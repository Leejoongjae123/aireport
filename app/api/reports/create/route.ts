import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

  const { title, businessField } = await request.json();

  if (!title || !businessField) {
    return NextResponse.json(
      { error: "제목과 사업분야를 입력해주세요." },
      { status: 400 }
    );
  }

  // report_create 테이블에 데이터 삽입
  const { data, error } = await supabase
    .from("report_create")
    .insert({
      title: title,
      user_id: user.id,
      email: user.email,
      business_field: businessField,
      step: "inputs",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "보고서 생성에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      reportId: data.uuid, // uuid 컬럼 사용 (자동 생성됨)
    },
    { status: 200 }
  );
}
