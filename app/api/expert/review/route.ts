import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - No user found", authError: authError?.message },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const reportUuid = url.searchParams.get("report_uuid");

    if (!reportUuid) {
      return NextResponse.json(
        { error: "report_uuid parameter is required" },
        { status: 400 }
      );
    }

    // expert_review 테이블에서 report_uuid로 데이터 조회
    const { data, error } = await supabase
      .from("expert_review")
      .select(`
        *,
        expert_requests!inner(
          id,
          selected_expert_id,
          expert_informations!inner(
            id,
            name,
            career,
            field
          )
        )
      `)
      .eq("report_uuid", reportUuid)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch expert review", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Expert review not found" },
        { status: 404 }
      );
    }

    // 전문가 정보 추출
    const expertInfo = data.expert_requests?.expert_informations;
    const career = expertInfo?.career as string[] || [];
    const field = expertInfo?.field as string[] || [];

    // 응답 데이터 매핑
    const responseData = {
      id: data.id,
      report_uuid: data.report_uuid,
      expert_request_id: data.expert_requests?.id?.toString() || data.expert_request_id?.toString() || "",
      expert_id: data.expert_requests?.selected_expert_id || "",
      expert_name: expertInfo?.name || "",
      expert_title: career[0] || "",
      expert_experience: field[0] || "",
      expert_description: field.join(", ") || "",
      evaluation_date: data.created_at,
      status: "평가 완료",
      business_score: data.business_score || 0,
      market_score: data.market_score || 0,
      investment_appeal_score: data.investment_appeal_score || 0,
      execution_feasibility_score: data.execution_feasibility_score || 0,
      document_completeness_score: data.document_completeness_score || 0,
      overall_score: data.overall_score || 0,
      expert_comment: data.expert_comment || "",
      pdf_url: data.attachment_url_pdf || "",
      word_url: data.attachment_url_word || "",
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error)?.message },
      { status: 500 }
    );
  }
}
