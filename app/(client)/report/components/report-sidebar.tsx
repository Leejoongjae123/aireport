"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "./store/sidebar-store";
import { FileText, Plus, Copy, Trash, MoreVertical } from "lucide-react";

interface Report {
  uuid: string;
  title: string;
  created_at: string;
}

export function ReportSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSidebarOpen = useSidebarStore(
    (state: { isOpen: boolean }) => state.isOpen
  );

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const response = await fetch("/api/reports/list");

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReports(data.reports);
        }
      }
      setIsLoading(false);
    };

    if (isSidebarOpen) {
      fetchReports();
    }
  }, [isSidebarOpen]);

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 z-10 w-[314px] h-[709px] bg-white rounded-xl border border-[#EEF1F7] shadow-[0_0_10px_rgba(60,123,194,0.12)] p-6 transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full gap-2.5">
        {/* New Report Button */}
        <Button
          className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white font-semibold text-[18px] h-[48px] rounded-lg gap-1.5 justify-start px-6"
          onClick={() => {
            router.push("/report/start");
          }}
        >
          <Plus className="w-6 h-6" />새 보고서 생성
        </Button>

        {/* Report List Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-4 py-2.5">
            <span className="text-[#6B6B6B] text-sm font-medium">
              보고서 목록
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-[#767676]">로딩 중...</div>
            ) : reports.length === 0 ? (
              <div className="px-4 py-2 text-sm text-[#767676]">
                생성된 보고서가 없습니다.
              </div>
            ) : (
              reports.map((report) => {
                const isSelected = pathname.includes(report.uuid);
                return (
                  <div key={report.uuid} className="relative">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                        isSelected ? "bg-[#E8F3FF]" : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        router.push(`/report/editor?id=${report.uuid}`)
                      }
                    >
                      <FileText
                        className={`w-6 h-6 ${
                          isSelected ? "text-[#0077FF]" : "text-[#767676]"
                        }`}
                      />
                      <span
                        className={`flex-1 text-base font-semibold truncate ${
                          isSelected ? "text-[#0077FF]" : "text-[#767676]"
                        }`}
                        title={report.title}
                      >
                        {report.title}
                      </span>
                      {isSelected && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4 text-[#444444]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[84px] rounded-md bg-white shadow-[0_2px_16px_rgba(19,48,74,0.08)] border-0 p-2"
                          >
                            <DropdownMenuItem className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-[#E8F3FF] text-[#0077FF] text-sm">
                              <Copy className="w-[18px] h-[18px]" />
                              복제
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[#767676] text-sm">
                              <Trash className="w-[18px] h-[18px]" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
