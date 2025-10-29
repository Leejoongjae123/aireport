"use client";

import { Badge } from "@/components/ui/Badge";
import { ExpertStats } from "../types";

interface ExpertsStatsCardsProps {
  stats: ExpertStats;
}

export default function ExpertsStatsCards({ stats }: ExpertsStatsCardsProps) {
  return (
    <div className="w-full flex items-start justify-center gap-4">
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[180px] h-[98px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          등록 전문가
        </Badge>
        <div className="w-[100px] text-center text-xl font-bold text-[#303030]">
          {stats.total}명
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[180px] h-[98px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          이번달 신규
        </Badge>
        <div className="w-[100px] text-center text-xl font-bold text-[#303030]">
          {stats.thisMonth}명
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-lg w-[180px] h-[98px] justify-center">
        <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-xs font-normal text-[#07F] hover:bg-[#ECF5FF]">
          최신 임베딩일
        </Badge>
        <div className="flex items-center gap-1">
          <div className="w-[100px] text-center text-base font-bold text-[#303030]">
            {stats.latestEmbeddingDate || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
