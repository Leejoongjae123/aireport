import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 작업 상태 응답 타입
interface JobStatusResponse {
  task_id: string;
  status: "PENDING" | "STARTED" | "PROGRESS" | "SUCCESS" | "FAILURE" | "RETRY";
  result: {
    result?: "success" | "error";
    contents?: string;
    elapsed_seconds?: number;
    success?: boolean;
    message?: string;
    [key: string]: unknown;
  } | null;
  error: string | null;
  meta: {
    status?: string;
    current?: number;
    total?: number;
    success?: boolean;
    [key: string]: unknown;
  };
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ task_id: string }> }
) {
  const params = await props.params;
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { task_id } = params;

    if (!task_id) {
      return NextResponse.json(
        { error: "task_id is required" },
        { status: 400 }
      );
    }

    // AI 엔드포인트 확인
    const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;
    if (!aiEndpoint) {
      return NextResponse.json(
        { error: "AI 엔드포인트가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    console.log(`[Job Status API] 작업 상태 조회 시작: ${task_id}`);

    // 백엔드 API 호출
    const response = await fetch(`${aiEndpoint}/api/jobs/status/${task_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
      } catch {
        errorDetail = await response.text();
      }

      console.error(`[Job Status API] AI 서버 에러:`, {
        status: response.status,
        statusText: response.statusText,
        errorDetail,
      });

      return NextResponse.json(
        {
          error: `AI 서버 요청 실패 (${response.status}): ${errorDetail}`,
        },
        { status: response.status }
      );
    }

    const result: JobStatusResponse = await response.json();

    console.log(`[Job Status API] 작업 상태 조회 성공:`, {
      task_id,
      status: result.status,
      hasResult: !!result.result,
      hasError: !!result.error,
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    
    console.error("[Job Status API] 에러:", errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
