export interface ConsultingRequestDetail {
  id: number;
  report_uuid: string;
  user_id: string;
  expert_request_id: number;
  expert_id: string;
  request_subject: string;
  detailed_requirements: string;
  attachment_urls: string[];
  status: string;
  created_at: string;
  updated_at: string;
  report_create: {
    title: string;
    uuid: string;
  };
  expert_requests: {
    id: number;
    selected_expert_id: string;
    status: string;
  };
  profiles: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ExpertInfo {
  id: string;
  name: string;
  career: string[];
  field: string[];
}

export interface ReviewInfo {
  id: number;
  created_at: string;
  business_score: number;
  market_score: number;
  investment_appeal_score: number;
  execution_feasibility_score: number;
  document_completeness_score: number;
  overall_score: number;
  expert_comment: string;
  attachment_url_pdf: string;
  attachment_url_word: string;
  updated_at: string;
  report_uuid: string;
  user_id: string;
  expert_request_id: number;
}

export interface ConsultingDetailResponse {
  success: boolean;
  data: {
    consultingRequest: ConsultingRequestDetail;
    expertInfo: ExpertInfo | null;
    reviewInfo: ReviewInfo | null;
  };
}
