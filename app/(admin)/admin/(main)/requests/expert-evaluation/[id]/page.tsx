"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Plus } from "lucide-react";
import { ReportViewingModal } from "./components/report-viewing-modal";

// Star Rating Component
function StarRating({
  rating,
  onChange,
  disabled = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex p-3 bg-[#F7F7F7] rounded gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= (hoverRating || rating)
                ? "fill-[#767676] text-[#767676]"
                : "fill-[#E6E6E6] text-[#E6E6E6]"
            }`}
            onClick={() => !disabled && onChange?.(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
          />
        ))}
      </div>
    </div>
  );
}

// Overall Rating Display Component
function OverallRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[100px]">
      <div className="flex p-3.5 border border-[#89BBF4] bg-[#F7FBFF] rounded gap-1">
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= Math.floor(rating)
                    ? "fill-[#0077FF] text-[#0077FF]"
                    : star === Math.ceil(rating) && rating % 1 !== 0
                    ? "fill-[#CAE5FF] text-[#CAE5FF]"
                    : "fill-[#CAE5FF] text-[#CAE5FF]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-14 px-4 items-center">
        <div className="flex h-[18px] items-end gap-1.5">
          <span className="text-2xl font-semibold text-[#07F] opacity-80 leading-5">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-[#303030] opacity-80 leading-3">
            /5.0
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExpertEvaluationDetailPage() {
  const router = useRouter();
  const [ratings, setRatings] = useState({
    business: 0,
    market: 0,
    investment: 0,
    feasibility: 0,
    documentation: 4.0,
  });
  const [comment, setComment] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleRatingChange =
    (category: keyof typeof ratings) => (rating: number) => {
      setRatings((prev) => ({ ...prev, [category]: rating }));
    };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting evaluation:", { ratings, comment });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen bg-white m-8">
      <div className="flex w-full mx-auto">
        <div className="flex flex-col flex-1 p-11 gap-6 bg-white rounded-[5px]">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-[#303030]">
              전문가 평가
            </h1>

            {/* Report Information Section */}
            <div className="flex p-8 items-end gap-8 border border-[#D9D9D9] rounded bg-[#FAFAFA]">
              <div className="flex flex-col flex-1">
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    보고서 ID
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    REQ-250216-032
                  </div>
                </div>
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    사용자
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    홍길동 (hong@gmail.com)
                  </div>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    스냅샷 시각
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    2025-09-09 15:32
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-[124px] bg-[#D9D9D9]"></div>

              <div className="flex flex-col flex-1 justify-end">
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    상태
                  </div>
                  <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#FFF1C2] text-[#975102] border-none">
                    대기
                  </Badge>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    업종
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    IT·소프트웨어
                  </div>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    마감일
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#303030]">
                      2025-02-20
                    </span>
                    <span className="text-base font-bold text-[#F94F4C]">
                      (D-3)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Report Information Section */}
            <div className="flex flex-col p-8 gap-4 border border-[#D9D9D9] rounded bg-[#FAFAFA]">
              <h2 className="text-xl font-bold text-black">대상 보고서 정보</h2>
              <div className="flex items-center gap-8">
                <div className="flex flex-col flex-1">
                  <div className="flex py-2 items-center">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      제목
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      Series-A IR 초안
                    </div>
                  </div>
                  <div className="flex py-2 items-center">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      업종
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      디지털·ICT·AI
                    </div>
                  </div>
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      생성일
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      2025-09-09
                    </div>
                  </div>
                </div>

                <div className="w-0.5 h-[126px] bg-[#D9D9D9]"></div>

                <div className="flex flex-col flex-1 justify-end">
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      유형
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      사업계획서
                    </div>
                  </div>
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      목표투자
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      ₩10,000,000
                    </div>
                  </div>
                  <div className="flex py-2 items-start">
                    <Button
                      onClick={() => setIsReportModalOpen(true)}
                      variant="outline"
                      className="flex gap-1 px-2.5 py-1.5 border border-[#D9D9D9] bg-white text-[#5A5A5A] text-xs font-medium rounded"
                    >
                      <FileText className="w-4 h-4" />
                      보고서 열람
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Scores Section */}
          <div className="flex flex-col p-8 gap-6 border border-[#EEEEEF] rounded bg-white">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-black">평가 항목별 점수</h2>

              <div className="flex flex-col gap-4">
                {/* Business Viability */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">
                    사업성
                  </div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.business}
                      onChange={handleRatingChange("business")}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={
                        ratings.business > 0 ? ratings.business.toString() : ""
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setRatings((prev) => ({ ...prev, business: value }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Market Viability */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">
                    시장성
                  </div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.market}
                      onChange={handleRatingChange("market")}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={
                        ratings.market > 0 ? ratings.market.toString() : ""
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setRatings((prev) => ({ ...prev, market: value }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Investment Attractiveness */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">
                    투자 매력도
                  </div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.investment}
                      onChange={handleRatingChange("investment")}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={
                        ratings.investment > 0
                          ? ratings.investment.toString()
                          : ""
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setRatings((prev) => ({
                            ...prev,
                            investment: value,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Feasibility */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">
                    실행 가능성
                  </div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.feasibility}
                      onChange={handleRatingChange("feasibility")}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                      value={
                        ratings.feasibility > 0
                          ? ratings.feasibility.toString()
                          : ""
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setRatings((prev) => ({
                            ...prev,
                            feasibility: value,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Documentation Completeness */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">
                    문서 완성도
                  </div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.documentation}
                      onChange={handleRatingChange("documentation")}
                    />
                    <Input
                      className="flex-1 h-14 px-[18px] border border-[#07F] rounded-lg text-base text-[#303030] rounded-[8px]"
                      value="4.0"
                      readOnly
                    />
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030] ">
                    종합 평점
                  </div>
                  <OverallRating rating={4.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Expert Comments Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black">전문가 코멘트</h2>
            <div className="flex p-3 justify-between items-center border border-[#E3E5E5] rounded-xl bg-white">
              <div className="flex h-[120px] px-3 items-start gap-2.5 flex-1">
                <textarea
                  placeholder="내용을 입력해주세요."
                  className="w-full h-full resize-none border-none outline-none text-base text-[#B3B3B3] font-normal leading-6 focus:ring-0"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-black">첨부파일</h2>

            <div className="flex flex-col gap-3">
              {/* PDF Evaluation */}
              <div className="flex items-center gap-2">
                <div className="w-40 text-base font-bold text-[#303030]">
                  평가서 PDF
                </div>
                <Button className="flex  w-[144px] h-[48px] gap-1.5 bg-[#E8F3FF] text-[#07F] text-lg font-semibold rounded-lg border-none hover:bg-[#D0E7FF] rounded-[8px]">
                  <Plus className="w-6 h-6" />
                  파일 첨부
                </Button>
                <Input
                  placeholder="첨부파일을 업로드해주세요."
                  className="flex-1 h-12 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                  readOnly
                />
              </div>

              {/* Word Summary */}
              <div className="flex items-center gap-2">
                <div className="w-40 text-base font-bold text-[#303030]">
                  평가 요약 Word
                </div>
                <Button className="flex w-[144px] h-[48px] gap-1.5 bg-[#E8F3FF] text-[#07F] text-lg font-semibold rounded-lg border-none hover:bg-[#D0E7FF] rounded-[8px]">
                  <Plus className="w-6 h-6" />
                  파일 첨부
                </Button>
                <Input
                  placeholder="첨부파일을 업로드해주세요."
                  className="flex-1 h-12 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-start justify-end gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-[79px] h-[46px] border border-[#07F] bg-white text-[#07F] text-lg font-semibold rounded-lg hover:bg-[#F8FBFF] rounded-[8px]"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-[79px] h-[46px] bg-[#07F] text-white text-lg font-semibold rounded-lg hover:bg-[#0066CC] rounded-[8px]"
            >
              제출
            </Button>
          </div>
        </div>
      </div>

      {/* Report Viewing Modal */}
      <ReportViewingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportTitle="AI 기반 리테일 수요예측 사업계획서"
      />
    </div>
  );
}
