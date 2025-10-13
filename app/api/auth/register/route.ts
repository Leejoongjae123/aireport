import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 회원가입 처리
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/register/complete`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 데이터베이스 트리거가 자동으로 profiles 레코드를 생성합니다
    // 생성된 profiles 레코드에 email 업데이트
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          email: email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.user.id);

      if (profileError) {
        return NextResponse.json(
          { error: "프로필 이메일 업데이트에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch {
    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
