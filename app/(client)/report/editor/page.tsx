"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  List,
  AlignLeft,
  Link,
  Image as ImageIcon,
  Edit,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import AgentChat from "../components/agent-chat";
import { DiagnosisTab } from "./components/diagnosis-tab";
import { TableOfContents } from "./components/table-of-contents";
import { useReportStore } from "../components/store/report-store";
import {
  EvaluationCriteriaData,
  ProcedureModifyData,
} from "../procedure/types";

// Custom Icons as SVG components
const AIIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9001 14.0311V11.0939M10.9001 14.0311C12.699 14.0311 14.5664 14.0311 16.2236 14.2459C16.9184 14.3326 17.566 14.6439 18.0677 15.1324C18.5694 15.6209 18.8978 16.2599 19.003 16.9522C19.1378 17.8734 19.1378 18.8082 19.1378 20.3991C19.1378 21.9922 19.1378 22.9271 19.0007 23.8459C18.8958 24.5376 18.568 25.1761 18.0672 25.6645C17.5664 26.1529 16.9199 26.4646 16.2258 26.5522C14.5687 26.7694 12.7013 26.7694 10.9024 26.7694C9.10585 26.7694 7.23842 26.7694 5.58128 26.5522C4.88641 26.4655 4.23887 26.1543 3.73716 25.6658C3.23545 25.1772 2.90703 24.5382 2.80185 23.8459C2.66699 22.9271 2.66699 21.9922 2.66699 20.3991C2.66699 18.8059 2.66699 17.8734 2.80185 16.9522C2.90703 16.2599 3.23545 15.6209 3.73716 15.1324C4.23887 14.6439 4.88641 14.3326 5.58128 14.2459C7.23842 14.0311 9.10356 14.0311 10.9001 14.0311ZM13.8647 20.8425V19.9556M7.92871 20.8425V19.9556M10.9001 11.0642C12.3081 11.0642 13.1013 10.2711 13.1013 8.86308C13.1013 7.45508 12.3081 6.6665 10.9001 6.6665C9.49214 6.6665 8.70128 7.45965 8.70128 8.86536C8.70128 10.2711 9.49442 11.0642 10.9001 11.0642Z"
      stroke="#1E1E1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.6667 9.33333C27.5787 10.2169 26.4 11.3956 25.3333 14.6667C24.2667 11.3956 23.088 10.2169 20 9.33333C23.088 8.44978 24.2667 7.27111 25.3333 4C26.4 7.27111 27.5787 8.44978 30.6667 9.33333Z"
      stroke="#1E1E1E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

function ReportEditorContent() {
  const searchParams = useSearchParams();
  const { reportId, setReportId, setReportType } = useReportStore();

  const [activeTab, setActiveTab] = useState<"chat" | "diagnosis">("chat");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [evaluationCriteria, setEvaluationCriteria] =
    useState<EvaluationCriteriaData | null>(null);
  const [procedureModify, setProcedureModify] =
    useState<ProcedureModifyData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  // URL에서 reportId와 reportType 가져와서 store에 저장
  useEffect(() => {
    const reportId = searchParams.get("reportId");
    const reportType = searchParams.get("reportType");

    if (reportId) {
      setReportId(reportId);
    }
    if (reportType) {
      setReportType(reportType);
    }
  }, [searchParams, setReportId, setReportType]);

  // 평가 기준 및 목차 데이터 불러오기
  useEffect(() => {
    // reportId가 없으면 fetch하지 않음
    if (!reportId) {
      return;
    }

    const fetchProcedureData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/reports/${reportId}/procedure`);
        const result = await response.json();

        if (result.success && result.data) {
          // 평가 기준 데이터 설정
          if (result.data.evaluation_criteria) {
            setEvaluationCriteria(result.data.evaluation_criteria);
            // 첫 번째 카테고리를 기본으로 펼침
            if (result.data.evaluation_criteria.length > 0) {
              setExpandedCategories(
                new Set([result.data.evaluation_criteria[0].id])
              );
            }
          }

          // procedure_modify 데이터 설정
          if (result.data.procedure_modify) {
            setProcedureModify(result.data.procedure_modify);
          }
        }
      } catch {
        // 에러 처리
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcedureData();
  }, [reportId]);

  // 카테고리 토글 핸들러
  const handleToggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex items-stretch gap-3 w-full max-w-[1200px] mx-auto h-[calc(100vh-210px)] pb-6">
      {/* Left Sidebar - Table of Contents */}
      <TableOfContents
        procedureModify={procedureModify}
        selectedItemId={selectedItemId}
        onItemSelect={setSelectedItemId}
      />

      {/* Main Content Area */}
      <div className="flex-1 h-full">
        <Card className="border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full flex flex-col">
          <div className="flex flex-col h-full">
            {/* Rich Text Editor Toolbar */}
            <div className="px-8 pt-5 flex-shrink-0">
              <div className="flex flex-col gap-2.5 border-b border-[#D9D9D9] pb-2">
                <div className="flex justify-center items-center gap-4 ">
                  {/* Text Style */}
                  <div className="flex items-center gap-4">
                    <div className="text-[#232325] text-base">Heading</div>
                    <ChevronDown className="w-4 h-4 text-[#232325]" />
                  </div>

                  <div className="w-px h-8 bg-[#E0E2E7]" />

                  {/* Format Options */}
                  <div className="flex justify-center items-center gap-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#232325] font-bold"
                    >
                      B
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#232325] italic"
                    >
                      I
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#232325] underline"
                    >
                      U
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#232325] line-through"
                    >
                      S
                    </Button>
                    <List className="w-5 h-5 text-[#232325]" />
                    <AlignLeft className="w-5 h-5 text-[#232325]" />
                  </div>

                  <div className="w-px h-8 bg-[#E0E2E7]" />

                  {/* Attachments */}
                  <div className="flex justify-center items-center gap-6">
                    <Link className="w-5 h-5 text-[#232325]" />
                    <ImageIcon className="w-5 h-5 text-[#232325]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto px-11 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <h1 className="text-[#303030] font-bold text-[32px] leading-[44px] tracking-[-0.64px]">
                      AI 기반 리테일 수요예측 솔루션 사업계획서
                    </h1>
                  </div>
                  <div className="text-black font-semibold text-base text-right">
                    2025년 9월 9일
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative">
                  {/* Highlighted section marker */}
                  <div className="w-[229px] h-[21px] bg-[#AAD2FF] rounded-sm absolute left-[89px] top-[74px]" />

                  <h2 className="text-black font-semibold text-xl">
                    1. 사업 개요
                  </h2>
                  <h3 className="text-black font-semibold text-base">
                    1.1 추진 배경 및 필요성
                  </h3>

                  <div className="text-[#343330] text-base leading-6">
                    리테일 산업은 디지털 전환과 함께 데이터 기반 경영이 필수
                    요소로 자리잡고 있습니다. 온라인·오프라인 채널의 융합,
                    소비자 구매 패턴의 다변화, 경기 변동성 확대 등으로 인해 재고
                    관리, 공급망 최적화, 판촉 전략 수립의 복잡성이 과거보다 크게
                    증가하였습니다.
                    <br />
                    <br />
                    특히,
                    <br />
                    • 수요 예측의 불확실성으로 인한 과잉 재고 및 품절 리스크
                    발생
                    <br />
                    • 단기 프로모션 및 마케팅 효과 측정의 어려움
                    <br />
                    • 소비자 데이터 활용의 한계로 맞춤형 전략 수립이 미흡
                    <br />
                    이라는 문제점들이 리테일 기업의 수익성 및 경쟁력 약화로
                    이어지고 있습니다.
                    <br />
                    <br />
                    이러한 환경 속에서, AI 기반 수요예측 솔루션은 대규모 거래
                    데이터와 외부 요인(계절성, 지역별 트렌드, 거시경제 지표
                    등)을 결합하여 정교한 수요 예측 모델을 제공함으로써, 리테일
                    기업이 직면한 문제를 근본적으로 해결할 수 있습니다.
                    <br />
                    <br />
                    이를 통해 기업은:
                    <br />
                    • 재고 관리 최적화 – 과잉재고 및 품절을 최소화하여 비용 절감
                    및 매출 기회 극대화
                    <br />
                    • 공급망 효율화 – 유통 단계별 수요 변동을 사전에 예측하여
                    운영 효율성 제고
                    <br />
                    • 맞춤형 마케팅 강화 – 고객 세그먼트별 구매 패턴 분석을
                    기반으로 한 타겟 마케팅 전략 수립
                    <br />
                    • 경쟁력 확보 – 급변하는 리테일 시장에서 차별화된 데이터
                    기반 의사결정 역량 확보
                    <br />
                    <br />
                    따라서, 본 사업은 리테일 산업의 디지털 경쟁력 강화와 지속
                    가능한 성장 기반 마련을 위해 추진이 필요하며, 향후 관련 산업
                    전반에 걸쳐 확장성과 파급 효과가 기대됩니다.
                  </div>

                  <Button
                    variant="outline"
                    className="w-fit self-end mt-9 gap-1 h-9 px-3.5 border-[#D9D9D9]"
                  >
                    <Edit className="w-6 h-6 text-[#5A5A5A]" />
                    <span className="text-[#5A5A5A] font-semibold text-sm">
                      수정 요청하기
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Scrollbar */}

      {/* Right Sidebar - AI Agent */}
      <Card className="w-[322px] flex-shrink-0 border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full flex flex-col">
        <div className="flex flex-col h-full">
          {/* Agent Header */}
          <div className="flex flex-col gap-3 p-6 flex-shrink-0">
            <div className="flex items-center gap-1">
              <AIIcon />
              <h2 className="text-[#303030] font-semibold text-xl leading-8 tracking-[-0.4px]">
                에이전트
              </h2>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-between items-center p-1.5 rounded-full border border-[#EEF1F7] bg-[#EFF2F7]">
              <button
                className={`flex-1 py-2 px-2.5 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === "chat"
                    ? "text-white bg-[#0077FF]"
                    : "text-[#0077FF] bg-transparent"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                대화
              </button>
              <button
                className={`flex-1 py-2 px-2.5 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === "diagnosis"
                    ? "text-white bg-[#0077FF]"
                    : "text-[#0077FF] bg-transparent"
                }`}
                onClick={() => setActiveTab("diagnosis")}
              >
                AI 진단
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {activeTab === "chat" ? (
              <AgentChat />
            ) : (
              <DiagnosisTab
                evaluationCriteria={evaluationCriteria}
                expandedCategories={expandedCategories}
                onToggleCategory={handleToggleCategory}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ReportEditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportEditorContent />
    </Suspense>
  );
}
