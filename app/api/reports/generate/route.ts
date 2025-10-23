import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      reportId,
      보고서파일명,
      사업아이디어,
      핵심가치제안,
      business_idea,
      core_value,
      file_name,
      report_id,
    } = body;

    // AI 엔드포인트로 요청 전달
    const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;
    if (!aiEndpoint) {
      return NextResponse.json(
        { error: "AI 엔드포인트가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const response = await fetch(`${aiEndpoint}/api/reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_idea: business_idea ?? 사업아이디어 ?? "",
        core_value: core_value ?? 핵심가치제안 ?? "",
        file_name: file_name ?? 보고서파일명 ?? "사업계획서",
        report_id: report_id ?? reportId,
      }),
    });
    

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "AI 서버 요청 실패", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "보고서 생성 요청 실패", details: error },
      { status: 500 }
    );
  }
}

