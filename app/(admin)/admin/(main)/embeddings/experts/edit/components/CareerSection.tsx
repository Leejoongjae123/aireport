"use client";

import { Input } from "@/components/ui/Input";
import { Plus, Minus } from "lucide-react";
import { CareerEntry } from "../types";

interface CareerSectionProps {
  careerEntries: CareerEntry[];
  onCareerEntriesChange: (entries: CareerEntry[]) => void;
}

export default function CareerSection({
  careerEntries,
  onCareerEntriesChange,
}: CareerSectionProps) {
  const addCareerEntry = () => {
    const newId = Date.now().toString();
    onCareerEntriesChange([
      ...careerEntries,
      { id: newId, description: "" },
    ]);
  };

  const removeCareerEntry = (id: string) => {
    if (careerEntries.length > 1) {
      onCareerEntriesChange(careerEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateCareerEntry = (id: string, description: string) => {
    onCareerEntriesChange(
      careerEntries.map((entry) =>
        entry.id === id ? { ...entry, description } : entry
      )
    );
  };

  return (
    <div className="flex flex-col items-end gap-4 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
          경력<span className="text-[#2A2A2A] font-pretendard text-lg text-red-500 font-bold leading-6">(*분석에 사용되므로 유의)</span>
        </h2>
        <button
          onClick={addCareerEntry}
          className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
        >
          <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
        </button>
      </div>

      <div className="flex flex-col items-start gap-4 self-stretch">
        {careerEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-4 self-stretch">
            <Input
              placeholder="예: 사단법인 한국창업융합컨설팅학회 상임이사"
              value={entry.description}
              onChange={(e) => updateCareerEntry(entry.id, e.target.value)}
              className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
            />

            <button
              onClick={() => removeCareerEntry(entry.id)}
              className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
            >
              <Minus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
