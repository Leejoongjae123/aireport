"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/hooks/UseToast";
import { ToastContainer } from "@/components/ToastContainer";
import { Skeleton } from "@/components/ui/Skeleton";

interface ExpertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertRequestId: string;
}

interface ExpertRequest {
  id: string;
  report_uuid: string;
  status: string;
  created_at: string;
  selected_expert_id: string | null;
  candidate_expert_ids: string[] | null;
  report_create?: {
    title: string;
    uuid: string;
  };
}

interface ExpertInfo {
  id: string;
  name: string;
  career: Record<string, unknown> | null;
  field: Record<string, unknown> | null;
}

export function ExpertDetailModal({
  isOpen,
  onClose,
  expertRequestId,
}: ExpertDetailModalProps) {
  const [expertRequestData, setExpertRequestData] = useState<ExpertRequest | null>(null);
  const [selectedExpertInfo, setSelectedExpertInfo] = useState<ExpertInfo | null>(null);
  const [candidateExperts, setCandidateExperts] = useState<ExpertInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, showError } = useToast();

  const fetchExpertRequestDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/expert-requests/${expertRequestId}`);
      
      if (!response.ok) {
        showError("전문가 평가 요청 정보를 불러올 수 없습니다.");
        return;
      }

      const data = await response.json();
      setExpertRequestData(data.expertRequest);
      setSelectedExpertInfo(data.selectedExpertInfo);
      setCandidateExperts(data.candidateExperts);
    } catch {
      showError("전문가 평가 요청 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && expertRequestId) {
      fetchExpertRequestDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, expertRequestId]);

  const getReportTitle = () => {
    if (!expertRequestData?.report_create) return "-";
    if (Array.isArray(expertRequestData.report_create)) {
      return expertRequestData.report_create[0]?.title || "-";
    }
    return expertRequestData.report_create.title || "-";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "대기중",
      evaluating: "평가중",
      consulting_requested: "컨설팅 요청됨",
      completed: "완료",
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        className="border-none"
        width="500px"
        padding="40px"
        showCloseButton={false}
      >
        <div className="flex w-[420px] flex-col items-center relative">
          {isLoading ? (
            <div className="flex flex-col items-start gap-11 self-stretch relative w-full">
              {/* Header Skeleton */}
              <div className="flex justify-between items-start self-stretch relative">
                <div className="flex flex-col justify-center items-start gap-4 flex-1 relative ">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-[20px] w-2/3" />
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-1/2" />
                </div>
              </div>
            </div>
          ) : expertRequestData ? (
            <div className="flex flex-col items-start gap-11 self-stretch relative">
              {/* Header */}
              <div className="flex justify-between items-start self-stretch relative">
                <div className="flex flex-col justify-center items-start gap-2 flex-1 relative">
                  <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                    전문가 평가 요청 상세
                  </div>
                  <div className="self-stretch text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-medium leading-[20px]">
                    회원이 요청한 전문가 평가 내용을 확인할 수 있습니다.
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
                </button>
              </div>

              <div className="flex flex-col items-start self-stretch relative">
                {/* Report Info Section */}
                <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
                  <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                    보고서 정보
                  </div>
                  <div className="flex flex-col items-start self-stretch relative">
                    <div className="flex py-2 justify-between items-start self-stretch relative">
                      <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        보고서
                      </div>
                      {expertRequestData.report_uuid ? (
                        <button
                          onClick={() => window.open(`/preview/${expertRequestData.report_uuid}`, '_blank')}
                          className="text-[#0077FF] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80 hover:underline cursor-pointer"
                        >
                          {getReportTitle()}
                        </button>
                      ) : (
                        <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                          {getReportTitle()}
                        </div>
                      )}
                    </div>
                    <div className="flex py-2 justify-between items-start self-stretch relative">
                      <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        요청일시
                      </div>
                      <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                        {new Date(expertRequestData.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <div className="flex py-2 justify-between items-start self-stretch relative">
                      <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        상태
                      </div>
                      <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                        {getStatusText(expertRequestData.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Expert Section */}
                {selectedExpertInfo && (
                  <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
                    <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                      선정된 전문가
                    </div>
                    <div className="flex flex-col items-start self-stretch relative">
                      <div className="flex py-2 justify-between items-start self-stretch relative">
                        <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                          이름
                        </div>
                        <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                          {selectedExpertInfo.name}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Candidate Experts Section */}
                
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px]">
              <span className="text-base text-[#6A6A6A]">
                데이터를 불러올 수 없습니다.
              </span>
            </div>
          )}

          {/* Bottom Button */}
          <div className="flex items-start gap-3 self-stretch relative mt-4">
            <button
              onClick={onClose}
              className="flex h-[62px] w-full justify-center items-center gap-2 rounded-[10px] bg-[#07F] text-white transition-colors hover:bg-[#0066CC]"
            >
              <div className="font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
                닫기
              </div>
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
