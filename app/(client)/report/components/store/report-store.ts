import { create } from "zustand";

interface ReportInputData {
  investmentAmount: string;
  businessIdea: string;
  coreValue: string;
}

interface ReportState {
  reportId: string | null;
  reportType: string | null;
  businessField: string | null;
  isGenerationModalOpen: boolean;
  inputData: ReportInputData;
  setReportId: (id: string) => void;
  setReportType: (type: string) => void;
  setBusinessField: (field: string) => void;
  generateReportId: () => string;
  setGenerationModalOpen: (isOpen: boolean) => void;
  setInputData: (data: Partial<ReportInputData>) => void;
  resetInputData: () => void;
}

const initialInputData: ReportInputData = {
  investmentAmount: "",
  businessIdea: "",
  coreValue: "",
};

export const useReportStore = create<ReportState>((set) => ({
  reportId: null,
  reportType: null,
  businessField: null,
  isGenerationModalOpen: false,
  inputData: initialInputData,
  setReportId: (id) => set({ reportId: id }),
  setReportType: (type) => set({ reportType: type }),
  setBusinessField: (field) => set({ businessField: field }),
  generateReportId: () => {
    // 표준 UUID v4 생성 (하이픈 포함)
    const uuid = crypto.randomUUID();
    set({ reportId: uuid });
    return uuid;
  },
  setGenerationModalOpen: (isOpen) => set({ isGenerationModalOpen: isOpen }),
  setInputData: (data) =>
    set((state) => ({
      inputData: { ...state.inputData, ...data },
    })),
  resetInputData: () => set({ inputData: initialInputData }),
}));
