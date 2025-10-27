"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpertRecommendationCompleteModal } from "./ExpertRecommendationCompleteModal";
import { Expert } from "./types";
import { ExpertEvaluationRequestModal } from "./ExpertEvaluationRequestModal";
import { useExpertStore } from "./store/ExpertStore";

interface ExpertRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StepStatus = "pending" | "loading" | "completed";

export function ExpertRecommendationModal({
  isOpen,
  onClose,
}: ExpertRecommendationModalProps) {
  const { expertMatchData } = useExpertStore();
  const [step1Status, setStep1Status] = useState<StepStatus>("loading");
  const [step2Status, setStep2Status] = useState<StepStatus>("pending");
  const [step3Status, setStep3Status] = useState<StepStatus>("pending");
  const [showExpertEvaluation, setShowExpertEvaluation] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [experts, setExperts] = useState<Expert[]>([]);

  // 모달이 열릴 때 상태 초기화 및 스텝 진행
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 상태 초기화
    setStep1Status("loading");
    setStep2Status("pending");
    setStep3Status("pending");
    setShowExpertEvaluation(false);
    setExperts([]);

    const processSteps = async () => {
      try {
        // Step 1: 보고서 분석 시작 (2초)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep1Status("completed");
        setStep2Status("loading");

        // Step 2: 전문가 분석중 (2초)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep2Status("completed");
        setStep3Status("loading");

        // Step 3: 매칭중 (2초)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep3Status("completed");
      } catch {
        setStep1Status("pending");
        setStep2Status("pending");
        setStep3Status("pending");
      }
    };

    processSteps();
  }, [isOpen]);

  // Store 데이터 감지 및 전문가 모달로 전환
  useEffect(() => {
    if (!isOpen || !expertMatchData) {
      return;
    }

    // 전문가 데이터 변환
    const transformedExperts: Expert[] = expertMatchData.final_ranking.map(
      (ranking, index) => ({
        id: `expert-${index}`,
        name: ranking.이름,
        specialty: ranking.분야.slice(0, 2).join(", "),
        experience: `${ranking.매칭_개수}개 항목 매칭`,
        description: ranking.경력.slice(0, 2).join(", "),
        careers: ranking.경력,
        fields: ranking.분야,
        matchingCount: ranking.매칭_개수,
        matchingDetails: ranking.매칭_상세,
        selected: index === 0,
      })
    );

    setExperts(transformedExperts);

    // 모든 스텝이 완료되면 전문가 평가 모달 표시
    if (step1Status === "completed" && step2Status === "completed" && step3Status === "completed") {
      setTimeout(() => {
        setShowExpertEvaluation(true);
      }, 500);
    }
  }, [isOpen, expertMatchData, step1Status, step2Status, step3Status]);

  // 스텝 상태에 따른 ��이콘 렌더링
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

  // 전문가 평가 모달 핸들러
  const handleExpertEvaluationClose = () => {
    setShowExpertEvaluation(false);
    onClose();
  };

  const handleEvaluationRequest = () => {
    // 평가 요청 로직 처리
    setShowExpertEvaluation(false);
    setShowCompleteModal(true);
  };

  const handleCompleteModalClose = () => {
    setShowCompleteModal(false);
    onClose();
  };

  return (
    <>
      <CustomModal
        isOpen={isOpen && !showExpertEvaluation}
        onClose={onClose}
        className="border-none"
        width="419px"
        padding="32px"
        showCloseButton={false}
      >
        <div className="flex w-[355px] flex-col items-start gap-[31px] relative">
          {/* Header with close button */}
          <div className="flex w-[355px] pb-6 flex-col items-center gap-4 relative">
            <div className="flex flex-col items-end gap-[9px] self-stretch relative">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
              </button>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center gap-11 self-stretch relative">
              <div className="flex flex-col items-center gap-8 self-stretch relative">
                <div className="flex flex-col justify-center items-center gap-6 self-stretch relative">
                  {/* Title section with search icon */}
                  <div className="flex flex-col items-center gap-3 self-stretch relative">
                    <div className="flex justify-center items-center gap-3 relative">
                      <Search
                        className="w-6 h-6 text-[#0077FF]"
                        strokeWidth={2.5}
                      />
                      <div className="text-[#303030] font-pretendard text-[24px] font-bold leading-normal">
                        전문가 추천 중...
                      </div>
                    </div>
                    <div className="self-stretch text-[#6B6B6B] text-center font-pretendard text-[14px] font-medium leading-[20px] tracking-[-0.064px]">
                      입력하신 보고서와 분야, 평가 기준을 분석하여
                      <br />
                      적합한 전문가를 추천하고 있습니다.
                      <br />
                      잠시만 기다려주세요!
                    </div>
                  </div>
                </div>

                {/* Progress section */}
                <div className="flex flex-col items-center gap-3 relative">
                  <div className="flex w-[225px] h-3 items-center rounded-[50px] bg-[#E6E6E6] relative overflow-hidden">
                    <div
                      className="h-3 flex-shrink-0 rounded-l-[100px] bg-[#07F] transition-all duration-500 ease-in-out"
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                  <div className="text-[#878A8F] font-pretendard text-[16px] font-medium leading-normal tracking-[-0.064px] opacity-80">
                    전문가 리스트 불러오는 중 ...
                  </div>
                </div>
              </div>

              {/* Status items */}
              <div className="flex flex-col items-start gap-2 relative">
                {/* Status 1 */}
                <div
                  className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
                    step1Status
                  )} relative`}
                >
                  {renderStepIcon(step1Status)}
                  <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
                    보고서 분석중
                  </span>
                </div>

                {/* Status 2 */}
                <div
                  className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
                    step2Status
                  )} relative`}
                >
                  {renderStepIcon(step2Status)}
                  <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
                    전문가 분석중
                  </span>
                </div>

                {/* Status 3 */}
                <div
                  className={`flex w-[300px] p-3 items-center gap-4 rounded-lg ${getStepBackground(
                    step3Status
                  )} relative`}
                >
                  {renderStepIcon(step3Status)}
                  <span className="text-[#303030] font-pretendard text-lg font-semibold leading-8 tracking-[-0.36px]">
                    매칭중
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <ExpertEvaluationRequestModal
        isOpen={showExpertEvaluation}
        onClose={handleExpertEvaluationClose}
        onEvaluationRequest={handleEvaluationRequest}
        experts={experts}
      />

      <ExpertRecommendationCompleteModal
        isOpen={showCompleteModal}
        onClose={handleCompleteModalClose}
      />
    </>
  );
}
