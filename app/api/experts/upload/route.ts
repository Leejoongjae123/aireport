import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  // 파일 크기 체크 (20MB)
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json(
      { error: "파일 크기는 20MB를 초과할 수 없습니다." },
      { status: 400 }
    );
  }

  // 파일 확장자 추출
  const fileExtension = file.name.substring(file.name.lastIndexOf("."));

  // 파일명 생성 (UUID + 파일 확장자)
  const uuid = randomUUID();
  const fileName = `${uuid}${fileExtension}`;

  // Supabase Storage에 업로드
  const { error } = await supabase.storage
    .from("expert-files")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 파일 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("expert-files").getPublicUrl(fileName);

  return NextResponse.json({
    fileName: fileName,
    url: publicUrl,
  });
}
