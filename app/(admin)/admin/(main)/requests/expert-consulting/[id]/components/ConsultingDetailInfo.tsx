"use client";

import { Button } from "@/components/ui/Button";
import { FileText, BarChart3 } from "lucide-react";
import { ReportPreviewModal } from "@/app/(client)/review/components/ReportPreviewModal";
import { ReviewResultModal } from "@/app/(client)/review/components/ReviewResult";
import { ConsultingRequestDetail, ExpertInfo, ReviewInfo } from "../types";

interface ConsultingDetailInfoProps {
  consultingRequest: ConsultingRequestDetail;
  expertInfo: ExpertInfo | null;
  reviewInfo: ReviewInfo | null;
}

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

export const ConsultingDetailInfo = ({
  consultingRequest,
  expertInfo,
  reviewInfo,
}: ConsultingDetailInfoProps) => {
  const formatExpertField = () => {
    if (!expertInfo?.field || expertInfo.field.length === 0) return "-";
    return expertInfo.field.join(", ");
  };

  const formatExpertCareer = () => {
    if (!expertInfo?.career || expertInfo.career.length === 0) return "";
    // 경력 년수는 career 배열의 길이로 추정
    return `${expertInfo.career.length}년`;
  };

  return (
    <>
      {/* Request Basic Information */}
      <div className="flex flex-col gap-4">
        <SectionHeader title="요청 기본 정보" />
        <TableContainer>
          <TableRow
            label="보고서"
            value={consultingRequest.report_create?.title || "-"}
            action={
              <ReportPreviewModal
                reportUuid={consultingRequest.report_uuid}
                reportTitle={consultingRequest.report_create?.title || ""}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2.5 py-1.5 h-7 border border-[#d9d9d9] bg-white text-[#5a5a5a] text-xs font-medium rounded cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  보고서 열람
                </Button>
              </ReportPreviewModal>
            }
          />
          <TableRow
            label="평가서"
            value={
              reviewInfo
                ? `${expertInfo?.name || "전문가"} 평가서 (${new Date(
                    reviewInfo.created_at
                  ).toLocaleDateString("ko-KR")})`
                : "-"
            }
            action={
              reviewInfo && (
                <ReviewResultModal reportUuid={consultingRequest.report_uuid}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 px-2.5 py-1.5 h-7 border border-[#d9d9d9] bg-white text-[#5a5a5a] text-xs font-medium rounded cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4" />
                    평가서 열람
                  </Button>
                </ReviewResultModal>
              )
            }
          />
          <TableRow
            label="전문가"
            value={
              expertInfo
                ? `${expertInfo.name} (${formatExpertField()} · ${formatExpertCareer()})`
                : "-"
            }
          />
        </TableContainer>
      </div>

      {/* Request Content */}
      <div className="flex flex-col gap-4">
        <SectionHeader title="요청 내용" />
        <TableContainer>
          <TableRow
            label="요청 주제"
            value={consultingRequest.request_subject || "-"}
          />
          <TableRow
            label="상세 요구사항"
            value={
              <div className="whitespace-pre-line">
                {consultingRequest.detailed_requirements || "-"}
              </div>
            }
          />
          <TableRow
            label="참고 첨부자료"
            value={
              consultingRequest.attachment_urls &&
              consultingRequest.attachment_urls.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {consultingRequest.attachment_urls.map((url, index) => {
                    const fileName = url.split("/").pop() || `첨부파일 ${index + 1}`;
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#07F] underline cursor-pointer hover:text-[#0056b3]"
                      >
                        {decodeURIComponent(fileName)}
                      </a>
                    );
                  })}
                </div>
              ) : (
                "-"
              )
            }
          />
        </TableContainer>
      </div>
    </>
  );
};
