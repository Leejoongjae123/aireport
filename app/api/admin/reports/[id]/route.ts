import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    // report_create 테이블에서 uuid로 조회
    const { data: report, error } = await supabase
      .from("report_create")
      .select("uuid, title, business_field, user_id, email, created_at")
      .eq("uuid", id)
      .single();

    if (error || !report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // user_id로 profiles에서 이름 가져오기
    let userName = null;
    if (report.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", report.user_id)
        .single();
      
      if (profile) {
        userName = profile.name;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uuid: report.uuid,
        title: report.title,
        business_field: report.business_field,
        email: report.email,
        created_at: report.created_at,
        user_name: userName,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
