export type ExpertRequestStatus = 'pending' | 'evaluating' | 'completed' | 'consulting_requested';

export interface ExpertRequest {
  id: string;
  user_id: string;
  report_uuid: string;
  status: ExpertRequestStatus;
  created_at: string;
  updated_at: string;
  report_create: {
    title: string;
    business_field: string;
  };
  profiles: {
    username: string;
  };
}
