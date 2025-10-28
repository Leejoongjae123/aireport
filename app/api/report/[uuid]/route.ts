import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { uuid } = await params;
    const supabase = await createClient();

    // 보고서 기본 정보 조회
    const { data: reportData, error: reportError } = await supabase
      .from("report_create")
      .select("*")
      .eq("uuid", uuid)
      .single();

    if (reportError || !reportData) {
      return NextResponse.json(
        { error: "보고서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 보고서 섹션 정보 조회
    const { data: sectionsData, error: sectionsError } = await supabase
      .from("report_sections")
      .select("*")
      .eq("report_uuid", uuid)
      .order("generation_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json(
        { error: "보고서 섹션을 불러올 수 없습니다." },
        { status: 500 }
      );
    }

    // 진단 정보 조회 (있는 경우)
    const { data: diagnosisData } = await supabase
      .from("diagnosis")
      .select("*")
      .eq("report_uuid", uuid)
      .single();

    // 전문가 평가 정보 조회 (있는 경우)
    const { data: expertReviewData } = await supabase
      .from("expert_review")
      .select("*")
      .eq("report_uuid", uuid)
      .single();

    return NextResponse.json({
      report: reportData,
      sections: sectionsData || [],
      diagnosis: diagnosisData || null,
      expertReview: expertReviewData || null,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
