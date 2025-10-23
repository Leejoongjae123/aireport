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
    const { report_uuid } = body;

    if (!report_uuid) {
      return NextResponse.json(
        { error: "report_uuid는 필수 항목입니다." },
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
        { alreadyRequested: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { alreadyRequested: false },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "요청 이력 확인 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
