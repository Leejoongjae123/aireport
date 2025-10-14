import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("report_create")
      .select("procedure_modify")
      .eq("uuid", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "보고서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      procedureModify: data.procedure_modify,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
