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
  const status = searchParams.get("status");
  const searchType = searchParams.get("searchType");
  const searchValue = searchParams.get("searchValue");

  try {
    // profiles와 auth.users를 조인하여 조회
    let query = supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        email,
        organization,
        business_field,
        provider,
        role
      `,
        { count: "exact" }
      );

    // 가입일시 필터 (auth.users의 created_at 사용)
    // Note: Supabase에서 auth.users는 직접 조회가 제한될 수 있으므로
    // 대신 profiles의 updated_at이나 별도 필드를 사용해야 할 수 있습니다.
    // 여기서는 profiles 테이블만 사용합니다.

    // 사업분야 필터
    if (businessField && businessField !== "전체") {
      query = query.eq("business_field", businessField);
    }

    // 상태 필터 - role이 'deleted'인 경우 탈퇴로 간주
    if (status && status !== "전체") {
      if (status === "탈퇴") {
        query = query.eq("role", "deleted");
      } else {
        query = query.neq("role", "deleted");
      }
    }

    // 검색 필터
    if (searchValue && searchType) {
      switch (searchType) {
        case "이름":
          query = query.ilike("name", `%${searchValue}%`);
          break;
        case "ID":
          query = query.ilike("email", `%${searchValue}%`);
          break;
        case "회사명":
          query = query.ilike("organization", `%${searchValue}%`);
          break;
      }
    }

    // 페이지네이션 적용
    query = query.range(offset, offset + limit - 1).order("id", { ascending: false });

    const { data: profiles, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // auth.users에서 created_at과 last_sign_in_at 가져오기
    const userIds = profiles?.map((p) => p.id) || [];
    
    interface AuthUser {
      id: string;
      created_at: string;
      last_sign_in_at: string | null | undefined;
    }
    
    let authUsers: AuthUser[] = [];
    if (userIds.length > 0) {
      // admin API를 사용하여 auth.users 정보 가져오기
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && users) {
        authUsers = users.filter((u) => userIds.includes(u.id)) as AuthUser[];
      }
    }

    // 데이터 매핑
    const membersData = profiles?.map((profile) => {
      const authUser = authUsers.find((u) => u.id === profile.id);
      
      return {
        id: profile.id,
        user_id: profile.id,
        name: profile.name,
        email: profile.email,
        organization: profile.organization,
        business_field: profile.business_field,
        provider: profile.provider || "local",
        role: profile.role,
        created_at: authUser?.created_at || new Date().toISOString(),
        last_sign_in_at: authUser?.last_sign_in_at || null,
        status: profile.role === "deleted" ? "탈퇴" : "정상",
      };
    }) || [];

    // 가입일시 필터 적용 (auth.users 데이터를 가져온 후)
    let filteredMembers = membersData;
    if (startDate) {
      filteredMembers = filteredMembers.filter(
        (m) => new Date(m.created_at) >= new Date(startDate)
      );
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      filteredMembers = filteredMembers.filter(
        (m) => new Date(m.created_at) <= endDateTime
      );
    }

    return NextResponse.json({
      data: filteredMembers,
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
