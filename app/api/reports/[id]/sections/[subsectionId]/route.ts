import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 특정 섹션 조회
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; subsectionId: string }> }
) {
  const params = await context.params;
  const { id, subsectionId } = params;

  try {
    const supabase = await createClient();

    // subsectionId 형식 정규화: "1-1" -> "1.1" 또는 그대로 유지
    const normalizedSubsectionId = subsectionId.replace(/-/g, ".");

    // 먼저 정규화된 ID로 검색
    let { data, error } = await supabase
      .from("report_sections")
      .select("*")
      .eq("report_uuid", id)
      .eq("subsection_id", normalizedSubsectionId)
      .single();

    // 정규화된 ID로 찾지 못하면 원본 ID로 재시도
    if (error && subsectionId !== normalizedSubsectionId) {
      const result = await supabase
        .from("report_sections")
        .select("*")
        .eq("report_uuid", id)
        .eq("subsection_id", subsectionId)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      return NextResponse.json(
        { 
          success: false, 
          message: "섹션을 찾을 수 없습니다.",
          debug: {
            requestedId: subsectionId,
            normalizedId: normalizedSubsectionId,
            reportUuid: id
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        query: data.query,
        content: data.content,
        section_id: data.section_id,
        section_name: data.section_name,
        subsection_id: data.subsection_id,
        subsection_name: data.subsection_name,
        is_completed: data.is_completed,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 특정 섹션 업데이트
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; subsectionId: string }> }
) {
  const params = await context.params;
  const { id, subsectionId } = params;

  try {
    const supabase = await createClient();
    const body = await request.json();

    const { content } = body;

    // subsectionId 형식 정규화: "1-1" -> "1.1" 또는 그대로 유지
    const normalizedSubsectionId = subsectionId.replace(/-/g, ".");

    // 먼저 정규화된 ID로 업데이트 시도
    let { data, error } = await supabase
      .from("report_sections")
      .update({
        content,
        is_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("report_uuid", id)
      .eq("subsection_id", normalizedSubsectionId)
      .select();

    // 정규화된 ID로 찾지 못하면 원본 ID로 재시도
    if ((!data || data.length === 0) && subsectionId !== normalizedSubsectionId) {
      const result = await supabase
        .from("report_sections")
        .update({
          content,
          is_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("report_uuid", id)
        .eq("subsection_id", subsectionId)
        .select();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: "섹션 업데이트에 실패했습니다.",
          error: error.message 
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "섹션을 찾을 수 없습니다.",
          debug: {
            requestedId: subsectionId,
            normalizedId: normalizedSubsectionId,
            reportUuid: id
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
