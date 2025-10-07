import { create } from "zustand";

interface ReportState {
  reportId: string | null;
  reportType: string | null;
  isGenerationModalOpen: boolean;
  setReportId: (id: string) => void;
  setReportType: (type: string) => void;
  generateReportId: () => string;
  setGenerationModalOpen: (isOpen: boolean) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reportId: null,
  reportType: null,
  isGenerationModalOpen: false,
  setReportId: (id) => set({ reportId: id }),
  setReportType: (type) => set({ reportType: type }),
  generateReportId: () => {
    // UUID v4 생성 후 하이픈 제거하여 24자리만 사용
    const uuid = crypto.randomUUID().replace(/-/g, "");
    const shortId = uuid.substring(0, 24);
    set({ reportId: shortId });
    return shortId;
  },
  setGenerationModalOpen: (isOpen) => set({ isGenerationModalOpen: isOpen }),
}));
