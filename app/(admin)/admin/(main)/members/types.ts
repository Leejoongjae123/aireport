export interface MemberData {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  organization: string | null;
  business_field: "AI/ICT" | "제조" | "콘텐츠/문화" | "공공/인프라/에너지" | null;
  provider: "local" | "google" | "kakao";
  role: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  status: "정상" | "탈퇴";
}

export interface MemberSearchParams {
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
  businessField?: string;
  status?: string;
  searchType?: string;
  searchValue?: string;
}

export interface MemberListResponse {
  data: MemberData[];
  total: number;
  page: number;
  limit: number;
}
