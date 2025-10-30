import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 요청 헤더 확인
    const cookieHeader = request.headers.get("cookie");
    console.log("요청 쿠키 헤더:", cookieHeader);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("인증 결과:", { user: user?.id, error: authError?.message });

    if (!user) {
      console.error("사용자 인증 실패 - user가 null입니다");
      return NextResponse.json(
        { error: "Unauthorized - No user found", authError: authError?.message },
        { status: 401 }
      );
    }

    console.log("인증된 사용자:", user.id);

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const keywordParam = url.searchParams.get("keyword");
    const allowedStatuses = [
      "pending",
      "evaluating",
      "consulting_requested",
      "completed",
    ] as const;

    console.log(
      "쿼리 파라미터 - status:",
      statusParam,
      "keyword:",
      keywordParam
    );

    const { data } = await supabase
      .from("expert_requests")
      .select(
        `
        id,
        created_at,
        updated_at,
        report_uuid,
        user_id,
        candidate_expert_ids,
        selected_expert_id,
        status,
        report_create!expert_requests_report_uuid_fkey(
          title,
          business_field,
          created_at
        ),
        expert_informations!expert_requests_selected_expert_id_fkey(
          id,
          name,
          field
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("쿼리 결과 데이터 개수:", data?.length || 0);
    if (data && data.length > 0) {
      console.log("첫 번째 데이터 샘플:", JSON.stringify(data[0], null, 2));
    }

    let rows = data ?? [];

    // 상태 필터링
    if (
      statusParam &&
      (allowedStatuses as readonly string[]).includes(statusParam)
    ) {
      rows = rows.filter((row) => row.status === statusParam);
    }

    // 키워드 필터링 (title 기준)
    if (keywordParam) {
      const keyword = keywordParam.toLowerCase();
      rows = rows.filter((row) => {
        const title =
          row.report_create &&
          typeof row.report_create === "object" &&
          "title" in row.report_create
            ? row.report_create.title
            : "";
        return (
          title &&
          typeof title === "string" &&
          title.toLowerCase().includes(keyword)
        );
      });
    }

    console.log("필터링 후 최종 데이터 개수:", rows.length);
    if (rows.length > 0) {
      console.log("최종 응답 데이터 샘플:", JSON.stringify(rows[0], null, 2));
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("API 내부 오류:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
