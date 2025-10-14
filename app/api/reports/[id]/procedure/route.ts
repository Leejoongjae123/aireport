import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // 1. 먼저 report에서 business_field와 procedure_modify 가져오기 (uuid로 조회)
    const { data: reportData, error: reportError } = await supabase
      .from("report_create")
      .select("business_field, procedure_modify")
      .eq("uuid", id)
      .single();

    if (reportError || !reportData) {
      return NextResponse.json(
        { error: "리포트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 2. business_field에 해당하는 field_name으로 procedure 데이터 가져오기
    // business_field가 이미 한글로 저장되어 있으므로 직접 사용
    const { data: procedureData, error: procedureError } = await supabase
      .from("procedure")
      .select("*")
      .eq("field_name", reportData.business_field)
      .single();

    if (procedureError || !procedureData) {
      return NextResponse.json(
        { error: "목차 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...procedureData,
        procedure_modify: reportData.procedure_modify,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
