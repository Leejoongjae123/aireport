import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // 쿼리 파라미터 추출
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const field = searchParams.get("field");
  const searchFilter = searchParams.get("searchFilter");
  const searchValue = searchParams.get("searchValue");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const offset = (page - 1) * limit;

  // 기본 쿼리 구성
  let query = supabase
    .from("report_embed")
    .select("*", { count: "exact" });

  // 분야 필터
  if (field && field !== "전체") {
    query = query.eq("분야", field);
  }

  // 검색 필터
  if (searchValue && searchFilter) {
    if (searchFilter === "제목") {
      query = query.ilike("제목", `%${searchValue}%`);
    } else if (searchFilter === "ID") {
      query = query.eq("id", parseInt(searchValue));
    } else if (searchFilter === "키워드") {
      query = query.ilike("키워드", `%${searchValue}%`);
    }
  }

  // 기간 필터
  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    query = query.lte("created_at", endDateTime.toISOString());
  }

  // 페이지네이션 및 정렬
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // 통계 정보 조회
  const { data: allReports } = await supabase
    .from("report_embed")
    .select("id, created_at");

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 최신 임베딩일 계산 (created_at 기준 가장 최신값)
  const latestReport = allReports?.reduce((latest, current) => {
    if (!current.created_at) return latest;
    if (!latest?.created_at) return current;
    return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
  }, null as { id: number; created_at: string | null } | null);

  // 날짜 포맷팅 함수
  const formatLatestDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const stats = {
    total: count || 0,
    thisMonth: allReports?.filter((report) => {
      if (!report.created_at) return false;
      return new Date(report.created_at) >= thisMonthStart;
    }).length || 0,
    latestEmbeddingDate: latestReport?.created_at 
      ? formatLatestDate(latestReport.created_at)
      : null,
  };

  return NextResponse.json({
    data,
    count,
    stats,
    page,
    limit,
  });
}
