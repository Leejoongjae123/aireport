import { z } from "zod";

// Expert Review Form Schema
export const expertReviewSchema = z.object({
  business_score: z
    .number()
    .min(1, "사업성 점수는 1점 이상이어야 합니다")
    .max(5, "사업성 점수는 5점 이하여야 합니다"),
  market_score: z
    .number()
    .min(1, "시장성 점수는 1점 이상이어야 합니다")
    .max(5, "시장성 점수는 5점 이하여야 합니다"),
  investment_appeal_score: z
    .number()
    .min(1, "투자 매력도 점수는 1점 이상이어야 합니다")
    .max(5, "투자 매력도 점수는 5점 이하여야 합니다"),
  execution_feasibility_score: z
    .number()
    .min(1, "실행 가능성 점수는 1점 이상이어야 합니다")
    .max(5, "실행 가능성 점수는 5점 이하여야 합니다"),
  document_completeness_score: z
    .number()
    .min(1, "문서 완성도 점수는 1점 이상이어야 합니다")
    .max(5, "문서 완성도 점수는 5점 이하여야 합니다"),
  expert_comment: z
    .string()
    .min(10, "전문가 코멘트는 최소 10자 이상 입력해주세요"),
  attachment_url_pdf: z.string().optional(),
  attachment_url_word: z.string().optional(),
});

export type ExpertReviewFormData = z.infer<typeof expertReviewSchema>;

// Expert Review Detail Data
export interface ExpertReviewDetailData {
  id: number;
  created_at: string;
  business_score: number | null;
  market_score: number | null;
  investment_appeal_score: number | null;
  execution_feasibility_score: number | null;
  document_completeness_score: number | null;
  overall_score: string | null;
  expert_comment: string | null;
  attachment_url_pdf: string | null;
  attachment_url_word: string | null;
  report_uuid: string | null;
  user_id: string | null;
  expert_request_id: number | null;
  request_status: string | null;
  selected_expert_id: string | null;
  report_title: string | null;
  business_field: string | null;
  investment_amount: string | null;
  report_created_at: string | null;
  user_name: string | null;
  user_email: string | null;
}
