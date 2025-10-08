"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ReportDetailPageProps {
  params: {
    id: string;
  };
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const router = useRouter();

  return (
    <div className="flex w-full p-8 min-h-screen bg-gray-50">
      <div className="flex flex-col p-11 gap-20 flex-1 rounded-[5px] bg-white">
        <div className="flex flex-col gap-10">
          {/* 보고서 임베딩 Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-black font-pretendard">
                보고서 임베딩
              </h1>
            </div>
            <div className="flex flex-col border border-[#F5F5F5]">
              {/* Report Title Row */}
              <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] shrink-0">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    보고서 제목
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                    기계제작 및 설치 서비스 고도화
                  </div>
                </div>
              </div>

              {/* Category Row */}
              <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] shrink-0">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    카테고리
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                    강소기업
                  </div>
                </div>
              </div>

              {/* Field Row */}
              <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] shrink-0">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    분야
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                    제조·산업기술·혁신
                  </div>
                </div>
              </div>

              {/* Keywords Row */}
              <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] shrink-0">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    키워드
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                    설비기술, LNG, CRT, 저장탱크, 제품개발, Ball Tank
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 보고서 등록 Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2A2A2A] font-pretendard leading-6">
                보고서 등록
              </h2>
            </div>
            <div className="flex flex-col border border-[#F5F5F5]">
              {/* File Attachment Row */}
              <div className="flex h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5]">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    파일 첨부
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-medium text-[#07F] font-pretendard leading-6 tracking-[-0.32px] underline">
                    강소기업1.pdf
                  </div>
                </div>
              </div>

              {/* Preview Row */}
              <div className="flex items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] self-stretch">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    미리보기
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-6 flex-1">
                  <div className="flex h-[555px] px-6 py-5 flex-col items-center gap-2.5 flex-1 rounded-xl border border-[#EEEEEF] bg-white relative">
                    {/* PDF Preview Background */}
                    <div className="flex flex-col items-start flex-1 self-stretch bg-gray-100 bg-[url('https://api.builder.io/api/v1/image/assets/TEMP/c5358080b3abe8820812fbd862c746a62c726290?width=1624')] bg-cover bg-center bg-no-repeat">
                      <div className="h-[689px] self-stretch"></div>
                    </div>
                    
                    {/* Scrollbar */}
                    <div className="absolute right-2.5 top-[153px] flex w-1.5 h-[371px] flex-col items-center rounded-full bg-[#F5F5F5]">
                      <div className="w-1.5 h-[317px] rounded-full bg-[#B2B2B2]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메타데이터 Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2A2A2A] font-pretendard leading-6">
                메타데이터
              </h2>
            </div>
            <div className="flex flex-col border border-[#F5F5F5]">
              {/* Registrant Row */}
              <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
                <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5] shrink-0">
                  <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                    등록자
                  </div>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                    admin01
                  </div>
                </div>
              </div>

              {/* Request Date and Version Row */}
              <div className="flex items-start">
                {/* Request Date */}
                <div className="flex items-center flex-1 border-b border-[#F5F5F5]">
                  <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5]">
                    <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                      요청일시
                    </div>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                      2023-11-15 12:22:23
                    </div>
                  </div>
                </div>
                
                {/* Version */}
                <div className="flex h-[72px] items-center flex-1 border-b border-[#F5F5F5]">
                  <div className="flex w-[160px] px-6 py-6 items-center gap-2.5 bg-[#F5F5F5]">
                    <div className="text-base font-normal text-[#555] font-pretendard leading-6 tracking-[-0.32px]">
                      버전
                    </div>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <div className="text-base font-normal text-[#303030] font-pretendard leading-6 tracking-[-0.32px]">
                      v3.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#A0A0A0] bg-white"
            onClick={() => router.back()}
          >
            <Menu className="w-4 h-4 text-[#555]" />
            <span className="text-sm font-bold text-[#555] font-pretendard leading-4 tracking-[-0.28px]">
              목록으로
            </span>
          </Button>
          
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              className="flex w-[79px] h-[45px] justify-center items-center gap-1.5 rounded-lg border border-[#EC221F] bg-white hover:bg-gray-50"
            >
              <span className="text-lg font-bold text-[#EC221F] font-pretendard tracking-[-0.36px]">
                삭제
              </span>
            </Button>
            
            <Button className="flex w-[79px] h-[45px] justify-center items-center gap-1.5 rounded-lg bg-[#07F] hover:bg-[#0066CC]">
              <span className="text-lg font-bold text-white font-pretendard tracking-[-0.36px]">
                수정
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
