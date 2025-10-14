import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 사업분야를 분류번호로 매핑
const businessFieldToNumber: Record<string, number> = {
  "디지털·ICT·AI 산업": 1,
  "제조·산업기술·혁신": 2,
  "문화·콘텐츠·관광": 3,
  "공공·도시·인프라": 4,
  "에너지·환경": 5,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, topK = 5 } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // report_create 테이블에서 데이터 조회
    const { data: report, error: reportError } = await supabase
      .from("report_create")
      .select("*")
      .eq("uuid", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "보고서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // AI 검색 엔드포인트로 요청
    const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;
    if (!aiEndpoint) {
      return NextResponse.json(
        { error: "AI 엔드포인트가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const 분류번호 = businessFieldToNumber[report.business_field] || 1;

    const searchResponse = await fetch(`${aiEndpoint}/api/reports/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        사업아이디어: report.business_idea || "",
        핵심가치제안: report.core_value || "",
        분류번호: 분류번호,
        topK: topK,
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      return NextResponse.json(
        { error: "검색 요청 실패", details: errorText },
        { status: searchResponse.status }
      );
    }

    const searchResult = await searchResponse.json();
    return NextResponse.json(searchResult);
  } catch (error) {
    return NextResponse.json(
      { error: "검색 요청 중 오류 발생", details: error },
      { status: 500 }
    );
  }
}
