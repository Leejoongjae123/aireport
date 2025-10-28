export interface ReportData {
  id: string;
  uuid: string;
  title: string;
  created_at: string;
  step: string;
  user_id: string;
  email: string;
  business_field: string;
  investment_amount: string;
  business_idea: string;
  core_value: string;
  procedure_modify: Record<string, unknown>;
  is_complete: boolean;
  generated_report: Record<string, unknown>;
  reference_report: string;
}

export interface ReportSection {
  id: string;
  report_uuid: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
  query: string;
  content: string;
  is_completed: boolean;
  generation_order: number;
  character_count: number;
  created_at: string;
  updated_at: string;
}

export interface DiagnosisData {
  id: string;
  report_uuid: string;
  diagnosis_result: Record<string, unknown>;
  duration_seconds: number;
  score_average: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertReviewData {
  id: string;
  report_uuid: string;
  user_id: string;
  expert_request_id: string;
  business_score: number;
  market_score: number;
  investment_appeal_score: number;
  execution_feasibility_score: number;
  document_completeness_score: number;
  overall_score: number;
  expert_comment: string;
  attachment_url_pdf: string;
  attachment_url_word: string;
  created_at: string;
  updated_at: string;
}

export interface ReportPreviewData {
  report: ReportData;
  sections: ReportSection[];
  diagnosis: DiagnosisData | null;
  expertReview: ExpertReviewData | null;
}
