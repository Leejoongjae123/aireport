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
      const redirectUrl = new URL('/login', requestUrl.origin);
      redirectUrl.searchParams.set('error', 'auth_failed');
      return NextResponse.redirect(redirectUrl);
    }

    // 사용자 정보 가져오기
    let user;
    try {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      user = fetchedUser;
    } catch {
      const redirectUrl = new URL('/login', requestUrl.origin);
      redirectUrl.searchParams.set('error', 'get_user_failed');
      return NextResponse.redirect(redirectUrl);
    }

    if (!user) {
      const redirectUrl = new URL('/login', requestUrl.origin);
      redirectUrl.searchParams.set('error', 'no_user');
      return NextResponse.redirect(redirectUrl);
    }

    // OAuth 로그인 시 프로필의 email과 provider 업데이트
    const provider = user.app_metadata?.provider || "local";
    if (user.email) {
      await supabase
        .from("profiles")
        .update({ email: user.email, provider })
        .eq("id", user.id);
    } else {
      // email이 없어도 provider 업데이트
      await supabase
        .from("profiles")
        .update({ provider })
        .eq("id", user.id);
    }

    // 홈으로 리다이렉트
    const redirectUrl = new URL('/', requestUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // 코드가 없으면 로그인 페이지로
  const redirectUrl = new URL('/login', requestUrl.origin);
  redirectUrl.searchParams.set('error', 'no_code');
  return NextResponse.redirect(redirectUrl);
}
