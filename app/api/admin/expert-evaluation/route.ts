import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // 쿼리 파라미터 추출
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const searchFilter = searchParams.get("searchFilter");
  const searchValue = searchParams.get("searchValue");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const offset = (page - 1) * limit;

  // 기본 쿼리 구성
  let query = supabase
    .from("expert_requests")
    .select(
      `
      id,
      created_at,
      updated_at,
      status,
      report_uuid,
      user_id,
      selected_expert_id,
      report_create!inner(
        uuid,
        title,
        business_field
      ),
      profiles!inner(
        id,
        name,
        email
      ),
      expert_informations(
        id,
        name,
        field
      ),
      expert_review(
        id,
        overall_score,
        updated_at
      )
    `,
      { count: "exact" }
    );

  // 상태 필터
  if (status && status !== "전체") {
    const statusMap: Record<string, string> = {
      완료: "completed",
      대기: "pending",
      지연: "evaluating",
    };
    if (statusMap[status]) {
      query = query.eq("status", statusMap[status]);
    }
  }

  // 날짜 필터
  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    query = query.lte("created_at", endDateTime.toISOString());
  }

  // 검색 필터
  if (searchValue && searchFilter) {
    if (searchFilter === "이름") {
      query = query.ilike("profiles.name", `%${searchValue}%`);
    } else if (searchFilter === "ID") {
      query = query.ilike("profiles.email", `%${searchValue}%`);
    } else if (searchFilter === "대상 보고서") {
      query = query.ilike("report_create.title", `%${searchValue}%`);
    }
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

  // 상태별 카운트 조회
  const { data: statusCounts } = await supabase
    .from("expert_requests")
    .select("status", { count: "exact", head: false });

  const stats = {
    total: count || 0,
    completed: statusCounts?.filter((item) => item.status === "completed").length || 0,
    pending: statusCounts?.filter((item) => item.status === "pending").length || 0,
    delayed: statusCounts?.filter((item) => item.status === "evaluating").length || 0,
  };

  return NextResponse.json({
    data,
    count,
    stats,
    page,
    limit,
  });
}
