"use client";

import { Badge } from "@/components/ui/Badge";
import { ReportStats } from "../types";

interface ReportsStatsCardsProps {
  stats: ReportStats;
}

export default function ReportsStatsCards({ stats }: ReportsStatsCardsProps) {
  return (
    <div className="w-full flex items-start justify-center gap-4">
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[220px] h-[120px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          등록 보고서
        </Badge>
        <div className="w-[100px] text-center text-xl font-bold text-[#303030]">
          {stats.total}건
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[220px] h-[120px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          이번달 신규
        </Badge>
        <div className="w-[100px] text-center text-xl font-bold text-[#303030]">
          {stats.thisMonth}건
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[220px] h-[120px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          최신 임베딩일
        </Badge>
        <div className="flex flex-col items-center">
          <div className="w-[180px] text-center text-base font-bold text-[#303030]">
            {stats.latestEmbeddingDate ? stats.latestEmbeddingDate.split(' ')[0] : "N/A"}
          </div>
          <div className="w-[180px] text-center text-sm font-normal text-[#686868]">
            {stats.latestEmbeddingDate ? stats.latestEmbeddingDate.split(' ')[1] : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
