import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { reportId, investmentAmount, businessIdea, coreValue } = body;

  if (!reportId) {
    return NextResponse.json(
      { error: "Report ID가 필요합니다." },
      { status: 400 }
    );
  }

  // 기존 report 확인
  const { data: existingReport } = await supabase
    .from("report_create")
    .select("*")
    .eq("uuid", reportId)
    .eq("user_id", user.id)
    .single();

  if (!existingReport) {
    // report가 존재하지 않으면 에러 반환
    // /start에서 먼저 report를 생성해야 함
    return NextResponse.json(
      {
        error:
          "보고서를 먼저 생성해주세요. /start 페이지에서 제목과 사업분야를 입력하세요.",
      },
      { status: 404 }
    );
  }

  // 기존 report 업데이트 (title과 business_field는 건드리지 않음)
  const { data, error } = await supabase
    .from("report_create")
    .update({
      investment_amount: investmentAmount,
      business_idea: businessIdea,
      core_value: coreValue,
      step: "inputs",
    })
    .eq("uuid", reportId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "데이터 업데이트에 실패했습니다.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "저장되었습니다.",
    data,
  });
}
