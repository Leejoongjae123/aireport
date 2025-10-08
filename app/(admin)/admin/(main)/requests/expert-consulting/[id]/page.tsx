"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, BarChart3, Menu } from "lucide-react";

const ExpertConsultingDetailPage = () => {
  const router = useRouter();

  // Mock data - in real implementation, this would be fetched based on params.id
  const consultingData = {
    requestId: "CR-2025-0915-014",
    requesterName: "김이수",
    requesterId: "hong***@gmail.com",
    requestDate: "2023-11-15 12:22:23",
    status: "waiting" as const,
    reportName: "AI 기반 리테일 수요예측 솔루션 사업계획서",
    evaluationName: "홍길동 평가서 (2025-09-11)",
    expertName: "김철수 박사",
    expertField: "헬스케어/AI · 15년",
    requestSubject: "IR 자료 보강을 위한 컨설팅 요청",
    requestDetails: `평가서에서 지적된 시장분석 보완 및 근거 자료 보강
경쟁사 대비 차별화 포인트 정�� 및 메세지 구체화
투자자 피칭용 자료 재구성 가이드 요청`,
    attachmentFile: "market_kpi.xlsx",
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "waiting") {
      return (
        <div className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full bg-[#fff1c2]">
          <span className="text-xs font-medium text-[#975102]">대기</span>
        </div>
      );
    }
    return null;
  };

  const TableRow = ({
    label,
    value,
    action,
    isFirstRow = false,
  }: {
    label: string;
    value: string | React.ReactNode;
    action?: React.ReactNode;
    isFirstRow?: boolean;
  }) => (
    <div
      className={`flex items-stretch ${
        isFirstRow ? "h-[72px]" : "min-h-[72px]"
      } border-b border-[#f5f5f5]`}
    >
      <div className="flex items-center w-[160px] bg-[#f5f5f5] label-name px-6">
        <span className="text-base font-normal text-[#555555] leading-6 tracking-[-0.32px]">
          {label}
        </span>
      </div>
      <div className="flex items-center flex-1 px-6 py-6 gap-6">
        <div className="text-base font-normal text-[#303030] leading-6 tracking-[-0.32px] flex-1">
          {value}
        </div>
        {action && action}
      </div>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-[#2A2A2A] leading-6">
        {title}
      </h2>
    </div>
  );

  const TableContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-[#f5f5f5] bg-white">{children}</div>
  );

  return (
    <div className="flex flex-col gap-20 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Header */}
      <div className="flex flex-col gap-10">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-black leading-8">
            전문가 컨설팅 요청
          </h1>
        </div>

        {/* Basic Request Information Table */}
        <TableContainer>
          <TableRow
            label="요청ID"
            value={consultingData.requestId}
            isFirstRow={true}
          />
          <div className="flex">
            <div className="flex-1 border-r border-[#f5f5f5] ">
              <TableRow label="요청자" value={consultingData.requesterName} />
            </div>
            <div className="flex-1">
              <TableRow label="요청자 ID" value={consultingData.requesterId} />
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 border-r border-[#f5f5f5] items-stretch h-full">
              <TableRow label="요청일시" value={consultingData.requestDate} />
            </div>
            <div className="flex-1">
              <TableRow
                label="상태"
                value={<StatusBadge status={consultingData.status} />}
              />
            </div>
          </div>
        </TableContainer>
      </div>

      {/* Request Basic Information */}
      <div className="flex flex-col gap-4">
        <SectionHeader title="요청 기본 정보" />
        <TableContainer>
          <TableRow
            label="보고서"
            value={consultingData.reportName}
            action={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 px-2.5 py-1.5 h-7 border border-[#d9d9d9] bg-white text-[#5a5a5a] text-xs font-medium rounded"
              >
                <FileText className="w-4 h-4" />
                보고서 열람
              </Button>
            }
          />
          <TableRow
            label="평가서"
            value={consultingData.evaluationName}
            action={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 px-2.5 py-1.5 h-7 border border-[#d9d9d9] bg-white text-[#5a5a5a] text-xs font-medium rounded"
              >
                <BarChart3 className="w-4 h-4" />
                평가서 열람
              </Button>
            }
          />
          <TableRow
            label="전문가"
            value={`${consultingData.expertName}  (${consultingData.expertField})`}
          />
        </TableContainer>
      </div>

      {/* Request Content */}
      <div className="flex flex-col gap-4">
        <SectionHeader title="요청 내용" />
        <TableContainer>
          <TableRow label="요청 주제" value={consultingData.requestSubject} />
          <TableRow
            label="상세 요구사항"
            value={
              <div className="whitespace-pre-line">
                {consultingData.requestDetails}
              </div>
            }
          />
          <TableRow
            label="참고 첨부자료"
            value={
              <span className="text-[#07F] underline cursor-pointer">
                {consultingData.attachmentFile}
              </span>
            }
          />
        </TableContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/requests/expert-consulting")}
          className="flex items-center gap-1.5 px-3 py-2.5 border border-[#a0a0a0] bg-white text-[#555555] text-sm font-semibold rounded"
        >
          <Menu className="w-4 h-4" />
          목록으로
        </Button>
      </div>

      {/* Floating Numbers */}
    </div>
  );
};

export default ExpertConsultingDetailPage;
