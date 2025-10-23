"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ExpertRequestsList } from "./components/expert-requests-list";
import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLoader } from "@/components/hooks/use-loader";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as "all" | "pending" | "evaluating" | "consulting_requested" | "completed") || "all";
  const keyword = searchParams.get("keyword") || "";
  const [searchInput, setSearchInput] = useState(keyword);
  const [isLoading, setIsLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    evaluating: 0,
    consulting_requested: 0,
    completed: 0,
  });
  
  const loader = useLoader({ isLoading });

  const fetchStatusCounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const counts = {
        all: 0,
        pending: 0,
        evaluating: 0,
        consulting_requested: 0,
        completed: 0,
      };

      // 전체 개수
      const allRes = await fetch("/api/expert/requests");
      if (allRes.ok) {
        const allData = await allRes.json();
        counts.all = Array.isArray(allData) ? allData.length : 0;
      }

      // 각 상태별 개수
      const statuses = ["pending", "evaluating", "consulting_requested", "completed"] as const;
      for (const status of statuses) {
        const res = await fetch(`/api/expert/requests?status=${status}`);
        if (res.ok) {
          const data = await res.json();
          counts[status] = Array.isArray(data) ? data.length : 0;
        }
      }

      setStatusCounts(counts);
    } catch {
      console.log("Error fetching status counts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (keyword) {
      params.set("keyword", keyword);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSearch = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (searchInput.trim()) {
      params.set("keyword", searchInput.trim());
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {loader}
      <div className="w-full bg-[#FAFAFD] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-0 py-5 mt-[131px]">
          <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-[#303030] tracking-[-0.48px]">
              평가 요청
            </h1>

            {/* Filter Buttons and Search */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleTabChange("all")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "all"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50 hover:text-[#0077FF]"
                  }`}
                >
                  전체 ({statusCounts.all})
                </Button>
                <Button
                  onClick={() => handleTabChange("pending")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "pending"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50 hover:text-[#0077FF]"
                  }`}
                >
                  평가요청 ({statusCounts.pending})
                </Button>
                <Button
                  onClick={() => handleTabChange("evaluating")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "evaluating"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50 hover:text-[#0077FF]"
                  }`}
                >
                  평가중 ({statusCounts.evaluating})
                </Button>
                <Button
                  onClick={() => handleTabChange("completed")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "completed"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50 hover:text-[#0077FF]"
                  }`}
                >
                  평가완료 ({statusCounts.completed})
                </Button>
                <Button
                  onClick={() => handleTabChange("consulting_requested")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "consulting_requested"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50 hover:text-[#0077FF]"
                  }`}
                >
                  컨설팅요청 ({statusCounts.consulting_requested})
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative w-[453px]">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="생성하려는 보고서 제목을 입력해주세요."
                  className="w-full px-[18px] h-11 border border-[#E3E5E5] rounded-full bg-white text-base tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                />
                <Search 
                  onClick={handleSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#0077FF] stroke-[2.5] cursor-pointer hover:opacity-80" 
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <ExpertRequestsList 
            isOpen={true} 
            statusFilter={activeTab === "all" ? "all" : activeTab as "pending" | "evaluating" | "consulting_requested" | "completed"}
            keyword={keyword}
            onLoadingChange={setIsLoading}
          />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="w-full bg-[#FAFAFD] min-h-screen flex items-center justify-center"></div>}>
      <ReviewPageContent />
    </Suspense>
  );
}
