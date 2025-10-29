"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExpertInformation } from "../types";

interface ExpertsTableProps {
  experts: ExpertInformation[];
  currentPage: number;
  itemsPerPage: number;
}

export default function ExpertsTable({ experts, currentPage, itemsPerPage }: ExpertsTableProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start w-full">
      {/* Table Header */}
      <div className="flex h-[50px] px-4 items-center w-full rounded-sm bg-[#EEE]">
        <div className="w-[5%] min-w-[50px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">NO</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">전문가ID</div>
        </div>
        <div className="w-[10%] min-w-[70px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">이름</div>
        </div>
        <div className="w-[15%] min-w-[120px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">경력</div>
        </div>
        <div className="w-[15%] min-w-[120px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">전문 분야</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">상태</div>
        </div>
        <div className="w-[10%] min-w-[80px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">파일</div>
        </div>
        <div className="w-[25%] min-w-[150px] flex justify-center items-center">
          <div className="text-center text-xs font-bold text-[#515151]">임베딩 일시</div>
        </div>
      </div>

      {/* Table Rows */}
      {experts.map((expert, index) => {
        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
        const careerText = expert.career && expert.career.length > 0 ? expert.career[0] : "-";
        const fieldText = expert.field && expert.field.length > 0 ? expert.field[0] : "-";
        const expertStatus = expert.status || "공개";

        return (
          <div
            key={expert.id}
            className="flex h-[50px] px-4 items-center w-full rounded cursor-pointer hover:bg-[#E3EFFE] group"
            onClick={() => router.push(`/admin/embeddings/experts/${expert.id}`)}
          >
            <div className="w-[5%] min-w-[50px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {rowNumber}
              </div>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {expert.id.substring(0, 8)}...
              </div>
            </div>
            <div className="w-[8%] min-w-[70px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {expert.name || "-"}
              </div>
            </div>
            <div className="w-[12%] min-w-[100px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {careerText}
              </div>
            </div>
            <div className="w-[7%] min-w-[60px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {expert.career ? `${expert.career.length}개` : "-"}
              </div>
            </div>
            <div className="w-[13%] min-w-[100px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {fieldText}
              </div>
            </div>
            <div className="w-[13%] min-w-[100px] flex justify-center items-center">
              <div className="text-center text-xs font-normal leading-4 text-[#313131] group-hover:text-[#07F] truncate px-2">
                {fieldText}
              </div>
            </div>
            <div className="w-[7%] min-w-[60px] flex justify-center items-center">
              <Badge
                className={`flex p-[6px_10px] justify-center items-center rounded-full text-xs font-normal hover:bg-current ${
                  expertStatus === "공개"
                    ? "bg-[#ECF5FF] text-[#07F] hover:bg-[#ECF5FF]/90 hover:text-[#07F]"
                    : "bg-[#E3E3E3] text-[#5A5A5A] hover:bg-[#E3E3E3]/90 hover:text-[#5A5A5A]"
                }`}
              >
                {expertStatus}
              </Badge>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
              <Button
                variant="outline"
                className="flex h-6 p-[4px_8px] justify-center items-center gap-1 rounded border border-[#BAD1EC] bg-white hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  // 다운로드 기능 추가
                }}
              >
                <span className="text-xs font-normal text-[#5A5A5A] leading-4">
                  다운로드
                </span>
              </Button>
            </div>
            <div className="w-[15%] min-w-[100px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {expert.created_at ? new Date(expert.created_at).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
