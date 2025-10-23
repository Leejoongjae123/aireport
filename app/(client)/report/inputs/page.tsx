"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useReportStore } from "../components/store/report-store";
import { useLoader } from "@/components/hooks/use-loader";

function ReportInputsContent() {
  const searchParams = useSearchParams();
  const {
    setReportType,
    setReportId,
    setBusinessField,
    setInputData,
    resetInputData,
  } = useReportStore();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [businessIdea, setBusinessIdea] = useState("");
  const [coreValue, setCoreValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const loader = useLoader({ isLoading });

  // reportId로 데이터 가져오기
  useEffect(() => {
    const fetchReportData = async () => {
      const reportId = searchParams.get("reportId");
      const reportType = searchParams.get("reportType");

      if (!reportId) {
        // reportId가 없으면 초기화
        resetInputData();
        setInvestmentAmount("");
        setBusinessIdea("");
        setCoreValue("");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/reports/${reportId}/inputs`);

        if (!response.ok) {
          // 데이터가 없으면 초기화
          resetInputData();
          setInvestmentAmount("");
          setBusinessIdea("");
          setCoreValue("");
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        // 가져온 데이터로 상태 업데이트
        setInvestmentAmount(data.investmentAmount || "");
        setBusinessIdea(data.businessIdea || "");
        setCoreValue(data.coreValue || "");

        // store에도 저장
        setReportId(reportId);
        setReportType(data.reportType || reportType || "");
        setBusinessField(data.businessField || "");
        setInputData({
          investmentAmount: data.investmentAmount || "",
          businessIdea: data.businessIdea || "",
          coreValue: data.coreValue || "",
        });
      } catch {
        // 에러 발생 시 초기화
        resetInputData();
        setInvestmentAmount("");
        setBusinessIdea("");
        setCoreValue("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [
    searchParams,
    setReportType,
    setReportId,
    setBusinessField,
    setInputData,
    resetInputData,
  ]);

  // 입력값 변경 시 store에도 저장
  useEffect(() => {
    if (!isLoading) {
      setInputData({
        investmentAmount,
        businessIdea,
        coreValue,
      });
    }
  }, [investmentAmount, businessIdea, coreValue, setInputData, isLoading]);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      return "";
    }
    return new Intl.NumberFormat("ko-KR").format(parseInt(numericValue));
  };

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatNumber(e.target.value);
    setInvestmentAmount(formatted);
  };

  return (
    <>
      {loader}
      <div className="flex w-full justify-center">
      <Card className="w-full max-w-[1200px] p-6 border border-[#EEF1F7] bg-white shadow-[0_0_10px_0_rgba(60,123,194,0.12)] rounded-xl">
        <div className="flex flex-col gap-6">
          {/* 목표 투자 금액 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Label className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#303030]">
                  목표 투자 금액
                </Label>
                <span className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#EC221F]">
                  *
                </span>
              </div>
              <p className="text-base font-normal leading-[29px] text-[#767676]">
                숫자만 입력하세요. 자동으로 쉼표가 추가됩니다.
              </p>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={investmentAmount}
                onChange={handleInvestmentAmountChange}
                placeholder="예: 1,000,000,000원"
                className={cn(
                  "h-14 px-6 py-4 rounded-xl border border-[#E3E5E5] bg-white",
                  "text-base leading-6 tracking-[-0.064px]",
                  "placeholder:text-[#B3B3B3] placeholder:font-normal",
                  "focus:border-[#E3E5E5] focus:ring-0 focus-visible:ring-0"
                )}
              />
            </div>
          </div>

          {/* 사업 아이디어 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Label className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#303030]">
                  사업 아이디어
                </Label>
                <span className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#EC221F]">
                  *
                </span>
              </div>
              <p className="text-base font-normal leading-[29px] text-[#767676]">
                {businessIdea.length}자/ 최소 100자 이상 작성 필요
              </p>
            </div>
            <div className="relative">
              <textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="해결하고자 하는 문제와 제안하는 솔루션을 구체적으로 설명해주세요."
                rows={5}
                className={cn(
                  "w-full min-h-[120px] px-6 py-4 rounded-xl border border-[#E3E5E5] bg-white",
                  "text-base leading-6 tracking-[-0.064px] resize-none",
                  "placeholder:text-[#B3B3B3] placeholder:font-normal",
                  "focus:border-[#E3E5E5] focus:ring-0 focus:outline-none"
                )}
              />
            </div>
          </div>

          {/* 핵심가치 제안 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Label className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#303030]">
                  핵심가치 제안
                </Label>
                <span className="text-xl font-semibold leading-8 tracking-[-0.4px] text-[#EC221F]">
                  *
                </span>
              </div>
              <p className="text-base font-normal leading-[29px] text-[#767676]">
                {coreValue.length}자/ 최소 100자 이상 작성 필요
              </p>
            </div>
            <div className="relative">
              <textarea
                value={coreValue}
                onChange={(e) => setCoreValue(e.target.value)}
                placeholder="고객에게 제제공하는 핵심가치와 차별점을 상세히 설명해주세요."
                rows={5}
                className={cn(
                  "w-full min-h-[120px] px-6 py-4 rounded-xl border border-[#E3E5E5] bg-white",
                  "text-base leading-6 tracking-[-0.064px] resize-none",
                  "placeholder:text-[#B3B3B3] placeholder:font-normal",
                  "focus:border-[#E3E5E5] focus:ring-0 focus:outline-none"
                )}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
    </>
  );
}

export default function ReportInputsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportInputsContent />
    </Suspense>
  );
}
