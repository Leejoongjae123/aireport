import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const businessField = searchParams.get("businessField");
  const searchType = searchParams.get("searchType");
  const searchValue = searchParams.get("searchValue");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("report_create")
      .select(
        `
        uuid,
        title,
        business_field,
        user_id,
        email,
        step,
        is_complete,
        created_at
      `,
        { count: "exact" }
      )
      .eq("is_deleted", false);

    // 사업분야 필터
    if (businessField && businessField !== "전체") {
      query = query.eq("business_field", businessField);
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
    if (searchValue && searchType) {
      switch (searchType) {
        case "제목":
          query = query.ilike("title", `%${searchValue}%`);
          break;
        case "이름":
          // profiles 테이블의 name으로 검색하기 위해서는 필터링 후 처리 필요
          // 일단 email로 검색
          query = query.ilike("email", `%${searchValue}%`);
          break;
        case "ID":
          query = query.ilike("email", `%${searchValue}%`);
          break;
        case "UUID":
          query = query.ilike("uuid", `%${searchValue}%`);
          break;
      }
    }

    // 페이지네이션 적용
    query = query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // user_id 목록 추출
    const userIds = [...new Set(data?.map(r => r.user_id).filter(Boolean))];
    
    // profiles 조회
    const profilesMap = new Map();
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);
      
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile.name);
      });
    }

    // 데이터 매핑
    const reportsData =
      data?.map((report) => {
        return {
          id: report.uuid,
          uuid: report.uuid,
          title: report.title,
          business_field: report.business_field,
          user_id: report.user_id,
          email: report.email,
          step: report.step,
          is_complete: report.is_complete,
          created_at: report.created_at,
          user_name: profilesMap.get(report.user_id) || null,
        };
      }) || [];

    return NextResponse.json({
      data: reportsData,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
