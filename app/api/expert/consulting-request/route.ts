import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - No user found", authError: authError?.message },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const reportUuid = formData.get("report_uuid") as string;
    const expertRequestId = formData.get("expert_request_id") as string;
    const expertId = formData.get("expert_id") as string;
    const requestSubject = formData.get("request_subject") as string;
    const detailedRequirements = formData.get("detailed_requirements") as string;
    const files = formData.getAll("files") as File[];

    if (!reportUuid || !expertRequestId || !expertId || !requestSubject || !detailedRequirements) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 파일 업로드 처리
    const attachmentUrls: string[] = [];
    
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('consulting-attachments')
            .upload(fileName, file, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) {
            return NextResponse.json(
              { error: "파일 업로드 실패", details: uploadError.message },
              { status: 500 }
            );
          }

          const { data: { publicUrl } } = supabase.storage
            .from('consulting-attachments')
            .getPublicUrl(fileName);

          attachmentUrls.push(publicUrl);
        }
      }
    }

    // consulting_requests 테이블에 데이터 삽입
    const { data: consultingRequest, error: insertError } = await supabase
      .from("consulting_requests")
      .insert({
        report_uuid: reportUuid,
        user_id: user.id,
        expert_request_id: parseInt(expertRequestId),
        expert_id: expertId,
        request_subject: requestSubject,
        detailed_requirements: detailedRequirements,
        attachment_urls: attachmentUrls,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "컨설팅 요청 생성 실패", details: insertError.message },
        { status: 500 }
      );
    }

    // expert_requests 테이블의 status를 consulting_requested로 업데이트
    const { error: updateError } = await supabase
      .from("expert_requests")
      .update({ status: 'consulting_requested' })
      .eq('id', parseInt(expertRequestId));

    if (updateError) {
      return NextResponse.json(
        { error: "전문가 요청 상태 업데이트 실패", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: consultingRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error)?.message },
      { status: 500 }
    );
  }
}
