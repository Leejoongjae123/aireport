import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

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
    const { report_uuid, all_candidates, selected_expert } = body;

    if (!report_uuid || !all_candidates || !selected_expert) {
      return NextResponse.json(
        {
          error:
            "report_uuid, all_candidates, selected_expert는 필수 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 이미 요청한 이력이 있는지 확인
    const { data: existingRequest } = await supabase
      .from("expert_requests")
      .select("id")
      .eq("report_uuid", report_uuid)
      .eq("user_id", user.id)
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: "이미 요청한 이력이 있습니다.", alreadyRequested: true },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("expert_requests")
      .insert({
        user_id: user.id,
        report_uuid,
        all_candidates,
        selected_expert,
        status: "pending",
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
