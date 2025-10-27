import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 현재 로그인된 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 오늘 날짜 범위 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.toISOString();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayEnd = tomorrow.toISOString();

  // 오늘 생성된 보고서 조회
  const { data: todayReports, error } = await supabase
    .from("report_create")
    .select("uuid, is_complete")
    .gte("created_at", todayStart)
    .lt("created_at", todayEnd);

  if (error) {
    return NextResponse.json(
      { error: "통계 데이터를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // 통계 계산
  const totalCount = todayReports?.length || 0;
  const successCount = todayReports?.filter(r => r.is_complete === true).length || 0;
  const queueCount = todayReports?.filter(r => r.is_complete === false || r.is_complete === null).length || 0;
  const failureCount = totalCount - successCount - queueCount;

  // 전체 진단 데이터 조회 (테스트용)
  const { data: todayDiagnosis, error: diagnosisError } = await supabase
    .from("diagnosis")
    .select("diagnosis_result, duration_seconds, score_average");

  if (diagnosisError) {
    return NextResponse.json(
      { error: "진단 통계 데이터를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // 진단 통계 계산
  const diagnosisCount = todayDiagnosis?.length || 0;
  const successfulDiagnosisCount = todayDiagnosis?.filter(d => d.diagnosis_result !== null).length || 0;
  const successRate = diagnosisCount > 0 ? (successfulDiagnosisCount / diagnosisCount) * 100 : 0;
  const averageScore = todayDiagnosis?.length > 0 
    ? todayDiagnosis.reduce((sum, d) => sum + (d.score_average || 0), 0) / todayDiagnosis.length 
    : 0;
  const averageDuration = todayDiagnosis?.length > 0
    ? todayDiagnosis.reduce((sum, d) => sum + (d.duration_seconds || 0), 0) / todayDiagnosis.length
    : 0;

  // 전체 전문가 평가 요청 데이터 조회 (테스트용)
  const { data: todayExpertRequests, error: expertRequestsError } = await supabase
    .from("expert_requests")
    .select("status");

  if (expertRequestsError) {
    return NextResponse.json(
      { error: "전문가 평가 요청 통계 데이터를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // 전문가 평가 요청 통계 계산
  const expertRequestCount = todayExpertRequests?.length || 0;

  // 컨설팅 요청 데이터 조회
  const { data: todayConsultingRequests, error: consultingRequestsError } = await supabase
    .from("consulting_requests")
    .select("status");

  if (consultingRequestsError) {
    return NextResponse.json(
      { error: "컨설팅 요청 통계 데이터를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // 컨설팅 요청 통계 계산
  const consultingRequestCount = todayConsultingRequests?.length || 0;

  // 최근 생성 보고서 5개 조회
  const { data: recentReports, error: recentReportsError } = await supabase
    .from("report_create")
    .select("uuid, title, business_field, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentReportsError) {
    return NextResponse.json(
      { error: "최근 보고서 데이터를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // 평균 처리 시간을 분:초 형식으로 변환
  const minutes = Math.floor(averageDuration / 60);
  const seconds = Math.floor(averageDuration % 60);
  const averageDurationFormatted = `${minutes}분 ${seconds}초`;

  return NextResponse.json({
    success: true,
    stats: {
      totalCount,
      successCount,
      failureCount,
      queueCount,
      diagnosisCount,
      averageScore,
      averageDurationFormatted,
      successRate,
      expertRequestCount,
      consultingRequestCount,
    },
    recentReports: recentReports || [],
  });
}
