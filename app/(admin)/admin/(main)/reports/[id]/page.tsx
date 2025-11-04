"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { TableOfContents } from "./components/TableOfContents";
import { TextEditor } from "./components/TextEditor";
import { useParams } from "next/navigation";
import { useLoader } from "@/components/hooks/UseLoader";
import { useWordDownload } from "@/components/hooks/UseWordDownload";
import { useCustomToast } from "@/components/hooks/UseCustomToast";

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

interface ProcedureModifySection {
  id: string;
  name: string;
  enabled: boolean;
  subsections?: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
}

interface ProcedureModifyData {
  sections: ProcedureModifySection[];
}

interface ReportData {
  uuid: string;
  title: string | null;
  business_field: string | null;
  email: string | null;
  created_at: string;
  user_name: string | null;
}

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [procedureModify, setProcedureModify] =
    useState<ProcedureModifyData | null>(null);
  const [generatedReport, setGeneratedReport] = useState<
    GeneratedReportSection[] | null
  >(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showSuccess, showError } = useCustomToast();
  const { downloadWord, isDownloading } = useWordDownload({
    onSuccess: () => showSuccess("보고서 다운로드가 완료되었습니다."),
    onError: (error) => showError(error),
  });

  // 보고서 기본 정보 가져오기
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/admin/reports/${reportId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setReportData(result.data);
          }
        }
      } catch {
        // 에러 처리
      }
    };

    if (reportId) {
      fetchReportData();
    }
  }, [reportId]);

  // procedure_modify 데이터 가져오기
  useEffect(() => {
    const fetchProcedureData = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}/procedure`);
        const result = await response.json();

        if (result.success && result.data) {
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

    if (reportId) {
      fetchProcedureData();
    }
  }, [reportId]);

  // generated_report 데이터 가져오기
  useEffect(() => {
    const fetchGeneratedReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}/sections`);
        const result = await response.json();

        if (result.success && result.data) {
          setGeneratedReport(result.data);
        }
      } catch {
        // 에러 처리
      }
    };

    if (reportId) {
      fetchGeneratedReport();
    }
  }, [reportId]);

  // 선택된 목차에 맞는 content 찾기
  useEffect(() => {
    if (!selectedItemId || !generatedReport) {
      setEditorContent("");
      return;
    }

    const removeNumbering = (text: string): string => {
      return text.replace(/^\d+(\.\d+)?\s*/, "").trim();
    };

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

    const cleanedSubsectionName = removeNumbering(selectedSubsectionName);

    let matchingSection = generatedReport.find((section) => {
      return section.subsection_id === selectedItemId;
    });

    if (!matchingSection && cleanedSubsectionName) {
      matchingSection = generatedReport.find((section) => {
        const cleanedApiSubsectionName = removeNumbering(
          section.subsection_name || ""
        );
        const cleanedApiQuery = removeNumbering(section.query || "");

        return (
          cleanedApiSubsectionName.includes(cleanedSubsectionName) ||
          cleanedSubsectionName.includes(cleanedApiSubsectionName) ||
          cleanedApiQuery.includes(cleanedSubsectionName) ||
          cleanedSubsectionName.includes(cleanedApiQuery)
        );
      });
    }

    if (matchingSection && matchingSection.content) {
      setEditorContent(matchingSection.content);
    } else {
      setEditorContent("");
    }
  }, [selectedItemId, procedureModify, generatedReport]);

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
  };

  const handleDownloadReport = async () => {
    if (!generatedReport || generatedReport.length === 0) {
      alert("다운로드할 보고서 내용이 없습니다.");
      return;
    }

    await downloadWord(reportId);
  };

  const Loader = useLoader({ isLoading });

  return (
    <>
      {Loader}
      {!isLoading && (
    <div className="flex w-full p-8 mx-auto">
      <div className="flex w-full items-start gap-3 h-full min-h-screen">
        <div className="flex p-11 flex-col justify-center items-center gap-6 flex-1 rounded-[5px] bg-white">
          <div className="flex flex-col items-start gap-6 self-stretch">
            {/* Header */}
            <div className="flex justify-between items-center self-stretch">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => window.history.back()}
              >
                <Image
                  src="/images/back.svg"
                  alt="Arrow Left"
                  width={32}
                  height={32}
                />
                <span className="text-[#767676] font-pretendard text-base font-semibold leading-6">
                  뒤로가기
                </span>
              </div>
              <div className="flex items-start gap-4">
                <Button
                  variant="outline"
                  className="flex p-2 justify-center items-center gap-2 rounded border border-[#D9D9D9] bg-white"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  <Image
                    src="/images/word.svg"
                    alt="Word"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#5A5A5A] font-pretendard text-xs font-bold leading-4">
                    {isDownloading ? "다운로드 중..." : "보고서 다운로드"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col items-start gap-4 self-stretch">
              <h1 className="text-[#303030] font-pretendard text-2xl font-semibold leading-8">
                보고서 생성관리
              </h1>

              {/* Report Info Section */}
              <div className="flex p-8 items-end gap-8 self-stretch rounded bg-[#F5FAFF]">
                <div className="flex flex-col items-start flex-1 self-stretch">
                  {/* <div className="flex py-2 items-center self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      보고서 ID
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.uuid}
                    </div>
                  </div> */}
                  <div className="flex py-2 items-center self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      사용자
                    </div>
                    <div className="flex-1 text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.user_name || "-"} ({reportData?.email || "-"}
                      )
                    </div>
                  </div>
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      생성일시
                    </div>
                    <div className="flex-1 text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.created_at
                        ? new Date(reportData.created_at).toLocaleString(
                            "ko-KR"
                          )
                        : "-"}
                    </div>
                  </div>
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      제목
                    </div>
                    <div className="flex-1 text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.title || "-"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px self-stretch border-l border-[#D9D9D9]"></div>

                <div className="flex flex-col justify-end items-start flex-1 self-stretch">
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      분야
                    </div>
                    <div className="flex-1 text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.business_field || "-"}
                    </div>
                  </div>
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      제목
                    </div>
                    <div className="flex-1 text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      {reportData?.title || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area with TableOfContents and TextEditor */}
          <div className="flex items-stretch gap-3 w-full h-[calc(100vh-400px)]">
            {/* Table of Contents */}
            <TableOfContents
              procedureModify={procedureModify}
              selectedItemId={selectedItemId}
              onItemSelect={handleItemSelect}
              generatedReport={generatedReport}
            />

            {/* Text Editor */}
            <div className="h-full flex-1">
              <Card className="border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full flex flex-col">
                <TextEditor
                  key={selectedItemId || "default"}
                  content={editorContent}
                  onUpdate={(newContent) => {
                    setEditorContent(newContent);
                  }}
                  readOnly={true}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
