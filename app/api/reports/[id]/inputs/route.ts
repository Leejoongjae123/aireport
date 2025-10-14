import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 사용자 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // report_create 테이블에서 데이터 조회 (uuid로 조회)
  const { data: report, error } = await supabase
    .from("report_create")
    .select("*")
    .eq("uuid", id)
    .eq("user_id", user.id)
    .single();

  if (error || !report) {
    return NextResponse.json(
      {
        error:
          "보고서를 먼저 생성해주세요. /start 페이지에서 제목과 사업분야를 입력하세요.",
      },
      { status: 404 }
    );
  }

  // 필요한 데이터만 반환
  return NextResponse.json({
    investmentAmount: report.investment_amount || "",
    businessIdea: report.business_idea || "",
    coreValue: report.core_value || "",
    reportType: report.report_type || "",
    businessField: report.business_field || "",
  });
}
