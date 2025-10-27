import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

interface ReportSection {
  query: string | null;
  content: string | null;
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
      .select("business_field")
      .eq("uuid", id)
      .single();

    if (reportError || !reportData) {
      return NextResponse.json(
        { success: false, message: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const {
      data: sectionsData,
      error: sectionsError,
    } = await supabase
      .from("report_sections")
      .select("query, content")
      .eq("report_uuid", id)
      .order("generation_order", { ascending: true });

    if (sectionsError || !sectionsData) {
      return NextResponse.json(
        {
          success: false,
          message: "리포트 섹션을 불러올 수 없습니다.",
        },
        { status: 500 }
      );
    }

    if (sectionsData.length === 0) {
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
      input: sectionsData.map((section: ReportSection) => ({
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
    // console.log('requestBody:', requestBody);

    // AI 호출 시작 시간 측정
    const startTime = Date.now();

    const response = await fetch(`${aiEndpoint}/api/diagnosis`, {
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

    // AI 호출 종료 시간 측정 (초 단위)
    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - startTime) / 1000);

    // 진단 결과에서 평균 점수 추출
    let scoreAverage = null;
    if (diagnosisResult && typeof diagnosisResult === 'object') {
      // score_average 필드가 직접 제공되는 경우 우선 사용
      if (diagnosisResult.score_average !== undefined && diagnosisResult.score_average !== null) {
        const score = Number(diagnosisResult.score_average);
        if (!isNaN(score)) {
          scoreAverage = Math.round(score * 100) / 100; // 소수점 둘째자리까지 유지
        }
      }
      
      // 기존 로직: 여러 가능한 필드명에서 평균 점수 찾기 (fallback)
      if (scoreAverage === null) {
        const possibleScoreFields = ['average_score', 'averageScore', 'score', 'totalScore', 'average'];
        for (const field of possibleScoreFields) {
          if (diagnosisResult[field] !== undefined && diagnosisResult[field] !== null) {
            const score = Number(diagnosisResult[field]);
            if (!isNaN(score)) {
              scoreAverage = Math.round(score * 100) / 100; // 소수점 둘째자리까지 유지
              break;
            }
          }
        }
      }

      // scores 배열의 평균 계산 (fallback)
      if (!scoreAverage && diagnosisResult.scores && Array.isArray(diagnosisResult.scores)) {
        const validScores = diagnosisResult.scores.filter((s: any) => !isNaN(Number(s)));
        if (validScores.length > 0) {
          const average = validScores.reduce((sum: number, s: any) => sum + Number(s), 0) / validScores.length;
          scoreAverage = Math.round(average * 100) / 100; // 소수점 둘째자리까지 유지
        }
      }
    }

    // 진단 결과를 diagnosis 테이블에 저장 (upsert)
    const { error: upsertError } = await supabase
      .from("diagnosis")
      .upsert(
        {
          report_uuid: id,
          diagnosis_result: diagnosisResult,
          score_average: scoreAverage,
          duration_seconds: durationSeconds,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "report_uuid",
        }
      );

    if (upsertError) {
      return NextResponse.json(
        {
          success: false,
          message: "진단 결과 저장에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: diagnosisResult,
      requestBody: requestBody, // 디버깅용 requestBody 포함
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET: 저장된 진단 결과 불러오기
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("diagnosis")
      .select("diagnosis_result, updated_at")
      .eq("report_uuid", id)
      .single();

    if (error) {
      // 데이터가 없는 경우는 정상 (아직 진단하지 않음)
      if (error.code === "PGRST116") {
        return NextResponse.json({
          success: true,
          data: null,
        });
      }

      return NextResponse.json(
        { success: false, message: "진단 결과를 불러올 수 없습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.diagnosis_result ?? null,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
