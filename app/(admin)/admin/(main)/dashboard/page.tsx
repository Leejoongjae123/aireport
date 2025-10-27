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
  consultingRequestCount: number;
}

interface RecentReport {
  uuid: string;
  title: string;
  business_field: string;
  email: string;
  created_at: string;
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
    consultingRequestCount: 0,
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
          setRecentReports(data.recentReports || []);
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
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">전문가 평가 요청</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.expertRequestCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">컨설팅 요청</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">
                  {loading ? "-" : stats.consultingRequestCount}
                </span>
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
            {loading ? (
              <div className="text-center py-8 text-[#767676]">로딩 중...</div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-8 text-[#767676]">최근 생성된 보고서가 없습니다.</div>
            ) : (
              recentReports.map((report) => (
                <div key={report.uuid} className="flex justify-evenly items-center py-4 border-b border-[#d9d9d9] gap-24">
                  <div className="text-sm text-[#303030] opacity-90 min-w-[80px]">{report.uuid.slice(0, 8)}</div>
                  <div className="text-sm text-[#303030] opacity-90 flex-1">{report.title || "제목 없음"}</div>
                  <div className="text-sm text-[#303030] opacity-90 min-w-[150px]">{report.business_field || "-"}</div>
                  <div className="text-sm text-[#303030] opacity-90 min-w-[150px]">{report.email || "-"}</div>
                  <div className="text-sm text-[#303030] opacity-90 min-w-[130px]">
                    {new Date(report.created_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
