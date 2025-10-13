import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: error.message || "로그아웃에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
