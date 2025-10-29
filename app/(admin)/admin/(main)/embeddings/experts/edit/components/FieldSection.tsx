"use client";

import { Input } from "@/components/ui/Input";
import { Plus, Minus } from "lucide-react";
import { FieldEntry } from "../types";

interface FieldSectionProps {
  fieldEntries: FieldEntry[];
  onFieldEntriesChange: (entries: FieldEntry[]) => void;
}

export default function FieldSection({
  fieldEntries,
  onFieldEntriesChange,
}: FieldSectionProps) {
  const addFieldEntry = () => {
    const newId = Date.now().toString();
    onFieldEntriesChange([
      ...fieldEntries,
      { id: newId, year: "", field: "", description: "" },
    ]);
  };

  const removeFieldEntry = (id: string) => {
    if (fieldEntries.length > 1) {
      onFieldEntriesChange(fieldEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateFieldEntry = (id: string, description: string) => {
    onFieldEntriesChange(
      fieldEntries.map((entry) =>
        entry.id === id ? { ...entry, description } : entry
      )
    );
  };

  return (
    <div className="flex flex-col items-end gap-4 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
          분야<span className="text-[#2A2A2A] font-pretendard text-lg text-red-500 font-bold leading-6">(*분석에 사용되므로 유의)</span>
        </h2>
        <button
          onClick={addFieldEntry}
          className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
        >
          <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
        </button>
      </div>

      <div className="flex flex-col items-start gap-4 self-stretch">
        {fieldEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-4 self-stretch">
            <Input
              placeholder="예: AI 의료기기 개발, 디지털 헬스케어"
              value={entry.description}
              onChange={(e) => updateFieldEntry(entry.id, e.target.value)}
              className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
            />

            <button
              onClick={() => removeFieldEntry(entry.id)}
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
