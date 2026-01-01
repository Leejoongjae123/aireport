import { NextRequest, NextResponse } from "next/server";

interface GeneratedReportConfirmRequest {
  report_id: string;
}

interface GeneratedReportSaveResponse {
  success: boolean;
  message: string;
  report_id: string;
}

export async function POST(req: NextRequest) {
  const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;

  if (!aiEndpoint) {
    return NextResponse.json(
      {
        success: false,
        message: "AI 엔드포인트가 설정되지 않았습니다.",
        report_id: "",
      },
      { status: 500 }
    );
  }

  let body: GeneratedReportConfirmRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "잘못된 요청 형식입니다.",
        report_id: "",
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${aiEndpoint}/api/reports/generated/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();
    let json: GeneratedReportSaveResponse | null = null;

    if (text) {
      try {
        json = JSON.parse(text) as GeneratedReportSaveResponse;
      } catch {
        json = null;
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        json ?? {
          success: false,
          message: "리포트 확정에 실패했습니다.",
          report_id: body.report_id,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      json ?? {
        success: true,
        message: "임시 리포트가 최종 리포트로 확정되었습니다.",
        report_id: body.report_id,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "리포트 확정 중 오류가 발생했습니다.";

    return NextResponse.json(
      {
        success: false,
        message,
        report_id: body?.report_id ?? "",
      },
      { status: 500 }
    );
  }
}
