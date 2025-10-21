import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 섹션 목록 조회
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  try {
    const supabase = await createClient();

    // report_sections 테이블에서 해당 리포트의 섹션들 가져오기
    const { data, error } = await supabase
      .from("report_sections")
      .select("*")
      .eq("report_uuid", id)
      .order("generation_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, message: "섹션을 조회할 수 없습니다." },
        { status: 500 }
      );
    }

    // 데이터 형식 변환 (기존 generated_report 형식과 호환)
    const formattedData = data?.map((section) => ({
      query: section.query,
      content: section.content,
      section_id: section.section_id,
      section_name: section.section_name,
      subsection_id: section.subsection_id,
      subsection_name: section.subsection_name,
      is_completed: section.is_completed,
    })) || [];

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 섹션 생성 또는 업데이트
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      section_id,
      section_name,
      subsection_id,
      subsection_name,
      query,
      content,
      generation_order,
    } = body;

    // upsert: subsection_id가 같으면 업데이트, 없으면 생성
    const { data, error } = await supabase
      .from("report_sections")
      .upsert(
        {
          report_uuid: id,
          section_id,
          section_name,
          subsection_id,
          subsection_name,
          query,
          content,
          generation_order,
          is_completed: true,
        },
        {
          onConflict: "report_uuid,subsection_id",
        }
      )
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: "섹션 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
