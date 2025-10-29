import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // 쿼리 파라미터 추출
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const field = searchParams.get("field");
  const searchFilter = searchParams.get("searchFilter");
  const searchValue = searchParams.get("searchValue");

  const offset = (page - 1) * limit;

  // 기본 쿼리 구성
  let query = supabase
    .from("expert_informations")
    .select("*", { count: "exact" });

  // 분야 필터
  if (field && field !== "전체") {
    query = query.contains("field", [field]);
  }

  // 검색 필터
  if (searchValue && searchFilter) {
    if (searchFilter === "이름") {
      query = query.ilike("name", `%${searchValue}%`);
    } else if (searchFilter === "ID") {
      query = query.ilike("id", `%${searchValue}%`);
    } else if (searchFilter === "소속") {
      // career 배열 내 검색
      query = query.contains("career", [searchValue]);
    }
  }

  // 페이지네이션 및 정렬
  query = query.order("name", { ascending: true }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // 통계 정보 조회
  const { data: allExperts } = await supabase
    .from("expert_informations")
    .select("id, created_at");

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 최신 임베딩일 계산 (created_at 기준 가장 최신값)
  const latestExpert = allExperts?.reduce((latest, current) => {
    if (!current.created_at) return latest;
    if (!latest?.created_at) return current;
    return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
  }, null as { id: string; created_at: string | null } | null);

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
    thisMonth: allExperts?.filter((expert) => {
      if (!expert.created_at) return false;
      return new Date(expert.created_at) >= thisMonthStart;
    }).length || 0,
    latestEmbeddingDate: latestExpert?.created_at 
      ? formatLatestDate(latestExpert.created_at)
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
