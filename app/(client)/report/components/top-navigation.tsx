"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useReportStore } from "./store/report-store";
import { ExpertRecommendationModal } from "./expert-recommendation-modal";
import { ExpertStepModal } from "./expert-step-modal";

interface TopNavigationProps {
  onMenuClick: () => void;
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpertStepModalOpen, setIsExpertStepModalOpen] = useState(false);
  const [isExpertRecommendationModalOpen, setIsExpertRecommendationModalOpen] =
    useState(false);
  const { reportType, reportId, generateReportId, setGenerationModalOpen } =
    useReportStore();

  const isInputsOrProcedurePage =
    pathname?.includes("/report/inputs") ||
    pathname?.includes("/report/procedure");

  const isEditorPage = pathname?.includes("/report/editor");

  const handleNextClick = () => {
    if (pathname?.includes("/report/inputs")) {
      // inputs 페이지에서 다음 클릭 시
      const newReportId = reportId || generateReportId();
      router.push(
        `/report/procedure?reportType=${reportType}&reportId=${newReportId}`
      );
    } else if (pathname?.includes("/report/procedure")) {
      // procedure 페이지에서 다음 클릭 시 모달 열기
      setGenerationModalOpen(true);
    }
  };

  const handleTemporarySave = () => {
    // TODO: 임시저장 로직 구현
  };

  const handleExport = () => {
    // TODO: 내보내기 로직 구현
  };

  const handleExpertReview = () => {
    setIsExpertStepModalOpen(true);
  };

  const handleStartExpertRequest = () => {
    setIsExpertStepModalOpen(false);
    setIsExpertRecommendationModalOpen(true);
  };

  const handleComplete = () => {
    // TODO: 완료 로직 구현
  };

  return (
    <>
      <div
        className={`flex w-full max-w-[1200px] mx-auto py-5 items-center ${
          isInputsOrProcedurePage || isEditorPage ? "justify-between" : ""
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
              onClick={handleNextClick}
            >
              다음
            </Button>
          </div>
        )}

        {isEditorPage && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white text-primary h-12 px-6 text-[18px] font-semibold border-primary hover:bg-white/90 hover:text-primary"
              onClick={handleTemporarySave}
            >
              <Image src="/images/save.svg" alt="save" width={15} height={15} />
              임시저장
            </Button>
            <Button
              variant="outline"
              className="bg-white text-primary h-12 px-6 text-[18px] font-semibold border-primary hover:bg-white/90 hover:text-primary"
              onClick={handleExport}
            >
              <Image
                src="/images/upload.png"
                alt="export"
                width={24}
                height={24}
              />
              내보내기
            </Button>
            <Button
              variant="default"
              className="h-12 px-6 text-[18px] font-semibold"
              onClick={handleExpertReview}
            >
              전문가 평가요청
            </Button>
            <Button
              variant="default"
              className="h-12 px-6 text-[18px] font-semibold"
              onClick={handleComplete}
            >
              완료
            </Button>
          </div>
        )}
      </div>

      <ExpertStepModal
        isOpen={isExpertStepModalOpen}
        onClose={() => setIsExpertStepModalOpen(false)}
        onStartRequest={handleStartExpertRequest}
      />
      <ExpertRecommendationModal
        isOpen={isExpertRecommendationModalOpen}
        onClose={() => setIsExpertRecommendationModalOpen(false)}
      />
    </>
  );
}
