"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ConsultingRequest } from "../types";

interface ConsultingTableProps {
  requests: ConsultingRequest[];
  currentPage: number;
  itemsPerPage: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "completed") {
    return (
      <Badge className="bg-[#cff7d3] text-[#025420] hover:bg-[#cff7d3] rounded-full px-2.5 py-1.5 text-xs font-normal">
        완료
      </Badge>
    );
  } else if (status === "pending" || status === "waiting") {
    return (
      <Badge className="bg-[#fff1c2] text-[#975102] hover:bg-[#fff1c2] rounded-full px-2.5 py-1.5 text-xs font-normal">
        대기
      </Badge>
    );
  }
  return null;
};

export default function ConsultingTable({ requests, currentPage, itemsPerPage }: ConsultingTableProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
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
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">대상 보고서</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">전문가</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">분야</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">상태</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">요청일시</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">완료일시</span>
        </div>
      </div>

      {/* Table Body */}
      {requests.map((request, index) => {
        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return (
          <div
            key={request.id}
            className="flex items-center px-4 h-[50px] bg-white cursor-pointer hover:bg-[#E3EFFE] group transition-colors duration-200"
            onClick={() => router.push(`/admin/requests/expert-consulting/${request.id}`)}
          >
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {rowNumber}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.report_create?.uuid?.substring(0, 8) || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.profiles?.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.profiles?.email || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] max-h-[14px] overflow-hidden text-center truncate transition-colors duration-200">
                {request.report_create?.title || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.expert_informations?.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.request_subject || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {formatDate(request.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {request.status === "completed" && request.updated_at ? formatDate(request.updated_at) : "-"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
