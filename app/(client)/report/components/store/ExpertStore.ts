import { create } from "zustand";
import { ExpertMatchResponse, Expert } from "../types";

interface ExpertStore {
  expertMatchData: ExpertMatchResponse | null;
  selectedExpert: Expert | null;
  setExpertMatchData: (data: ExpertMatchResponse) => void;
  setSelectedExpert: (expert: Expert) => void;
  clearExpertMatchData: () => void;
  clearSelectedExpert: () => void;
}

export const useExpertStore = create<ExpertStore>((set) => ({
  expertMatchData: null,
  selectedExpert: null,
  setExpertMatchData: (data) => set({ expertMatchData: data }),
  setSelectedExpert: (expert) => set({ selectedExpert: expert }),
  clearExpertMatchData: () => set({ expertMatchData: null }),
  clearSelectedExpert: () => set({ selectedExpert: null }),
}));
