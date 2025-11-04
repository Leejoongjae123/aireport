"use client";

import { useCallback, useEffect, useState } from "react";
import { ExpertRequest, ExpertRequestStatus } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Trash2, Pencil, FileText, BarChart3 } from "lucide-react";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { ExpertConsultationModal } from "./ExpertConsultationModal";
import { ReviewResultModal } from "./ReviewResult";
import { useRouter } from "next/navigation";

interface ExpertRequestsListProps {
  isOpen: boolean;
  statusFilter?: "all" | ExpertRequestStatus;
  keyword?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function ExpertRequestsList({ isOpen, statusFilter = "all", keyword, onLoadingChange }: ExpertRequestsListProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<ExpertRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchExpertRequests = useCallback(async () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    try {
      const base = new URL("/api/expert/requests", window.location.origin);
      if (statusFilter !== "all") {
        base.searchParams.set("status", statusFilter);
      }
      if (keyword) {
        base.searchParams.set("keyword", keyword);
      }
      console.log("API 호출 URL:", base.toString());
      const response = await fetch(base.toString(), {
        credentials: "include",
      });
      console.log("API 응답 상태:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API 응답 데이터:", data);
        setRequests(Array.isArray(data) ? data : []);
      } else {
        console.error("API 호출 실패:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("API 에러 내용:", errorText);
        setRequests([]);
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [statusFilter, keyword, onLoadingChange]);

  useEffect(() => {
    if (isOpen) {
      fetchExpertRequests();
    }
  }, [isOpen, fetchExpertRequests]);

  const handleDelete = async (requestId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setDeletingId(requestId);
    try {
      const response = await fetch(`/api/expert/requests/${requestId}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        // 삭제 성공 시 목록에서 제거
        setRequests((prev) => prev?.filter((req) => req.id !== requestId) || null);
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "평가요청",
          className:
            "bg-[#FFF1C2] text-[#BF6A02] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "evaluating":
        return {
          text: "평가중",
          className:
            "bg-[#E7E7FF] text-[#4F46E5] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "consulting_requested":
        return {
          text: "컨설팅요청",
          className:
            "bg-[#FFE8E0] text-[#C2410C] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "completed":
        return {
          text: "평가완료",
          className:
            "bg-[#C7EAFF] text-[#0077FF] px-3 py-2 rounded-full text-sm font-semibold",
        };
      default:
        return {
          text: status,
          className:
            "bg-[#F0F0F0] text-[#666666] px-3 py-2 rounded-full text-sm font-semibold",
        };
    }
  };

  if (isLoading) {
    return <div className="text-center py-8"></div>;
  }

  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="text-center py-8 text-[#999999]">
        평가요청 내역이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="border border-[#D9D9D9]">
        {/* Table Header */}
        <div className="flex h-[50px] bg-[#F5F5F5] border-b border-[#D9D9D9]">
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">제목</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">분야</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">상태</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">생성일</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">보고서</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">전문가 평가</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">평가서</span>
          </div>
          <div className="w-20 flex items-center justify-center px-[10px]">
            <span className="text-[#5A5A5A] text-xs font-semibold">더보기</span>
          </div>
        </div>

        {/* Table Rows */}
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex py-4 border-b border-[#D9D9D9] last:border-b-0"
          >
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <span className="text-[#444444] text-sm tracking-[-0.28px]">
                {request.report_create.title}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <span className="text-[#444444] text-sm tracking-[-0.28px]">
                {request.report_create.business_field}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <span className={getStatusConfig(request.status).className}>
                {getStatusConfig(request.status).text}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <span className="text-[#444444] text-sm tracking-[-0.28px]">
                {new Date(request.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <ReportPreviewModal 
                reportUuid={request.report_uuid}
                reportTitle={request.report_create.title}
              >
                <Button
                  variant="outline"
                  className="flex items-center gap-1 px-[10px] py-[6px] border border-[#D9D9D9] bg-white rounded text-xs text-[#5A5A5A] hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" strokeWidth={1.4} />
                  보고서 보기
                </Button>
              </ReportPreviewModal>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <span className="text-[#444444] text-sm tracking-[-0.28px]">
                {request.expert_informations?.name || '전문가 정보 없음'}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center px-[10px]">
              <ReviewResultModal reportUuid={request.report_uuid}>
              <Button
                variant="outline"
                className="flex items-center gap-1 px-[10px] py-[6px] border border-[#D9D9D9] bg-white rounded text-xs text-[#5A5A5A] hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4" strokeWidth={1.4} />
                평가서 보기
              </Button>
            </ReviewResultModal>
            </div>
            <div className="w-20 flex items-center justify-center px-[10px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-8 h-8 text-[#444444]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  alignOffset={0}
                  sideOffset={5}
                  className="p-2 w-auto min-w-fit"
                >

                  <DropdownMenuItem 
                    className="flex items-center gap-[6px] px-3 py-[6px] text-[#767676] text-sm hover:bg-gray-50 cursor-pointer mt-[2px]"
                    onClick={() => router.push(`/report/editor?reportId=${request.report_uuid}`)}
                  >
                    <Pencil className="w-[18px] h-[18px]" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-[6px] px-3 py-[6px] text-[#767676] text-sm hover:bg-gray-50 cursor-pointer mt-[2px]"
                    onClick={() => handleDelete(request.id)}
                    disabled={deletingId === request.id}
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                    {deletingId === request.id ? "삭제 중..." : "삭제"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <ExpertConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </>
  );
}
