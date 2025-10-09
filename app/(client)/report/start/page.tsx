"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCategoryModal } from "./components/business-category-modal";
import { Send } from "lucide-react";

export default function ReportStartPage() {
  const [reportTitle, setReportTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateReport = () => {
    if (reportTitle.trim()) {
      setIsModalOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateReport();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[709px]">
      {/* Logo */}
      <div className="flex items-center gap-[15px] mb-[70px]">
        <div className="w-[38px] h-[38px] bg-[#B2B2B2] rounded-full" />
        <span className="text-[#B3B3B3] font-bold text-[32px] font-['Pretendard']">
          LOGO
        </span>
      </div>

      {/* Search Input */}
      <div className="relative w-[563px]">
        <Input
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="생성하려는 보고서 제목을 입력해주세요."
          className="w-full h-[62px] rounded-[100px] border border-[#E3E5E5] bg-white px-6 text-base placeholder:text-[#A6A6A6] pr-[60px] focus-visible:ring-1 focus-visible:ring-[#0077FF]"
        />
        <BusinessCategoryModal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={handleCreateReport}
            size="icon"
            className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[42px] h-[42px] bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-full btn-send"
            disabled={!reportTitle.trim()}
          >
            <Send className="w-[18px] h-[18px] text-white" />
          </Button>
        </BusinessCategoryModal>
      </div>
    </div>
  );
}
