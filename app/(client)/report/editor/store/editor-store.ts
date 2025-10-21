import { create } from 'zustand';

interface GeneratedReportSection {
  query: string;
  content: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
  is_completed?: boolean;
  character_count?: number;
}

interface ProcedureModifySubsection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  minChar: number;
  maxChar: number;
}

interface ProcedureModifySection {
  id: string;
  name: string;
  enabled: boolean;
  subsections: ProcedureModifySubsection[];
}

interface ProcedureModifyData {
  sections: ProcedureModifySection[];
}

interface EditorState {
  editorContent: string;
  isLoading: boolean;
  currentSection: string | null; // 현재 작업 중인 목차
  selectedSubsectionId: string | null; // 현재 선택된 subsection ID
  cachedSections: Map<string, GeneratedReportSection>; // subsection_id를 키로 하는 캐시
  forceUpdate: number; // 강제 업데이트 트리거
  setEditorContent: (content: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentSection: (section: string | null) => void;
  setSelectedSubsectionId: (id: string | null) => void;
  updateCachedSections: (sections: GeneratedReportSection[]) => void;
  updateCachedSectionsWithMatching: (sections: GeneratedReportSection[], procedureModify: ProcedureModifyData | null) => void;
  getCachedSection: (subsectionId: string) => GeneratedReportSection | undefined;
  triggerForceUpdate: () => void; // 강제 업데이트 함수
  resetEditorState: () => void; // 에디터 상태 초기화 함수
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editorContent: '',
  isLoading: false,
  currentSection: null,
  selectedSubsectionId: null,
  cachedSections: new Map(),
  forceUpdate: 0,
  setEditorContent: (content) => set({ editorContent: content }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setSelectedSubsectionId: (id) => set({ selectedSubsectionId: id }),
  triggerForceUpdate: () => set((state) => ({ forceUpdate: state.forceUpdate + 1 })),
  updateCachedSections: (sections) => {
    const newCache = new Map(get().cachedSections);
    sections.forEach(section => {
      newCache.set(section.subsection_id, section);
    });
    set({ cachedSections: newCache });
  },
  updateCachedSectionsWithMatching: (sections, procedureModify) => {
    const newCache = new Map(get().cachedSections);
    
    // 숫자 부분 제거 함수
    const removeNumbering = (text: string): string => {
      return text.replace(/^\d+(\.\d+)?\s*/, "").trim();
    };

    // procedureModify의 모든 subsection 목록 생성
    const procedureSubsections: Array<{ id: string; name: string }> = [];
    if (procedureModify) {
      procedureModify.sections.forEach(section => {
        if (section.enabled && section.subsections) {
          section.subsections.forEach(sub => {
            if (sub.enabled) {
              procedureSubsections.push({ id: sub.id, name: sub.name });
            }
          });
        }
      });
    }

    sections.forEach(apiSection => {
      // 1차: API의 subsection_id로 직접 매칭
      const directMatch = procedureSubsections.find(
        sub => sub.id === apiSection.subsection_id
      );
      
      if (directMatch) {
        console.log(`[캐시] 직접 매칭 성공: ${apiSection.subsection_name} -> ${directMatch.id}`);
        newCache.set(directMatch.id, apiSection);
      } else {
        // 2차: subsection_name으로 부분 매칭
        const cleanedApiSubsectionName = removeNumbering(apiSection.subsection_name || "");
        const cleanedApiQuery = removeNumbering(apiSection.query || "");
        
        const partialMatch = procedureSubsections.find(sub => {
          const cleanedSubName = removeNumbering(sub.name);
          return (
            cleanedApiSubsectionName.includes(cleanedSubName) ||
            cleanedSubName.includes(cleanedApiSubsectionName) ||
            cleanedApiQuery.includes(cleanedSubName) ||
            cleanedSubName.includes(cleanedApiQuery)
          );
        });
        
        if (partialMatch) {
          console.log(`[캐시] 부분 매칭 성공: "${cleanedApiSubsectionName}" (query: "${cleanedApiQuery}") -> ${partialMatch.id} ("${partialMatch.name}")`);
          newCache.set(partialMatch.id, apiSection);
        } else {
          console.log(`[캐시] 매칭 실패: "${cleanedApiSubsectionName}" (query: "${cleanedApiQuery}") - API subsection_id로 저장: ${apiSection.subsection_id}`);
          // 매칭 실패 시 API의 subsection_id로 저장
          newCache.set(apiSection.subsection_id, apiSection);
        }
      }
    });
    
    set({ cachedSections: newCache });
  },
  getCachedSection: (subsectionId) => {
    return get().cachedSections.get(subsectionId);
  },
  resetEditorState: () => {
    set({
      editorContent: '',
      isLoading: false,
      currentSection: null,
      selectedSubsectionId: null,
      cachedSections: new Map(),
      forceUpdate: 0,
    });
  },
}));
