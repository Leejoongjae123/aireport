"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
import UpArrow from "@/components/icons/UpArrow";

interface SearchInputWithFilterProps {
  searchType?: string;
  searchTypeOptions?: Array<{ value: string; label: string }>;
  onSearchTypeChange?: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  placeholder?: string;
  // 하위 호환성을 위한 기존 props
  filterValue?: string;
  filterOptions?: string[];
  onFilterChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

export default function SearchInputWithFilter({
  searchType,
  searchTypeOptions,
  onSearchTypeChange,
  searchValue,
  onSearchValueChange,
  placeholder = "검색조건을 입력해주세요",
  // 하위 호환성을 위한 기존 props
  filterValue,
  filterOptions,
  onFilterChange,
  onSearchChange,
}: SearchInputWithFilterProps) {
  // 새로운 props 우선, 없으면 기존 props 사용
  const currentFilterValue = searchType || filterValue || "";
  const currentFilterOptions = searchTypeOptions || (filterOptions || []).map(opt => ({ value: opt, label: opt }));
  const handleFilterChange = onSearchTypeChange || onFilterChange || (() => {});
  const handleSearchChange = onSearchValueChange || onSearchChange || (() => {});
  const [open, setOpen] = useState(false);

  // 현재 선택된 옵션의 라벨 찾기
  const currentLabel = currentFilterOptions.find(opt => opt.value === currentFilterValue)?.label || currentFilterValue;

  return (
    <div className="relative flex h-[43px] flex-1 items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-1 transition-colors hover:bg-transparent focus:outline-none">
            <span className="whitespace-nowrap font-pretendard text-xs font-bold text-[#0077FF]">
              {currentLabel}
            </span>
            <UpArrow
              size={8}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={-12}
          sideOffset={16}
          className="w-[120px] rounded-md border border-[#EBEBEB] bg-white shadow-lg"
        >
          {currentFilterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`cursor-pointer px-4 py-2 hover:bg-[#E8F3FF] focus:bg-[#E8F3FF] ${
                currentFilterValue === option.value
                  ? "bg-[#E8F3FF] font-bold text-[#0077FF]"
                  : "text-[#686868]"
              }`}
            >
              <span className="font-pretendard text-xs">{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent p-0 font-pretendard text-xs font-medium text-[#2A2A2A] placeholder:text-[#727272] focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
