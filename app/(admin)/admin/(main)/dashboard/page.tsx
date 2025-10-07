import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
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
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">312</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">성공</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">307</span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-base font-semibold text-[#767676]">실패</span>
                <div className="flex flex-col items-end min-w-[114px]">
                  <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">5</span>
                  <span className="text-xs font-semibold text-[#0077ff] text-right">네트워크 3, 시스템 1</span>
                </div>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-base font-semibold text-[#767676]">대기열(실시간)</span>
                <div className="flex flex-col items-end min-w-[73px]">
                  <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">4</span>
                  <span className="text-xs font-semibold text-[#0077ff] text-right">평균 대기 6s</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-px bg-[#d9d9d9] mx-8"></div>
            
            {/* Middle Column - AI Diagnosis */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">AI 진단 실행</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">188</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">평균 점수</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">76.2</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">처리 시간</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">1분 47초</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-semibold text-[#767676]">성공률</span>
                <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">98.4%</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-px bg-[#d9d9d9] mx-8"></div>
            
            {/* Right Column - Expert Evaluations */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start py-2">
                <span className="text-base font-semibold text-[#767676]">전문가 평가 요청</span>
                <div className="flex flex-col items-end min-w-[114px]">
                  <span className="text-base font-bold text-[#0077ff] min-w-[80px] text-right">27</span>
                  <span className="text-xs font-semibold text-[#0077ff] text-right">대기 5 · 완료 22</span>
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
