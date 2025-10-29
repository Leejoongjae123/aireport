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

interface AffiliationSectionProps {
  formData: ExpertFormData;
  onFormDataChange: (data: ExpertFormData) => void;
}

export default function AffiliationSection({
  formData,
  onFormDataChange,
}: AffiliationSectionProps) {
  return (
    <div className="flex flex-col items-end gap-4 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h2 className="text-[#2A2A2A] font-pretendard text-xl font-bold leading-6">
          소속 및 주요 경력
        </h2>
      </div>

      <div className="flex flex-col items-start self-stretch border border-[#F5F5F5]">
        {/* 경력 년수 Row */}
        <div className="flex w-full h-[88px] items-center border-b border-[#F5F5F5]">
          <div className="flex w-40 p-6 items-center gap-2.5 flex-shrink-0 self-stretch bg-[#F5F5F5]">
            <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
              경력 년수
            </div>
          </div>
          <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
            <Select
              value={formData.experienceYears}
              onValueChange={(value) =>
                onFormDataChange({ ...formData, experienceYears: value })
              }
            >
              <SelectTrigger className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3년</SelectItem>
                <SelectItem value="4-7">4-7년</SelectItem>
                <SelectItem value="8-15">8-15년</SelectItem>
                <SelectItem value="15+">15년 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 최근 소속/경력 Row */}
        <div className="flex items-start self-stretch">
          <div className="flex items-center flex-1 border-b border-[#F5F5F5]">
            <div className="flex w-40 p-6 items-center gap-2.5 self-stretch bg-[#F5F5F5]">
              <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
                최근 소속/경력
              </div>
            </div>
            <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
              <Input
                placeholder="예: 삼성의료원 디지털헬스케어팀"
                value={formData.recentAffiliation}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    recentAffiliation: e.target.value,
                  })
                }
                className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
