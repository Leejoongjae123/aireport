import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  try {
    const supabase = await createClient();

    // report_create 테이블에서 generated_report 가져오기
    const { data, error } = await supabase
      .from("report_create")
      .select("generated_report")
      .eq("uuid", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (!data || !data.generated_report) {
      return NextResponse.json(
        { success: false, message: "생성된 리포트가 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.generated_report,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
