"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BusinessCategoryModal } from "./components/business-category-modal";
import { useSidebarStore } from "../components/store/sidebar-store";
import { FileText, Plus, Send, Copy, Trash, MoreVertical } from "lucide-react";

interface Report {
  id: string;
  title: string;
  isSelected?: boolean;
}

export default function ReportStartPage() {
  const [reports] = useState<Report[]>([
    { id: "1", title: "AI 헬스케어 사업계획서", isSelected: true },
    { id: "2", title: "핀테크 스타트업 사업계획 및 투자 제안서" },
    { id: "3", title: "블록체인 기술 개발 보고서" },
  ]);

  const [reportTitle, setReportTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSidebarOpen = useSidebarStore(
    (state: { isOpen: boolean }) => state.isOpen
  );

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
    <div className="relative w-full max-w-[1200px] mx-auto">
      {/* Sidebar - Absolute positioned */}
      {isSidebarOpen && (
        <div className="absolute left-0 top-0 z-10 w-[314px] h-[709px] bg-white rounded-xl border border-[#EEF1F7] shadow-[0_0_10px_rgba(60,123,194,0.12)] p-6 transition-all duration-300 ease-in-out">
          <div className="flex flex-col h-full gap-2.5">
            {/* New Report Button */}
            <Button
              className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white font-semibold text-[18px] h-[48px] rounded-lg gap-1.5 justify-start px-6"
              onClick={() => {
                // Create new report logic
              }}
            >
              <Plus className="w-6 h-6" />새 보고서 생성
            </Button>

            {/* Report List Section */}
            <div className="flex flex-col flex-1">
              <div className="px-4 py-2.5">
                <span className="text-[#6B6B6B] text-sm font-medium">
                  보고서 목록
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {reports.map((report) => (
                  <div key={report.id} className="relative">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                        report.isSelected ? "bg-[#E8F3FF]" : "hover:bg-gray-50"
                      }`}
                    >
                      <FileText
                        className={`w-6 h-6 ${
                          report.isSelected
                            ? "text-[#0077FF]"
                            : "text-[#767676]"
                        }`}
                      />
                      <span
                        className={`flex-1 text-base font-semibold truncate ${
                          report.isSelected
                            ? "text-[#0077FF]"
                            : "text-[#767676]"
                        }`}
                        title={report.title}
                      >
                        {report.title}
                      </span>
                      {report.isSelected && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreVertical className="h-4 w-4 text-[#444444]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[84px] rounded-md bg-white shadow-[0_2px_16px_rgba(19,48,74,0.08)] border-0 p-2"
                          >
                            <DropdownMenuItem className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-[#E8F3FF] text-[#0077FF] text-sm">
                              <Copy className="w-[18px] h-[18px]" />
                              복제
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[#767676] text-sm">
                              <Trash className="w-[18px] h-[18px]" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - 항상 전체 너비 유지 */}
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
          <BusinessCategoryModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          >
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
    </div>
  );
}
