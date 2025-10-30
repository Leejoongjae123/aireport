"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { useSearchParams } from "next/navigation";
import AgentChat from "../components/AgentChat";
import { DiagnosisTab } from "./components/DiagnosisTab";
import { TableOfContents } from "./components/TableOfContents";
import { TextEditor } from "./components/TextEditor";
import { useReportStore } from "../components/store/ReportStore";
import { useEditorStore } from "./store/EditorStore";
import {
  EvaluationCriteriaData,
  ProcedureModifyData,
} from "../procedure/types";
import { Button } from "@/components/ui/Button";
import { useLoadingOverlay } from "@/components/hooks/UseLoadingOverlay";
import { DiagnosisResult } from "./components/types";
import { IncompleteModal } from "./components/IncompleteModal";

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

interface GeneratedReportSection {
  query: string;
  content: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
  is_completed?: boolean;
  character_count?: number;
}

function ReportEditorContent() {
  const searchParams = useSearchParams();
  const { reportId, setReportId, setReportType } = useReportStore();
  const { editorContent, setEditorContent, setSelectedSubsectionId, updateCachedSectionsWithMatching, getCachedSection, resetEditorState } = useEditorStore();

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
  const [generatedReport, setGeneratedReport] = useState<
    GeneratedReportSection[] | null
  >(null);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [requestBody, setRequestBody] = useState<any>(null); // requestBody 상태 추가

  const loadingOverlay = useLoadingOverlay({ isLoading: isDiagnosing });

  // 페이지 최초 마운트 시 editor 상태 초기화
  useEffect(() => {
    resetEditorState();
    setGeneratedReport(null);
    setSelectedItemId(null);
    setProcedureModify(null);
    setDiagnosisResult(null);
    setDiagnosisError(null);
    setActiveTab("chat");
    setRequestBody(null); // requestBody 초기화 추가
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // URL에서 reportId와 reportType 가져와서 store에 저장
  useEffect(() => {
    const urlReportId = searchParams.get("reportId");
    const urlReportType = searchParams.get("reportType");

    if (urlReportId && urlReportId !== reportId) {
      setReportId(urlReportId);
    }
    if (urlReportType) {
      setReportType(urlReportType);
    }
  }, [searchParams, setReportId, setReportType, reportId]);

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
          }

          // procedure_modify 데이터 설정
          if (result.data.procedure_modify) {
            setProcedureModify(result.data.procedure_modify);

            // 첫 번째 활성화된 subsection을 자동 선택
            for (const section of result.data.procedure_modify.sections) {
              if (section.enabled && section.subsections) {
                const firstEnabledSubsection = section.subsections.find(
                  (sub: { enabled: boolean }) => sub.enabled
                );
                if (firstEnabledSubsection) {
                  setSelectedItemId(firstEnabledSubsection.id);
                  break;
                }
              }
            }
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

  // 저장된 진단 결과 불러오기
  useEffect(() => {
    if (!reportId) {
      return;
    }

    const fetchDiagnosisResult = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}/diagnosis`);
        const result = await response.json();

        if (result.success && result.data) {
          setDiagnosisResult(result.data);
        }
      } catch {
        // 에러 처리 (저장된 진단 결과가 없는 경우는 정상)
      }
    };

    fetchDiagnosisResult();
  }, [reportId]);

  // generated_report 데이터 불러오기 (5초마다 polling)
  useEffect(() => {
    if (!reportId) {
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const fetchGeneratedReport = async () => {
      try {
        // 새로운 sections API 사용
        const response = await fetch(
          `/api/reports/${reportId}/sections`
        );
        const result = await response.json();

        if (result.success && result.data) {
          const newData = result.data as GeneratedReportSection[];
          
          // 캐시에 새 데이터 업데이트 (부분 매칭 포함)
          updateCachedSectionsWithMatching(newData, procedureModify);
          
          // 항상 최신 데이터로 업데이트 (API 응답이 전체 데이터를 포함하므로)
          setGeneratedReport(newData);

          // procedureModify가 있을 때만 완료 여부 체크
          if (procedureModify) {
            // enabled된 subsection 개수 계산
            let totalEnabledSubsections = 0;
            for (const section of procedureModify.sections) {
              if (section.enabled && section.subsections) {
                totalEnabledSubsections += section.subsections.filter(
                  (sub) => sub.enabled
                ).length;
              }
            }

            // 생성된 리포트 개수와 비교
            const generatedCount = newData.length;

            // 모든 목차가 생성되었으면 polling 중단
            if (generatedCount >= totalEnabledSubsections && intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }
      } catch {
        // 에러 처리
      }
    };

    // 최초 실행
    fetchGeneratedReport();

    // 5초마다 polling
    intervalId = setInterval(() => {
      fetchGeneratedReport();
    }, 10000);

    // cleanup: 컴포넌트 언마운트 또는 reportId 변경 시 interval 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [reportId, procedureModify, updateCachedSectionsWithMatching]);

  // 선택된 목차에 맞는 content 찾기
  useEffect(() => {
    if (!selectedItemId) {
      setEditorContent("");
      return;
    }

    // 먼저 캐시에서 직접 찾기 (subsection_id로)
    const cachedSection = getCachedSection(selectedItemId);
    
    if (cachedSection && cachedSection.content) {
      // 캐시에 있으면 바로 사용
      setEditorContent(cachedSection.content);
      return;
    }

    // 캐시에 없으면 generatedReport에서 찾기 (fallback)
    if (!generatedReport) {
      setEditorContent("");
      return;
    }

    // procedureModify에서 선택된 subsection의 name 찾기
    let selectedSubsectionName = "";
    if (procedureModify) {
      for (const section of procedureModify.sections) {
        if (!section.enabled) continue;
        const foundSubsection = section.subsections?.find(
          (sub) => sub.enabled && sub.id === selectedItemId
        );
        if (foundSubsection) {
          selectedSubsectionName = foundSubsection.name;
          break;
        }
      }
    }

    // 숫자 부분 제거 함수
    const removeNumbering = (text: string): string => {
      return text.replace(/^\d+(\.\d+)?\s*/, "").trim();
    };

    const cleanedSubsectionName = removeNumbering(selectedSubsectionName);

    // 1차: subsection_id로 직접 매칭 시도
    let matchingSection = generatedReport.find((section) => {
      return section.subsection_id === selectedItemId;
    });

    // 2차: subsection_id 매칭 실패 시, subsection_name으로 부분 매칭
    if (!matchingSection && cleanedSubsectionName) {
      matchingSection = generatedReport.find((section) => {
        const cleanedApiSubsectionName = removeNumbering(section.subsection_name || "");
        const cleanedApiQuery = removeNumbering(section.query || "");
        
        // subsection_name 또는 query에 목차명이 포함되어 있는지 확인
        return (
          cleanedApiSubsectionName.includes(cleanedSubsectionName) ||
          cleanedSubsectionName.includes(cleanedApiSubsectionName) ||
          cleanedApiQuery.includes(cleanedSubsectionName) ||
          cleanedSubsectionName.includes(cleanedApiQuery)
        );
      });
    }

    if (matchingSection && matchingSection.content) {
      // content를 그대로 사용 (이미 HTML 형식)
      const newContent = matchingSection.content;
      setEditorContent(newContent); // 스토어 업데이트
    } else {
      setEditorContent(""); // 스토어 업데이트
    }
  }, [selectedItemId, procedureModify, generatedReport, setEditorContent, getCachedSection]);

  // 목차 선택 핸들러
  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    setSelectedSubsectionId(id); // store에도 저장
  };

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

  const handleDiagnosis = async () => {
    if (!reportId) {
      setDiagnosisError("리포트 정보가 없습니다.");
      return;
    }

    // 목차 완성 여부 확인
    if (procedureModify && generatedReport) {
      // enabled된 subsection 개수 계산
      let totalEnabledSubsections = 0;
      for (const section of procedureModify.sections) {
        if (section.enabled && section.subsections) {
          totalEnabledSubsections += section.subsections.filter(
            (sub) => sub.enabled
          ).length;
        }
      }

      // 완성된 섹션 개수 계산 (is_completed && content가 있는 것만)
      const completedCount = generatedReport.filter(
        (section) => section.is_completed && section.content && section.content.trim()
      ).length;

      // 모든 목차가 완성되지 않았으면 모달 띄우기
      if (completedCount < totalEnabledSubsections) {
        setShowIncompleteModal(true);
        return;
      }
    }

    setActiveTab("diagnosis");
    setIsDiagnosing(true);
    setDiagnosisError(null);

    try {
      const response = await fetch(`/api/reports/${reportId}/diagnosis`, {
        method: "POST",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        const message = result?.message ?? "AI 진단 요청에 실패했습니다.";
        setDiagnosisError(message);
        setDiagnosisResult(null);
        return;
      }

      setDiagnosisResult(result.data ?? null);
      setRequestBody(result.requestBody ?? null); // requestBody 저장
    } catch {
      setDiagnosisError("AI 진단 요청 중 오류가 발생했습니다.");
      setDiagnosisResult(null);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="flex items-stretch gap-3 w-full max-w-[1200px] mx-auto h-[calc(100vh-220px)] pb-6">
      {/* Left Sidebar - Table of Contents */}
      <TableOfContents
        procedureModify={procedureModify}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        generatedReport={generatedReport}
      />

      {/* Main Content Area */}
      <div className="h-full w-[611px]">
        <Card className="border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full flex flex-col">
          <TextEditor
            key={selectedItemId || "default"}
            content={editorContent}
            onUpdate={(newContent) => {
              setEditorContent(newContent);
            }}
          />
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

          <div className="flex-1 overflow-y-auto px-6 px-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {activeTab === "chat" ? (
              <AgentChat />
            ) : (
              <div className="flex flex-col gap-2 justify-center">
                <Button
                  onClick={handleDiagnosis}
                  disabled={isDiagnosing}
                  className="mx-auto w-full h-12 rounded-full bg-white border border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white"
                >
                  진단하기
                </Button>
                <div className="relative">
                  <DiagnosisTab
                    evaluationCriteria={evaluationCriteria}
                    diagnosisResult={diagnosisResult}
                    expandedCategories={expandedCategories}
                    onToggleCategory={handleToggleCategory}
                    isLoading={isLoading}
                    isDiagnosing={isDiagnosing}
                    errorMessage={diagnosisError}
                    requestBody={requestBody}
                  />
                  {loadingOverlay}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 보고서 미완성 모달 */}
      <IncompleteModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
      />
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
