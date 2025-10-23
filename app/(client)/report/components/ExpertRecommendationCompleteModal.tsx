"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { X } from "lucide-react";
import Image from "next/image";
import { useExpertStore } from "./store/ExpertStore";

interface ExpertRecommendationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertRecommendationCompleteModal({
  isOpen,
  onClose,
}: ExpertRecommendationCompleteModalProps) {
  const { selectedExpert } = useExpertStore();

  // 현재 날짜와 시간 포맷팅
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const requestDate = getCurrentDateTime();
  const expertName = selectedExpert?.name || "전문가";
  const expertSpecialty = selectedExpert?.specialty || "전문 분야";
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
        <div className="flex flex-col items-center gap-5 self-stretch relative">
          {/* Header */}
          <div className="flex justify-between items-start self-stretch relative">
            <div className="flex flex-col justify-center items-start gap-2 flex-1 relative">
              <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                전문가 평가요청
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center"
            >
              <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
            </button>
          </div>

          {/* Content Section */}
          <div className="flex flex-col items-center gap-8 relative">
            {/* Illustration */}
            <div className="flex w-[280px] h-[224px] justify-center items-center relative">
              <Image
                src="/images/send_report.webp"
                alt="Expert evaluation illustration"
                width={280}
                height={224}
                sizes="(max-width: 560px) 100vw, 560px"
                className="object-contain"
                priority
              />
            </div>

            {/* Main Message */}
            <div className="flex flex-col items-center gap-2 relative">
              <div className="text-[#07F] text-center font-pretendard text-[24px] font-bold leading-[32px]">
                전문가에게 보고서를 전달했습니다.
              </div>
              <div className="text-[rgba(48,48,48,1)] text-center font-pretendard text-[16px] font-bold leading-[32px]">
                평가가 완료될 때까지 기다려주세요!
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex p-6 flex-col items-start gap-4 self-stretch rounded-[10px] border border-[#EEEEEF] bg-white relative">
            <div className="flex flex-col items-start self-stretch relative">
              <div className="self-stretch text-[#2B2B2B] font-pretendard text-[16px] font-semibold leading-[29px]">
                평가 요청 상태
              </div>
              
              {/* Status Rows with Border */}
              <div className="flex py-5 flex-col items-start gap-3 self-stretch border-b border-[rgba(217,217,217,1)] relative">
                <div className="flex justify-between items-start self-stretch relative">
                  <div className="text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    평가 요청일
                  </div>
                  <div className="text-[rgba(48,48,48,1)] font-pretendard text-[14px] font-normal leading-normal tracking-[-0.064px] opacity-80">
                    {requestDate}
                  </div>
                </div>
                <div className="flex justify-between items-start self-stretch relative">
                  <div className="text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    선택 전문가
                  </div>
                  <div className="text-[rgba(48,48,48,1)] font-pretendard text-[14px] font-normal leading-normal tracking-[-0.064px] opacity-80">
                    {expertName} ({expertSpecialty})
                  </div>
                </div>
              </div>
            </div>

            {/* Status Row */}
            <div className="flex justify-between items-start self-stretch relative">
              <div className="text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                상태
              </div>
              <div className="text-[#07F] font-pretendard text-[14px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                평가 진행중
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex items-start gap-3 self-stretch relative">
          <button
            onClick={onClose}
            className="flex py-5 px-[52px] justify-center items-center gap-2 flex-1 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC]"
          >
            <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              확인
            </div>
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
