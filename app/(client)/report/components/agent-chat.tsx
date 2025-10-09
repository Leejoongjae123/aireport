"use client";

import React from "react";

const AIIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9011 14.0306V11.0934M10.9011 14.0306C12.7 14.0306 14.5674 14.0306 16.2245 14.2454C16.9194 14.3321 17.5669 14.6434 18.0687 15.1319C18.5704 15.6204 18.8988 16.2594 19.004 16.9517C19.1388 17.8729 19.1388 18.8077 19.1388 20.3986C19.1388 21.9917 19.1388 22.9266 19.0017 23.8454C18.8967 24.5371 18.569 25.1756 18.0682 25.664C17.5674 26.1524 16.9209 26.4641 16.2268 26.5517C14.5697 26.7689 12.7023 26.7689 10.9034 26.7689C9.10683 26.7689 7.2394 26.7689 5.58225 26.5517C4.88739 26.465 4.23985 26.1538 3.73814 25.6653C3.23643 25.1768 2.90801 24.5378 2.80283 23.8454C2.66797 22.9266 2.66797 21.9917 2.66797 20.3986C2.66797 18.8054 2.66797 17.8729 2.80283 16.9517C2.90801 16.2594 3.23643 15.6204 3.73814 15.1319C4.23985 14.6434 4.88739 14.3321 5.58225 14.2454C7.2394 14.0306 9.10454 14.0306 10.9011 14.0306ZM13.8657 20.842V19.9552M7.92968 20.842V19.9552M10.9011 11.0637C12.3091 11.0637 13.1023 10.2706 13.1023 8.86259C13.1023 7.45459 12.3091 6.66602 10.9011 6.66602C9.49311 6.66602 8.70225 7.45916 8.70225 8.86487C8.70225 10.2706 9.4954 11.0637 10.9011 11.0637Z"
      stroke="#1E1E1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.6667 9.33333C27.5787 10.2169 26.4 11.3956 25.3333 14.6667C24.2667 11.3956 23.088 10.2169 20 9.33333C23.088 8.44978 24.2667 7.27111 25.3333 4C26.4 7.27111 27.5787 8.44978 30.6667 9.33333Z"
      stroke="#1E1E1E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

interface AgentChatProps {
  activeTab: "chat" | "diagnosis";
  setActiveTab: (tab: "chat" | "diagnosis") => void;
}

export default function AgentChat({ activeTab, setActiveTab }: AgentChatProps) {
  const quickActions = [
    "자세히 쓰기",
    "간결하게 쓰기",
    "윤문하기",
    "논문검색",
    "뉴스검색",
    "특허검색",
  ];

  return (
    <div className="flex flex-col">
      {/* Agent Header */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-1">
          <AIIcon />
          <h2 className="text-[#303030] font-semibold text-xl leading-8 tracking-[-0.4px]">
            에이전트
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-between items-center p-1.5 rounded-full border border-[#EEF1F7] bg-[#EFF2F7]">
          <button
            className={`flex-1 py-2 px-2.5 text-sm font-semibold rounded-full transition-colors ${
              activeTab === "chat"
                ? "text-white bg-[#0077FF]"
                : "text-[#0077FF] bg-transparent"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            대화
          </button>
          <button
            className={`flex-1 py-2 px-2.5 text-sm font-semibold rounded-full transition-colors ${
              activeTab === "diagnosis"
                ? "text-white bg-[#0077FF]"
                : "text-[#0077FF] bg-transparent"
            }`}
            onClick={() => setActiveTab("diagnosis")}
          >
            AI 진단
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex py-5 items-start content-start gap-2 self-stretch flex-wrap border-b border-[#D9D9D9] mb-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="flex h-6 py-1 px-2 justify-center items-center gap-1 rounded border border-[#BAD1EC] bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#5A5A5A] font-medium text-xs leading-4">
              {action}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex h-[513px] flex-col items-end gap-3 self-stretch">
        <div className="flex flex-col items-end gap-3 flex-1 self-stretch">
          {/* AI Welcome Message */}
          <div className="flex py-2.5 px-4 items-center gap-2.5 self-stretch rounded-lg bg-[#FAFAFA]">
            <div className="flex-1 text-[#5A5A5A] font-medium text-sm leading-5 tracking-[-0.064px]">
              안녕하세요! Report-GPT입니다. 보고서를 검토하고 개선 사항을 제안해드리겠습니다. 어떤 도움이 필요하신가요?
            </div>
          </div>

          {/* User Message */}
          <div className="flex py-2.5 px-4 items-center gap-2.5 rounded-lg bg-[#F5F5F5]">
            <div className="text-[#1E1E1E] text-right font-medium text-sm leading-5 tracking-[-0.064px]">
              [논문 검색 요청]
            </div>
          </div>

          {/* AI Response Message */}
          <div className="flex py-2.5 px-4 items-center gap-2.5 self-stretch rounded-lg bg-[#FAFAFA]">
            <div className="flex-1 text-[#5A5A5A] font-medium text-sm leading-5 tracking-[-0.064px]">
              [논문 검색 요청] "디지털전환과 함께 데이터 기반 경영" 관련 최신 논문을 탐색 중입니다...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
