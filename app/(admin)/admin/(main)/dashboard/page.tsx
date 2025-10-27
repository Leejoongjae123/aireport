"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalCount: number;
  successCount: number;
  failureCount: number;
  queueCount: number;
  diagnosisCount: number;
  averageScore: number;
  averageDurationFormatted: string;
  successRate: number;
  expertRequestCount: number;
  expertRequestPending: number;
  expertRequestCompleted: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCount: 0,
    successCount: 0,
    failureCount: 0,
    queueCount: 0,
    diagnosisCount: 0,
    averageScore: 0,
    averageDurationFormatted: "0분 0초",
    successRate: 0,
    expertRequestCount: 0,
    expertRequestPending: 0,
    expertRequestCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.log("통계 데이터를 불러오는데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      <div className="flex flex-col gap-6">
        {/* Real-time Processing Status */}
        <div className="p-11 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">실시간 처리 현황</h2>

          <div className="flex">
            {/* Left Column - Report Generation */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">오늘 보고서 생성</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.totalCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">성공</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.successCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">실패</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.failureCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">대기열(실시간)</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.queueCount}
                </span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-px bg-[#d9d9d9] mx-8"></div>
            
            {/* Middle Column - AI Diagnosis */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">AI 진단 실행</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.diagnosisCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">평균 점수</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.averageScore.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">처리 시간</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.averageDurationFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">성공률</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : `${stats.successRate.toFixed(1)}%`}
                </span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-px bg-[#d9d9d9] mx-8"></div>
            
            {/* Right Column - Expert Evaluations */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start py-2">
                <span className="text-base font-semibold text-[#767676]">전문가 평가 요청</span>
                <div className="flex flex-col items-end min-w-[114px]">
                  <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                    {loading ? "-" : stats.expertRequestCount}
                  </span>
                  <span className="text-xs font-semibold text-[#0077ff] text-right">
                    대기 {loading ? "-" : stats.expertRequestPending} · 완료 {loading ? "-" : stats.expertRequestCompleted}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-base font-semibold text-[#767676]">컨설팅 요청</span>
                <div className="flex flex-col items-end min-w-[73px]">
                  <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">11</span>
                  <span className="text-xs font-semibold text-[#0077ff] text-right">대기 3 · 완료 8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Reports */}
        <div className="p-11 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">최근 생성 보고서</h2>
            <Button 
              className="bg-[#0077ff] hover:bg-[#0066dd] text-white px-4 py-2 rounded text-xs font-semibold"
              size="sm"
            >
              전체 보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="flex flex-col">
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-evenly items-center py-4 border-b border-[#d9d9d9] gap-24">
                <div className="text-sm text-[#303030] opacity-90">RP10231</div>
                <div className="text-sm text-[#303030] opacity-90">AI 기반 리테일 수요예측 사업계획서</div>
                <div className="text-sm text-[#303030] opacity-90">디지털·ICT·AI 산업</div>
                <div className="text-sm text-[#303030] opacity-90">김철수(User1)</div>
                <div className="text-sm text-[#303030] opacity-90">2025-09-10 14:12</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
