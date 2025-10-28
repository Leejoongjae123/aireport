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
    // consulting_requests 상세 조회
    const { data: consultingRequest, error } = await supabase
      .from("consulting_requests")
      .select(`
        id,
        report_uuid,
        user_id,
        expert_request_id,
        expert_id,
        request_subject,
        detailed_requirements,
        attachment_urls,
        status,
        created_at,
        updated_at,
        report_create(
          title,
          uuid
        ),
        expert_requests(
          id,
          selected_expert_id,
          status
        ),
        profiles(
          id,
          name,
          email
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "컨설팅 요청 정보를 찾을 수 없습니다.", details: error.message },
        { status: 404 }
      );
    }

    // 전문가 정보 조회 (expert_informations 테이블에서)
    let expertInfo = null;
    if (consultingRequest.expert_id) {
      const { data: expert } = await supabase
        .from("expert_informations")
        .select("id, name, career, field")
        .eq("id", consultingRequest.expert_id)
        .single();
      
      expertInfo = expert;
    }

    // 평가서 정보 조회 (expert_review 테이블에서)
    let reviewInfo = null;
    if (consultingRequest.expert_request_id) {
      const { data: review } = await supabase
        .from("expert_review")
        .select("*")
        .eq("expert_request_id", consultingRequest.expert_request_id)
        .single();
      
      reviewInfo = review;
    }

    return NextResponse.json({
      success: true,
      data: {
        consultingRequest,
        expertInfo,
        reviewInfo,
      }
    });
  } catch (error) {
    console.log("Error fetching consulting request detail:", error);
    return NextResponse.json(
      { error: "컨설팅 요청 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
