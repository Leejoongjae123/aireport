import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    // OAuth 코드를 세션으로 교환
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_failed`
      );
    }

    // 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user`);
    }

    // OAuth 로그인 시 프로필의 email 업데이트
    if (user.email) {
      await supabase
        .from("profiles")
        .update({ email: user.email })
        .eq("id", user.id);
    }

    // 프로필 정보 확인
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, organization, business_field")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // 프로필이 없으면 회원가입 완료 페이지로
      return NextResponse.redirect(`${requestUrl.origin}/register/complete`);
    }

    // name, organization, business_field가 모두 있는지 확인
    if (!profile.name || !profile.organization || !profile.business_field) {
      // 하나라도 없으면 회원가입 완료 페이지로
      return NextResponse.redirect(`${requestUrl.origin}/register/complete`);
    }

    // 모든 정보가 있으면 홈으로
    return NextResponse.redirect(`${requestUrl.origin}/`);
  }

  // 코드가 없으면 로그인 페이지로
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
}
