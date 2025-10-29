"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReportInformation } from "../types";

interface ReportsTableProps {
  reports: ReportInformation[];
  currentPage: number;
  itemsPerPage: number;
}

export default function ReportsTable({ reports, currentPage, itemsPerPage }: ReportsTableProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start w-full">
      {/* Table Header */}
      <div className="flex h-[50px] px-4 items-center w-full rounded-sm bg-[#EEE]">
        <div className="w-[5%] min-w-[50px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">NO</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">보고서ID</div>
        </div>
        <div className="w-[20%] min-w-[150px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">제목</div>
        </div>
        <div className="w-[15%] min-w-[120px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">분야</div>
        </div>
        <div className="w-[20%] min-w-[150px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">키워드</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">파일</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">임베딩</div>
        </div>
        <div className="w-[15%] min-w-[120px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">임베딩 일시</div>
        </div>
      </div>

      {/* Table Rows */}
      {reports.map((report, index) => {
        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

        return (
          <div
            key={report.id}
            className="flex h-[50px] px-4 items-center w-full rounded cursor-pointer hover:bg-[#E3EFFE] group"
            onClick={() => router.push(`/admin/embeddings/reports/${report.id}`)}
          >
            <div className="w-[5%] min-w-[50px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {rowNumber}
              </div>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2" title={String(report.id)}>
                {report.id}
              </div>
            </div>
            <div className="w-[20%] min-w-[150px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {report.제목 || "-"}
              </div>
            </div>
            <div className="w-[15%] min-w-[120px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {report.분야 || "-"}
              </div>
            </div>
            <div className="w-[20%] min-w-[150px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {report.키워드 || "-"}
              </div>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
              <Button
                variant="outline"
                className="flex h-6 p-[4px_8px] justify-center items-center gap-1 rounded border border-[#BAD1EC] bg-white hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (report.보고서파일명) {
                    window.open(`/api/reports/download?fileName=${report.보고서파일명}`, '_blank');
                  }
                }}
                disabled={!report.보고서파일명}
              >
                <span className="text-xs font-normal text-[#5A5A5A] leading-4">
                  다운로드
                </span>
              </Button>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
              <Badge 
                variant={report.is_completed ? "default" : "secondary"}
                className="text-xs"
              >
                {report.is_completed ? "완료" : "대기중"}
              </Badge>
            </div>
            <div className="w-[15%] min-w-[120px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {report.created_at ? new Date(report.created_at).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
