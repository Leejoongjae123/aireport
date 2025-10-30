export type ExpertRequestStatus = "pending" | "evaluating" | "consulting_requested" | "completed";

export interface ExpertRequest {
  id: number;
  created_at: string;
  updated_at: string;
  status: ExpertRequestStatus;
  report_uuid: string;
  user_id: string;
  selected_expert_id: string | null;
  report_create: {
    uuid: string;
    title: string;
    business_field: string;
  };
  profiles: {
    id: string;
    name: string;
    email: string;
  };
  expert_informations: {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any;
  } | null;
  expert_review: {
    id: number;
    overall_score: number;
    updated_at: string;
  }[] | null;
}

export interface ExpertEvaluationStats {
  total: number;
  completed: number;
  pending: number;
  delayed: number;
}

export interface ExpertEvaluationResponse {
  data: ExpertRequest[];
  count: number;
  stats: ExpertEvaluationStats;
  page: number;
  limit: number;
}

export type StatusBadgeType = "완료" | "대기" | "지연";
