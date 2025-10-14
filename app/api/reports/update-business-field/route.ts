import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
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

  const { reportId, businessField } = await request.json();

  if (!reportId || !businessField) {
    return NextResponse.json(
      { error: "보고서 ID와 사업분야를 입력해주세요." },
      { status: 400 }
    );
  }

  // report_create 테이블에서 business_field 업데이트
  const { data, error } = await supabase
    .from("report_create")
    .update({
      business_field: businessField,
    })
    .eq("uuid", reportId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "사업분야 업데이트에 실패했습니다." },
      { status: 500 }
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
