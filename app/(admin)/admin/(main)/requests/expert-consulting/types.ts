export type ConsultingRequestStatus = "completed" | "waiting";

export interface ConsultingRequest {
  id: number;
  created_at: string;
  updated_at: string;
  status: ConsultingRequestStatus;
  report_uuid: string;
  user_id: string;
  expert_id: string | null;
  request_subject: string | null;
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
    field: string | null;
  } | null;
}

export interface ConsultingRequestStats {
  total: number;
  completed: number;
  waiting: number;
}

export interface ConsultingRequestResponse {
  data: ConsultingRequest[];
  count: number;
  stats: ConsultingRequestStats;
  page: number;
  limit: number;
}

export type StatusBadgeType = "완료" | "대기";
