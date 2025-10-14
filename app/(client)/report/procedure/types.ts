// Procedure 페이지 타입 정의

export interface SectionItem {
  id: string;
  name: string;
  enabled: boolean;
}

export interface SubsectionItem {
  id: number;
  소목차명: string;
  enabled?: boolean;
}

export interface TableOfContentItem {
  id: number;
  대목차: string;
  소목차: SubsectionItem[];
}

// 평가 항목의 상세 내용 타입
export interface EvaluationItemDetail {
  id: number;
  내용: string;
}

// 평가 카테고리 타입
export interface EvaluationCategoryItem {
  id: number;
  카테고리: string;
  평가항목: EvaluationItemDetail[];
}

// evaluation_criteria 구조: 배열 형태
export type EvaluationCriteriaData = EvaluationCategoryItem[];

export interface ProcedureData {
  id: number;
  field_number: number;
  field_name: string;
  table_of_contents: TableOfContentItem[];
  evaluation_criteria?: EvaluationCriteriaData;
}

// 평평한(flat) 소목차 아이템 (드래그 앤 드롭용)
export interface FlatSubsectionItem {
  id: string; // 고유 ID (mainId-subId 형식)
  mainId: number;
  subId: number;
  name: string;
  enabled: boolean;
}

// Supabase에 저장될 procedure_modify JSON 구조
export interface ProcedureModifySubsection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  minChar: number;
  maxChar: number;
}

export interface ProcedureModifySection {
  id: string;
  name: string;
  enabled: boolean;
  subsections: ProcedureModifySubsection[];
}

export interface ProcedureModifyData {
  sections: ProcedureModifySection[];
}
