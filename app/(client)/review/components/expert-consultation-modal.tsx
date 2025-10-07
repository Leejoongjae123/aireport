"use client";

import { CustomModal } from "@/components/ui/custom-modal";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface ExpertConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultationRequest?: () => void;
}

export function ExpertConsultationModal({
  isOpen,
  onClose,
  onConsultationRequest,
}: ExpertConsultationModalProps) {
  const [requestSubject, setRequestSubject] = useState("");
  const [detailedRequirements, setDetailedRequirements] = useState("");

  const handleConsultationRequest = () => {
    // Validate required fields
    if (!requestSubject.trim() || !detailedRequirements.trim()) {
      alert("요청주제와 상세 요구사항을 모두 입력해주세요.");
      return;
    }
    onConsultationRequest?.();
    onClose();
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
      <div className="flex w-[420px] flex-col items-center relative">
        <div className="flex flex-col items-start gap-11 self-stretch relative">
          {/* Header */}
          <div className="flex justify-between items-start self-stretch relative">
            <div className="flex flex-col justify-center items-start gap-2 flex-1 relative">
              <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                전문가 평가요청
              </div>
              <div className="self-stretch text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-medium leading-[20px]">
                전문가 평가서를 기반으로 추가 컨설팅을 요청할 수 있습니다.
                <br />
                받으신 평가서를 참고하여 구체적인 요구사항을 작성해 주세요.
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center"
            >
              <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
            </button>
          </div>

          <div className="flex flex-col items-start self-stretch relative">
            {/* Report/Expert Info Section */}
            <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
              <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                보고서 / 전문가 정보
              </div>
              <div className="flex flex-col items-start self-stretch relative">
                <div className="flex py-2 justify-between items-start self-stretch relative">
                  <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    보고서
                  </div>
                  <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                    AI 기반 리테일 수요예측 솔루션 사업계획서
                  </div>
                </div>
                <div className="flex py-2 justify-between items-start self-stretch relative">
                  <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    평가서
                  </div>
                  <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                    김○○ 박사 평가서 (2025-09-11)
                  </div>
                </div>
                <div className="flex py-2 justify-between items-start self-stretch relative">
                  <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    전문가
                  </div>
                  <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                    김○○ 박사 · 헬스케어/AI · 15년 경력
                  </div>
                </div>
              </div>
            </div>

            {/* Consulting Request Content */}
            <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
              <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                컨설팅 요청 내용
              </div>
              <div className="flex flex-col items-start gap-3 self-stretch relative">
                {/* Request Subject Input */}
                <div className="flex flex-col items-start gap-3 self-stretch relative">
                  <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    요청주제
                    <span className="text-[rgba(236,34,31,1)]">*</span>
                  </div>
                  <div className="flex py-4 px-[18px] items-center gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-white relative">
                    <input
                      type="text"
                      value={requestSubject}
                      onChange={(e) => setRequestSubject(e.target.value)}
                      placeholder="예) IR 자료 보강을 위한 컨설팅 요청"
                      className="flex-1 text-[rgba(166,166,166,1)] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[rgba(166,166,166,1)]"
                    />
                  </div>
                </div>

                {/* Detailed Requirements Textarea */}
                <div className="flex flex-col items-start gap-3 self-stretch relative">
                  <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    상세 요구사항
                    <span className="text-[rgba(236,34,31,1)]">*</span>
                  </div>
                  <div className="flex py-4 px-[18px] items-start gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-white relative">
                    <textarea
                      value={detailedRequirements}
                      onChange={(e) => setDetailedRequirements(e.target.value)}
                      placeholder="예)&#10;평가서에서 지적된 시장분석 부분을 더 깊이 보완하고 싶습니다.&#10;경쟁사 사례와 차별화 포인트를 컨설팅 세션에서 다뤄주시면 좋겠습니다.&#10;투자자 피칭용 자료로 재구성할 수 있는 가이드도 필요합니다."
                      className="flex-1 text-[rgba(166,166,166,1)] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none resize-none h-24 placeholder:text-[rgba(166,166,166,1)]"
                      rows={4}
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="flex flex-col items-start gap-3 self-stretch relative">
                  <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    참고자료 첨부 (선택)
                  </div>
                  <div className="flex items-start gap-2 self-stretch relative">
                    <div className="flex py-3 px-[18px] items-center gap-[10px] flex-1 rounded-lg border border-[#E3E5E5] bg-white relative">
                      <div className="text-[rgba(166,166,166,1)] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px]">
                        첨부파일을 업로드해주세요.
                      </div>
                    </div>
                    <button className="flex py-3 px-6 justify-center items-center gap-[6px] rounded-lg bg-[#E8F3FF]">
                      <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={2} />
                      <div className="text-[#07F] font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
                        파일 첨부
                      </div>
                    </button>
                  </div>
                  <div className="self-stretch text-[rgba(117,117,117,1)] font-pretendard text-[14px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                    (PDF/Word, 최대 20MB)
                  </div>
                </div>
              </div>
            </div>
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
            onClick={handleConsultationRequest}
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
