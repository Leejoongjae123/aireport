import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "로그인에 실패했습니다." },
      { status: 401 }
    );
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "사용자 정보를 찾을 수 없습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    },
    { status: 200 }
  );
}
