"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { EvaluationCriteriaData } from "../../procedure/types";

interface DiagnosisTabProps {
  evaluationCriteria: EvaluationCriteriaData | null;
  expandedCategories: Set<number>;
  onToggleCategory: (categoryId: number) => void;
  isLoading?: boolean;
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
  expandedCategories,
  onToggleCategory,
  isLoading = false,
}: DiagnosisTabProps) {
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
          <div className="flex py-5 gap-2 flex-wrap mb-5">
            <Card className="flex-1 p-5 border-[#BAD1EC]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <div className="text-[#0077FF] font-bold text-2xl">
                      71점
                    </div>
                    <div className="text-[#878A8F] text-xs opacity-80">
                      전체 평가 점수
                    </div>
                  </div>
                  <ProgressBar value={71} className="w-full" />
                </div>
                <div className="text-[#6B6B6B] text-xs leading-4 opacity-80">
                  본 사업은 리테일 시장 내 수요예측의 정확성과 실시간 분석
                  역량에서 높은 경쟁 우위를 보임. 다만, 데이터 품질관리 및
                  글로벌 진출 전략 구체화가 필요함.
                </div>
              </div>
            </Card>
          </div>

          {/* Evaluation Criteria Sections */}
          {evaluationCriteria && evaluationCriteria.length > 0 ? (
            evaluationCriteria.map((category) => (
              <div key={category.id} className="flex gap-2 flex-wrap mb-5">
                <Card className="flex-1 p-5 border-[#BAD1EC]">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => onToggleCategory(category.id)}
                  >
                    <h3 className="text-[#303030] font-semibold text-lg">
                      {category.카테고리}
                    </h3>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-5 h-5 text-[#878A8F]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#878A8F]" />
                    )}
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="flex flex-col gap-5 mt-5 pt-5 border-t border-[#D9D9D9]">
                      {category.평가항목.map((item) => (
                        <div key={item.id} className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div className="text-[#2B2B2B] font-semibold text-xs opacity-80">
                              {item.내용}
                            </div>
                            <div className="text-[#2B2B2B] text-xs opacity-80">
                              80/100
                            </div>
                          </div>
                          <ProgressBar value={80} className="w-full" />
                          <div className="text-[#6B6B6B] text-xs leading-4 opacity-80 whitespace-pre-line">
                            평가 결과가 여기에 표시됩니다.
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <>
              {/* Technology Section (기본값) */}
              <div className="flex pb-5 gap-2 flex-wrap mb-5">
                <Card className="flex-1 p-5 border-[#BAD1EC]">
                  <div className="flex justify-between items-center mb-5 border-b border-[#D9D9D9] pb-5">
                    <h3 className="text-[#303030] font-semibold text-lg">
                      기술성
                    </h3>
                    <ChevronDown className="w-5 h-5 text-[#878A8F]" />
                  </div>

                  <div className="flex flex-col gap-5">
                    {[
                      {
                        title: "핵심 기술의 독창성 및 차별성",
                        score: 80,
                        description:
                          "기존 리테일 예측 모델 대비 정밀도가 높으며,\n데이터 처리 알고리즘의 차별성이 명확함",
                      },
                      {
                        title: "기술 성숙도(TRL) 및 적용 가능성",
                        score: 80,
                        description: "TRL 6~7 수준으로 상용화 단계 진입 가능.",
                      },
                      {
                        title: "AI 모델/알고리즘의 정확도·성능·신뢰성",
                        score: 80,
                        description: "데이터셋 확장 시 안정성 추가 검증 필요.",
                      },
                      {
                        title: "데이터 확보 수준 및 품질 관리 체계",
                        score: 80,
                        description:
                          "리테일 POS/CRM 데이터 연동 우수, 외부데이터 보강 필요",
                      },
                      {
                        title: "시스템 아키텍처의 안정성 및 확장성",
                        score: 80,
                        description:
                          "클라우드 기반 확장성 확보, 보안 강화 필요",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="text-[#2B2B2B] font-semibold text-xs opacity-80">
                            {item.title}
                          </div>
                          <div className="text-[#2B2B2B] text-xs opacity-80">
                            {item.score}/100
                          </div>
                        </div>
                        <ProgressBar value={item.score} className="w-full" />
                        <div className="text-[#6B6B6B] text-xs leading-4 opacity-80 whitespace-pre-line">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Business Section (기본값) */}
              <div className="flex pb-5 gap-2 flex-wrap mb-5">
                <Card className="flex-1 p-5 border-[#BAD1EC]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[#303030] font-semibold text-lg">
                      사업성
                    </h3>
                    <ChevronRight className="w-5 h-5 text-[#878A8F]" />
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            className="w-full gap-3 border-[#D9D9D9] h-12"
          >
            <RotateCcw className="w-4 h-4 text-[#6C6C6C]" />
            <span className="text-[#757575] font-semibold text-base">
              새로고침
            </span>
          </Button>
        </>
      )}
    </div>
  );
}
