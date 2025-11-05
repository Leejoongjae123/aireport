"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CustomModal } from "@/components/ui/CustomModal";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import Image from "next/image";
import { useLoadingOverlay } from "@/components/hooks/UseLoadingOverlay";
import { useWordDownload } from "@/components/hooks/UseWordDownload";

interface ReportPreviewModalProps {
  children: React.ReactNode;
  reportUuid: string;
  reportTitle: string;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  children,
  reportUuid,
  reportTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportContent, setReportContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const loadingOverlay = useLoadingOverlay({
    isLoading,
    currentSection: "",
  });

  const { downloadWord } = useWordDownload();

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const fetchReportSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportUuid}/sections`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // 모든 섹션의 content를 순서대로 합치기
          const combinedContent = result.data
            .map((section: { content: string }) => section.content || "")
            .join("");
          setReportContent(combinedContent);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportUuid]);

  useEffect(() => {
    if (isOpen && reportUuid) {
      fetchReportSections();
    }
  }, [isOpen, reportUuid, fetchReportSections]);

  const handleDownloadWord = async () => {
    await downloadWord(reportUuid);
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpenModal}>{children}</div>

      {/* Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="border-none"
        width="691px"
        padding="40px"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center relative w-full h-full">
          <div className="flex flex-col items-start relative w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-start self-stretch relative">
              <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                보고서
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center"
              >
                <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
              </button>
            </div>

            {/* Title and Download Button */}
            <div className="flex justify-between items-start self-stretch relative py-6">
              <div className="text-[#2A2A2A] font-pretendard text-[20px] font-semibold leading-[150%] tracking-[-0.4px]">
                {reportTitle}
              </div>
              <button
                onClick={handleDownloadWord}
                className="w-[139px] h-[40px] flex items-center justify-center gap-2 border border-[#D9D9D9] bg-white rounded"
              >
                {/* Word Icon */}
                <Image
                  src="/images/word.svg"
                  alt="Word"
                  width={24}
                  height={24}
                />
                <span className="text-[#5A5A5A] font-pretendard text-[12px] font-bold leading-[150%] tracking-[-0.32px]">
                  Word 다운로드
                </span>
              </button>
            </div>

            {/* Document Preview */}
            <div className="flex w-[611px] h-[555px] p-5 px-6 flex-col items-start gap-[10px] border border-[#EEEEEF] bg-white rounded-xl relative overflow-y-auto">
              {loadingOverlay}
              <div
                className="prose prose-sm max-w-none w-full 
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 
                  [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-4"
                dangerouslySetInnerHTML={{ __html: reportContent }}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-center items-center gap-3 self-stretch relative mt-6">
            <Button
              onClick={handleCloseModal}
              className="flex w-[271px] h-[62px] justify-center items-center gap-2 rounded-[10px] bg-[#0077FF] text-white font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px] hover:bg-[#0077FF]/90"
            >
              확인
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
