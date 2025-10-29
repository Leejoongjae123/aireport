export interface ReportInformation {
  id: number;
  번호: number | null;
  제목: string | null;
  분야: string | null;
  키워드: string | null;
  보고서파일명: string | null;
  분야번호: number | null;
  is_completed: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReportStats {
  total: number;
  thisMonth: number;
  latestEmbeddingDate: string | null;
}

export interface ReportResponse {
  data: ReportInformation[];
  count: number;
  stats: ReportStats;
  page: number;
  limit: number;
}
