"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Menu } from "lucide-react";

export default function ExpertDetailPage() {
  const router = useRouter();

  return (
    <div className="flex w-full p-8 items-start gap-2.5 min-h-screen bg-[rgba(245,245,245,1)]">
      <div className="flex p-11 flex-col items-end gap-20 flex-1 rounded-[5px] bg-white">
        <div className="flex flex-col items-start gap-10 self-stretch">
          {/* 전문가 임베딩 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-black font-['Pretendard'] text-2xl font-bold leading-8">
                전문가 임베딩
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch border border-[rgba(245,245,245,1)]">
              <div className="flex items-start self-stretch">
                <div className="flex h-[72px] items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 p-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                      이름
                    </div>
                  </div>
                  <div className="flex p-6 items-center gap-2.5 flex-1">
                    <div className="text-[#212B36] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                      박형범
                    </div>
                  </div>
                </div>
                <div className="flex h-[72px] items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 p-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                      연락처
                    </div>
                  </div>
                  <div className="flex p-6 items-center gap-2.5 flex-1">
                    <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                      010-1234-1234
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full h-[72px] items-center border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 shrink-0 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    전문 분야
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    헬스케어·IT
                  </div>
                </div>
              </div>
              <div className="flex w-full h-[72px] items-center border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 shrink-0 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    요약 소개
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    삼성 의료원 디지털 헬스 케어팀 출신, AI 의료기기 개발 다수
                    경험
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 소속 및 주요 경력 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-[#2A2A2A] font-['Pretendard'] text-xl font-bold leading-6">
                소속 및 주요 경력
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch border border-[rgba(245,245,245,1)]">
              <div className="flex h-[72px] items-center self-stretch border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    경력 년수
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[#212B36] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    총 15년
                  </div>
                </div>
              </div>
              <div className="flex h-[72px] items-center self-stretch border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    최근 소속/경력
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[#212B36] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    삼성의료원 디지털헬스케어팀
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 경력 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-[#2A2A2A] font-['Pretendard'] text-lg font-bold leading-6">
                핵심 경���
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 flex-1 self-stretch">
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      3년
                    </div>
                  </div>
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      2개월
                    </div>
                  </div>
                </div>
                <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                  <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                    사단법인 한국창업융합컨설팅학회 상임이사
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 flex-1 self-stretch">
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      4년
                    </div>
                  </div>
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      1개월
                    </div>
                  </div>
                </div>
                <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                  <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                    사단법인 중소기업융합학회 이사
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 성과 및 전문성 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-[#2A2A2A] font-['Pretendard'] text-lg font-bold leading-6">
                성과 및 전문성
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 flex-1 self-stretch">
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      2022
                    </div>
                  </div>
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      과제수행
                    </div>
                  </div>
                </div>
                <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                  <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                    지역특화산업육성+(R&D) 지역주력사업(중소기업벤처부)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 flex-1 self-stretch">
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      2021
                    </div>
                  </div>
                  <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                    <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                      수상경력
                    </div>
                  </div>
                </div>
                <div className="flex p-[16px_18px] items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                  <div className="text-[rgba(30,30,30,1)] font-['Pretendard'] text-base font-normal leading-6">
                    국가사회발전 분야 ��주전남지방중소기업청장 표창
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 첨부자료 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-[#2A2A2A] font-['Pretendard'] text-xl font-bold leading-6">
                첨부자료
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch border border-[rgba(245,245,245,1)]">
              <div className="flex h-[72px] items-center self-stretch border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    파일 첨부
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[#07F] font-['Pretendard'] text-base font-medium leading-6 tracking-[-0.32px] underline cursor-pointer">
                    박형범이력.hwp
                  </div>
                </div>
              </div>
              <div className="flex w-full h-[72px] items-center border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 shrink-0 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    노출 여부
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    노출
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메타데이터 섹션 */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="text-[#2A2A2A] font-['Pretendard'] text-xl font-bold leading-6">
                메타데이터
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch border border-[rgba(245,245,245,1)]">
              <div className="flex w-full h-[72px] items-center border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 shrink-0 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    등록자
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    admin01
                  </div>
                </div>
              </div>
              <div className="flex w-full h-[72px] items-center border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 p-6 items-center gap-2.5 shrink-0 bg-[rgba(245,245,245,1)]">
                  <div className="text-[#555] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    등록 일시
                  </div>
                </div>
                <div className="flex p-6 items-center gap-2.5 flex-1">
                  <div className="text-[rgba(48,48,48,1)] font-['Pretendard'] text-base font-normal leading-6 tracking-[-0.32px]">
                    2023-11-15 12:22:23
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="flex justify-between items-center self-stretch">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex p-[10px_12px] justify-center items-center gap-1.5 rounded border border-[#A0A0A0] bg-white hover:bg-gray-50"
          >
            <Menu className="w-4 h-4 text-[#555]" />
            <span className="text-[#555] font-['Pretendard'] text-sm font-bold leading-4 tracking-[-0.28px]">
              목록으로
            </span>
          </Button>
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              className="flex w-[79px] h-[45px] justify-center items-center gap-1.5 rounded-lg border border-[rgba(236,34,31,1)] bg-white hover:bg-red-50"
            >
              <span className="text-[rgba(236,34,31,1)] font-['Pretendard'] text-lg font-bold tracking-[-0.36px]">
                삭제
              </span>
            </Button>
            <Button className="flex w-[79px] h-[45px] justify-center items-center gap-1.5 rounded-lg bg-[#07F] hover:bg-[#0066dd]">
              <span className="text-white font-['Pretendard'] text-lg font-bold tracking-[-0.36px]">
                수정
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
