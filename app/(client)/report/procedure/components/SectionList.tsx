"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { SectionItem } from "../types";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Toggle = ({ checked, onCheckedChange, className }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-[18px] w-8 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        checked ? "bg-[#07F]" : "bg-neutral-400",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
};

interface SectionListProps {
  sections: SectionItem[];
  selectedSectionId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  businessFieldName: string;
  onChangeCategory: () => void;
}

export function SectionList({
  sections,
  selectedSectionId,
  onToggle,
  onSelect,
  businessFieldName,
  onChangeCategory,
}: SectionListProps) {
  return (
    <div className="flex h-[709px] flex-1 flex-col justify-between rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
            {businessFieldName}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                "flex items-center justify-between py-1 px-3 rounded-md cursor-pointer hover:bg-gray-50",
                selectedSectionId === section.id && "bg-[#E8F3FF]"
              )}
              onClick={() => onSelect(section.id)}
            >
              <span
                className={cn(
                  "flex-1 text-base font-semibold leading-[29px]",
                  section.enabled ? "text-[#303030]" : "text-[#B3B3B3]"
                )}
              >
                {section.name}
              </span>
              <Toggle
                checked={section.enabled}
                onCheckedChange={() => onToggle(section.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onChangeCategory}
        className="flex items-center justify-center gap-1.5 self-stretch rounded-lg border border-[#B2B2B2] bg-white px-6 py-3 text-lg font-semibold tracking-[-0.36px] text-[#757575] hover:bg-gray-50"
      >
        <RotateCcw className="h-6 w-6" />
        다른분야 선택
      </Button>
    </div>
  );
}
