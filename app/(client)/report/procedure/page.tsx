"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GripVertical, RotateCcw } from "lucide-react";

// Custom Toggle Component
interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, className }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onCheckedChange(!checked)}
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
  }
);
Toggle.displayName = "Toggle";

interface SectionItem {
  id: string;
  name: string;
  enabled: boolean;
}

interface TableOfContentItem {
  id: string;
  name: string;
  enabled: boolean;
  highlighted?: boolean;
}

export default function ReportProcedurePage() {
  const [sections, setSections] = useState<SectionItem[]>([
    { id: "1", name: "사업 개요", enabled: true },
    { id: "2", name: "연구개발 목표 및 전략", enabled: true },
    { id: "3", name: "기술 및 서비스 개요", enabled: true },
    { id: "4", name: "추진체계 및 수행역량", enabled: false },
    { id: "5", name: "사업 추진계획", enabled: true },
    { id: "6", name: "자원 및 예산 계획", enabled: true },
    { id: "7", name: "안전 및 보안 관리", enabled: false },
    { id: "8", name: "성과 및 기대효과", enabled: true },
  ]);

  const [tableOfContents, setTableOfContents] = useState<TableOfContentItem[]>([
    { id: "1", name: "추진 배경 및 필요성", enabled: true, highlighted: true },
    { id: "2", name: "사업 목적 및 비전", enabled: false },
    { id: "3", name: "목표 시장 및 수요 분석", enabled: false },
  ]);

  const [itemName, setItemName] = useState("추천 배경 및 필요성");
  const [minCharCount, setMinCharCount] = useState("300");
  const [maxCharCount, setMaxCharCount] = useState("300");

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const toggleTableItem = (id: string) => {
    setTableOfContents(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="flex w-full items-start gap-6 max-w-[1200px] mx-auto">
      {/* Left Panel - Digital ICT AI Industry */}
      <div className="flex h-[709px] flex-1 flex-col justify-between rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
              디지털·ICT·AI 산업
            </h2>
          </div>
          
          <div className="flex flex-col gap-2.5">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between py-1">
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
                  onCheckedChange={() => toggleSection(section.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-1.5 self-stretch rounded-lg border border-[#B2B2B2] bg-white px-6 py-3 text-lg font-semibold tracking-[-0.36px] text-[#757575] hover:bg-gray-50"
        >
          <RotateCcw className="h-6 w-6" />
          다른분야 선택
        </Button>
      </div>

      {/* Middle Panel - Current Table of Contents */}
      <div className="flex h-[709px] flex-1 flex-col gap-2.5 rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
              현재 목차 구성
            </h2>
          </div>
          
          <div className="flex flex-col gap-2.5">
            {tableOfContents.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-md p-3",
                  item.highlighted
                    ? "bg-[#E8F3FF]"
                    : "border border-[#D9D9D9] bg-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-6 w-6 text-[#303030]" />
                  <span
                    className={cn(
                      "text-base font-medium leading-[29px]",
                      item.enabled ? "text-[#303030]" : "text-[#5A5A5A]"
                    )}
                  >
                    {item.name}
                  </span>
                </div>
                <Toggle
                  checked={item.enabled}
                  onCheckedChange={() => toggleTableItem(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div className="flex flex-1 flex-col gap-6 self-stretch rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
            "추진배경 및 필요성" 설정
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
              글자수 가이드
            </Label>
            <div className="flex items-center rounded-lg bg-[#FAFAFD] px-4 py-2.5">
              <Input
                id="min-char-count"
                value={minCharCount}
                onChange={(e) => setMinCharCount(e.target.value)}
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
              글자수 가이드
            </Label>
            <div className="flex items-center rounded-lg bg-[#FAFAFD] px-4 py-2.5">
              <Input
                id="max-char-count"
                value={maxCharCount}
                onChange={(e) => setMaxCharCount(e.target.value)}
                className="border-0 bg-transparent p-0 text-sm font-medium leading-6 tracking-[-0.064px] text-[#303030] focus-visible:ring-0"
              />
            </div>
          </div>
          <p className="text-xs font-medium leading-[29px] text-[#767676]">
            최소권장 글자수를 입력하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
