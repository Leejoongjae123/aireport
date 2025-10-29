export interface ExpertInformation {
  id: string;
  name: string | null;
  career: Array<{ career: string[] } | string> | null;
  field: Array<{ field: string[] } | string> | null;
  career_file_name: string | null;
  created_at?: string;
  updated_at?: string;
  is_visible?: boolean;
  embedding_date?: string;
}

export interface ExpertStats {
  total: number;
  thisMonth: number;
  latestEmbeddingDate: string | null;
}

export interface ExpertResponse {
  data: ExpertInformation[];
  count: number;
  stats: ExpertStats;
  page: number;
  limit: number;
}

export type ExpertStatusType = "공개" | "비공개";
