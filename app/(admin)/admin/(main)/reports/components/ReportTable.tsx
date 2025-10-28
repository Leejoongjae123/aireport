"use client";

import { useRouter } from "next/navigation";
import { ReportData } from "../types";

interface ReportTableProps {
  reports: ReportData[];
  currentPage: number;
  itemsPerPage: number;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
}

function maskEmail(email: string | null): string {
  if (!email) return "-";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = localPart.slice(0, Math.min(3, localPart.length)) + "***";
  return `${maskedLocal}@${domain}`;
}

export default function ReportTable({ reports, currentPage, itemsPerPage }: ReportTableProps) {
  const router = useRouter();
  
  // 페이지네이션을 고려한 시작 번호 계산
  const startNumber = (currentPage - 1) * itemsPerPage;

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
        <div className="flex items-center justify-center px-2.5 flex-[2]">
          <span className="text-xs font-bold text-[#515151]">제목</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">분야</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">이름</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">ID</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-1">
          <span className="text-xs font-bold text-[#515151]">버전</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">생성일시</span>
        </div>
        <div className="flex items-center justify-center px-2.5 flex-[1.5]">
          <span className="text-xs font-bold text-[#515151]">수정일시</span>
        </div>
      </div>

      {/* Table Body */}
      {reports.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] bg-white border-b border-gray-100">
          <span className="text-sm text-[#686868]">검색 결과가 없습니다.</span>
        </div>
      ) : (
        reports.map((report, index) => (
          <div
            key={report.id}
            className="flex items-center px-4 h-[50px] bg-white cursor-pointer hover:bg-[#E3EFFE] group transition-colors duration-200 border-b border-gray-100"
            onClick={() => router.push(`/admin/reports/${report.uuid}`)}
          >
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {startNumber + index + 1}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {report.uuid.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[2]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] text-center truncate transition-colors duration-200">
                {report.title || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {report.business_field || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {report.user_name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {maskEmail(report.email)}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {report.version || "v1.0"}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {formatDateTime(report.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {report.updated_at ? formatDateTime(report.updated_at) : "-"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
