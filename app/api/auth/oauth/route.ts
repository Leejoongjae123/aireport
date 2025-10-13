import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const provider = searchParams.get("provider");

  if (!provider || (provider !== "google" && provider !== "kakao")) {
    return NextResponse.json(
      { error: "유효하지 않은 제공자입니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "kakao",
    options: {
      redirectTo: `${request.nextUrl.origin}/api/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "OAuth 로그인에 실패했습니다." },
      { status: 500 }
    );
  }

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.json(
    { error: "OAuth URL을 생성할 수 없습니다." },
    { status: 500 }
  );
}
