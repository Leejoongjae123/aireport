import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

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

  // user_id가 현재 사용자와 일치하는 보고서 목록 가져오기
  const { data, error } = await supabase
    .from("report_create")
    .select("uuid, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "보고서 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      reports: data,
    },
    { status: 200 }
  );
}
