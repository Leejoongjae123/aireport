"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Expert } from "./types";
import { useExpertStore } from "./store/ExpertStore";
import { useReportStore } from "./store/ReportStore";

interface ExpertEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationRequest?: () => void;
  experts?: Expert[];
}

export function ExpertEvaluationRequestModal({
  isOpen,
  onClose,
  onEvaluationRequest,
  experts: initialExperts = [],
}: ExpertEvaluationModalProps) {
  const [experts, setExperts] = useState<Expert[]>(initialExperts);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlreadyRequestedModal, setShowAlreadyRequestedModal] = useState(false);
  const { setSelectedExpert } = useExpertStore();
  const { reportId } = useReportStore();

  // props로 받은 experts가 변경되면 상태 업데이트
  useEffect(() => {
    if (initialExperts.length > 0) {
      setExperts(initialExperts);
    }
  }, [initialExperts]);

  const toggleExpertSelection = (expertId: string) => {
    setExperts((prev) =>
      prev.map((expert) =>
        expert.id === expertId
          ? { ...expert, selected: true }
          : { ...expert, selected: false }
      )
    );
  };

  const handleEvaluationRequest = async () => {
    const selectedExpert = experts.find((expert) => expert.selected);
    if (!selectedExpert || !reportId) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/expert/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_uuid: reportId,
          all_candidates: experts,
          selected_expert: selectedExpert,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyRequested) {
          setShowAlreadyRequestedModal(true);
          return;
        }
        return;
      }

      setSelectedExpert(selectedExpert);
      onEvaluationRequest?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomModal
        isOpen={showAlreadyRequestedModal}
        onClose={() => setShowAlreadyRequestedModal(false)}
        className="border-none"
        width="400px"
        padding="40px"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="text-black font-pretendard text-[20px] font-bold leading-normal">
              평가요청을 이미 요청하였습니다.
            </div>
          </div>
          <button
            onClick={() => setShowAlreadyRequestedModal(false)}
            className="flex py-3 px-8 justify-center items-center gap-2 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC]"
          >
            <div className="font-pretendard text-[16px] font-bold leading-normal">
              확인
            </div>
          </button>
        </div>
      </CustomModal>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        className="border-none"
        width="500px"
        padding="40px"
        showCloseButton={false}
      >
      <div className="flex w-[420px] flex-col items-center gap-8 relative">
        <div className="flex flex-col items-start gap-5 self-stretch relative">
          {/* Header */}
          <div className="flex justify-between items-start self-stretch relative">
            <div className="flex flex-col justify-center items-start gap-2 flex-1 relative">
              <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                전문가 평가요청
              </div>
              <div className="self-stretch text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-normal leading-[20px]">
                해당 보고서에 적합한 전문가들을 찾았어요!
                <br />
                필요한 전문가를 선택해 평가를 요청하세요.
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center"
            >
              <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
            </button>
          </div>

          {/* Expert Cards */}
          <div className="flex flex-col items-start gap-3 self-stretch relative">
            {experts.slice(0, 3).map((expert) => (
              <div
                key={expert.id}
                className="flex p-6 flex-col items-start gap-4 self-stretch rounded-[10px] border border-[#EEEEEF] bg-white relative"
              >
                <div className="flex flex-col items-start gap-2 self-stretch relative">
                  <div className="flex w-full flex-col items-start relative">
                    <div className="self-stretch text-[#2B2B2B] font-pretendard text-[16px] font-bold leading-[29px]">
                      {expert.name}
                    </div>
                    <div className="w-full text-[#6B6B6B] font-pretendard text-[14px] font-normal leading-normal tracking-[-0.064px] opacity-80 line-clamp-2">
                      {expert.specialty}
                    </div>
                  </div>
                  <div className="self-stretch text-[#2B2B2B] font-pretendard text-[14px] font-normal leading-[18px] tracking-[-0.064px] opacity-80">
                    {expert.description}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpertSelection(expert.id)}
                  className={`flex py-3 px-6 justify-center items-center gap-[6px] rounded-lg ${
                    expert.selected
                      ? "bg-[#07F] text-white"
                      : "border border-[#07F] bg-white text-[#07F]"
                  } transition-colors`}
                >
                  <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
                    선택
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-start gap-3 self-stretch relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex py-5 px-[52px] justify-center items-center gap-2 flex-1 rounded-[10px] border border-[#07F] bg-white text-[#07F] transition-colors hover:bg-[#07F]/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              취소
            </div>
          </button>
          <button
            onClick={handleEvaluationRequest}
            disabled={isLoading}
            className="flex py-5 px-[52px] justify-center items-center gap-2 flex-1 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              {isLoading ? "요청 중..." : "평가 요청"}
            </div>
          </button>
        </div>
      </div>
      </CustomModal>
    </>
  );
}
