"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  AlignLeft,
  Link,
  Image,
  Edit,
  RotateCcw,
  Bot
} from "lucide-react";

// Custom Icons as SVG components
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_920_1621)">
      <mask id="mask0_920_1621" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
        <path d="M9.00001 16.5C9.9851 16.5012 10.9607 16.3078 11.8708 15.9308C12.7809 15.5538 13.6076 15.0007 14.3033 14.3033C15.0007 13.6076 15.5538 12.7809 15.9308 11.8708C16.3078 10.9607 16.5012 9.9851 16.5 9.00001C16.5012 8.01491 16.3078 7.03929 15.9308 6.12919C15.5538 5.21909 15.0007 4.39245 14.3033 3.69676C13.6076 2.99932 12.7809 2.44621 11.8708 2.06922C10.9607 1.69223 9.9851 1.49879 9.00001 1.50001C8.01491 1.49879 7.03929 1.69223 6.12919 2.06922C5.21909 2.44621 4.39245 2.99932 3.69676 3.69676C2.99932 4.39245 2.44621 5.21909 2.06922 6.12919C1.69223 7.03929 1.49879 8.01491 1.50001 9.00001C1.49879 9.9851 1.69223 10.9607 2.06922 11.8708C2.44621 12.7809 2.99932 13.6076 3.69676 14.3033C4.39245 15.0007 5.21909 15.5538 6.12919 15.9308C7.03929 16.3078 8.01491 16.5012 9.00001 16.5Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M6 9L8.25 11.25L12.75 6.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </mask>
      <g mask="url(#mask0_920_1621)">
        <path d="M0 0H18V18H0V0Z" fill="#0077FF"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_920_1621">
        <rect width="18" height="18" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.6632 1.89912C9.4037 1.40863 8.5967 1.40863 8.3372 1.89912L1.5872 14.6491C1.52667 14.7634 1.49673 14.8914 1.50028 15.0207C1.50384 15.15 1.54077 15.2762 1.6075 15.387C1.67422 15.4978 1.76847 15.5895 1.88109 15.6531C1.9937 15.7167 2.12086 15.7502 2.2502 15.7501H15.7502C15.8795 15.7504 16.0067 15.7171 16.1194 15.6536C16.2321 15.5901 16.3263 15.4984 16.393 15.3876C16.4597 15.2768 16.4966 15.1506 16.5 15.0213C16.5034 14.892 16.4732 14.764 16.4125 14.6499L9.6632 1.89912ZM9.7502 12.7501C9.7502 13.1643 9.41442 13.5001 9.0002 13.5001C8.58599 13.5001 8.2502 13.1643 8.2502 12.7501C8.2502 12.3359 8.58599 12.0001 9.0002 12.0001C9.41442 12.0001 9.7502 12.3359 9.7502 12.7501ZM9.0005 10.5001C8.58612 10.5001 8.2502 10.1642 8.2502 9.74982V7.5002C8.2502 7.08594 8.58602 6.75012 9.00028 6.75012C9.41448 6.75012 9.75027 7.08585 9.75035 7.50005L9.7508 9.74967C9.75089 10.1641 9.41494 10.5001 9.0005 10.5001Z" fill="#F9433F"/>
  </svg>
);

const CaretRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.4137 10.6632L8.16374 16.9132C7.98761 17.0894 7.74874 17.1883 7.49967 17.1883C7.2506 17.1883 7.01173 17.0894 6.83561 16.9132C6.65949 16.7371 6.56055 16.4983 6.56055 16.2492C6.56055 16.0001 6.65949 15.7612 6.83561 15.5851L12.4223 9.99997L6.83717 4.41325C6.74997 4.32604 6.68079 4.22251 6.6336 4.10857C6.5864 3.99463 6.56211 3.87251 6.56211 3.74918C6.56211 3.62586 6.5864 3.50374 6.6336 3.3898C6.68079 3.27586 6.74997 3.17233 6.83717 3.08512C6.92438 2.99792 7.02791 2.92874 7.14185 2.88155C7.25579 2.83435 7.37791 2.81006 7.50124 2.81006C7.62456 2.81006 7.74668 2.83435 7.86062 2.88155C7.97456 2.92874 8.07809 2.99792 8.1653 3.08512L14.4153 9.33512C14.5026 9.42232 14.5718 9.5259 14.619 9.63991C14.6662 9.75392 14.6904 9.87612 14.6903 9.99951C14.6901 10.1229 14.6656 10.245 14.6182 10.3589C14.5707 10.4728 14.5012 10.5763 14.4137 10.6632Z" fill="#878A8F"/>
  </svg>
);

const AIIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.9001 14.0311V11.0939M10.9001 14.0311C12.699 14.0311 14.5664 14.0311 16.2236 14.2459C16.9184 14.3326 17.566 14.6439 18.0677 15.1324C18.5694 15.6209 18.8978 16.2599 19.003 16.9522C19.1378 17.8734 19.1378 18.8082 19.1378 20.3991C19.1378 21.9922 19.1378 22.9271 19.0007 23.8459C18.8958 24.5376 18.568 25.1761 18.0672 25.6645C17.5664 26.1529 16.9199 26.4646 16.2258 26.5522C14.5687 26.7694 12.7013 26.7694 10.9024 26.7694C9.10585 26.7694 7.23842 26.7694 5.58128 26.5522C4.88641 26.4655 4.23887 26.1543 3.73716 25.6658C3.23545 25.1772 2.90703 24.5382 2.80185 23.8459C2.66699 22.9271 2.66699 21.9922 2.66699 20.3991C2.66699 18.8059 2.66699 17.8734 2.80185 16.9522C2.90703 16.2599 3.23545 15.6209 3.73716 15.1324C4.23887 14.6439 4.88641 14.3326 5.58128 14.2459C7.23842 14.0311 9.10356 14.0311 10.9001 14.0311ZM13.8647 20.8425V19.9556M7.92871 20.8425V19.9556M10.9001 11.0642C12.3081 11.0642 13.1013 10.2711 13.1013 8.86308C13.1013 7.45508 12.3081 6.6665 10.9001 6.6665C9.49214 6.6665 8.70128 7.45965 8.70128 8.86536C8.70128 10.2711 9.49442 11.0642 10.9001 11.0642Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30.6667 9.33333C27.5787 10.2169 26.4 11.3956 25.3333 14.6667C24.2667 11.3956 23.088 10.2169 20 9.33333C23.088 8.44978 24.2667 7.27111 25.3333 4C26.4 7.27111 27.5787 8.44978 30.6667 9.33333Z" stroke="#1E1E1E" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

interface TableOfContentsItem {
  id: string;
  title: string;
  completed: boolean;
  hasError?: boolean;
  score: string;
  children?: TableOfContentsItem[];
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className = "" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`flex h-3 items-center self-stretch rounded-full bg-[#E6E6E6] ${className}`}>
      <div 
        className="h-3 rounded-l-full bg-[#0077FF] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function ReportEditorPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['business-overview']);
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnosis'>('diagnosis');

  const tableOfContents: TableOfContentsItem[] = [
    {
      id: 'business-overview',
      title: '사업 개요',
      completed: true,
      score: '',
      children: [
        { id: 'background', title: '추진 배경 및 필요성', completed: true, score: '112/100자 · 75점' },
        { id: 'purpose', title: '사업 목적 및 비전', completed: true, score: '112/100자 · 75점' },
        { id: 'market-analysis', title: '목표시장 및 수요 분석', completed: false, hasError: true, score: '112/100자 · 60점' },
      ]
    },
    {
      id: 'research-goals',
      title: '연구개발 목표 및 전략',
      completed: true,
      score: '',
      children: [
        { id: 'final-goal', title: '최종목표', completed: true, score: '112/100자 · 75점' },
        { id: 'step-goals', title: '단계별 목표', completed: true, score: '112/100자 · 75점' },
        { id: 'business-strategy', title: '사업화 및 확산 전략', completed: true, score: '112/100자 · 75점' },
      ]
    },
    {
      id: 'tech-overview',
      title: '기술 및 서비스 개요',
      completed: true,
      score: '',
      children: [
        { id: 'tech-level', title: '활용 기술 및 알고리즘 수준 및 완성도', completed: true, score: '112/100자 · 75점' },
        { id: 'service-innovation', title: '서비스 개념, 혁신성 및 우수성', completed: true, score: '112/100자 · 75점' },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderTableOfContentsItem = (item: TableOfContentsItem, level: number = 0) => {
    const isExpanded = expandedSections.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="flex flex-col">
        {level === 0 ? (
          <div className="flex flex-col pt-5 border-b border-[#D9D9D9] pb-3">
            <div className="text-[#202224] font-semibold text-base opacity-80 mb-3">
              {item.title}
            </div>
            {hasChildren && (
              <div className="flex flex-col gap-2.5">
                {item.children!.map(child => (
                  <div key={child.id} className={`flex items-center gap-5 p-3 rounded-md ${child.completed && !child.hasError ? 'bg-[#E8F3FF]' : ''}`}>
                    <div className="flex flex-col justify-center items-start gap-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#1E1E1E] font-semibold text-sm">
                          {child.title}
                        </span>
                        {child.completed && !child.hasError && <CheckIcon />}
                        {child.hasError && <ErrorIcon />}
                      </div>
                      <div className="text-[#757575] text-xs">
                        {child.score}
                      </div>
                    </div>
                    <CaretRightIcon />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-5 p-3 rounded-md">
            <div className="flex flex-col justify-center items-start gap-0.5 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[#1E1E1E] font-semibold text-sm">
                  {item.title}
                </span>
                {item.completed && <CheckIcon />}
              </div>
              <div className="text-[#757575] text-xs">
                {item.score}
              </div>
            </div>
            <CaretRightIcon />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-start gap-3 w-full max-w-[1200px] mx-auto min-h-screen">
      {/* Left Sidebar - Table of Contents */}
      <Card className="w-[248px] p-6 flex-shrink-0 border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-1 mb-5">
            <h2 className="text-[#303030] font-bold text-xl leading-8 tracking-[-0.4px]">
              목차
            </h2>
          </div>
          <div className="flex flex-col">
            {tableOfContents.map(item => renderTableOfContentsItem(item))}
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[729px]">
        <Card className="p-8 border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full">
          <div className="flex flex-col h-full">
            {/* Rich Text Editor Toolbar */}
            <div className="flex flex-col gap-2.5 pb-9 border-b border-[#D9D9D9] mb-8">
              <div className="flex justify-center items-center gap-4">
                {/* Text Style */}
                <div className="flex items-center gap-4">
                  <div className="text-[#232325] text-base">Heading</div>
                  <ChevronDown className="w-4 h-4 text-[#232325]" />
                </div>
                
                <div className="w-px h-8 bg-[#E0E2E7]" />
                
                {/* Format Options */}
                <div className="flex justify-center items-center gap-6">
                  <Button variant="ghost" size="icon" className="text-[#232325] font-bold">B</Button>
                  <Button variant="ghost" size="icon" className="text-[#232325] italic">I</Button>
                  <Button variant="ghost" size="icon" className="text-[#232325] underline">U</Button>
                  <Button variant="ghost" size="icon" className="text-[#232325] line-through">S</Button>
                  <List className="w-5 h-5 text-[#232325]" />
                  <AlignLeft className="w-5 h-5 text-[#232325]" />
                </div>
                
                <div className="w-px h-8 bg-[#E0E2E7]" />
                
                {/* Attachments */}
                <div className="flex justify-center items-center gap-6">
                  <Link className="w-5 h-5 text-[#232325]" />
                  <Image className="w-5 h-5 text-[#232325]" />
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex flex-col gap-6 flex-1 px-3 py-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-1">
                  <h1 className="text-[#303030] font-bold text-[32px] leading-[44px] tracking-[-0.64px]">
                    AI 기반 리테일 수요예측 솔루션 사업계획서
                  </h1>
                </div>
                <div className="text-black font-semibold text-base text-right">
                  2025년 9월 9일
                </div>
              </div>

              <div className="flex flex-col gap-3 relative">
                {/* Highlighted section marker */}
                <div className="w-[229px] h-[21px] bg-[#AAD2FF] rounded-sm absolute left-[89px] top-[74px]" />
                
                <h2 className="text-black font-semibold text-xl">1. 사업 개요</h2>
                <h3 className="text-black font-semibold text-base">1.1 추진 배경 및 필요성</h3>
                
                <div className="text-[#343330] text-base leading-6">
                  리테일 산업은 디지털 전환과 함께 데이터 기반 경영이 필수 요소로 자리잡고 있습니다. 온라인·오프라인 채널의 융합, 소비자 구매 패턴의 다변화, 경기 변동성 확대 등으로 인해 재고 관리, 공급망 최적화, 판촉 전략 수립의 복잡성이 과거보다 크게 증가하였습니다.
                  <br /><br />
                  특히,<br />
                  • 수요 예측의 불확실성으로 인한 과잉 재고 및 품절 리스크 발생<br />
                  • 단기 프로모션 및 마케팅 효과 측정의 어려움<br />
                  • 소비자 데이터 활용의 한계로 맞춤형 전략 수립이 미흡<br />
                  이라는 문제점들이 리테일 기업의 수익성 및 경쟁력 약화로 이어지고 있습니다.
                  <br /><br />
                  이러한 환경 속에서, AI 기반 수요예측 솔루션은 대규모 거래 데이터와 외부 요인(계절성, 지역별 트렌드, 거시경제 지표 등)을 결합하여 정교한 수요 예측 모델을 제공함으로써, 리테일 기업이 직면한 문제를 근본적으로 해결할 수 ���습니다.
                  <br /><br />
                  이를 통해 기업은:<br />
                  • 재고 관리 최적화 – 과잉재고 및 품절을 최소화하여 비용 절감 및 매출 기회 극대화<br />
                  • 공급망 효율화 – 유통 단계별 수요 변동을 사전에 예측하여 운영 효율성 제고<br />
                  • 춤형 마케팅 강화 – 고객 세그먼트별 구매 패턴 분석을 기반으로 한 타겟 마케팅 전략 수립<br />
                  • 경쟁력 확보 – 급변하는 리테일 시장에서 차별화된 데이터 기반 의사결정 역량 확보<br />
                  <br />
                  따라서, 본 사업은 리테일 산업의 디지털 경쟁력 강화와 지속 가능한 성장 기반 마련을 위해 추진이 필요하며, 향후 관련 산업 전반에 걸쳐 확장성과 파급 효과가 기대됩니다.
                </div>

                <Button variant="outline" className="w-fit self-end mt-9 gap-1 h-9 px-3.5 border-[#D9D9D9]">
                  <Edit className="w-6 h-6 text-[#5A5A5A]" />
                  <span className="text-[#5A5A5A] font-semibold text-sm">수정 요청하기</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Scrollbar */}
      <div className="w-1.5 bg-[#F5F5F5] rounded-full relative h-[329px] mt-5">
        <div className="w-1.5 h-[317px] bg-[#B2B2B2] rounded-full absolute top-0 left-0" />
      </div>

      {/* Right Sidebar - AI Agent */}
      <Card className="w-[322px] p-6 flex-shrink-0 border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
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
                  activeTab === 'chat' 
                    ? 'text-[#0077FF] bg-transparent' 
                    : 'text-[#0077FF] bg-transparent'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                대화
              </button>
              <button
                className={`flex-1 py-2 px-2.5 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === 'diagnosis' 
                    ? 'text-white bg-[#0077FF]' 
                    : 'text-[#0077FF] bg-transparent'
                }`}
                onClick={() => setActiveTab('diagnosis')}
              >
                AI 진단
              </button>
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex py-5 gap-2 flex-wrap mb-5">
            <Card className="flex-1 p-5 border-[#BAD1EC]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <div className="text-[#0077FF] font-bold text-2xl">71점</div>
                    <div className="text-[#878A8F] text-xs opacity-80">전체 평가 점수</div>
                  </div>
                  <ProgressBar value={71} className="w-full" />
                </div>
                <div className="text-[#6B6B6B] text-xs leading-4 opacity-80">
                  본 사업은 리테일 시장 내 수요예측의 정확성과 실시간 분석 역량에서 높은 경쟁 우위를 보임. 다만, 데이터 품질관리 및 글로벌 진출 전략 구체화가 필요함.
                </div>
              </div>
            </Card>
          </div>

          {/* Technology Section */}
          <div className="flex pb-5 gap-2 flex-wrap mb-5">
            <Card className="flex-1 p-5 border-[#BAD1EC]">
              <div className="flex justify-between items-center mb-5 border-b border-[#D9D9D9] pb-5">
                <h3 className="text-[#303030] font-semibold text-lg">기술성</h3>
                <ChevronDown className="w-5 h-5 text-[#878A8F]" />
              </div>
              
              <div className="flex flex-col gap-5">
                {[
                  { title: '핵심 기술의 독창성 및 차별성', score: 80, description: '기존 리테일 예측 모델 대비 정밀도가 높으며,\n데이터 처리 알고리즘의 차별성이 명확함' },
                  { title: '기술 성숙도(TRL) 및 적용 가능성', score: 80, description: 'TRL 6~7 수준으로 상용화 단계 진입 가능.' },
                  { title: 'AI 모델/알고리즘의 정확도·성능·신뢰성', score: 80, description: '데이터셋 확장 시 안정성 추가 검증 필요.' },
                  { title: '데이터 확보 수준 및 품질 관리 체계', score: 80, description: '리테일 POS/CRM 데이터 연동 우수, 외부데이터 보강 필요' },
                  { title: '시스�� 아키텍처의 안정성 및 확장성', score: 80, description: '클라우드 기반 확장성 확보, 보안 강화 필요' },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="text-[#2B2B2B] font-semibold text-xs opacity-80">{item.title}</div>
                      <div className="text-[#2B2B2B] text-xs opacity-80">{item.score}/100</div>
                    </div>
                    <ProgressBar value={item.score} className="w-full" />
                    <div className="text-[#6B6B6B] text-xs leading-4 opacity-80 whitespace-pre-line">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Business Section */}
          <div className="flex pb-5 gap-2 flex-wrap mb-5">
            <Card className="flex-1 p-5 border-[#BAD1EC]">
              <div className="flex justify-between items-center">
                <h3 className="text-[#303030] font-semibold text-lg">사업성</h3>
                <ChevronRight className="w-5 h-5 text-[#878A8F]" />
              </div>
            </Card>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" className="w-full gap-3 border-[#D9D9D9] py-3">
            <RotateCcw className="w-4 h-4 text-[#6C6C6C]" />
            <span className="text-[#757575] font-semibold text-base">새로고침</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
