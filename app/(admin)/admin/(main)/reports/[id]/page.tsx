"use client";

import { Button } from "@/components/ui/button";
import Arrow from "@/components/icons/Arrow";
import { Camera, RotateCcw } from "lucide-react";
import Image from "next/image";

const tableOfContents = [
  {
    section: "사업 개요",
    items: [
      {
        name: "추진 배경 및 필요성",
        score: "112/100자 · 75점",
        highlighted: true,
      },
      { name: "사업 목적 및 비전", score: "112/100자 · 75점" },
      { name: "목표시장 및 수요 분석", score: "112/100자 · 60점" },
    ],
  },
  {
    section: "연구개발 목표 및 전략",
    items: [
      { name: "최종목표", score: "112/100자 · 75점" },
      { name: "단계별 목표", score: "112/100자 · 75점" },
      { name: "사업화 및 확산 전략", score: "112/100자 · 75점" },
    ],
  },
  {
    section: "기술 및 서비스 개요",
    items: [
      {
        name: "활용 기술 및 알고리즘 수준 및 완성도",
        score: "112/100자 · 75점",
      },
      { name: "서비스 개념, 혁신성 및 우수성", score: "112/100자 · 75점" },
    ],
  },
];

const reportContent = `리테일 산업은 디지털 전환과 함께 데이터 ���반 경영이 필수 요소로 자리잡고 있습니다. 온라인·오프라인 채널의 융합, 소비자 구매 패턴의 다변화, 경기 변동성 확대 등으로 인해 재고 관리, 공급망 최적화, 판촉 전략 수립의 복잡성이 과거보다 크게 증가하였습니다.
특히,
수요 예측의 불확실성으로 인한 과잉 재고 및 품절 리스크 발생
단기 프로모션 및 마케팅 효과 측정의 어려움
소비자 데이터 활용의 한계로 맞춤형 전략 수립이 미흡
이라는 문제점들이 리테일 기업의 수익성 및 경쟁력 약화로 이어지고 있습니다.
이러한 환경 속에서, AI 기반 수요예측 솔루션은 대규모 거래 데이터와 외부 요인(계절성, 지역별 트렌드, 거시경제 지표 등)을 결합하여 정교한 수요 예측 모델을 제공함으로써, 리테일 기업이 직면한 문제를 근본적으로 해결할 수 있습니다.
이를 통해 기업은:
재고 관리 최적화 – 과잉재고 및 품절을 최소화하여 비용 절감 및 매출 기회 극대화
공급망 효율화 – 유통 단계별 수요 변동을 사전에 예측하여 운영 효율성 제고
춤형 마케팅 강화 – 고객 세그먼트별 구매 패턴 분석을 기반으로 한 타겟 마케팅 전략 수립
경쟁력 확보 – 급변하는 리테일 시장에서 차��화된 데이터 기반 의사결정 역량 확보
따라서, 본 사업은 리테일 산업의 디지털 경쟁력 강화와 지속 가능한 성장 기반 마련을 위해 추진이 필요하며, 향후 관련 산업 전반에 걸쳐 확장성과 파급 효과가 기대됩니다.`;

export default function ReportDetailPage() {
  return (
    <div className="flex w-full p-8 mx-auto">
      <div className="flex w-full items-start gap-3 h-full min-h-screen">
        <div className="flex p-11 flex-col justify-center items-center gap-6 flex-1 rounded-[5px] bg-white">
          <div className="flex flex-col items-start gap-6 self-stretch">
            {/* Header */}
            <div className="flex justify-between items-center self-stretch">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/back.svg"
                  alt="Arrow Left"
                  width={32}
                  height={32}
                />
                <span className="text-[#767676] font-pretendard text-base font-semibold leading-6">
                  뒤로가기
                </span>
              </div>
              <div className="flex items-start gap-4">
                <Button
                  variant="outline"
                  className="flex p-2 justify-center items-center gap-2 rounded border border-[#D9D9D9] bg-white"
                >
                  <Image
                    src="/images/word.svg"
                    alt="Word"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#5A5A5A] font-pretendard text-xs font-bold leading-4">
                    보고서 다운로드
                  </span>
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col items-start gap-4 self-stretch">
              <h1 className="text-[#303030] font-pretendard text-2xl font-semibold leading-8">
                보고서 생성관리
              </h1>

              {/* Report Info Section */}
              <div className="flex p-8 items-end gap-8 self-stretch rounded bg-[#F5FAFF]">
                <div className="flex flex-col items-start flex-1 self-stretch">
                  <div className="flex py-2 items-center self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      보고서 ID
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      REQ-250216-032
                    </div>
                  </div>
                  <div className="flex py-2 items-center self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      사용자
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      홍길동 (hong@gmail.com)
                    </div>
                  </div>
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      스냅샷 시각
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      2025-09-09 15:32
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px self-stretch border-l border-[#D9D9D9]"></div>

                <div className="flex flex-col justify-end items-start flex-1 self-stretch">
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      분야
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      디지털·ICT·AI
                    </div>
                  </div>
                  <div className="flex py-2 items-start self-stretch">
                    <div className="w-[120px] text-[#767676] font-pretendard text-base font-semibold leading-6">
                      버전
                    </div>
                    <div className="w-[200px] text-[#0077FF] font-pretendard text-base font-bold leading-6">
                      v12
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex items-start gap-3 self-stretch">
            {/* Table of Contents Sidebar */}
            <div className="flex w-[248px] p-6 flex-col items-center gap-2.5 rounded-xl border border-[#D9D9D9] bg-white">
              <div className="flex flex-col items-start self-stretch">
                <div className="flex flex-col items-start gap-1 self-stretch">
                  <h2 className="text-[#303030] font-pretendard text-xl font-semibold leading-8 tracking-[-0.4px]">
                    목차
                  </h2>
                </div>

                <div className="flex flex-col items-start self-stretch">
                  {tableOfContents.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="flex pt-5 flex-col items-start gap-3 self-stretch border-b border-[#D9D9D9] last:border-b-0"
                    >
                      <div className="self-stretch text-[#202224] font-pretendard text-base font-semibold leading-normal tracking-[-0.064px] opacity-80">
                        {section.section}
                      </div>
                      <div className="flex flex-col items-start gap-2.5 self-stretch">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`flex p-3 items-center gap-5 self-stretch rounded-md ${
                              item.highlighted ? "bg-[#E8F3FF]" : ""
                            }`}
                          >
                            <div className="flex flex-col justify-center items-start gap-0.5 flex-1">
                              <div className="flex items-center gap-1.5">
                                <div className="text-[#1E1E1E] font-pretendard text-sm font-semibold leading-4">
                                  {item.name}
                                </div>
                              </div>
                              <div className="text-[#757575] font-pretendard text-[10px] font-normal leading-4">
                                {item.score}
                              </div>
                            </div>
                            <Arrow
                              direction="right"
                              size={20}
                              color="#878A8F"
                              className="w-5 h-5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Report Content */}
            <div className="flex p-5 px-8 flex-col items-center gap-2.5 flex-1 self-stretch rounded-xl border border-[#D9D9D9] bg-white relative">
              <div className="flex flex-col items-start flex-1 self-stretch">
                <div className="flex p-8 px-3 flex-col items-start gap-6 self-stretch">
                  <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex flex-col items-center gap-1 self-stretch">
                      <h1 className="text-[#303030] font-pretendard text-[32px] font-bold leading-[44px] tracking-[-0.64px]">
                        AI 기반 리테일 수요예측 솔루션 사업계획서
                      </h1>
                    </div>
                    <div className="self-stretch text-black text-right font-pretendard text-base font-semibold leading-6">
                      2025년 9월 9일
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 self-stretch">
                    <h2 className="text-black font-pretendard text-xl font-semibold leading-6">
                      1. 사업 개요
                    </h2>
                    <h3 className="text-black font-pretendard text-base font-semibold leading-6">
                      1.1 추진 배경 및 필요성
                    </h3>
                    <div className="self-stretch text-[#343330] font-pretendard text-base font-normal leading-6">
                      {reportContent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Scrollbar */}
              <div className="flex w-1.5 pb-[434px] flex-col items-center relative -right-4 -bottom-3 rounded-full bg-[#F5F5F5]">
                <div className="w-1.5 h-[317px] rounded-full bg-[#B2B2B2] absolute left-0 top-0"></div>
              </div>

              {/* Snapshot Toast Notification */}
              <div className="flex w-[383px] p-3 px-5 justify-between items-center rounded-[10px] border border-[#07F] bg-[#E1EDFF] absolute bottom-5">
                <div className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-[#0077FF]" />
                  <span className="text-[#07F] font-pretendard text-base font-bold leading-5">
                    새 스냅샷 감지됨 (15:40)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 p-2 px-3 justify-center items-center gap-1.5 rounded-md border border-[#D9D9D9] bg-white"
                >
                  <RotateCcw className="w-4 h-4 text-[#5A5A5A]" />
                  <span className="text-[#5A5A5A] font-inter text-sm font-normal leading-5">
                    새로고침
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
