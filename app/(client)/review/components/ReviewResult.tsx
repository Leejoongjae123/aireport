"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { ExpertConsultationModal } from "./ExpertConsultationModal";
import { useState } from "react";
interface ReviewResultModalProps {
  children: React.ReactNode;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[18px] h-[18px]"
  >
    <path
      d="M16.4879 8.0422L13.3168 10.8097L14.2667 14.93C14.317 15.1454 14.3027 15.3708 14.2255 15.5781C14.1483 15.7854 14.0118 15.9654 13.8329 16.0955C13.654 16.2256 13.4408 16.3001 13.2198 16.3096C12.9988 16.3192 12.7799 16.2634 12.5905 16.1492L8.99681 13.9695L5.41087 16.1492C5.22143 16.2634 5.00254 16.3192 4.78156 16.3096C4.56058 16.3001 4.34732 16.2256 4.16845 16.0955C3.98958 15.9654 3.85302 15.7854 3.77586 15.5781C3.6987 15.3708 3.68436 15.1454 3.73462 14.93L4.68314 10.8139L1.51134 8.0422C1.34358 7.89752 1.22228 7.70652 1.16263 7.49317C1.10299 7.27981 1.10767 7.0536 1.17607 6.84289C1.24448 6.63218 1.37358 6.44636 1.54717 6.30873C1.72077 6.1711 1.93113 6.08779 2.15189 6.06923L6.33267 5.70712L7.96463 1.81463C8.04985 1.61038 8.1936 1.43591 8.37777 1.3132C8.56195 1.19048 8.77831 1.125 8.99963 1.125C9.22094 1.125 9.4373 1.19048 9.62148 1.3132C9.80565 1.43591 9.9494 1.61038 10.0346 1.81463L11.6715 5.70712L15.8509 6.06923C16.0716 6.08779 16.282 6.1711 16.4556 6.30873C16.6292 6.44636 16.7583 6.63218 16.8267 6.84289C16.8951 7.0536 16.8998 7.27981 16.8401 7.49317C16.7805 7.70652 16.6592 7.89752 16.4914 8.0422H16.4879Z"
      fill={filled ? "#0077FF" : "#767676"}
    />
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= Math.floor(rating)} />
      ))}
    </div>
  );
};

const EvaluationCard = ({
  title,
  rating,
}: {
  title: string;
  rating: number;
}) => (
  <div className="flex flex-col items-start gap-1 p-3 rounded bg-[#F7F7F7]">
    <span className="text-sm font-medium text-[#303030] opacity-80 leading-5 tracking-[-0.064px]">
      {title}
    </span>
    <div className="flex items-center gap-2 w-full">
      <StarRating rating={rating} />
      <span className="text-sm font-semibold text-[#757575] opacity-80 leading-5 tracking-[-0.064px]">
        {rating}
      </span>
    </div>
  </div>
);

export function ReviewResultModal({ children }: ReviewResultModalProps) {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConsultationRequest = () => {
    // Handle consultation request logic here
  };

  const handleConsultationButtonClick = () => {
    setIsDialogOpen(false); // 현재 Dialog 닫기
    setIsConsultationModalOpen(true); // 컨설팅 모달 열기
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="max-w-[862px] p-10 border-none bg-white rounded-xl shadow-[0_0_10px_0_rgba(0,119,255,0.20)] overflow-y-auto"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-start gap-5 w-full">
              {/* Header */}
              <div className="flex justify-between items-start w-full">
                <h1 className="text-2xl font-bold text-black">
                  전문가 평가서 확인
                </h1>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:bg-gray-100 p-0"
                  >
                    <X className="w-8 h-8 text-[#767676] stroke-[1.6]" />
                  </Button>
                </DialogClose>
              </div>

              {/* Main Content */}
              <div className="flex items-start gap-3 w-full h-80">
                {/* Expert Info */}
                <div className="flex flex-col items-start gap-4 flex-1 h-full p-6 rounded-[10px] border border-[#EEEEEF] bg-white">
                  <h2 className="text-xl font-bold text-black">전문가 정보</h2>
                  <div className="flex flex-col justify-between items-start flex-1 w-full">
                    <div className="flex flex-col items-start gap-2 w-full">
                      <div className="flex flex-col items-start w-[165px]">
                        <span className="text-base font-semibold text-[#2B2B2B] leading-[29px] w-full">
                          김○○ 박사
                        </span>
                        <span className="text-sm font-medium text-[#6B6B6B] opacity-80 tracking-[-0.064px] w-full">
                          헬스케어 IT전문가 · 15년 경력
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#2B2B2B] opacity-80 leading-[18px] tracking-[-0.064px] w-full">
                        삼성의료원 디지털헬스 케어팀 출신, AI 의료기기 개발 다수
                        경험
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-[10px] w-full">
                      <div className="flex justify-center items-center gap-[10px] px-3 py-2 rounded-full bg-[#C7EAFF]">
                        <span className="text-sm font-semibold text-[#0077FF] text-center tracking-[-0.28px]">
                          평가 완료
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#2B2B2B] opacity-80 leading-5 tracking-[-0.064px]">
                        평가일자 : 2025.09.11
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evaluation Summary */}
                <div className="flex flex-col items-start gap-4 h-full p-6 rounded-[10px] border border-[#EEEEEF] bg-white w-full">
                  <h2 className="text-xl font-bold text-black">평가 요약</h2>
                  <div className="flex flex-col justify-between items-start flex-1 w-[472px]">
                    <div className="flex items-start content-start gap-2 flex-wrap w-full">
                      <EvaluationCard title="사업성" rating={4} />
                      <EvaluationCard title="시장성" rating={4} />
                      <EvaluationCard title="투자 매력도" rating={4} />
                      <EvaluationCard title="실행 가능성" rating={4} />
                      <EvaluationCard title="문서 완성도" rating={4} />
                    </div>

                    {/* Overall Rating */}
                    <div className="flex justify-between items-start p-[14px_16px] w-full rounded border border-[#89BBF4] bg-[#F7FBFF]">
                      <span className="text-sm font-bold text-[#1E1E1E] opacity-80 leading-5 tracking-[-0.064px]">
                        종합 평점
                      </span>
                      <div className="flex items-center gap-[17px]">
                        <div className="flex items-center gap-[3px]">
                          <StarIcon filled={true} />
                          <StarIcon filled={true} />
                          <StarIcon filled={true} />
                          <StarIcon filled={true} />
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[18px] h-[18px]"
                          >
                            <path
                              d="M16.4879 8.0422L13.3168 10.8097L14.2667 14.93C14.317 15.1454 14.3027 15.3708 14.2255 15.5781C14.1483 15.7854 14.0118 15.9654 13.8329 16.0955C13.654 16.2256 13.4408 16.3001 13.2198 16.3096C12.9988 16.3192 12.7799 16.2634 12.5905 16.1492L8.99681 13.9695L5.41087 16.1492C5.22143 16.2634 5.00254 16.3192 4.78156 16.3096C4.56058 16.3001 4.34732 16.2256 4.16845 16.0955C3.98958 15.9654 3.85302 15.7854 3.77586 15.5781C3.6987 15.3708 3.68436 15.1454 3.73462 14.93L4.68314 10.8139L1.51134 8.0422C1.34358 7.89752 1.22228 7.70652 1.16263 7.49317C1.10299 7.27981 1.10767 7.0536 1.17607 6.84289C1.24448 6.63218 1.37358 6.44636 1.54717 6.30873C1.72077 6.1711 1.93113 6.08779 2.15189 6.06923L6.33267 5.70712L7.96463 1.81463C8.04985 1.61038 8.1936 1.43591 8.37777 1.3132C8.56195 1.19048 8.77831 1.125 8.99963 1.125C9.22094 1.125 9.4373 1.19048 9.62148 1.3132C9.80565 1.43591 9.9494 1.61038 10.0346 1.81463L11.6715 5.70712L15.8509 6.06923C16.0716 6.08779 16.282 6.1711 16.4556 6.30873C16.6292 6.44636 16.7583 6.63218 16.8267 6.84289C16.8951 7.0536 16.8998 7.27981 16.8401 7.49317C16.7805 7.70652 16.6592 7.89752 16.4914 8.0422H16.4879Z"
                              fill="#CAE5FF"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-[#0077FF] opacity-80 leading-5 tracking-[-0.064px]">
                          4.5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Comments */}
              <div className="flex flex-col items-start gap-4 p-6 w-full rounded-[10px] border border-[#EEEEEF] bg-white">
                <h2 className="text-xl font-bold text-black">전문가 코멘트</h2>
                <div className="flex justify-between items-center p-6 w-full rounded-md bg-[#F5F5F5]">
                  <p className="flex-1 text-base font-normal text-[#444444] leading-6 tracking-[-0.064px]">
                    본 보고서는 리테일 시장 내 AI 수요예측 솔루션의 차별성과
                    확장 가능성을 잘 보여줍니다. 특히 기존 솔루션 대비 정확도
                    향상과 실시간 분석 능력은 명확한 경쟁우위로 판단됩니다.
                    <br />
                    강점: 기술적 차별성이 명확하고, 목표 시장의 규모와 성장성이
                    ���력적입니다. 팀의 전문성과 실행 경험도 충분하다고
                    평가됩니다.
                    <br />
                    개선 제안: 초기 고객 확보 전략을 더 구체화하고, 경쟁사 대응
                    방안을 보완하면 투자 매력도를 더욱 높일 수 있을 것입니다.
                  </p>
                </div>
              </div>

              {/* Attachment Files */}
              <div className="flex justify-between items-center p-[18px_24px] w-full rounded-[10px] border border-[#EEEEEF] bg-white">
                <h2 className="text-xl font-bold text-black">
                  첨부 평가서 파일
                </h2>
                <div className="flex items-start gap-4">
                  <Button
                    variant="outline"
                    className="flex justify-center items-center gap-2 px-4 py-2 border border-[#D9D9D9] bg-white rounded hover:bg-gray-50"
                  >
                    <Image
                      src="/images/pdf.svg"
                      alt="PDF"
                      width={24}
                      height={24}
                    />
                    <span className="text-xs font-bold text-[#5A5A5A] leading-4">
                      PDF 다운로드
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex justify-center items-center gap-2 px-4 py-2 border border-[#D9D9D9] bg-white rounded hover:bg-gray-50"
                  >
                    <Image
                      src="/images/word.svg"
                      alt="Word"
                      width={24}
                      height={24}
                    />
                    <span className="text-xs font-bold text-[#5A5A5A] leading-4">
                      Word 다운로드
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-start gap-3 w-full">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2 px-[52px] h-[62px] flex-1 rounded-[10px] border border-[#0077FF] bg-white hover:bg-gray-50"
                >
                  <span className="text-lg font-bold text-[#0077FF] tracking-[-0.36px]">
                    취소
                  </span>
                </Button>
              </DialogClose>
              <Button
                onClick={handleConsultationButtonClick}
                className="flex justify-center items-center gap-2 px-[52px] h-[62px] flex-1 rounded-[10px] bg-[#0077FF] hover:bg-[#0077FF]/90"
              >
                <span className="text-lg font-bold text-white tracking-[-0.36px]">
                  컨설팅 요청
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ExpertConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onConsultationRequest={handleConsultationRequest}
      />
    </>
  );
}
