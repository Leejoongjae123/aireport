import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, organization, businessField } = await request.json();

  if (!name || !organization || !businessField) {
    return NextResponse.json(
      { error: "모든 정보를 입력해주세요." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      organization,
      business_field: businessField,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "프로필 업데이트에 실패했습니다.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "프로필 조회에 실패했습니다.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    profile,
  });
}
