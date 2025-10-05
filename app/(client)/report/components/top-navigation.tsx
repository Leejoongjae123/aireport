"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
interface TopNavigationProps {
  onMenuClick: () => void;
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const pathname = usePathname();
  const isInputsOrProcedurePage =
    pathname?.includes("/report/inputs") ||
    pathname?.includes("/report/procedure");

  return (
    <div
      className={`flex w-full max-w-[1200px] mx-auto py-5 items-center ${
        isInputsOrProcedurePage ? "justify-between" : ""
      }`}
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-[#EEF1F7] bg-white shadow-[0_0_10px_rgba(60,123,194,0.12)]"
        onClick={onMenuClick}
      >
        <Menu className="h-8 w-8" />
      </Button>

      {isInputsOrProcedurePage && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white text-primary w-[144px] h-12 text-[18px] font-semibold border-primary hover:bg-white/90 hover:text-primary"
          >
            <Image src="/images/save.svg" alt="save" width={15} height={15} />
            임시 저장
          </Button>
          <Button
            variant="default"
            className="w-[79px] h-12 text-[18px] font-semibold"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
