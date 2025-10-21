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

    const { data, error } = await supabase
      .from("report_sections")
      .select("*")
      .eq("report_uuid", id)
      .eq("subsection_id", subsectionId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: "섹션을 찾을 수 없습니다." },
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

    const { data, error } = await supabase
      .from("report_sections")
      .update({
        content,
        is_completed: true,
      })
      .eq("report_uuid", id)
      .eq("subsection_id", subsectionId)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: "섹션 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "섹션을 찾을 수 없습니다." },
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
