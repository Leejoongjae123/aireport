"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Star, FileText, Plus } from "lucide-react";
import { ReportViewingModal } from "./ReportViewingModal";
import { expertReviewSchema, ExpertReviewFormData, ExpertReviewDetailData } from "../types";
import { useToast } from "@/components/hooks/UseToast";

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

interface ExpertEvaluationFormProps {
  data: ExpertReviewDetailData;
  expertRequestId: string;
}

export function ExpertEvaluationForm({ data, expertRequestId }: ExpertEvaluationFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpertReviewFormData>({
    resolver: zodResolver(expertReviewSchema),
    defaultValues: {
      business_score: data.business_score || 0,
      market_score: data.market_score || 0,
      investment_appeal_score: data.investment_appeal_score || 0,
      execution_feasibility_score: data.execution_feasibility_score || 0,
      document_completeness_score: data.document_completeness_score || 0,
      expert_comment: data.expert_comment || "",
      attachment_url_pdf: data.attachment_url_pdf || "",
      attachment_url_word: data.attachment_url_word || "",
    },
  });

  const ratings = {
    business: watch("business_score"),
    market: watch("market_score"),
    investment: watch("investment_appeal_score"),
    feasibility: watch("execution_feasibility_score"),
    documentation: watch("document_completeness_score"),
  };

  // 종합 평점 계산
  const calculateOverallScore = () => {
    const scores = [
      ratings.business,
      ratings.market,
      ratings.investment,
      ratings.feasibility,
      ratings.documentation,
    ];
    const validScores = scores.filter((score) => score > 0);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
  };

  const overallScore = calculateOverallScore();

  const handleRatingChange = (field: keyof typeof ratings, value: number) => {
    const fieldMap = {
      business: "business_score",
      market: "market_score",
      investment: "investment_appeal_score",
      feasibility: "execution_feasibility_score",
      documentation: "document_completeness_score",
    } as const;

    setValue(fieldMap[field], value, { shouldValidate: true });
  };

  const onSubmit = async (formData: ExpertReviewFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/expert-review/${expertRequestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          overall_score: overallScore,
          expert_request_id: parseInt(expertRequestId),
          report_uuid: data.report_uuid,
          user_id: data.user_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || "평가 제출에 실패했습니다.", "error");
        return;
      }

      showToast("전문가 평가가 성공적으로 제출되었습니다.", "success");
      router.push("/admin/requests/expert-evaluation");
    } catch {
      showToast("평가 제출 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#FFF1C2] text-[#975102] border-none">
            대기
          </Badge>
        );
      case "evaluating":
        return (
          <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#E8F3FF] text-[#0077FF] border-none">
            평가중
          </Badge>
        );
      case "consulting_requested":
        return (
          <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#E8F3FF] text-[#0077FF] border-none">
            컨설팅 요청
          </Badge>
        );
      case "completed":
        return (
          <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#E8F5E9] text-[#2E7D32] border-none">
            완료
          </Badge>
        );
      default:
        return (
          <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#F5F5F5] text-[#757575] border-none">
            알 수 없음
          </Badge>
        );
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-screen bg-white m-8">
      <div className="flex w-full mx-auto">
        <div className="flex flex-col flex-1 p-11 gap-6 bg-white rounded-[5px]">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-[#303030]">전문가 평가</h1>

            {/* Report Information Section */}
            <div className="flex p-8 items-end gap-8 border border-[#D9D9D9] rounded bg-[#FAFAFA]">
              <div className="flex flex-col flex-1">
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    보고서 ID
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    {expertRequestId}
                  </div>
                </div>
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    사용자
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    {data.user_name || "-"} ({data.user_email || "-"})
                  </div>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    스냅샷 시각
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    {formatDateTime(data.created_at)}
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-[124px] bg-[#D9D9D9]"></div>

              <div className="flex flex-col flex-1 justify-end">
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    상태
                  </div>
                  {getStatusBadge(data.request_status)}
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">
                    업종
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    {data.business_field || "-"}
                  </div>
                </div>
                <div className="flex py-2 items-start">
                  {/* <div className="w-[120px] text-base font-semibold text-[#767676]">
                    투자 금액
                  </div>
                  <div className="text-base font-bold text-[#303030]">
                    ₩{data.investment_amount || "0"}
                  </div> */}
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
                      {data.report_title || "-"}
                    </div>
                  </div>
                  <div className="flex py-2 items-center">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      업종
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      {data.business_field || "-"}
                    </div>
                  </div>
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      생성일
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      {formatDate(data.report_created_at)}
                    </div>
                  </div>
                </div>

                <div className="w-0.5 h-[126px] bg-[#D9D9D9]"></div>

                <div className="flex flex-col flex-1 justify-end">
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      유형
                    </div>
                    <div className="text-base font-bold text-[#303030]">사업계획서</div>
                  </div>
                  <div className="flex py-2 items-start">
                    <div className="w-[120px] text-base font-semibold text-[#767676]">
                      목표투자
                    </div>
                    <div className="text-base font-bold text-[#303030]">
                      ₩{data.investment_amount || "0"}
                    </div>
                  </div>
                  <div className="flex py-2 items-start">
                    <Button
                      type="button"
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
                  <div className="w-40 text-base font-bold text-[#303030]">사업성</div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.business}
                      onChange={(value) => handleRatingChange("business", value)}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={ratings.business > 0 ? ratings.business.toString() : ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setValue("business_score", value, { shouldValidate: true });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors.business_score && (
                  <p className="text-red-500 text-sm ml-40">{errors.business_score.message}</p>
                )}

                {/* Market Viability */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">시장성</div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.market}
                      onChange={(value) => handleRatingChange("market", value)}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={ratings.market > 0 ? ratings.market.toString() : ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setValue("market_score", value, { shouldValidate: true });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors.market_score && (
                  <p className="text-red-500 text-sm ml-40">{errors.market_score.message}</p>
                )}

                {/* Investment Attractiveness */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">투자 매력도</div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.investment}
                      onChange={(value) => handleRatingChange("investment", value)}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6]"
                      value={ratings.investment > 0 ? ratings.investment.toString() : ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setValue("investment_appeal_score", value, { shouldValidate: true });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors.investment_appeal_score && (
                  <p className="text-red-500 text-sm ml-40">
                    {errors.investment_appeal_score.message}
                  </p>
                )}

                {/* Feasibility */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">실행 가능성</div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.feasibility}
                      onChange={(value) => handleRatingChange("feasibility", value)}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                      value={ratings.feasibility > 0 ? ratings.feasibility.toString() : ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setValue("execution_feasibility_score", value, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors.execution_feasibility_score && (
                  <p className="text-red-500 text-sm ml-40">
                    {errors.execution_feasibility_score.message}
                  </p>
                )}

                {/* Documentation Completeness */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030]">문서 완성도</div>
                  <div className="flex items-center gap-[100px] flex-1">
                    <StarRating
                      rating={ratings.documentation}
                      onChange={(value) => handleRatingChange("documentation", value)}
                    />
                    <Input
                      placeholder="숫자 입력 가능 (1.0 ~ 5.0)"
                      className="flex-1 h-14 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                      value={ratings.documentation > 0 ? ratings.documentation.toString() : ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value >= 1 && value <= 5) {
                          setValue("document_completeness_score", value, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors.document_completeness_score && (
                  <p className="text-red-500 text-sm ml-40">
                    {errors.document_completeness_score.message}
                  </p>
                )}

                {/* Overall Rating */}
                <div className="flex py-4 items-center">
                  <div className="w-40 text-base font-bold text-[#303030] ">종합 평점</div>
                  <OverallRating rating={overallScore} />
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
                  className="w-full h-full resize-none border-none outline-none text-base text-[#303030] font-normal leading-6 focus:ring-0"
                  {...register("expert_comment")}
                />
              </div>
            </div>
            {errors.expert_comment && (
              <p className="text-red-500 text-sm">{errors.expert_comment.message}</p>
            )}
          </div>

          {/* Attachments Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-black">첨부파일</h2>

            <div className="flex flex-col gap-3">
              {/* PDF Evaluation */}
              <div className="flex items-center gap-2">
                <div className="w-40 text-base font-bold text-[#303030]">평가서 PDF</div>
                <Button
                  type="button"
                  className="flex  w-[144px] h-[48px] gap-1.5 bg-[#E8F3FF] text-[#07F] text-lg font-semibold rounded-lg border-none hover:bg-[#D0E7FF] rounded-[8px]"
                >
                  <Plus className="w-6 h-6" />
                  파일 첨부
                </Button>
                <Input
                  placeholder="첨부파일을 업로드해주세요."
                  className="flex-1 h-12 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                  value={watch("attachment_url_pdf") || ""}
                  readOnly
                />
              </div>

              {/* Word Summary */}
              <div className="flex items-center gap-2">
                <div className="w-40 text-base font-bold text-[#303030]">평가 요약 Word</div>
                <Button
                  type="button"
                  className="flex w-[144px] h-[48px] gap-1.5 bg-[#E8F3FF] text-[#07F] text-lg font-semibold rounded-lg border-none hover:bg-[#D0E7FF] rounded-[8px]"
                >
                  <Plus className="w-6 h-6" />
                  파일 첨부
                </Button>
                <Input
                  placeholder="첨부파일을 업로드해주세요."
                  className="flex-1 h-12 px-[18px] border border-[#E3E5E5] rounded-lg text-base text-[#A6A6A6] rounded-[8px]"
                  value={watch("attachment_url_word") || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-start justify-end gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-[79px] h-[46px] bg-[#07F] text-white text-lg font-semibold rounded-lg hover:bg-[#0066CC] rounded-[8px] disabled:opacity-50"
            >
              {isSubmitting 
                ? "처리중..." 
                : data.request_status === "completed" 
                  ? "수정" 
                  : "제출"}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Viewing Modal */}
      <ReportViewingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportTitle={data.report_title || "보고서"}
        reportUuid={data.report_uuid}
      />
    </form>
  );
}
