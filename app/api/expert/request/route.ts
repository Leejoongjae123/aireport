import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { report_id, expert_id, expert_name, expert_info } = body;

    if (!report_id || !expert_id) {
      return NextResponse.json(
        { error: "report_id와 expert_id는 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 전문가 평가 요청 저장
    const { data, error } = await supabase
      .from("expert_evaluations")
      .insert({
        user_id: user.id,
        report_id,
        expert_id,
        expert_name,
        expert_info,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "전문가 평가 요청 저장 실패",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "전문가 평가 요청이 성공적으로 저장되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "전문가 평가 요청 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
