import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import ReportSearchFilter from "./components/ReportSearchFilter";
import ReportTable from "./components/ReportTable";
import ReportPagination from "./components/ReportPagination";
import { ReportSearchParams, ReportListResponse } from "./types";

async function fetchReports(searchParams: ReportSearchParams): Promise<ReportListResponse> {
  const params = new URLSearchParams();
  
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.limit) params.set("limit", searchParams.limit);
  if (searchParams.startDate) params.set("startDate", searchParams.startDate);
  if (searchParams.endDate) params.set("endDate", searchParams.endDate);
  if (searchParams.businessField) params.set("businessField", searchParams.businessField);
  if (searchParams.searchType) params.set("searchType", searchParams.searchType);
  if (searchParams.searchValue) params.set("searchValue", searchParams.searchValue);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/admin/reports?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: [], total: 0, page: 1, limit: 10 };
  }

  return response.json();
}

interface ReportsPageProps {
  searchParams: Promise<ReportSearchParams>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");

  // 보고서 데이터 가져오기
  const { data: reports, total } = await fetchReports(params);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col items-center gap-8 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Page Title */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">보고서 생성 관리</h1>
      </div>

      {/* Filter Section */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <ReportSearchFilter />
      </Suspense>

      {/* Results Section */}
      <div className="w-full flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">
            <span className="text-[#6D6D6D]">총 </span>
            <span className="text-[#07F]">{total.toLocaleString()}</span>
            <span className="text-[#6D6D6D]">건</span>
          </div>
          <Button className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9]">
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
        </div>

        {/* Table */}
        <ReportTable 
          reports={reports} 
          currentPage={page}
          itemsPerPage={limit}
        />

        {/* Pagination */}
        <ReportPagination
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={limit}
        />
      </div>
    </div>
  );
}
