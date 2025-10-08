"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";

interface ReportViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle?: string;
}

export const ReportViewingModal: React.FC<ReportViewingModalProps> = ({
  isOpen,
  onClose,
  reportTitle = "AI 기반 리테일 수요예측 사업계획서",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <DialogContent
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 inline-flex p-10 flex-col items-start rounded-[12px] border border-[#07F] bg-white shadow-[0_0_10px_0_rgba(0,119,255,0.20)] w-[691px] border-none"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>보고서</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col items-center relative w-full h-full">
            <div className="flex flex-col items-start relative w-full">
              {/* Header */}
              <div className="flex justify-between items-start self-stretch relative w-full">
                <h1 className="text-black font-pretendard text-[24px] font-bold leading-normal">
                  보고서
                </h1>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
                </button>
              </div>

              {/* Report Info Section */}
              <div className="flex pt-6 pb-6 justify-between items-start self-stretch relative w-full">
                <h2 className="text-[#2A2A2A] font-pretendard text-[20px] font-semibold leading-[150%] tracking-[-0.4px] flex-1">
                  {reportTitle}
                </h2>
                <div className="flex items-center gap-3">
                  {/* Download Button */}
                  <div className="flex p-2 justify-center items-center gap-2 rounded border border-[#D9D9D9] bg-white">
                    <div className="w-6 h-6 relative">
                      <div className="w-[9px] h-2 flex-shrink-0 rounded-[0.6px] border border-[#134CB0] bg-[#134CB0] absolute left-1 top-2"></div>
                      <div className="w-[14px] h-[17px] flex-shrink-0 rounded-[0.6px] border-[1.6px] border-[#134CB0] absolute left-[6px] top-[3px]"></div>
                      <svg
                        className="w-[5px] h-1 flex-shrink-0 stroke-white absolute left-[6px] top-[10px]"
                        width="7"
                        height="6"
                        viewBox="0 0 7 6"
                        fill="none"
                      >
                        <path
                          d="M1 1L2 5L3.5 1.75L5 5L6 1"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[#5A5A5A] font-pretendard text-xs font-bold leading-4">
                      보고서 다운로드
                    </span>
                  </div>

                  {/* Version Badge */}
                </div>
              </div>

              {/* Report Preview Section */}
              <div className="flex w-[611px] h-[555px] p-6 flex-col items-center gap-[10px] rounded-[12px] border border-[#EEEEEF] bg-white relative">
                {/* Custom Scrollbar */}
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center items-center gap-3 self-stretch relative mt-6">
              <Button
                onClick={onClose}
                className="flex w-[271px] h-[62px] justify-center items-center gap-2 rounded-[10px] bg-[#07F] text-white font-pretendard text-lg font-bold leading-normal tracking-[-0.36px] hover:bg-[#0066CC]"
              >
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
