"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/hooks/UseToast";
import { ToastContainer } from "@/components/ToastContainer";
import { Skeleton } from "@/components/ui/Skeleton";

interface ConsultingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultingId: string;
}

interface ConsultingDetail {
  id: string;
  report_uuid: string;
  request_subject: string;
  detailed_requirements: string;
  attachment_urls: string[] | null;
  status: string;
  created_at: string;
  report_create?: {
    title: string;
    uuid: string;
  };
}

export function ConsultingDetailModal({
  isOpen,
  onClose,
  consultingId,
}: ConsultingDetailModalProps) {
  const [consultingData, setConsultingData] = useState<ConsultingDetail | null>(null);
  const [expertInfo, setExpertInfo] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, showError } = useToast();

  const fetchConsultingDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/consulting-requests/${consultingId}`);
      
      if (!response.ok) {
        showError("컨설팅 요청 정보를 불러올 수 없습니다.");
        return;
      }

      const data = await response.json();
      setConsultingData(data.consultingRequest);
      setExpertInfo(data.expertInfo);
    } catch {
      showError("컨설팅 요청 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && consultingId) {
      fetchConsultingDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, consultingId]);

  const getReportTitle = () => {
    if (!consultingData?.report_create) return "-";
    if (Array.isArray(consultingData.report_create)) {
      return consultingData.report_create[0]?.title || "-";
    }
    return consultingData.report_create.title || "-";
  };

  const getAttachmentFiles = () => {
    if (!consultingData?.attachment_urls) return [];
    return consultingData.attachment_urls;
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
          ) : consultingData ? (
            <div className="flex flex-col items-start gap-11 self-stretch relative">
              {/* Header */}
              <div className="flex justify-between items-start self-stretch relative">
                <div className="flex flex-col justify-center items-start gap-2 flex-1 relative">
                  <div className="text-black font-pretendard text-[24px] font-bold leading-normal">
                    컨설팅 요청 상세
                  </div>
                  <div className="self-stretch text-[rgba(90,90,90,1)] font-pretendard text-[14px] font-medium leading-[20px]">
                    회원이 요청한 컨설팅 내용을 확인할 수 있습니다.
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
                {/* Report/Expert Info Section */}
                <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
                  <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                    보고서 / 전문가 정보
                  </div>
                  <div className="flex flex-col items-start self-stretch relative">
                    <div className="flex py-2 justify-between items-start self-stretch relative">
                      <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        보고서
                      </div>
                      {consultingData.report_uuid ? (
                        <button
                          onClick={() => window.open(`/preview/${consultingData.report_uuid}`, '_blank')}
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
                    {expertInfo && (
                      <div className="flex py-2 justify-between items-start self-stretch relative">
                        <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                          전문가
                        </div>
                        <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                          {expertInfo.name} 
                        </div>
                      </div>
                    )}
                    <div className="flex py-2 justify-between items-start self-stretch relative">
                      <div className="text-[rgba(90,90,90,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        요청일시
                      </div>
                      <div className="text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                        {new Date(consultingData.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consulting Request Content */}
                <div className="flex pb-11 flex-col items-start gap-4 self-stretch relative">
                  <div className="self-stretch text-black font-pretendard text-[20px] font-bold leading-normal">
                    컨설팅 요청 내용
                  </div>
                  <div className="flex flex-col items-start gap-3 self-stretch relative">
                    {/* Request Subject */}
                    <div className="flex flex-col items-start gap-3 self-stretch relative">
                      <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        요청주제
                      </div>
                      <div className="flex py-4 px-[18px] items-center gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-[#F9F9F9] relative">
                        <div className="flex-1 text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px]">
                          {consultingData.request_subject}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Requirements */}
                    <div className="flex flex-col items-start gap-3 self-stretch relative">
                      <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                        상세 요구사항
                      </div>
                      <div className="flex py-4 px-[18px] items-start gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-[#F9F9F9] relative">
                        <div className="flex-1 text-[rgba(48,48,48,1)] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] whitespace-pre-wrap">
                          {consultingData.detailed_requirements}
                        </div>
                      </div>
                    </div>

                    {/* Attached Files */}
                    {getAttachmentFiles().length > 0 && (
                      <div className="flex flex-col items-start gap-3 self-stretch relative">
                        <div className="self-stretch text-[rgba(32,34,36,1)] font-pretendard text-[16px] font-bold leading-normal tracking-[-0.064px] opacity-80">
                          첨부파일
                        </div>
                        <div className="flex py-3 px-[18px] items-center gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-[#F9F9F9] relative">
                          <div className="flex flex-col gap-2 w-full">
                            {getAttachmentFiles().map((url, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#0077FF]" />
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[rgba(48,48,48,1)] font-pretendard text-[14px] font-normal leading-[20px] tracking-[-0.064px] hover:text-[#0077FF] hover:underline"
                                >
                                  첨부파일 {index + 1}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
