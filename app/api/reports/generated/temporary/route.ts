import { NextRequest, NextResponse } from "next/server";

interface GeneratedReportTemporaryRequest {
  report_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generated_report: any;
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

  let body: GeneratedReportTemporaryRequest;

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
      `${aiEndpoint}/api/reports/generated/temporary`,
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
          message: "임시 리포트 저장에 실패했습니다.",
          report_id: body.report_id,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      json ?? {
        success: true,
        message: "임시 리포트가 저장되었습니다.",
        report_id: body.report_id,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "임시 리포트 저장 중 오류가 발생했습니다.";

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
