import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // 회원 정보 조회
    const { data: member, error: memberError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (memberError) {
      return NextResponse.json(
        { error: "회원 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // expert_requests 조회 (report_create와 조인)
    const { data: expertRequests, error: expertError } = await supabase
      .from("expert_requests")
      .select(`
        id,
        created_at,
        status,
        report_uuid,
        report_create(
          title,
          uuid
        )
      `)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (expertError) {
      console.log("Expert requests error:", expertError);
    }

    // consulting_requests 조회 (report_create와 조인)
    const { data: consultingRequests, error: consultingError } = await supabase
      .from("consulting_requests")
      .select(`
        id,
        created_at,
        status,
        report_uuid,
        report_create(
          title,
          uuid
        )
      `)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (consultingError) {
      console.log("Consulting requests error:", consultingError);
    }

    // 요청 기록 통합 및 포맷팅
    interface RequestItem {
      no: number;
      type: "전문가 평가" | "컨설팅 요청";
      id: string;
      reportName: string;
      requestDate: string;
      status: string;
      originalId?: string;
      report_uuid?: string;
    }

    const requests: RequestItem[] = [];
    let no = 1;

    // expert_requests 추가
    if (expertRequests) {
      expertRequests.forEach((req) => {
        const reportCreate = Array.isArray(req.report_create) 
          ? req.report_create[0] 
          : req.report_create;
        
        requests.push({
          no: no++,
          type: "전문가 평가" as const,
          id: `EXP-${req.id}`,
          reportName: reportCreate?.title || "-",
          requestDate: new Date(req.created_at).toISOString().split("T")[0],
          status: getStatusText(req.status),
          report_uuid: req.report_uuid,
        });
      });
    }

    // consulting_requests 추가
    if (consultingRequests) {
      consultingRequests.forEach((req) => {
        const reportCreate = Array.isArray(req.report_create) 
          ? req.report_create[0] 
          : req.report_create;
        
        requests.push({
          no: no++,
          type: "컨설팅 요청" as const,
          id: `CON-${req.id}`,
          reportName: reportCreate?.title || "-",
          requestDate: new Date(req.created_at).toISOString().split("T")[0],
          status: getStatusText(req.status),
          originalId: req.id,
          report_uuid: req.report_uuid,
        });
      });
    }

    // 날짜순 정렬 (최신순)
    requests.sort((a, b) => {
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    });

    // no 재정렬
    requests.forEach((req, index) => {
      req.no = index + 1;
    });

    return NextResponse.json({
      member,
      requests,
    });
  } catch (error) {
    console.log("Error fetching member detail:", error);
    return NextResponse.json(
      { error: "회원 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 상태 텍스트 변환 함수
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "대기중",
    evaluating: "평가중",
    consulting_requested: "컨설팅 요청됨",
    completed: "완료",
  };
  return statusMap[status] || status;
}
