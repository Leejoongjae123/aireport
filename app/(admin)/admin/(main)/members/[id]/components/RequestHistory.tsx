"use client";

import { Button } from "@/components/ui/Button";
import { RequestRecord } from "../types";
import { useState } from "react";
import { ConsultingDetailModal } from "./ConsultingDetailModal";
import { ExpertDetailModal } from "./ExpertDetailModal";

interface RequestHistoryProps {
  requests: RequestRecord[];
}

export default function RequestHistory({ requests }: RequestHistoryProps) {
  const [selectedConsultingId, setSelectedConsultingId] = useState<string | null>(null);
  const [selectedExpertRequestId, setSelectedExpertRequestId] = useState<string | null>(null);
  const [isConsultingModalOpen, setIsConsultingModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  const handleDetailClick = (record: RequestRecord) => {
    if (record.type === "컨설팅 요청") {
      // originalId가 있으면 사용, 없으면 CON- 접두사 제거
      const consultingId = record.originalId || record.id.replace("CON-", "");
      setSelectedConsultingId(consultingId);
      setIsConsultingModalOpen(true);
    } else if (record.type === "전문가 평가") {
      // originalId가 있으면 사용, 없으면 EXP- 접두사 제거
      const expertRequestId = record.originalId || record.id.replace("EXP-", "");
      setSelectedExpertRequestId(expertRequestId);
      setIsExpertModalOpen(true);
    }
  };

  const handleCloseConsultingModal = () => {
    setIsConsultingModalOpen(false);
    setSelectedConsultingId(null);
  };

  const handleCloseExpertModal = () => {
    setIsExpertModalOpen(false);
    setSelectedExpertRequestId(null);
  };
  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold text-[#2A2A2A] font-['Pretendard']">
          요청 기록
        </h2>
      </div>

      {/* Request Records Table */}
      <div className="flex flex-col items-start w-full bg-white">
        {/* Table Header */}
        <div className="flex px-6 py-2.5 justify-between items-center w-full border-b border-[rgba(245,245,245,1)] bg-[rgba(245,245,245,1)]">
          <span className="w-6 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            NO
          </span>
          <span className="w-[116px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            구분
          </span>
          <span className="w-[140px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            ID
          </span>
          <div className="flex w-[200px] max-w-[200px] justify-center items-center gap-10">
            <span className="w-[200px] max-w-[200px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
              보고서명
            </span>
          </div>
          <span className="w-[100px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            요청일자
          </span>
          <span className="w-20 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            상태
          </span>
          <span className="w-[72px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
            상세
          </span>
        </div>

        {/* Table Rows */}
        {requests.length === 0 ? (
          <div className="flex w-full justify-center items-center py-10">
            <span className="text-base text-[#6A6A6A] font-['Pretendard']">
              요청 기록이 없습니다.
            </span>
          </div>
        ) : (
          requests.map((record) => (
            <div
              key={record.no}
              className="flex px-6 py-2.5 justify-between items-center w-full border-b border-[rgba(245,245,245,1)]"
            >
              <span className="w-6 text-base text-[rgba(48,48,48,1)] text-center font-['Pretendard'] tracking-[-0.32px]">
                {record.no}
              </span>
              <span className="w-[116px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                {record.type}
              </span>
              <span className="w-[140px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                {record.id}
              </span>
              <div className="flex w-[200px] max-w-[200px] justify-center items-center gap-10">
                {record.report_uuid ? (
                  <button
                    onClick={() => window.open(`/preview/${record.report_uuid}`, '_blank')}
                    className="w-[200px] max-w-[200px] max-h-6 text-sm font-medium text-[#0077FF] text-center font-['Pretendard'] hover:underline cursor-pointer"
                  >
                    {record.reportName}
                  </button>
                ) : (
                  <span className="w-[200px] max-w-[200px] max-h-6 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    {record.reportName}
                  </span>
                )}
              </div>
              <span className="w-[100px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                {record.requestDate}
              </span>
              <span className="w-20 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                {record.status}
              </span>
              <Button
                variant="outline"
                onClick={() => handleDetailClick(record)}
                className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#07F] bg-white text-sm font-semibold text-[#07F] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F8FBFF] hover:text-primary"
              >
                상세보기
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Consulting Detail Modal */}
      {selectedConsultingId && (
        <ConsultingDetailModal
          isOpen={isConsultingModalOpen}
          onClose={handleCloseConsultingModal}
          consultingId={selectedConsultingId}
        />
      )}

      {/* Expert Detail Modal */}
      {selectedExpertRequestId && (
        <ExpertDetailModal
          isOpen={isExpertModalOpen}
          onClose={handleCloseExpertModal}
          expertRequestId={selectedExpertRequestId}
        />
      )}
    </div>
  );
}
