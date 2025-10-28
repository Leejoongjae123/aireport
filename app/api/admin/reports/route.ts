import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // 페이지네이션 파라미터
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  // 필터 파라미터
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const businessField = searchParams.get("businessField");
  const searchType = searchParams.get("searchType");
  const searchValue = searchParams.get("searchValue");

  try {
    // report_create 테이블 조회
    let query = supabase
      .from("report_create")
      .select(
        `
        id,
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
      );

    // 기간 필터 (created_at 기준)
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateTime.toISOString());
    }

    // 사업분야 필터
    if (businessField && businessField !== "전체") {
      query = query.eq("business_field", businessField);
    }

    // 검색 필터
    if (searchValue && searchType) {
      switch (searchType) {
        case "이름":
          // 이름은 profiles 테이블에서 조회해야 하므로 나중에 필터링
          break;
        case "ID":
          query = query.ilike("email", `%${searchValue}%`);
          break;
        case "제목":
          query = query.ilike("title", `%${searchValue}%`);
          break;
      }
    }

    // 페이지네이션 적용
    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data: reports, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // user_id로 profiles에서 이름 가져오기
    const userIds = reports?.map((r) => r.user_id).filter(Boolean) || [];
    
    let profilesMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);
      
      if (profiles) {
        profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile.name || "-";
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // 데이터 매핑
    let reportsData = reports?.map((report) => {
      return {
        id: report.id.toString(),
        uuid: report.uuid,
        title: report.title,
        business_field: report.business_field,
        user_id: report.user_id,
        email: report.email,
        step: report.step,
        is_complete: report.is_complete,
        created_at: report.created_at,
        updated_at: report.created_at, // updated_at이 없으므로 created_at 사용
        user_name: report.user_id ? profilesMap[report.user_id] || "-" : "-",
        version: "v1.0", // 버전 정보가 없으므로 기본값
      };
    }) || [];

    // 이름으로 검색하는 경우 클라이언트 사이드 필터링
    if (searchValue && searchType === "이름") {
      reportsData = reportsData.filter((report) =>
        report.user_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return NextResponse.json({
      data: reportsData,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
