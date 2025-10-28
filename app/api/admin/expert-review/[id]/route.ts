import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();

    const {
      business_score,
      market_score,
      investment_appeal_score,
      execution_feasibility_score,
      document_completeness_score,
      expert_comment,
      attachment_url_pdf,
      attachment_url_word,
      overall_score,
      expert_request_id,
      report_uuid,
      user_id,
    } = body;

    const supabase = await createClient();

    // expert_review 테이블에 데이터 삽입 또는 업데이트
    const { data: existingReview } = await supabase
      .from("expert_review")
      .select("id")
      .eq("expert_request_id", expert_request_id)
      .single();

    let result;

    if (existingReview) {
      // 기존 리뷰 업데이트
      result = await supabase
        .from("expert_review")
        .update({
          business_score,
          market_score,
          investment_appeal_score,
          execution_feasibility_score,
          document_completeness_score,
          overall_score,
          expert_comment,
          attachment_url_pdf,
          attachment_url_word,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_request_id", expert_request_id)
        .select()
        .single();
    } else {
      // 새 리뷰 생성
      result = await supabase
        .from("expert_review")
        .insert({
          expert_request_id,
          report_uuid,
          user_id,
          business_score,
          market_score,
          investment_appeal_score,
          execution_feasibility_score,
          document_completeness_score,
          overall_score,
          expert_comment,
          attachment_url_pdf,
          attachment_url_word,
        })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    // expert_requests 상태 업데이트 (completed로 변경)
    await supabase
      .from("expert_requests")
      .update({ status: "completed" })
      .eq("id", expert_request_id);

    return NextResponse.json(
      { message: "평가가 성공적으로 제출되었습니다.", data: result.data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "평가 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
