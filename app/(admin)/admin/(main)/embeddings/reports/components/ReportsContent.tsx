"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import ReportsSearchFilter from "./ReportsSearchFilter";
import ReportsStatsCards from "./ReportsStatsCards";
import ReportsTable from "./ReportsTable";
import ReportsPagination from "./ReportsPagination";
import { ReportResponse, ReportInformation } from "../types";
import Link from "next/link";
import { useExcelDownload } from "@/components/hooks/UseExcelDownload";
import { useCustomToast } from "@/components/hooks/UseCustomToast";

interface ReportsContentProps {
  initialData: ReportResponse;
}

export default function ReportsContent({ initialData }: ReportsContentProps) {
  const [data, setData] = useState<ReportResponse>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    field: "전체",
    searchFilter: "제목",
    searchValue: "",
  });

  const { showSuccess, showError } = useCustomToast();
  const { downloadExcel } = useExcelDownload<ReportInformation>({
    filename: `보고서_목록_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "보고서 목록",
    dataTransformer: (reports) =>
      reports.map((report, index: number) => ({
        번호: index + 1,
        제목: report.제목 || "",
        분야: report.분야 || "",
        키워드: report.키워드 || "",
        보고서파일명: report.보고서파일명 || "",
        작성일: report.created_at
          ? new Date(report.created_at).toLocaleDateString("ko-KR")
          : "",
        완료여부: report.is_completed ? "완료" : "미완료",
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

      const response = await fetch(`/api/admin/reports?${params}`);
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
    searchFilter: string;
    searchValue: string;
  }) => {
    setFilters({
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      field: newFilters.field,
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
      const response = await fetch("/api/admin/reports/all");
      if (!response.ok) {
        showError("보고서 정보를 불러오는데 실패했습니다.");
        return;
      }

      const { data: allReports } = await response.json();
      const result = await downloadExcel(allReports);

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
        <h1 className="text-2xl font-bold text-[#2A2A2A]">보고서 정보 관리</h1>
      </div>

      {/* Filter Section */}
      <ReportsSearchFilter onSearch={handleSearch} />

      {/* Status Summary Cards */}
      <ReportsStatsCards stats={data.stats} />

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
              className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9]">
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
            </Button>
            <Link href='/admin/embeddings/reports/edit'>
            <Button className="flex px-3 py-2.5 justify-center items-center gap-2.5 rounded bg-[#07F] text-white font-bold text-sm hover:bg-[#0066dd]">
              보고서 등록
            </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#6D6D6D]">로딩 중...</div>
          </div>
        ) : (
          <ReportsTable
            reports={data.data || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPageNum}
          />
        )}

        {/* Pagination */}
        <ReportsPagination
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
