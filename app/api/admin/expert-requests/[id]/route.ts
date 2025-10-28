import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // expert_requests 상세 조회
    const { data: expertRequest, error } = await supabase
      .from("expert_requests")
      .select(`
        id,
        report_uuid,
        user_id,
        status,
        selected_expert_id,
        candidate_expert_ids,
        created_at,
        updated_at,
        report_create(
          title,
          uuid
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "전문가 평가 요청 정보를 찾을 수 없습니다.", details: error.message },
        { status: 404 }
      );
    }

    // 선정된 전문가 정보 조회
    let selectedExpertInfo = null;
    if (expertRequest.selected_expert_id) {
      const { data: expert } = await supabase
        .from("expert_informations")
        .select("id, name, career, field")
        .eq("id", expertRequest.selected_expert_id)
        .single();
      
      selectedExpertInfo = expert;
    }

    // 후보 전문가들 정보 조회
    let candidateExperts = null;
    if (expertRequest.candidate_expert_ids && expertRequest.candidate_expert_ids.length > 0) {
      const { data: candidates } = await supabase
        .from("expert_informations")
        .select("id, name, career, field")
        .in("id", expertRequest.candidate_expert_ids);
      
      candidateExperts = candidates;
    }

    return NextResponse.json({
      expertRequest,
      selectedExpertInfo,
      candidateExperts,
    });
  } catch {
    return NextResponse.json(
      { error: "전문가 평가 요청 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
