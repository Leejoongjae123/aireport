export interface Expert {
  id: string;
  name: string;
  specialty: string;
  description: string;
  selected?: boolean;
}

export interface ExpertRequest {
  id: number;
  created_at: string;
  updated_at: string;
  report_uuid: string;
  user_id: string;
  all_candidates: Expert[];
  selected_expert: Expert;
  status: string;
  report_create: {
    title: string;
    business_field: string;
    created_at: string;
  };
}
