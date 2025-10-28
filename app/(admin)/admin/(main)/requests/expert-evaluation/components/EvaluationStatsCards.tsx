import { ExpertEvaluationStats } from "../types";

interface EvaluationStatsCardsProps {
  stats: ExpertEvaluationStats;
}

export default function EvaluationStatsCards({ stats }: EvaluationStatsCardsProps) {
  return (
    <div className="flex items-start gap-4">
      {/* All Status Card */}
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
        <div className="w-[41px] h-[26px] bg-[#ECF5FF] rounded-full flex items-center justify-center">
          <span className="text-xs font-normal text-[#07F]">전체</span>
        </div>
        <div className="w-[100px] text-center">
          <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
            {stats.total.toLocaleString()}건
          </span>
        </div>
      </div>

      {/* Completed Status Card */}
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
        <div className="w-[41px] h-[26px] bg-[rgba(207,247,211,1)] rounded-full flex items-center justify-center">
          <span className="text-xs font-normal text-[rgba(2,84,45,1)]">
            완료
          </span>
        </div>
        <div className="w-[100px] text-center">
          <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
            {stats.completed.toLocaleString()}건
          </span>
        </div>
      </div>

      {/* Waiting Status Card */}
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
        <div className="w-[41px] h-[26px] bg-[rgba(255,241,194,1)] rounded-full flex items-center justify-center">
          <span className="text-xs font-normal text-[rgba(151,81,2,1)]">
            대기
          </span>
        </div>
        <div className="w-[100px] text-center">
          <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
            {stats.pending.toLocaleString()}건
          </span>
        </div>
      </div>

      {/* Delayed Status Card */}
      <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
        <div className="w-[41px] h-[26px] bg-[rgba(253,211,208,1)] rounded-full flex items-center justify-center">
          <span className="text-xs font-normal text-[rgba(144,11,9,1)]">
            지연
          </span>
        </div>
        <div className="w-[100px] text-center">
          <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
            {stats.delayed.toLocaleString()}건
          </span>
        </div>
      </div>
    </div>
  );
}
