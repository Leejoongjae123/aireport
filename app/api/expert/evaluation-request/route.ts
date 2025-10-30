import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { report_uuid, experts, selected_expert_name } = body;

    if (!report_uuid || !experts || !selected_expert_name) {
      return NextResponse.json(
        {
          error:
            "report_uuid, experts, selected_expert_name은 필수 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 이미 요청한 이력이 있는지 확인
    const { data: existingRequest } = await supabase
      .from("expert_requests")
      .select("id")
      .eq("report_uuid", report_uuid)
      .eq("user_id", user.id)
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: "이미 요청한 이력이 있습니다.", alreadyRequested: true },
        { status: 409 }
      );
    }

    // 선택된 전문가 ID 조회
    const { data: selectedExpertInfo, error: selectedExpertError } = await supabase
      .from("expert_informations")
      .select("id")
      .eq("name", selected_expert_name)
      .single();

    if (selectedExpertError || !selectedExpertInfo) {
      return NextResponse.json(
        { error: "선택된 전문가를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 모든 후보 전문가 ID 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidateNames = experts.map((expert: any) => expert.name);
    const { data: allExperts, error: allExpertsError } = await supabase
      .from("expert_informations")
      .select("id, name")
      .in("name", candidateNames);

    if (allExpertsError || !allExperts) {
      return NextResponse.json(
        { error: "후보 전문가들을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const candidateExpertIds = allExperts.map(expert => expert.id);

    // 전문가 평가 요청 저장
    const { data, error } = await supabase
      .from("expert_requests")
      .insert({
        user_id: user.id,
        report_uuid,
        candidate_expert_ids: candidateExpertIds,
        selected_expert_id: selectedExpertInfo.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "전문가 평가 요청 저장 실패",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "전문가 평가 요청이 성공적으로 저장되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "전문가 평가 요청 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
