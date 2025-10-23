"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpArrow from "@/components/icons/UpArrow";

interface FilterDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
}

export default function FilterDropdown({
  value,
  options,
  onChange,
  width = "flex-1",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex ${width} items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 transition-colors hover:!border-[#EBEBEB] hover:bg-[#E8F3FF] focus:!border-[#EBEBEB] focus:outline-none`}
        >
          <span className="font-pretendard text-xs font-bold text-[#0077FF]">
            {value}
          </span>
          <UpArrow
            size={10}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-auto min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-md border border-[#EBEBEB] bg-white shadow-lg"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={`cursor-pointer px-4 py-2 hover:bg-[#E8F3FF] focus:bg-[#E8F3FF] ${
              value === option
                ? "bg-[#E8F3FF] font-bold text-[#0077FF]"
                : "text-[#686868]"
            }`}
          >
            <span className="font-pretendard text-xs">{option}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
