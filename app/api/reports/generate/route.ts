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

    // 필수 데이터 검증
    if (!requestData.business_idea || requestData.business_idea.length < 10) {
      console.log("❌ business_idea가 너무 짧거나 비어있음:", requestData.business_idea);
      return NextResponse.json(
        { 
          error: "사업 아이디어를 입력해주세요", 
          details: "최소 10자 이상의 사업 아이디어가 필요합니다.",
          received_length: requestData.business_idea.length
        },
        { status: 400 }
      );
    }

    if (!requestData.core_value || requestData.core_value.length < 10) {
      console.log("❌ core_value가 너무 짧거나 비어있음:", requestData.core_value);
      return NextResponse.json(
        { 
          error: "핵심 가치 제안을 입력해주세요", 
          details: "최소 10자 이상의 핵심 가치 제안이 필요합니다.",
          received_length: requestData.core_value.length
        },
        { status: 400 }
      );
    }

    // 요청 데이터 로깅 (디버깅용)
    console.log("=== AI 엔드포인트 요청 시작 ===");
    console.log("Endpoint URL:", `${aiEndpoint}/api/reports/generate`);
    console.log("Request Data:", JSON.stringify(requestData, null, 2));
    console.log("Request Body Length:", JSON.stringify(requestData).length);
    console.log("business_idea length:", requestData.business_idea.length);
    console.log("core_value length:", requestData.core_value.length);

    // 타임아웃 설정 (5분)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    try {
      const response = await fetch(`${aiEndpoint}/api/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("=== AI 엔드포인트 응답 수신 ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log("=== AI 엔드포인트 에러 상세 ===");
        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("Error Response:", errorText);
        
        // JSON 파싱 시도
        try {
          const errorJson = JSON.parse(errorText);
          console.log("Parsed Error JSON:", JSON.stringify(errorJson, null, 2));
        } catch {
          console.log("Error response is not JSON");
        }

        // OpenAI 관련 에러 메시지 파싱
        let errorMessage = "AI 서버 요청 실패";
        if (errorText.includes("OpenAI") || errorText.includes("responses")) {
          errorMessage = "AI 서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.";
        }

        return NextResponse.json(
          { 
            error: errorMessage, 
            details: errorText,
            suggestion: "잠시 후 다시 시도해주세요."
          },
          { status: response.status }
        );
      }

      const result = await response.json();
      return NextResponse.json(result);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { 
            error: "요청 시간 초과", 
            details: "AI 서버 응답 시간이 너무 깁니다.",
            suggestion: "잠시 후 다시 시도해주세요."
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "AI 서버 연결 실패", 
          details: fetchError instanceof Error ? fetchError.message : String(fetchError),
          suggestion: "네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요."
        },
        { status: 503 }
      );
    }
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

