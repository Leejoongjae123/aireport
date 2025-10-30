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

    // 데이터 정제 및 검증
    const sanitizeString = (str: string | undefined | null): string => {
      if (!str) return "";
      // 문자열로 변환하고 양쪽 공백 제거
      return String(str).trim();
    };

    const requestData = {
      business_idea: sanitizeString(business_idea ?? 사업아이디어),
      core_value: sanitizeString(core_value ?? 핵심가치제안),
      file_name: sanitizeString(file_name ?? 보고서파일명) || "사업계획서",
      report_id: report_id ?? reportId,
    };

    // 요청 데이터 로깅 (디버깅용)
    console.log("Sending to AI endpoint:", requestData);

    const response = await fetch(`${aiEndpoint}/api/reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    

    if (!response.ok) {
      const errorText = await response.text();
      console.log("AI endpoint error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return NextResponse.json(
        { error: "AI 서버 요청 실패", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.log("Request failed:", error);
    return NextResponse.json(
      { 
        error: "보고서 생성 요청 실패", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

