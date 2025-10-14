import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { procedureModify } = body;

    if (!procedureModify) {
      return NextResponse.json(
        { error: "procedure_modify 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // report_create 테이블 업데이트 (uuid로 조회)
    const { data, error } = await supabase
      .from("report_create")
      .update({ procedure_modify: procedureModify })
      .eq("uuid", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// procedure_modify 데이터 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("report_create")
      .select("procedure_modify")
      .eq("uuid", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.procedure_modify,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
