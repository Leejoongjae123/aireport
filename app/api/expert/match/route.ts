import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      business_report,
      num_keywords = 10,
      top_k = 10,
      similarity_threshold = 0.5,
    } = body;

    if (!business_report) {
      return NextResponse.json(
        { error: "business_report는 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 외부 전문가 매칭 API 호출
    const response = await fetch("http://localhost:8000/api/expert/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_report,
        num_keywords,
        top_k,
        similarity_threshold,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "전문가 매칭 API 호출 실패",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("전문가 매칭 중 오류 발생:", error);
    return NextResponse.json(
      {
        error: "전문가 매칭 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
