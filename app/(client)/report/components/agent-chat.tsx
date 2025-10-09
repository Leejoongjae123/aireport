"use client";

import React from "react";

export default function AgentChat() {
  const quickActions = [
    "자세히 쓰기",
    "간결하게 쓰기",
    "윤문하기",
    "논문검색",
    "뉴스검색",
    "특허검색",
  ];

  return (
    <>
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
              안녕하세요! Report-GPT입니다. 보고서를 검토하고 개선 사항을
              제안해드리겠습니다. 어떤 도움이 필요하신가요?
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
              [논문 검색 요청] &ldquo;디지털전환과 함께 데이터 기반 경영&rdquo;
              관련 최신 논문을 탐색 중입니다...
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
