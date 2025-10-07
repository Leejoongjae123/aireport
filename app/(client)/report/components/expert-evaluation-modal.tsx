"use client";

import { CustomModal } from "@/components/ui/custom-modal";
import { X } from "lucide-react";
import { useState } from "react";

interface ExpertEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationRequest?: () => void;
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  description: string;
  selected: boolean;
}

export function ExpertEvaluationModal({
  isOpen,
  onClose,
  onEvaluationRequest,
}: ExpertEvaluationModalProps) {
  const [experts, setExperts] = useState<Expert[]>([
    {
      id: "1",
      name: "김○○ 박사",
      specialty: "헬스케어 IT전문가",
      experience: "15년 경력",
      description:
        "삼성의료원 디지털헬스 케어팀 출신, AI 의료기기 개발 다수 경험",
      selected: true,
    },
    {
      id: "2",
      name: "김○○ 박사",
      specialty: "헬스케어 IT전문가",
      experience: "15년 경력",
      description:
        "삼성의료원 디지털헬스 케어팀 출신, AI 의료기기 개발 다수 경험",
      selected: false,
    },
    {
      id: "3",
      name: "김○○ 박사",
      specialty: "헬스케어 IT전문가",
      experience: "15년 경력",
      description:
        "삼성의료원 디지털헬스 케어팀 출신, AI 의료기기 개발 다수 경험",
      selected: false,
    },
  ]);

  const toggleExpertSelection = (expertId: string) => {
    setExperts((prev) =>
      prev.map((expert) =>
        expert.id === expertId
          ? { ...expert, selected: true }
          : { ...expert, selected: false }
      )
    );
  };

  const handleEvaluationRequest = () => {
    onEvaluationRequest?.();
  };

  return (
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
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="flex p-6 flex-col items-start gap-4 self-stretch rounded-[10px] border border-[#EEEEEF] bg-white relative"
              >
                <div className="flex flex-col items-start gap-2 self-stretch relative">
                  <div className="flex w-[165px] flex-col items-start relative">
                    <div className="self-stretch text-[#2B2B2B] font-pretendard text-[16px] font-bold leading-[29px]">
                      {expert.name}
                    </div>
                    <div className="self-stretch text-[#6B6B6B] font-pretendard text-[14px] font-normal leading-normal tracking-[-0.064px] opacity-80">
                      {expert.specialty} · {expert.experience}
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
            className="flex py-5 px-[52px] justify-center items-center gap-2 flex-1 rounded-[10px] border border-[#07F] bg-white text-[#07F] transition-colors hover:bg-[#07F]/5"
          >
            <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              취소
            </div>
          </button>
          <button
            onClick={handleEvaluationRequest}
            className="flex py-5 px-[52px] justify-center items-center gap-2 flex-1 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC]"
          >
            <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              평가 요청
            </div>
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
