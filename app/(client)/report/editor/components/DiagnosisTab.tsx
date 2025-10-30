"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronRight, RotateCcw, Download } from "lucide-react";
import { DiagnosisResult } from "./types";
import { EvaluationCriteriaData } from "../../procedure/types";

interface DiagnosisTabProps {
  evaluationCriteria: EvaluationCriteriaData | null;
  diagnosisResult: DiagnosisResult | null;
  expandedCategories: Set<number>;
  onToggleCategory: (categoryId: number) => void;
  isLoading?: boolean;
  isDiagnosing?: boolean;
  errorMessage?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestBody?: any; // requestBody 추가
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = "",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={`flex h-3 items-center self-stretch rounded-full bg-[#E6E6E6] ${className}`}
    >
      <div
        className="h-3 rounded-l-full bg-[#0077FF] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export function DiagnosisTab({
  evaluationCriteria,
  diagnosisResult,
  expandedCategories,
  onToggleCategory,
  isLoading = false,
  isDiagnosing = false,
  errorMessage = null,
  requestBody,
}: DiagnosisTabProps) {
  const categories = React.useMemo(() => {
    if (diagnosisResult?.categories) {
      return diagnosisResult.categories.map((category) => ({
        id: category.id,
        name: category.name,
        score: category.score,
        summary: category.summary,
        items: category.items,
      }));
    }

    if (evaluationCriteria) {
      return evaluationCriteria.map((category) => ({
        id: category.id,
        name: category.카테고리,
        score: undefined,
        summary: undefined,
        items: category.평가항목.map((item) => ({
          id: item.id,
          title: item.내용,
          score: undefined,
          summary: undefined,
          description: undefined,
        })),
      }));
    }

    return [];
  }, [diagnosisResult, evaluationCriteria]);

  // requestBody 다운로드 함수
  const downloadRequestBody = () => {
    if (!requestBody) {
      alert("requestBody가 없습니다.");
      return;
    }

    const jsonString = JSON.stringify(requestBody, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "requestBody.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const overallScore = React.useMemo(() => {
    if (diagnosisResult?.overallScore !== undefined) {
      return diagnosisResult.overallScore;
    }

    const scores: number[] = [];

    diagnosisResult?.categories?.forEach((category) => {
      category.items.forEach((item) => {
        if (typeof item.score === "number") {
          scores.push(item.score);
        }
      });
    });

    if (scores.length > 0) {
      const sum = scores.reduce((acc, score) => acc + score, 0);
      return Math.round(sum / scores.length);
    }

    return undefined;
  }, [diagnosisResult]);

  const overallSummary = React.useMemo(() => {
    if (diagnosisResult?.overallSummary) {
      return diagnosisResult.overallSummary;
    }

    if (diagnosisResult?.recommendation) {
      return diagnosisResult.recommendation;
    }

    return "AI 진단 결과가 준비되면 여기에서 확인할 수 있습니다.";
  }, [diagnosisResult]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-[#878A8F] text-sm">
            평가 기준을 불러오는 중...
          </div>
        </div>
      ) : (
        <>
          {/* Overall Score */}
          <div className="flex py-5 gap-2 flex-wrap mb-5 ">
            <Card className="flex-1 p-5 border-[#BAD1EC]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <div className="text-[#0077FF] font-bold text-2xl">
                      {typeof overallScore === "number" ? `${overallScore}점` : "-"}
                    </div>
                    <div className="text-[#878A8F] text-xs opacity-80">
                      전체 평가 점수
                    </div>
                  </div>
                  <ProgressBar value={overallScore ?? 0} className="w-full" />
                </div>
                <div className="text-[#6B6B6B] text-xs leading-4 opacity-80 whitespace-pre-line">
                  {overallSummary}
                </div>
              </div>
            </Card>
          </div>

          {/* Evaluation Criteria Sections */}
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="flex gap-2 flex-wrap mb-5">
                <Card className="flex-1 p-5 border-[#BAD1EC]">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => onToggleCategory(category.id)}
                  >
                    <h3 className="text-[#303030] font-semibold text-lg">
                      {category.name}
                    </h3>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-5 h-5 text-[#878A8F]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#878A8F]" />
                    )}
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="flex flex-col gap-5 mt-5 pt-5 border-t border-[#D9D9D9]">
                      {category.items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div className="text-[#2B2B2B] font-semibold text-xs opacity-80">
                              {item.title}
                            </div>
                            <div className="text-[#2B2B2B] text-xs opacity-80">
                              {typeof item.score === "number" ? `${item.score}/100` : "-"}
                            </div>
                          </div>
                          <ProgressBar value={typeof item.score === "number" ? item.score : 0} className="w-full" />
                          <div className="text-[#6B6B6B] text-xs leading-4 opacity-80 whitespace-pre-line">
                            {item.description || item.summary || "평가 결과가 여기에 표시됩니다."}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-10">
              <div className="text-[#878A8F] text-sm">
                평가 기준을 불러올 수 없습니다.
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            className="w-full gap-3 border-[#D9D9D9] h-12 mb-12"
            disabled={isDiagnosing}
          >
            <RotateCcw className="w-4 h-4 text-[#6C6C6C]" />
            <span className="text-[#757575] font-semibold text-base">
              새로고침
            </span>
          </Button>

          {/* RequestBody Download Button */}
          {requestBody && (
            <Button
              variant="outline"
              onClick={downloadRequestBody}
              className="w-full gap-3 border-[#D9D9D9] h-12 mb-4"
            >
              <Download className="w-4 h-4 text-[#6C6C6C]" />
              <span className="text-[#757575] font-semibold text-base">
                requestBody.json 다운로드
              </span>
            </Button>
          )}

          {isDiagnosing ? (
            <div className="text-center text-xs text-[#878A8F]">
              AI 진단을 수행 중입니다...
            </div>
          ) : null}

          {errorMessage ? (
            <div className="text-center text-xs text-[#D74343]">
              {errorMessage}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
