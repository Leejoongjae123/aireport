import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExpertEvaluationForm } from "./components/ExpertEvaluationForm";
import { ExpertReviewDetailData } from "./types";

async function getExpertReviewData(
  expertRequestId: string
): Promise<ExpertReviewDetailData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
      attachment_url_word,
      report_uuid,
      user_id,
      expert_request_id,
      expert_requests!inner (
        status,
        selected_expert_id
      ),
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
    .eq("expert_request_id", expertRequestId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    created_at: data.created_at,
    business_score: data.business_score,
    market_score: data.market_score,
    investment_appeal_score: data.investment_appeal_score,
    execution_feasibility_score: data.execution_feasibility_score,
    document_completeness_score: data.document_completeness_score,
    overall_score: data.overall_score,
    expert_comment: data.expert_comment,
    attachment_url_pdf: data.attachment_url_pdf,
    attachment_url_word: data.attachment_url_word,
    report_uuid: data.report_uuid,
    user_id: data.user_id,
    expert_request_id: data.expert_request_id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request_status: (data.expert_requests as any)?.status || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected_expert_id: (data.expert_requests as any)?.selected_expert_id || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report_title: (data.report_create as any)?.title || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    business_field: (data.report_create as any)?.business_field || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    investment_amount: (data.report_create as any)?.investment_amount || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report_created_at: (data.report_create as any)?.created_at || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user_name: (data.profiles as any)?.name || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user_email: (data.profiles as any)?.email || null,
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
