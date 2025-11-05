import { Suspense } from "react";
import ReportsContent from "./components/ReportsContent";
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
  
  const url = `${baseUrl}/api/admin/report-create?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { data: [], total: 0, page: 1, limit: 10 };
    }

    const result = await response.json();
    return result;
  } catch {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
}

interface ReportsPageProps {
  searchParams: Promise<ReportSearchParams>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;

  // 보고서 데이터 가져오기
  const reportData = await fetchReports(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReportsContent initialData={reportData} />
    </Suspense>
  );
}
