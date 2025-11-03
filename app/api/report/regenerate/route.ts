import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// RegenerateRequest 타입 정의
interface RegenerateRequest {
  classification: "자세히" | "간결하게" | "윤문" | "특허" | string;
  subject?: string | null;
  contents?: string | null;
}

// RegenerateResponse 타입 정의
interface RegenerateResponse {
  result: "success" | "error";
  contents: string;
  elapsed_seconds: number;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { result: "error", contents: "Unauthorized", elapsed_seconds: 0 },
      { status: 401 }
    );
  }

  try {
    const body: RegenerateRequest = await req.json();
    const { classification, subject, contents } = body;

    // 유효성 검사
    if (["자세히", "간결하게", "윤문"].includes(classification)) {
      if (!contents) {
        return NextResponse.json(
          {
            result: "error",
            contents: '"contents" is required for this classification.',
            elapsed_seconds: (Date.now() - startTime) / 1000,
          },
          { status: 400 }
        );
      }
    } else {
      if (!subject) {
        return NextResponse.json(
          {
            result: "error",
            contents: '"subject" is required for this classification.',
            elapsed_seconds: (Date.now() - startTime) / 1000,
          },
          { status: 400 }
        );
      }
    }

    // AI 엔드포인트 확인
    const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;
    if (!aiEndpoint) {
      return NextResponse.json(
        {
          result: "error",
          contents: "AI 엔드포인트가 설정되지 않았습니다.",
          elapsed_seconds: (Date.now() - startTime) / 1000,
        },
        { status: 500 }
      );
    }

    // 백엔드 API 호출
    const requestBody = {
      classification,
      subject: subject ?? null,
      contents: contents ?? null,
    };

    console.log('[Regenerate API] 요청 시작:', {
      endpoint: `${aiEndpoint}/api/reports/regenerate`,
      classification,
      hasSubject: !!subject,
      hasContents: !!contents,
      contentsLength: contents?.length || 0,
    });

    let response: Response;
    try {
      response = await fetch(`${aiEndpoint}/api/reports/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error('[Regenerate API] 네트워크 에러:', errorMsg);
      return NextResponse.json(
        {
          result: "error",
          contents: `AI 서버 연결 실패 (네트워크 에러): ${errorMsg}`,
          elapsed_seconds: (Date.now() - startTime) / 1000,
        },
        { status: 503 }
      );
    }

    console.log('[Regenerate API] 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      let errorText = '';
      let errorDetail = '';
      
      try {
        errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorDetail = JSON.stringify(errorJson, null, 2);
        } catch {
          errorDetail = errorText;
        }
      } catch {
        errorDetail = '응답 본문을 읽을 수 없습니다.';
      }

      console.error('[Regenerate API] AI 서버 에러:', {
        status: response.status,
        statusText: response.statusText,
        errorDetail,
      });

      return NextResponse.json(
        {
          result: "error",
          contents: `AI 서버 요청 실패 (${response.status} ${response.statusText}): ${errorDetail}`,
          elapsed_seconds: (Date.now() - startTime) / 1000,
        },
        { status: response.status }
      );
    }

    const result: RegenerateResponse = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    const endTime = Date.now();
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      {
        result: "error",
        contents: errorMessage,
        elapsed_seconds: (endTime - startTime) / 1000,
      },
      { status: 500 }
    );
  }
}
