import { create } from 'zustand';

interface GeneratedReportSection {
  query: string;
  content: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
}

interface EditorState {
  editorContent: string;
  isLoading: boolean;
  currentSection: string | null; // 현재 작업 중인 목차
  selectedSubsectionId: string | null; // 현재 선택된 subsection ID
  cachedSections: Map<string, GeneratedReportSection>; // subsection_id를 키로 하는 캐시
  setEditorContent: (content: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentSection: (section: string | null) => void;
  setSelectedSubsectionId: (id: string | null) => void;
  updateCachedSections: (sections: GeneratedReportSection[]) => void;
  getCachedSection: (subsectionId: string) => GeneratedReportSection | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editorContent: '',
  isLoading: false,
  currentSection: null,
  selectedSubsectionId: null,
  cachedSections: new Map(),
  setEditorContent: (content) => set({ editorContent: content }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setSelectedSubsectionId: (id) => set({ selectedSubsectionId: id }),
  updateCachedSections: (sections) => {
    const newCache = new Map(get().cachedSections);
    sections.forEach(section => {
      newCache.set(section.subsection_id, section);
    });
    set({ cachedSections: newCache });
  },
  getCachedSection: (subsectionId) => {
    return get().cachedSections.get(subsectionId);
  },
}));
