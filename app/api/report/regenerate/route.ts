import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// RegenerateRequest 타입 정의
interface RegenerateRequest {
  classification: "자세히" | "간결하게" | "윤문" | "특허" | string;
  subject?: string | null;
  contents?: string | null;
}

// RegenerateResponse 타입 정의 (비동기 응답)
interface RegenerateResponse {
  success: boolean;
  message: string;
  task_id: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", task_id: "" },
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
            success: false,
            message: '"contents" is required for this classification.',
            task_id: "",
          },
          { status: 400 }
        );
      }
    } else {
      if (!subject) {
        return NextResponse.json(
          {
            success: false,
            message: '"subject" is required for this classification.',
            task_id: "",
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
          success: false,
          message: "AI 엔드포인트가 설정되지 않았습니다.",
          task_id: "",
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
          success: false,
          message: `AI 서버 연결 실패 (네트워크 에러): ${errorMsg}`,
          task_id: "",
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
          success: false,
          message: `AI 서버 요청 실패 (${response.status} ${response.statusText}): ${errorDetail}`,
          task_id: "",
        },
        { status: response.status }
      );
    }

    const result: RegenerateResponse = await response.json();

    console.log('[Regenerate API] 작업 시작 성공:', {
      success: result.success,
      task_id: result.task_id,
      message: result.message,
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    
    console.error('[Regenerate API] 에러:', errorMessage);
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        task_id: "",
      },
      { status: 500 }
    );
  }
}
