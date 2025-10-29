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
        
        // career 데이터 처리: [{"career": ["문자열", ...]}] 또는 ["문자열", ...] 형태
        let careerText = "-";
        if (expert.career && Array.isArray(expert.career) && expert.career.length > 0) {
          const firstCareer = expert.career[0];
          if (firstCareer && typeof firstCareer === 'object' && 'career' in firstCareer) {
            const careerArray = firstCareer.career;
            careerText = Array.isArray(careerArray) && careerArray.length > 0 ? careerArray[0] : "-";
          } else if (typeof firstCareer === 'string') {
            careerText = firstCareer;
          }
        }
        
        // field 데이터 처리: [{"field": ["문자열", ...]}] 또는 ["문자열", ...] 형태
        let fieldText = "-";
        if (expert.field && Array.isArray(expert.field) && expert.field.length > 0) {
          const firstField = expert.field[0];
          if (firstField && typeof firstField === 'object' && 'field' in firstField) {
            const fieldArray = firstField.field;
            fieldText = Array.isArray(fieldArray) && fieldArray.length > 0 ? fieldArray.join(", ") : "-";
          } else if (typeof firstField === 'string') {
            fieldText = expert.field.join(", ") as string;
          }
        }
        
        const expertStatus = expert.is_visible !== false ? "공개" : "비공개";

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
            <div className="w-[10%] min-w-[70px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F]">
                {expert.name || "-"}
              </div>
            </div>
            <div className="w-[15%] min-w-[120px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {careerText}
              </div>
            </div>
            <div className="w-[15%] min-w-[120px] flex justify-center items-center">
              <div className="text-center text-xs font-normal text-[#686868] group-hover:text-[#07F] truncate px-2">
                {fieldText}
              </div>
            </div>
            <div className="w-[10%] min-w-[80px] flex justify-center items-center">
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
                  if (expert.career_file_name) {
                    window.open(`/api/experts/download?fileName=${expert.career_file_name}`, '_blank');
                  }
                }}
                disabled={!expert.career_file_name}
              >
                <span className="text-xs font-normal text-[#5A5A5A] leading-4">
                  다운로드
                </span>
              </Button>
            </div>
            <div className="w-[25%] min-w-[150px] flex justify-center items-center">
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
