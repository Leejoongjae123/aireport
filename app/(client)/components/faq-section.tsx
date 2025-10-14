"use client";

import Image from "next/image";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "AI가 생성한 보고서 품질은 어느 정도인가요?",
    answer:
      "AI가 자동으로 초안을 생성하지만, 내부 진단 기능과 전문가 피드백을 통해 완성도를 높일 수 있습니다. 업종별 맞춤형 템플릿과 최신 트렌드를 반영하여 전문적인 수준의 보고서를 제공합니다. 또한 지속적인 학습을 통해 보고서 품질이 계속 개선되고 있습니다.",
  },
  {
    id: 2,
    question: "보고서 작성에 얼마나 걸리나요?",
    answer:
      "기본 정보 입력 후 AI 생성까지 약 5분이 소요됩니다. 추가로 사용자가 직접 수정하거나 보완하는 시간은 개인차가 있지만, 평균적으로 30분~1시간 내외로 완성도 높은 보고서를 작성할 수 있습니다. 기존 수작업 대비 약 80% 이상의 시간을 절약할 수 있습니다.",
  },
  {
    id: 3,
    question: "전문가 선정은 어떻게 진행되나요?",
    answer:
      "보고서의 업종과 분야에 맞는 전문가를 AI가 자동으로 매칭합니다. 각 전문가의 학력, 경력, 전문 분야, 평가 이력 등을 종합적으로 분석하여 최적의 전문가를 추천해드립니다. 사용자는 추천된 전문가 중에서 직접 선택하거나, 추가 검색을 통해 원하는 전문가를 찾을 수 있습니다.",
  },
  {
    id: 4,
    question: "컨설팅 요청은 어떻게 진행되나요?",
    answer:
      "전문가 평가를 받은 후, 평가 결과 페이지에서 직접 컨설팅을 요청할 수 있습니다. 요청 시 원하는 컨설팅 주제와 일정을 제안하면, 전문가가 확인 후 일정을 조율합니다. 컨설팅은 온라인(화상 회의) 또는 오프라인(대면 미팅) 중 선택 가능하며, 비용은 전문가의 경력과 소요 시간에 따라 책정됩니다.",
  },
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-auto self-stretch bg-[#ECF5FF]">
      <div className="flex h-auto w-full items-center gap-2.5 px-[115px] py-[88px]">
        <Image
          src="/images/faq.png"
          alt="FAQ 이미지"
          width={500}
          height={400}
        />
        <div className="flex w-[591px] flex-col items-start gap-2.5 p-2.5">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <h2 className="self-stretch text-[30px] font-semibold text-[#262626]">
              자주 묻는 질문 (FAQ)
            </h2>
            <div className="flex flex-col items-start gap-2 self-stretch">
              {faqData.map((faq) => {
                const isOpen = openItems.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="flex flex-col items-start gap-2.5 self-stretch rounded-md bg-white p-6 transition-all duration-200"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`flex-1 text-lg ${
                          isOpen
                            ? "font-semibold text-[#0077FF]"
                            : "font-normal text-[#303030]"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ECF5FF] transition-all hover:bg-[#d6ebff]"
                        aria-label={isOpen ? "답변 닫기" : "답변 열기"}
                      >
                        {isOpen ? (
                          <svg
                            width="12"
                            height="2"
                            viewBox="0 0 12 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.857178 1.11353H11.1429"
                              stroke="#0077FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.857178 6.11353H11.1429"
                              stroke="#0077FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M6.00488 0.975586V11.2613"
                              stroke="#0077FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {isOpen && (
                      <p className="w-full text-base font-normal leading-6 text-[#606060] animate-in fade-in slide-in-from-top-2 duration-200">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
