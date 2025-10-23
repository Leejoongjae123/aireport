"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface ItemSettingsProps {
  itemName: string;
  minCharCount: string;
  maxCharCount: string;
  onMinCharCountChange: (value: string) => void;
  onMaxCharCountChange: (value: string) => void;
}

export function ItemSettings({
  itemName,
  minCharCount,
  maxCharCount,
  onMinCharCountChange,
  onMaxCharCountChange,
}: ItemSettingsProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
          항목 설정
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <Label
          htmlFor="item-name"
          className="text-sm font-semibold tracking-[-0.064px] text-[#202224] opacity-80"
        >
          항목명
        </Label>
        <div className="flex items-center rounded-lg bg-[#FAFAFD] px-4 py-2.5">
          <span className="text-sm font-medium leading-6 tracking-[-0.064px] text-[#303030]">
            {itemName}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="min-char-count"
            className="text-sm font-semibold tracking-[-0.064px] text-[#202224] opacity-80"
          >
            최소 글자수
          </Label>
          <div className="flex items-center rounded-lg bg-[#FAFAFD] px-4 py-2.5">
            <Input
              id="min-char-count"
              value={minCharCount}
              onChange={(e) => onMinCharCountChange(e.target.value)}
              className="border-0 bg-transparent p-0 text-sm font-medium leading-6 tracking-[-0.064px] text-[#303030] focus-visible:ring-0"
            />
          </div>
        </div>
        <p className="text-xs font-medium leading-[29px] text-[#767676]">
          최소권장 글자수를 입력하세요.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="max-char-count"
            className="text-sm font-semibold tracking-[-0.064px] text-[#202224] opacity-80"
          >
            최대 글자수
          </Label>
          <div className="flex items-center rounded-lg bg-[#FAFAFD] px-4 py-2.5">
            <Input
              id="max-char-count"
              value={maxCharCount}
              onChange={(e) => onMaxCharCountChange(e.target.value)}
              className="border-0 bg-transparent p-0 text-sm font-medium leading-6 tracking-[-0.064px] text-[#303030] focus-visible:ring-0"
            />
          </div>
        </div>
        <p className="text-xs font-medium leading-[29px] text-[#767676]">
          최대권장 글자수를 입력하세요.
        </p>
      </div>
    </div>
  );
}
