"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useReportStore } from "./store/report-store";
import { useProcedureStore } from "../procedure/components/store/procedure-store";
import { ExpertRecommendationModal } from "./expert-evaluation-processing-modal";
import { ExpertStepModal } from "./expert-step-modal";
import { CustomModal } from "@/components/ui/custom-modal";
import { toast } from "sonner";

interface TopNavigationProps {
  onMenuClick: () => void;
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpertStepModalOpen, setIsExpertStepModalOpen] = useState(false);
  const [isExpertRecommendationModalOpen, setIsExpertRecommendationModalOpen] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] =
    useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [isAlreadyRequestedModalOpen, setIsAlreadyRequestedModalOpen] =
    useState(false);
  const {
    reportType,
    reportId,
    generateReportId,
    setGenerationModalOpen,
    inputData,
  } = useReportStore();

  const { procedureData } = useProcedureStore();

  const isInputsOrProcedurePage =
    pathname?.includes("/report/inputs") ||
    pathname?.includes("/report/procedure");

  const isEditorPage = pathname?.includes("/report/editor");

  const validateInputs = () => {
    if (inputData.businessIdea.length < 100) {
      setValidationErrorMessage(
        "사업 아이디어는 최소 100자 이상 작성해야 합니다."
      );
      setIsValidationErrorModalOpen(true);
      return false;
    }
    if (inputData.coreValue.length < 100) {
      setValidationErrorMessage(
        "핵심가치 제안은 최소 100자 이상 작성해야 합니다."
      );
      setIsValidationErrorModalOpen(true);
      return false;
    }
    return true;
  };

  const saveInputs = async (currentReportId: string) => {
    setIsSaving(true);
    const response = await fetch("/api/reports/save-inputs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId: currentReportId,
        investmentAmount: inputData.investmentAmount,
        businessIdea: inputData.businessIdea,
        coreValue: inputData.coreValue,
      }),
    });

    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      toast.error(result.error || "저장에 실패했습니다.");
      return false;
    }

    toast.success(result.message || "저장되었습니다.");
    return true;
  };

  const saveProcedure = async (currentReportId: string) => {
    if (!procedureData) {
      toast.error("저장할 데이터가 없습니다.");
      return false;
    }

    setIsSaving(true);
    const response = await fetch(
      `/api/reports/${currentReportId}/procedure-modify`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procedureModify: procedureData,
        }),
      }
    );

    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      toast.error(result.error || "저장에 실패했습니다.");
      return false;
    }

    toast.success("저장되었습니다.");
    return true;
  };

  const handleNextClick = async () => {
    if (pathname?.includes("/report/inputs")) {
      // 입력값 검증
      if (!validateInputs()) {
        return;
      }

      // inputs 페이지에서 다음 클릭 시 저장
      const newReportId = reportId || generateReportId();
      const saved = await saveInputs(newReportId);

      if (saved) {
        router.push(
          `/report/procedure?reportType=${reportType}&reportId=${newReportId}`
        );
      }
    } else if (pathname?.includes("/report/procedure")) {
      // procedure 페이지에서 다음 클릭 시 저장 후 모달 열기
      if (!reportId) {
        toast.error("리포트 ID가 없습니다.");
        return;
      }

      const saved = await saveProcedure(reportId);
      if (saved) {
        setGenerationModalOpen(true);
      }
    }
  };

  const handleTemporarySave = async () => {
    if (pathname?.includes("/report/inputs")) {
      // 입력값 검증
      if (!validateInputs()) {
        return;
      }

      const currentReportId = reportId || generateReportId();
      await saveInputs(currentReportId);
    } else if (pathname?.includes("/report/procedure")) {
      if (!reportId) {
        toast.error("리포트 ID가 없습니다.");
        return;
      }

      await saveProcedure(reportId);
    }
  };

  const handleExport = async () => {
    if (!reportId) {
      toast.error("리포트 ID가 없습니다.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/reports/${reportId}/export`);

      if (!response.ok) {
        toast.error("Word 파일 생성에 실패했습니다.");
        return;
      }
      

      // Blob으로 변환
      const blob = await response.blob();

      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Word 파일이 다운로드되었습니다.");
    } catch {
      toast.error("내보내기 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExpertReview = async () => {
    if (!reportId) {
      toast.error("리포트 ID가 없습니다.");
      return;
    }

    try {
      const response = await fetch("/api/expert/check-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_uuid: reportId,
        }),
      });

      const data = await response.json();

      if (data.alreadyRequested) {
        setIsAlreadyRequestedModalOpen(true);
        return;
      }

      setIsExpertStepModalOpen(true);
    } catch {
      toast.error("요청 이력 확인 중 오류가 발생했습니다.");
    }
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
              onClick={handleTemporarySave}
              disabled={isSaving}
            >
              <Image src="/images/save.svg" alt="save" width={15} height={15} />
              {isSaving ? "저장 중..." : "임시 저장"}
            </Button>
            <Button
              variant="default"
              className="w-[79px] h-12 text-[18px] font-semibold bg-primary text-white hover:bg-primary/90"
              onClick={handleNextClick}
              disabled={isSaving}
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
        reportId={reportId || ""}
      />
      <ExpertRecommendationModal
        isOpen={isExpertRecommendationModalOpen}
        onClose={() => setIsExpertRecommendationModalOpen(false)}
      />
      <CustomModal
        isOpen={isValidationErrorModalOpen}
        onClose={() => setIsValidationErrorModalOpen(false)}
        title="입력 오류"
        width="400px"
        footer={
          <div className="flex justify-center w-full">
            <Button
              onClick={() => setIsValidationErrorModalOpen(false)}
              className="w-full h-12 text-[16px] font-semibold"
            >
              확인
            </Button>
          </div>
        }
      >
        <p className="text-center text-[16px] text-[#303030] leading-6">
          {validationErrorMessage}
        </p>
      </CustomModal>
      <CustomModal
        isOpen={isAlreadyRequestedModalOpen}
        onClose={() => setIsAlreadyRequestedModalOpen(false)}
        className="border-none"
        width="400px"
        padding="40px"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="text-black font-pretendard text-[20px] font-bold leading-normal">
              이미 평가요청을 하였습니다.
            </div>
          </div>
          <button
            onClick={() => setIsAlreadyRequestedModalOpen(false)}
            className="flex py-3 px-8 justify-center items-center gap-2 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC]"
          >
            <div className="font-pretendard text-[16px] font-bold leading-normal">
              확인
            </div>
          </button>
        </div>
      </CustomModal>
    </>
  );
}
