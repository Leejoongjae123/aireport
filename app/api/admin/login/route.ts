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

  // 로그인 시도
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

  // profiles 테이블에서 role 확인
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    // 로그인은 성공했지만 프로필 조회 실패 시 로그아웃
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "프로필 정보를 찾을 수 없습니다." },
      { status: 500 }
    );
  }

  // role이 admin이 아닌 경우
  if (profile.role !== "admin") {
    // 로그아웃 처리
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "관리자 계정이 아닙니다.", isNotAdmin: true },
      { status: 403 }
    );
  }

  // 관리자 로그인 성공
  return NextResponse.json(
    {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
      },
    },
    { status: 200 }
  );
}
