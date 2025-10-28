// 회원 정보 타입
export interface MemberDetail {
  id: string;
  name: string | null;
  email: string | null;
  provider: 'local' | 'google' | 'kakao' | null;
  organization: string | null;
  business_field: 'AI/ICT' | '제조' | '콘텐츠/문화' | '공공/인프라/에너지' | null;
  created_at: string | null;
  updated_at: string | null;
  role: string | null;
}

// 요청 기록 타입
export interface RequestRecord {
  no: number;
  type: '전문가 평가' | '컨설팅 요청';
  id: string;
  reportName: string;
  requestDate: string;
  status: string;
  originalId?: string; // 실제 DB ID (CON- 접두사 제거된 값)
  report_uuid?: string; // 보고서 UUID
}

// API 응답 타입
export interface MemberDetailResponse {
  member: MemberDetail | null;
  requests: RequestRecord[];
}
