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
    let user;
    try {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      user = fetchedUser;
    } catch {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=get_user_failed`);
    }

    if (!user) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user`);
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

    // name, organization, business_field 중 하나라도 없어도 홈으로 (정보 부족 시 제외하지 않음)
    return NextResponse.redirect(`${requestUrl.origin}/`);
  }

  // 코드가 없으면 로그인 페이지로
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
}
