"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import ExpertsSearchFilter from "./ExpertsSearchFilter";
import ExpertsStatsCards from "./ExpertsStatsCards";
import ExpertsTable from "./ExpertsTable";
import ExpertsPagination from "./ExpertsPagination";
import { ExpertResponse, ExpertInformation } from "../types";
import Link from "next/link";
import { useExcelDownload } from "@/components/hooks/UseExcelDownload";
import { useCustomToast } from "@/components/hooks/UseCustomToast";
interface ExpertsContentProps {
  initialData: ExpertResponse;
}

export default function ExpertsContent({ initialData }: ExpertsContentProps) {
  const [data, setData] = useState<ExpertResponse>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useCustomToast();

  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    field: "전체",
    status: "전체",
    searchFilter: "이름",
    searchValue: "",
  });

  // 엑셀 다운로드 hook 설정
  const { downloadExcel, isDownloading } = useExcelDownload<ExpertInformation>({
    filename: `전문가정보_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "전문가 정보",
    dataTransformer: (experts) =>
      experts.map((expert) => ({
        ID: expert.id,
        이름: expert.name || "",
        분야: Array.isArray(expert.field)
          ? expert.field
              .map((f) => (typeof f === "object" && "field" in f ? f.field.join(", ") : f))
              .join(", ")
          : "",
        경력: Array.isArray(expert.career)
          ? expert.career
              .map((c) => (typeof c === "object" && "career" in c ? c.career.join(", ") : c))
              .join(", ")
          : "",
        "경력 파일명": expert.career_file_name || "",
        공개여부: expert.is_visible ? "공개" : "비공개",
        등록일: expert.created_at
          ? new Date(expert.created_at).toLocaleDateString("ko-KR")
          : "",
      })),
  });

  const fetchData = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.field && filters.field !== "전체") {
        params.append("field", filters.field);
      }
      if (filters.status && filters.status !== "전체") {
        params.append("status", filters.status);
      }
      if (filters.searchValue) {
        params.append("searchFilter", filters.searchFilter);
        params.append("searchValue", filters.searchValue);
      }
      if (filters.startDate) {
        params.append("startDate", filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate.toISOString());
      }

      const response = await fetch(`/api/admin/experts?${params}`);
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newFilters: {
    startDate?: Date;
    endDate?: Date;
    field: string;
    status: string;
    searchFilter: string;
    searchValue: string;
  }) => {
    setFilters({
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      field: newFilters.field,
      status: newFilters.status,
      searchFilter: newFilters.searchFilter,
      searchValue: newFilters.searchValue,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleExcelDownload = async () => {
    try {
      const response = await fetch("/api/admin/experts/all");
      if (!response.ok) {
        showError("전문가 정보를 불러오는데 실패했습니다.");
        return;
      }

      const { data: allExperts } = await response.json();
      const result = await downloadExcel(allExperts);

      if (result.success) {
        showSuccess("엑셀 파일이 다운로드되었습니다.");
      } else {
        showError("엑셀 다운로드에 실패했습니다.");
      }
    } catch {
      showError("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const itemsPerPageNum = parseInt(itemsPerPage.match(/\d+/)?.[0] || "10");
    fetchData(currentPage, itemsPerPageNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, filters]);

  const itemsPerPageNum = parseInt(itemsPerPage.match(/\d+/)?.[0] || "10");
  const totalPages = Math.ceil((data.count || 0) / itemsPerPageNum);

  return (
    <div className="flex flex-col items-center gap-8 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Page Title */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">전문가 정보 관리</h1>
      </div>

      {/* Filter Section */}
      <ExpertsSearchFilter onSearch={handleSearch} />

      {/* Status Summary Cards */}
      <ExpertsStatsCards stats={data.stats} />

      {/* Results Section */}
      <div className="w-full flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">
            <span className="text-[#6D6D6D]">총 </span>
            <span className="text-[#07F]">{(data.count || 0).toLocaleString()}</span>
            <span className="text-[#6D6D6D]">건</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExcelDownload}
              disabled={isDownloading}
              className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  다운로드 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
                    <path
                      d="M2.66797 5.47233V2.47233C2.66797 2.29552 2.73821 2.12595 2.86323 2.00093C2.98826 1.8759 3.15782 1.80566 3.33464 1.80566H12.668C12.8448 1.80566 13.0143 1.8759 13.1394 2.00093C13.2644 2.12595 13.3346 2.29552 13.3346 2.47233V14.4723C13.3346 14.6491 13.2644 14.8187 13.1394 14.9437C13.0143 15.0688 12.8448 15.139 12.668 15.139H3.33464C3.15782 15.139 2.98826 15.0688 2.86323 14.9437C2.73821 14.8187 2.66797 14.6491 2.66797 14.4723V11.4723"
                      stroke="#4CA452"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.334 5.47266H11.334M9.33398 8.13932H11.334M9.33398 10.806H11.334"
                      stroke="#4CA452"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3.33398 7.47266L5.33398 9.47266M5.33398 7.47266L3.33398 9.47266M1.33398 5.47266H7.33398V11.4727H1.33398V5.47266Z"
                      stroke="#4CA452"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  엑셀 다운로드
                </>
              )}
            </Button>
            <Link href='/admin/embeddings/experts/edit'>
            <Button className="flex px-3 py-2.5 justify-center items-center gap-2.5 rounded bg-[#07F] text-white font-bold text-sm hover:bg-[#0066dd]">
              전문가 등록
            </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#6D6D6D]"></div>
          </div>
        ) : (
          <ExpertsTable
            experts={data.data || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPageNum}
          />
        )}

        {/* Pagination */}
        <ExpertsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
