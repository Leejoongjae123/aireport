import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // 현재 로그인된 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "보고서 ID를 입력해주세요." },
      { status: 400 }
    );
  }

  // report_create 테이블에서 데이터 가져오기
  const { data, error } = await supabase
    .from("report_create")
    .select("*")
    .eq("uuid", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "보고서를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: data,
    },
    { status: 200 }
  );
}
