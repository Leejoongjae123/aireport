"use client";

import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ExpertFormData } from "../types";

interface BasicInfoSectionProps {
  formData: ExpertFormData;
  onFormDataChange: (data: ExpertFormData) => void;
}

export default function BasicInfoSection({
  formData,
  onFormDataChange,
}: BasicInfoSectionProps) {
  return (
    <div className="flex flex-col items-end gap-4 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h1 className="text-black font-pretendard text-2xl font-bold leading-8">
          전문가 임베딩
        </h1>
      </div>

      <div className="flex flex-col items-start self-stretch border border-[#F5F5F5]">
        {/* 이름/연락처 Row */}
        <div className="flex items-start self-stretch">
          <div className="flex items-start flex-1">
            <div className="flex items-center flex-1 border-b border-[#F5F5F5]">
              <div className="flex w-40 p-6 items-center gap-2.5 self-stretch bg-[#F5F5F5]">
                <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
                  이름
                </div>
              </div>
              <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
                <Input
                  placeholder="전문가 성함을 입력해주세요"
                  value={formData.name}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, name: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start flex-1">
            <div className="flex items-center flex-1 border-b border-[#F5F5F5]">
              <div className="flex w-40 p-6 items-center gap-2.5 self-stretch bg-[#F5F5F5]">
                <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
                  연락처
                </div>
              </div>
              <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
                <Input
                  placeholder="연락처를 입력해주세요"
                  value={formData.contact}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, contact: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 전문분야 Row */}
        <div className="flex w-full h-[88px] items-center border-b border-[#F5F5F5]">
          <div className="flex w-40 p-6 items-center gap-2.5 flex-shrink-0 self-stretch bg-[#F5F5F5]">
            <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
              사업분야
            </div>
          </div>
          <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
            <Select
              value={formData.businessField}
              onValueChange={(value) =>
                onFormDataChange({ ...formData, businessField: value })
              }
            >
              <SelectTrigger className="flex-1 h-[56px] rounded-lg border border-[#E3E5E5] bg-white p-4 text-base">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI/ICT">AI/ICT</SelectItem>
                <SelectItem value="제조">제조</SelectItem>
                <SelectItem value="콘텐츠/문화">콘텐츠/문화</SelectItem>
                <SelectItem value="공공/인프라">공공/인프라</SelectItem>
                <SelectItem value="에너지">에너지</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 요약소개 Row */}
        <div className="flex items-start self-stretch">
          <div className="flex items-center flex-1 border-b border-[#F5F5F5]">
            <div className="flex w-40 p-6 items-center gap-2.5 self-stretch bg-[#F5F5F5]">
              <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
                요약소개
              </div>
            </div>
            <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
              <textarea
                placeholder="예 : 삼성 의료원 디지털헬스 케어팀 출신, AI 의료기기 개발 다수 경험"
                value={formData.summary}
                onChange={(e) =>
                  onFormDataChange({ ...formData, summary: e.target.value })
                }
                className="flex h-[138px] p-4 items-start gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white text-base placeholder:text-[#A6A6A6] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
