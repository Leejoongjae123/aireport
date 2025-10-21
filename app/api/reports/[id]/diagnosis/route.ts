import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface GeneratedReportItem {
  query?: string | null;
  content?: string | null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();

    const {
      data: reportData,
      error: reportError,
    } = await supabase
      .from("report_create")
      .select("generated_report, business_field")
      .eq("uuid", id)
      .single();

    if (reportError || !reportData) {
      return NextResponse.json(
        { success: false, message: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const generatedReport =
      (reportData.generated_report as GeneratedReportItem[] | null) ?? null;

    if (!generatedReport || generatedReport.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "생성된 리포트가 존재하지 않습니다.",
        },
        { status: 400 }
      );
    }

    const {
      data: procedureData,
      error: procedureError,
    } = await supabase
      .from("procedure")
      .select("evaluation_criteria")
      .eq("field_name", reportData.business_field)
      .single();

    if (procedureError && !procedureData) {
      return NextResponse.json(
        { success: false, message: "평가 기준을 불러오지 못했습니다." },
        { status: 500 }
      );
    }

    const evaluationCriteria = procedureData?.evaluation_criteria ?? null;

    const aiEndpoint = process.env.NEXT_PUBLIC_AI_END_POINT;
    if (!aiEndpoint) {
      return NextResponse.json(
        { success: false, message: "AI 엔드포인트가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const requestBody = {
      input: generatedReport.map((section) => ({
        contents:
          typeof section.content === "string" && section.content.length > 0
            ? section.content
            : null,
        query:
          typeof section.query === "string" && section.query.length > 0
            ? section.query
            : null,
      })),
      evaluation: evaluationCriteria ?? undefined,
    };

    const response = await fetch(`${aiEndpoint}/diagnosis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      return NextResponse.json(
        {
          success: false,
          message: "진단 요청에 실패했습니다.",
          detail,
        },
        { status: response.status }
      );
    }

    const diagnosisResult = await response.json();

    return NextResponse.json({
      success: true,
      data: diagnosisResult,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
