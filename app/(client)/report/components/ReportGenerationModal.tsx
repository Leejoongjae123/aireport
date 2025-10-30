"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomModal } from "@/components/ui/CustomModal";
import { useReportStore } from "./store/ReportStore";

const businessCategories = [
  {
    id: "digital-ict-ai",
    title: "디지털·ICT·AI 산업",
  },
  {
    id: "manufacturing-tech",
    title: "제조·산업기술·혁신",
  },
  {
    id: "culture-content-tourism",
    title: "문화·콘텐츠·관광",
  },
  {
    id: "public-urban-infrastructure",
    title: "공공·도시·인프라",
  },
  {
    id: "energy-environment",
    title: "에너지·환경",
  },
];

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StepStatus = "pending" | "loading" | "completed";

const MIN_LOADING_DURATION = 20000;

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { reportId } = useReportStore();
  const [step1Status, setStep1Status] = useState<StepStatus>("loading");
  const [step2Status, setStep2Status] = useState<StepStatus>("pending");
  const [step3Status, setStep3Status] = useState<StepStatus>("pending");

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫히면 상태 초기화
      setStep1Status("loading");
      setStep2Status("pending");
      setStep3Status("pending");
      return;
    }

    let isCancelled = false;
    let pollingInterval: NodeJS.Timeout | null = null;
    let fallbackTimer2: NodeJS.Timeout | null = null;
    let fallbackTimer3: NodeJS.Timeout | null = null;
    let fallbackTimer4: NodeJS.Timeout | null = null;
    let completionTimeout: NodeJS.Timeout | null = null;
    let step3CompletionTimeout: NodeJS.Timeout | null = null;
    const startTime = Date.now();

    const scheduleNavigation = () => {
      if (completionTimeout) return;
      const elapsed = Date.now() - startTime;
      const delay = Math.max(1000, MIN_LOADING_DURATION - elapsed);
      completionTimeout = setTimeout(() => {
        if (isCancelled) return;
        if (reportId) {
          router.push(`/report/editor?reportId=${reportId}`);
        } else {
          router.push("/report/editor");
        }
        completionTimeout = null;
      }, delay);
    };

    // Polling 함수: is_complete 확인
    const startPolling = () => {
      if (!reportId) return;

      pollingInterval = setInterval(async () => {
        if (isCancelled) return;

        try {
          const statusResponse = await fetch(`/api/reports/${reportId}/status`);
          if (!statusResponse.ok) return;

          const statusData = await statusResponse.json();

          if (statusData.isComplete) {
            // 완료되면 모든 단계를 즉시 완료 처리
            if (isCancelled) return;

            setStep1Status("completed");
            setStep2Status("completed");
            setStep3Status("completed");

            // polling 중지
            if (pollingInterval) {
              clearInterval(pollingInterval);
              pollingInterval = null;
            }

            // fallback 타이머들 중지
            if (fallbackTimer2) clearTimeout(fallbackTimer2);
            if (fallbackTimer3) clearTimeout(fallbackTimer3);
            if (fallbackTimer4) clearTimeout(fallbackTimer4);

            // step3 완료 후 2초 대기 후 페이지 이동
            step3CompletionTimeout = setTimeout(() => {
              if (isCancelled) return;
              if (reportId) {
                router.push(`/report/editor?reportId=${reportId}`);
              } else {
                router.push("/report/editor");
              }
            }, 2000);
          }
        } catch {
          // polling 중 오류는 무시하고 계속 시도
        }
      }, 3000); // 3초마다 확인
    };

    // Step 1: 입력값 확인 및 AI 보고서 생성 요청
    const runStep1 = async () => {
      if (!reportId) {
        setStep1Status("completed");
        setStep2Status("loading");
        return;
      }

      try {
        // 1. reportId로 입력 데이터 가져오기
        const inputResponse = await fetch(`/api/reports/${reportId}/inputs`);

        if (!inputResponse.ok) {
          if (isCancelled) return;
          setStep1Status("completed");
          setStep2Status("loading");
          return;
        }

        const inputData = await inputResponse.json();

        // 입력값 확인 완료
        if (isCancelled) return;
        setStep1Status("completed");
        setStep2Status("loading");
        console.log('inputData:', inputData)

        // businessField에 해당하는 category_number 찾기
        const categoryIndex = businessCategories.findIndex(
          (category) => category.title === inputData.businessField
        );
        const categoryNumber = categoryIndex !== -1 ? categoryIndex + 1 : 0;

        // 2. 유사 보고서 검색 API 호출
        const searchResponse = await fetch(`/api/reports/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: reportId,
            business_idea: inputData.businessIdea || "",
            core_value: inputData.coreValue || "",
            category_number: categoryNumber,
            top_k: 5,
          }),
        });
        

        if (!searchResponse.ok) {
          if (isCancelled) return;
          // 검색 실패해도 계속 진행
          return;
        }

        const searchData = await searchResponse.json();
        console.log("searchData:", searchData);
        // 검색 결과가 있는 경우 첫 번째 결과 사용
        const firstResult =
          searchData.results && searchData.results.length > 0
            ? searchData.results[0]
            : null;

        if (!firstResult) {
          if (isCancelled) return;
          // 검색 결과가 없어도 계속 진행
          return;
        }

        // 3. 내부 API(Route Handler)를 통해 AI 보고서 생성 요청
        const requestBody = {
          business_idea: inputData.businessIdea || "",
          core_value: inputData.coreValue || "",
          file_name: firstResult.보고서파일명 || "사업계획서",
          report_id: reportId,
        };
        
        console.log("=== 보고서 생성 요청 데이터 ===");
        console.log("business_idea 길이:", requestBody.business_idea.length);
        console.log("core_value 길이:", requestBody.core_value.length);
        console.log("file_name:", requestBody.file_name);
        console.log("report_id:", requestBody.report_id);
        
        const generateResponse = await fetch(`/api/reports/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (isCancelled) return;

        if (generateResponse.ok) {
          const generateData = await generateResponse.json();
          console.log("보고서 생성 응답:", generateData);
          if (generateData && generateData.success) {
            setStep2Status("completed");
            setStep3Status("completed");
            // step3 완료 후 2초 대기 후 페이지 이동
            step3CompletionTimeout = setTimeout(() => {
              if (isCancelled) return;
              if (reportId) {
                router.push(`/report/editor?reportId=${reportId}`);
              } else {
                router.push("/report/editor");
              }
            }, 2000);
            return;
          }
          // success가 아닌 경우에만 polling 시작
          startPolling();
        } else {
          // 에러 응답 로깅
          const errorData = await generateResponse.json().catch(() => null);
          console.error("보고서 생성 실패:", {
            status: generateResponse.status,
            statusText: generateResponse.statusText,
            error: errorData
          });
          // 실패해도 계속 진행 (fallback 타이머로)
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("보고서 생성 요청 중 예외 발생:", error);
        // 오류가 발생해도 계속 진행 (fallback 타이머로)
      }
    };

    runStep1();

    // Fallback 타이머들 (AI 요청이 실패하거나 응답이 없을 경우를 대비)
    fallbackTimer2 = setTimeout(() => {
      if (isCancelled) return;
      // 이미 완료되지 않았다면 완료 처리
      setStep2Status((prev) => (prev === "completed" ? prev : "completed"));
      setStep3Status((prev) => (prev === "pending" ? "loading" : prev));
    }, 10000);

    fallbackTimer3 = setTimeout(() => {
      if (isCancelled) return;
      setStep3Status((prev) => (prev === "completed" ? prev : "completed"));
      // step3 완료 후 2초 대기 후 페이지 이동
      step3CompletionTimeout = setTimeout(() => {
        if (isCancelled) return;
        if (reportId) {
          router.push(`/report/editor?reportId=${reportId}`);
        } else {
          router.push("/report/editor");
        }
      }, 2000);
    }, 15000);

    fallbackTimer4 = setTimeout(() => {
      if (isCancelled) return;
      // fallback: 일정 시간 후 무조건 페이지 이동
      scheduleNavigation();
    }, 180000); // 3분 (180초) 후

    return () => {
      isCancelled = true;
      if (pollingInterval) clearInterval(pollingInterval);
      if (fallbackTimer2) clearTimeout(fallbackTimer2);
      if (fallbackTimer3) clearTimeout(fallbackTimer3);
      if (fallbackTimer4) clearTimeout(fallbackTimer4);
      if (completionTimeout) clearTimeout(completionTimeout);
      if (step3CompletionTimeout) clearTimeout(step3CompletionTimeout);
    };
  }, [isOpen, router, reportId]);

  // 스텝 상태에 따른 아이콘 렌더링
  const renderStepIcon = (status: StepStatus) => {
    if (status === "completed") {
      // 체크 아이콘
      return (
        <svg
          className="w-6 h-6 shrink-0"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id={`mask0_check_${status}`}
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="1"
            y="1"
            width="23"
            height="22"
          >
            <path
              d="M12.5 22C13.8135 22.0016 15.1143 21.7437 16.3278 21.2411C17.5412 20.7384 18.6434 20.0009 19.571 19.071C20.5009 18.1434 21.2384 17.0412 21.7411 15.8278C22.2437 14.6143 22.5016 13.3135 22.5 12C22.5016 10.6866 22.2437 9.38572 21.7411 8.17225C21.2384 6.95878 20.5009 5.85659 19.571 4.92901C18.6434 3.99909 17.5412 3.26162 16.3278 2.75897C15.1143 2.25631 13.8135 1.99839 12.5 2.00001C11.1866 1.99839 9.88572 2.25631 8.67225 2.75897C7.45878 3.26162 6.35659 3.99909 5.42901 4.92901C4.49909 5.85659 3.76162 6.95878 3.25897 8.17225C2.75631 9.38572 2.49839 10.6866 2.50001 12C2.49839 13.3135 2.75631 14.6143 3.25897 15.8278C3.76162 17.0412 4.49909 18.1434 5.42901 19.071C6.35659 20.0009 7.45878 20.7384 8.67225 21.2411C9.88572 21.7437 11.1866 22.0016 12.5 22Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 12L11.5 15L17.5 9"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
          <g mask={`url(#mask0_check_${status})`}>
            <path d="M0.5 0H24.5V24H0.5V0Z" fill="#0077FF" />
          </g>
        </svg>
      );
    } else if (status === "loading") {
      // 로딩 아이콘 (회전 애니메이션)
      return (
        <svg
          className="w-6 h-6 shrink-0 animate-spin"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13" cy="12" r="9" stroke="#D9D9D9" strokeWidth="2" />
          <path
            d="M13 4C8.58172 4 5 7.58172 5 12C5 16.4183 8.58172 20 13 20C17.4183 20 21 16.4183 21 12H23C23 17.5228 18.5228 22 13 22C7.47715 22 3 17.5228 3 12C3 6.47715 7.47715 2 13 2V4Z"
            fill="#0077FF"
          />
        </svg>
      );
    } else {
      // 대기 중 아이콘 (비활성)
      return (
        <svg
          className="w-6 h-6 shrink-0"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13" cy="12" r="9" stroke="#D9D9D9" strokeWidth="2" />
        </svg>
      );
    }
  };

  // 스텝 상태에 따른 배경색
  const getStepBackground = (status: StepStatus) => {
    return status === "completed" ? "bg-[#E8F3FF]" : "bg-[#F5F5F5]";
  };

  // 완료된 스텝 수에 따른 진행률 계산
  const getProgress = () => {
    const completedSteps = [step1Status, step2Status, step3Status].filter(
      (status) => status === "completed"
    ).length;
    return (completedSteps / 3) * 100;
  };

  // 중앙에 표시할 내용 렌더링 (별 또는 퍼센트)
  const renderCenterContent = () => {
    const progress = getProgress();

    if (progress === 0) {
      // 처음에는 별모양
      return (
        <svg
          className="w-[60px] h-[57px] transition-opacity duration-1000"
          style={{
            opacity: 0.5,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
          width="60"
          height="58"
          viewBox="0 0 60 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.6667 45C38.4667 36.418 41.5607 33.3217 49.6667 31C41.5607 28.6783 38.4667 25.582 35.6667 17C32.8667 25.582 29.7727 28.6783 21.6667 31C29.7727 33.3217 32.8667 36.418 35.6667 45ZM17 24C18.4 19.7067 19.947 18.1597 24 17C19.947 15.8403 18.4 14.2933 17 10C15.6 14.2933 14.053 15.8403 10 17C14.053 18.1597 15.6 19.7067 17 24ZM20.5 47.3333C21.2 45.1867 21.9723 44.4143 24 43.8333C21.9723 43.2523 21.2 42.48 20.5 40.3333C19.8 42.48 19.0277 43.2523 17 43.8333C19.0277 44.4143 19.8 45.1867 20.5 47.3333Z"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      // 진행 중이거나 완료되면 퍼센트 표시
      const displayProgress = Math.round(progress);
      return (
        <span className="text-white font-pretendard text-[32px] font-bold leading-normal">
          {displayProgress}%
        </span>
      );
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      className="border-none"
      width="419px"
      height="556px"
      padding="52px 40px"
      showCloseButton={false}
    >
      <div className="flex w-[339px] flex-col items-center gap-8 relative">
        {/* Progress Circle and Title */}
        <div className="flex flex-col justify-center items-center gap-6 self-stretch relative">
          {/* Progress Circle */}
          <div className="flex w-[132px] h-[132px] items-center justify-center rounded-full  relative">
            {/* Progress Circle SVG */}
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[132px] h-[132px] -rotate-90"
              width="132"
              height="132"
              viewBox="0 0 132 132"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle (회색) */}
              <circle
                cx="66"
                cy="66"
                r="60"
                stroke="#E5E7EB"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress Circle (파란색) */}
              <circle
                cx="66"
                cy="66"
                r="60"
                stroke="#0077FF"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${
                  2 * Math.PI * 60 * (1 - getProgress() / 100)
                }`}
                className="transition-all duration-500 ease-in-out"
              />
            </svg>

            {/* Center Icon */}
            <div className="flex w-[110px] h-[110px] justify-center items-center rounded-full bg-[#07F] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {renderCenterContent()}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3 relative">
            <h2 className="text-[#303030] font-pretendard text-2xl font-semibold leading-normal">
              {getProgress() === 100
                ? "보고서 생성 완료"
                : "보고서를 생성하고 있습니다"}
            </h2>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex flex-col items-start gap-2 relative">
          {/* Step 1 */}
          <div
            className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
              step1Status
            )} relative`}
          >
            {renderStepIcon(step1Status)}
            <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
              입력값 확인 중
            </span>
          </div>

          {/* Step 2 */}
          <div
            className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
              step2Status
            )} relative`}
          >
            {renderStepIcon(step2Status)}
            <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
              목차 구조 설계
            </span>
          </div>

          {/* Step 3 */}
          <div
            className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
              step3Status
            )} relative`}
          >
            {renderStepIcon(step3Status)}
            <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
              마무리 검증
            </span>
          </div>
        </div>

        {/* Bottom Message */}
        <p className="text-[#878A8F] font-pretendard text-base font-medium leading-normal tracking-[-0.064px] opacity-80 relative">
          고품질 보고서 생성을 위해 잠시만 기다려주세요.
        </p>
      </div>
    </CustomModal>
  );
};
