import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExpertEvaluationForm } from "./components/ExpertEvaluationForm";
import { ExpertReviewDetailData } from "./types";

async function getExpertReviewData(
  expertRequestId: string
): Promise<ExpertReviewDetailData | null> {
  const supabase = await createClient();

  // 먼저 expert_requests 정보를 가져옵니다
  const { data: requestData, error: requestError } = await supabase
    .from("expert_requests")
    .select(
      `
      id,
      created_at,
      status,
      selected_expert_id,
      report_uuid,
      user_id,
      report_create!inner (
        title,
        business_field,
        investment_amount,
        created_at
      ),
      profiles!inner (
        name,
        email
      )
    `
    )
    .eq("id", expertRequestId)
    .single();

  if (requestError || !requestData) {
    return null;
  }

  // expert_review 데이터를 가져옵니다 (없을 수도 있음)
  const { data: reviewData } = await supabase
    .from("expert_review")
    .select(
      `
      id,
      created_at,
      business_score,
      market_score,
      investment_appeal_score,
      execution_feasibility_score,
      document_completeness_score,
      overall_score,
      expert_comment,
      attachment_url_pdf,
      attachment_url_word
    `
    )
    .eq("expert_request_id", expertRequestId)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportCreate = requestData.report_create as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profiles = requestData.profiles as any;

  return {
    id: reviewData?.id || 0,
    created_at: reviewData?.created_at || requestData.created_at,
    business_score: reviewData?.business_score || null,
    market_score: reviewData?.market_score || null,
    investment_appeal_score: reviewData?.investment_appeal_score || null,
    execution_feasibility_score: reviewData?.execution_feasibility_score || null,
    document_completeness_score: reviewData?.document_completeness_score || null,
    overall_score: reviewData?.overall_score || null,
    expert_comment: reviewData?.expert_comment || null,
    attachment_url_pdf: reviewData?.attachment_url_pdf || null,
    attachment_url_word: reviewData?.attachment_url_word || null,
    report_uuid: requestData.report_uuid,
    user_id: requestData.user_id,
    expert_request_id: parseInt(expertRequestId),
    request_status: requestData.status,
    selected_expert_id: requestData.selected_expert_id,
    report_title: reportCreate?.title || null,
    business_field: reportCreate?.business_field || null,
    investment_amount: reportCreate?.investment_amount || null,
    report_created_at: reportCreate?.created_at || null,
    user_name: profiles?.name || null,
    user_email: profiles?.email || null,
  };
}

export default async function ExpertEvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getExpertReviewData(id);

  if (!data) {
    notFound();
  }

  return <ExpertEvaluationForm data={data} expertRequestId={id} />;
}
