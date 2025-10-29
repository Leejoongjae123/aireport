export interface CareerEntry {
  id: string;
  description: string;
}

export interface FieldEntry {
  id: string;
  year: string;
  field: string;
  description: string;
}

export interface ExpertFormData {
  name: string;
  contact: string;
  businessField: string;
  summary: string;
  experienceYears: string;
  recentAffiliation: string;
  isPublic: boolean;
  careerFileName: string;
}
