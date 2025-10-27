export interface Expert {
  id: string;
  name: string;
  specialty: string;
  description: string;
  selected?: boolean;
}

export type ExpertRequestStatus =
  | "pending"
  | "evaluating"
  | "consulting_requested"
  | "completed";

export interface ExpertRequest {
  id: number;
  created_at: string;
  updated_at: string;
  report_uuid: string;
  user_id: string;
  candidate_expert_ids: string[];
  selected_expert_id: string;
  status: ExpertRequestStatus;
  report_create: {
    title: string;
    business_field: string;
    created_at: string;
  };
  expert_informations: {
    id: string;
    name: string;
    field: string[];
  } | null;
}
