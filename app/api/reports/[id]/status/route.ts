import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("report_create")
      .select("is_complete")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "보고서 상태 조회 실패", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isComplete: data?.is_complete || false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "보고서 상태 조회 중 오류 발생", details: error },
      { status: 500 }
    );
  }
}
