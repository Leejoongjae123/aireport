import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("report_create")
      .select(
        `
        uuid,
        title,
        business_field,
        user_id,
        email,
        step,
        is_complete,
        created_at
      `
      )
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // user_id 목록 추출
    const userIds = [...new Set(data?.map(r => r.user_id).filter(Boolean))];
    
    // profiles 조회
    const profilesMap = new Map();
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);
      
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile.name);
      });
    }

    // 데이터 매핑
    const reportsData =
      data?.map((report) => {
        return {
          id: report.uuid,
          uuid: report.uuid,
          title: report.title,
          business_field: report.business_field,
          user_id: report.user_id,
          email: report.email,
          step: report.step,
          is_complete: report.is_complete,
          created_at: report.created_at,
          user_name: profilesMap.get(report.user_id) || null,
        };
      }) || [];

    return NextResponse.json({ data: reportsData });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
