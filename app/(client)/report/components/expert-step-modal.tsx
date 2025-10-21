"use client";

import { CustomModal } from "@/components/ui/custom-modal";
import { X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useExpertStore } from "./store/expert-store";
import { ExpertMatchResponse } from "./types";

interface ExpertStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRequest?: () => void;
  reportId: string;
}

export function ExpertStepModal({
  isOpen,
  onClose,
  onStartRequest,
  reportId,
}: ExpertStepModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setExpertMatchData } = useExpertStore();

  const handleStartRequest = async () => {
    try {
      setIsLoading(true);

      // Supabase에서 report_create 조회
      const supabase = createClient();
      const { data: reportData, error } = await supabase
        .from("report_create")
        .select("business_idea, core_value")
        .eq("uuid", reportId)
        .single();

      if (error || !reportData) {
        setIsLoading(false);
        return;
      }

      const businessReport = `${reportData.business_idea || ""} ${
        reportData.core_value || ""
      }`.trim();

      // 전문가 매칭 API 호출 (백그라운드에서 실행)
      fetch("/api/expert/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_report: businessReport,
          num_keywords: 10,
          top_k: 10,
          similarity_threshold: 0.5,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((data: ExpertMatchResponse | null) => {
          if (data) {
            // Store에 저장
            setExpertMatchData(data);
          }
        });

      // 바로 다음 모달로 전환
      setIsLoading(false);
      onClose();

      setTimeout(() => {
        onStartRequest?.();
      }, 100);
    } catch {
      setIsLoading(false);
    }
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
      <div className="flex w-[420px] flex-col items-start gap-[31px] relative">
        <div className="flex flex-col items-start gap-[44px] self-stretch relative">
          <div className="flex flex-col items-start gap-[44px] self-stretch relative">
            {/* Header */}
            <div className="flex justify-between items-center self-stretch relative">
              <div className="text-black font-[Pretendard] text-[24px] font-bold leading-normal relative">
                전문가 평가요청
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
              </button>
            </div>

            {/* Steps */}
            <div className="flex flex-col items-start gap-[44px] self-stretch relative">
              {/* Step 1 */}
              <div className="flex items-center gap-5 self-stretch relative h-[58px]">
                <div className="w-[54px] text-[#E8F2FD] text-center font-[Pretendard] text-[80px] font-[900] leading-normal tracking-[-1.6px] relative">
                  1
                </div>
                <div className="flex flex-col items-start gap-3 flex-1 relative">
                  <div className="text-[#07F] font-[Pretendard] text-[24px] font-bold leading-normal relative">
                    평가요청
                  </div>
                  <div className="self-stretch text-[#6B6B6B] font-[Pretendard] text-[14px] font-medium leading-normal tracking-[-0.064px] relative">
                    보고서와 평가 기준을 선택하고 전문가를 지정합니다.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-5 self-stretch relative h-[58px]">
                <div className="w-[54px] text-[#E8F2FD] text-center font-[Pretendard] text-[80px] font-[900] leading-normal tracking-[-1.6px] relative">
                  2
                </div>
                <div className="flex flex-col items-start gap-3 flex-1 relative">
                  <div className="text-[#07F] font-[Pretendard] text-[24px] font-bold leading-normal relative">
                    평가 진행
                  </div>
                  <div className="self-stretch text-[#6B6B6B] font-[Pretendard] text-[14px] font-medium leading-normal tracking-[-0.064px] relative">
                    전문가가 보고서를 검토하고 상세한 평가를 진행합니다.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-5 self-stretch relative h-[58px]">
                <div className="w-[54px] text-[#E8F2FD] text-center font-[Pretendard] text-[80px] font-[900] leading-normal tracking-[-1.6px] relative">
                  3
                </div>
                <div className="flex flex-col items-start gap-3 flex-1 relative">
                  <div className="text-[#07F] font-[Pretendard] text-[24px] font-bold leading-normal relative">
                    결과 확인
                  </div>
                  <div className="self-stretch text-[#6B6B6B] font-[Pretendard] text-[14px] font-medium leading-normal tracking-[-0.064px] relative">
                    평가 결과와 개선 제안을 확인하고 보고서에 반영합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartRequest}
          disabled={isLoading}
          className="flex py-5 px-[52px] justify-center items-center gap-2 self-stretch rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-white font-[Pretendard] text-[18px] font-bold leading-normal tracking-[-0.36px]">
            {isLoading ? "전문가 매칭 중..." : "전문가 평가 요청하기"}
          </div>
        </button>
      </div>
    </CustomModal>
  );
}
