import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return NextResponse.json({ error: "파일명이 필요합니다." }, { status: 400 });
  }

  try {
    // 파일 다운로드
    const { data, error } = await supabase.storage
      .from("expert-files")
      .download(fileName);

    if (error) {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    }

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 파일명 추출 (UUID 제거)
    const originalFileName = fileName.includes('-') 
      ? fileName.substring(fileName.indexOf('-') + 1) 
      : fileName;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(originalFileName)}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "파일 다운로드에 실패했습니다." }, { status: 500 });
  }
}
