export interface DiagnosisItem {
  id: number;
  title: string;
  score: number;
  summary?: string;
  description?: string;
}

export interface DiagnosisCategory {
  id: number;
  name: string;
  score?: number;
  items: DiagnosisItem[];
  summary?: string;
}

export interface DiagnosisResult {
  categories: DiagnosisCategory[];
  overallScore?: number;
  overallSummary?: string;
  recommendation?: string;
}
