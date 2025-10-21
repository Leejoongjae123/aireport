export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  isGenerating?: boolean;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

// 전문가 매칭 관련 타입
export interface MatchDetail {
  keyword: string;
  matched_item: string;
  similarity: number;
}

export interface ExpertRanking {
  순위: number;
  이름: string;
  경력: string[];
  분야: string[];
  경력파일명: string;
  매칭_개수: number;
  매칭_상세: MatchDetail[];
}

export interface ExpertMatchResponse {
  keywords: string[];
  matching_method: string;
  similarity_threshold: number;
  total_experts_evaluated: number;
  final_ranking: ExpertRanking[];
}

// 전문가 선택용 인터페이스
export interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  description: string;
  careers: string[];
  fields: string[];
  matchingCount: number;
  matchingDetails: MatchDetail[];
  selected: boolean;
}
