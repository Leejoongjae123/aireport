"use client";

import { useRouter } from "next/navigation";
import { ExpertRequest } from "../types";
import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationTableProps {
  requests: ExpertRequest[];
  currentPage: number;
  itemsPerPage: number;
}

export default function EvaluationTable({
  requests,
  currentPage,
  itemsPerPage,
}: EvaluationTableProps) {
  const router = useRouter();

  const getStatusBadgeType = (status: string) => {
    const statusMap: Record<string, "완료" | "대기" | "지연"> = {
      completed: "완료",
      pending: "대기",
      evaluating: "지연",
      consulting_requested: "지연",
    };
    return statusMap[status] || "대기";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getRowNumber = (index: number) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  return (
    <div className="flex flex-col">
      {/* Table Header */}
      <div className="flex items-center px-4 py-4 bg-[#EEE] rounded-t-sm">
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">NO</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">보고서ID</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">이름</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">ID</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[2]">
          <span className="text-xs font-bold text-[#515151]">대상 보고서</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">분야</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">전문가</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">마감일</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">상태</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">평가요청일</span>
        </div>
      </div>

      {/* Table Body */}
      {requests.map((request, index) => (
        <div
          key={request.id}
          className="flex items-center px-4 h-[50px] bg-white cursor-pointer hover:bg-[#E3EFFE] group transition-colors duration-200"
          onClick={() =>
            router.push(`/admin/requests/expert-evaluation/${request.id}`)
          }
        >
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {getRowNumber(index)}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.report_uuid.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.profiles.name}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-[1.5]">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.profiles.email}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-[2]">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] max-h-[14px] overflow-hidden text-center truncate transition-colors duration-200">
              {request.report_create.title}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.report_create.business_field}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.expert_informations?.name || "-"}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {request.expert_review && request.expert_review.length > 0
                ? formatDate(request.expert_review[0].updated_at)
                : "-"}
            </span>
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <EvaluationStatusBadge status={getStatusBadgeType(request.status)} />
          </div>
          <div className="flex items-center justify-center px-2.5 flex-1">
            <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
              {formatDate(request.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
