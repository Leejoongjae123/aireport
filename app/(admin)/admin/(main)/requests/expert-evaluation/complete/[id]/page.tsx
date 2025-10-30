"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, Menu } from "lucide-react";

// Star Rating Component for display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.9852 10.7229L17.7571 14.4129L19.0236 19.9067C19.0906 20.1939 19.0715 20.4945 18.9686 20.7709C18.8658 21.0472 18.6837 21.2872 18.4452 21.4606C18.2067 21.6341 17.9223 21.7334 17.6277 21.7462C17.3331 21.7589 17.0412 21.6845 16.7886 21.5323L11.9971 18.6261L7.2158 21.5323C6.96321 21.6845 6.67135 21.7589 6.37671 21.7462C6.08208 21.7334 5.79773 21.6341 5.55923 21.4606C5.32074 21.2872 5.13866 21.0472 5.03578 20.7709C4.9329 20.4945 4.91378 20.1939 4.9808 19.9067L6.24549 14.4186L2.01643 10.7229C1.79275 10.53 1.631 10.2754 1.55148 9.99089C1.47195 9.70642 1.47819 9.4048 1.5694 9.12385C1.66061 8.84291 1.83274 8.59515 2.0642 8.41164C2.29566 8.22813 2.57615 8.11705 2.87049 8.09231L8.44487 7.6095L10.6208 2.4195C10.7344 2.14717 10.9261 1.91455 11.1717 1.75093C11.4172 1.58731 11.7057 1.5 12.0008 1.5C12.2959 1.5 12.5844 1.58731 12.8299 1.75093C13.0755 1.91455 13.2672 2.14717 13.3808 2.4195L15.5633 7.6095L21.1358 8.09231C21.4301 8.11705 21.7106 8.22813 21.9421 8.41164C22.1736 8.59515 22.3457 8.84291 22.4369 9.12385C22.5281 9.4048 22.5343 9.70642 22.4548 9.99089C22.3753 10.2754 22.2135 10.53 21.9899 10.7229H21.9852Z"
              fill={star <= rating ? "#767676" : "#E6E6E6"}
            />
          </svg>
        ))}
      </div>
      <span className="text-xl font-semibold text-[#757575] opacity-80 leading-5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// Evaluation Rating Card Component
function EvaluationRatingCard({ title, rating }: { title: string; rating: number }) {
  return (
    <div className="flex p-6 justify-between items-start rounded bg-[#F7F7F7]">
      <div className="flex-1 text-base font-semibold text-[#767676]">
        {title}
      </div>
      <div className="flex items-center gap-6">
        <StarRating rating={rating} />
      </div>
    </div>
  );
}

export default function ExpertEvaluationCompletePage() {
  const params = useParams();
  const router = useRouter();

  const handleGoToList = () => {
    router.push("/admin/requests/expert-evaluation");
  };

  const handleCancel = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/admin/requests/expert-evaluation/${params.id}`);
  };

  return (
    <div className="flex w-full p-8">
      <div className="flex flex-col w-full p-11 gap-6 bg-white rounded-[5px]">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-[#303030]">전문가 평가</h1>
          
          {/* Basic Information Section */}
          <div className="flex p-8 items-end gap-8 border border-[#D9D9D9] rounded bg-[#FAFAFA]">
            <div className="flex flex-col flex-1">
              <div className="flex py-2 items-center">
                <div className="w-[120px] text-base font-semibold text-[#767676]">보고서 ID</div>
                <div className="text-base font-bold text-[#303030]">REQ-250216-032</div>
              </div>
              <div className="flex py-2 items-center">
                <div className="w-[120px] text-base font-semibold text-[#767676]">사용자</div>
                <div className="text-base font-bold text-[#303030]">홍길동 (hong@gmail.com)</div>
              </div>
              <div className="flex py-2 items-start">
                <div className="w-[120px] text-base font-semibold text-[#767676]">요청일</div>
                <div className="text-base font-bold text-[#303030]">2025-09-09 15:32</div>
              </div>
            </div>
            
            <svg width="2" height="124" viewBox="0 0 2 124" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1V123" stroke="#D9D9D9" strokeLinecap="round"/>
            </svg>
            
            <div className="flex flex-col flex-1 justify-end">
              <div className="flex py-2 items-start">
                <div className="w-[120px] text-base font-semibold text-[#767676]">상태</div>
                <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[#CFF7D3] text-[#025429] border-none">
                  제출 완료
                </Badge>
              </div>
              <div className="flex py-2 items-start">
                <div className="w-[120px] text-base font-semibold text-[#767676]">업종</div>
                <div className="text-base font-bold text-[#303030]">IT·소프트웨어</div>
              </div>
              <div className="flex py-2 items-start">
                <div className="w-[120px] text-base font-semibold text-[#767676]">마감일</div>
                <div className="text-base font-bold text-[#303030]">2025-02-20</div>
              </div>
            </div>
          </div>

          {/* Target Report Information Section */}
          <div className="flex flex-col p-8 gap-4 border border-[#D9D9D9] rounded bg-[#FAFAFA]">
            <h2 className="text-xl font-bold text-black">대상 보고서 정보</h2>
            <div className="flex items-center gap-8">
              <div className="flex flex-col flex-1">
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">제목</div>
                  <div className="text-base font-bold text-[#303030]">Series-A IR 초안</div>
                </div>
                <div className="flex py-2 items-center">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">업종</div>
                  <div className="text-base font-bold text-[#303030]">디지털·ICT·AI</div>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">생성일</div>
                  <div className="text-base font-bold text-[#303030]">2025-09-09</div>
                </div>
              </div>
              
              <svg width="2" height="126" viewBox="0 0 2 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1V125" stroke="#D9D9D9" strokeLinecap="round"/>
              </svg>
              
              <div className="flex flex-col flex-1 justify-end">
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">유형</div>
                  <div className="text-base font-bold text-[#303030]">사업계획서</div>
                </div>
                <div className="flex py-2 items-start">
                  <div className="w-[120px] text-base font-semibold text-[#767676]">목표투자</div>
                  <div className="text-base font-bold text-[#303030]">₩10,000,000</div>
                </div>
                <div className="flex py-2 items-start">
                  <Button 
                    variant="outline" 
                    className="flex gap-1 px-2.5 py-1.5 border border-[#D9D9D9] bg-white text-[#5A5A5A] text-xs font-medium rounded"
                  >
                    <FileText className="w-4 h-4" />
                    보고서 열람
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Request Details Section */}
        <div className="flex flex-col p-8 gap-6 border border-[#EEEEEF] rounded bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black">평가 요청 세부</h2>
            
            <div className="flex items-start gap-4">
              <div className="flex w-[494px] py-2 items-start">
                <div className="w-[120px] flex-shrink-0 text-base font-semibold text-[#767676]">전문가</div>
                <div className="text-base font-bold text-[#303030]">김OO 박사 (헬스케어 IT 전문가, 15년 경력)</div>
              </div>
              <div className="flex w-[494px] py-2 items-start">
                <div className="w-[120px] flex-shrink-0 text-base font-semibold text-[#767676]">종합 평점</div>
                <div className="text-base font-bold text-[#303030]">4.5/5.0</div>
              </div>
            </div>

            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex flex-col gap-3 flex-1">
                <EvaluationRatingCard title="실행 가능성" rating={4.5} />
                <EvaluationRatingCard title="사업성" rating={4.5} />
                <EvaluationRatingCard title="투자 매력도" rating={4.5} />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <EvaluationRatingCard title="시장성" rating={4.5} />
                <EvaluationRatingCard title="문서 완성도" rating={4.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Expert Comments Section */}
        <div className="flex flex-col p-8 gap-6 border border-[#EEEEEF] rounded bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black">전문가 코멘트</h2>
            <div className="w-[901px] text-base font-normal text-[#444444] leading-6 -tracking-[0.064px]">
              본 보고서는 리테일 시장 내 AI 수요 예측 솔루션의 차별성과 확장 가능성을 잘 보여줍니다. 특히 기존 솔루션 대비 정확도 향상과 실시간 분석 능력은 경쟁우위를 판단합니다. … (중략) …<br />
              강점: 기술적 차별성, 성장성 높은 시장<br />
              개선 제안: 초기 고객 확보 전략 구체화, 경쟁사 대응 방안 보완
            </div>
          </div>
        </div>

        {/* Attachment Files Section */}
        <div className="flex flex-col p-8 gap-6 border border-[#EEEEEF] rounded bg-white">
          <h2 className="w-[131px] text-xl font-bold text-black">첨부 파일</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-40 text-base font-bold text-[#303030]">평가서 PDF</div>
              <div className="flex px-4 py-3 items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                <div className="text-base font-medium text-[#07F] leading-6 -tracking-[0.064px]">첨부파일. pdf</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-40 text-base font-bold text-[#303030]">평가 요약 Word</div>
              <div className="flex px-4 py-3 items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                <div className="text-base font-medium text-[#07F] leading-6 -tracking-[0.064px]">첨부파일. pdf</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleGoToList}
            variant="outline"
            className="flex w-[94px] h-[36px] gap-1.5 border border-[#A0A0A0] bg-white text-[#555555] text-sm font-semibold rounded"
          >
            <Menu className="w-4 h-4" />
            목록으로
          </Button>
          
          <div className="flex items-start gap-3">
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="w-[79px] h-[45px] border border-[#07F] bg-white text-[#07F] text-lg font-semibold rounded-lg"
            >
              취소
            </Button>
            <Button 
              onClick={handleEdit}
              className="w-[79px] h-[45px] bg-[#07F] text-white text-lg font-semibold rounded-lg"
            >
              수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
