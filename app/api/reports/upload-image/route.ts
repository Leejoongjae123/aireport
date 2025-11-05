import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { reportId, imageData, fileName } = body;

    if (!reportId || !imageData || !fileName) {
      return NextResponse.json(
        { success: false, message: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // base64 데이터에서 실제 이미지 데이터 추출
    const base64Data = imageData.split(",")[1];
    const mimeType = imageData.match(/data:([^;]+);/)?.[1] || "image/png";
    
    // base64를 Buffer로 변환
    const buffer = Buffer.from(base64Data, "base64");

    // 파일 확장자 추출
    const extension = mimeType.split("/")[1] || "png";
    const timestamp = Date.now();
    const uniqueFileName = `${reportId}/${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}.${extension}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from("reports")
      .upload(uniqueFileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { success: false, message: "이미지 업로드에 실패했습니다.", error: error.message },
        { status: 500 }
      );
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
}
