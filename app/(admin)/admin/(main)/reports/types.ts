export interface ReportData {
  id: string;
  uuid: string;
  title: string | null;
  business_field: string | null;
  user_id: string | null;
  email: string | null;
  step: string | null;
  is_complete: boolean | null;
  created_at: string;
  user_name: string | null;
}

export interface ReportSearchParams {
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
  businessField?: string;
  searchType?: string;
  searchValue?: string;
}

export interface ReportListResponse {
  data: ReportData[];
  total: number;
  page: number;
  limit: number;
}
