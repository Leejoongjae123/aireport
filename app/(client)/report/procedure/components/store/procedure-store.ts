import { create } from "zustand";
import {
  ProcedureModifyData,
  ProcedureModifySection,
  ProcedureModifySubsection,
} from "../../types";

interface ProcedureState {
  procedureData: ProcedureModifyData | null;
  setProcedureData: (data: ProcedureModifyData) => void;
  updateSection: (sectionId: string, enabled: boolean) => void;
  updateSubsection: (
    sectionId: string,
    subsectionId: string,
    updates: Partial<ProcedureModifySubsection>
  ) => void;
  reorderSubsections: (
    sectionId: string,
    subsections: ProcedureModifySubsection[]
  ) => void;
  reset: () => void;
}

export const useProcedureStore = create<ProcedureState>((set) => ({
  procedureData: null,

  setProcedureData: (data) => set({ procedureData: data }),

  updateSection: (sectionId, enabled) =>
    set((state) => {
      if (!state.procedureData) {
        return state;
      }
      return {
        procedureData: {
          ...state.procedureData,
          sections: state.procedureData.sections.map((section) =>
            section.id === sectionId ? { ...section, enabled } : section
          ),
        },
      };
    }),

  updateSubsection: (sectionId, subsectionId, updates) =>
    set((state) => {
      if (!state.procedureData) {
        return state;
      }
      return {
        procedureData: {
          ...state.procedureData,
          sections: state.procedureData.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  subsections: section.subsections.map((subsection) =>
                    subsection.id === subsectionId
                      ? { ...subsection, ...updates }
                      : subsection
                  ),
                }
              : section
          ),
        },
      };
    }),

  reorderSubsections: (sectionId, subsections) =>
    set((state) => {
      if (!state.procedureData) {
        return state;
      }
      return {
        procedureData: {
          ...state.procedureData,
          sections: state.procedureData.sections.map((section) =>
            section.id === sectionId ? { ...section, subsections } : section
          ),
        },
      };
    }),

  reset: () => set({ procedureData: null }),
}));
