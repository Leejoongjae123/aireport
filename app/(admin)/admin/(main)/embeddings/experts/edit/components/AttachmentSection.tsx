"use client";

import { Plus } from "lucide-react";
import { ExpertFormData } from "../types";

interface AttachmentSectionProps {
  formData: ExpertFormData;
  onFormDataChange: (data: ExpertFormData) => void;
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
}

export default function AttachmentSection({
  formData,
  onFormDataChange,
  uploadedFile,
  onFileUpload,
}: AttachmentSectionProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
          첨부자료
        </h2>
      </div>

      <div className="flex flex-col items-start self-stretch border border-[#F5F5F5]">
        <div className="flex w-full items-center border-b border-[#F5F5F5]">
          <div className="flex w-40 p-6 items-center gap-2.5 flex-shrink-0 self-stretch bg-[#F5F5F5]">
            <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
              파일첨부
            </div>
          </div>
          <div className="flex p-6 flex-col justify-center items-start gap-2 flex-1">
            <div className="flex items-center gap-2 self-stretch h-[48px]">
              <label
                htmlFor="file-upload"
                className="flex p-3 px-6 justify-center items-center gap-1.5 rounded-lg bg-[#E8F3FF] cursor-pointer"
              >
                <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={2} />
                <span className="text-[#07F] font-pretendard text-lg font-bold tracking-[-0.36px]">
                  파일 첨부
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="hidden h-[48px]"
              />
              <div className="flex p-3 px-4.5 items-center gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white">
                <div className="text-[#A6A6A6] font-pretendard text-base font-normal leading-6 tracking-[-0.064px]">
                  {uploadedFile ? uploadedFile.name : "첨부파일을 업로드해주세요."}
                </div>
              </div>
            </div>
            <div className="self-stretch text-[#757575] font-pretendard text-sm font-bold tracking-[-0.064px] opacity-80">
              (최대 20MB)
            </div>
          </div>
        </div>

        <div className="flex w-full h-[72px] items-center border-b border-[#F5F5F5]">
          <div className="flex w-40 p-6 items-center gap-2.5 flex-shrink-0 bg-[#F5F5F5]">
            <div className="text-[#555] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
              노출 여부
            </div>
          </div>
          <div className="flex p-0 px-6 items-center gap-2.5 flex-1">
            <div className="flex items-center">
              <label className="flex p-2 items-center gap-2.5 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => onFormDataChange({ ...formData, isPublic: true })}
                    className="sr-only"
                  />
                  <div className="w-6 h-6 rounded-full border-[1.6px] border-[#07F] flex items-center justify-center">
                    {formData.isPublic && <div className="w-3 h-3 rounded-full bg-[#07F]" />}
                  </div>
                </div>
                <span className="text-[#07F] font-pretendard text-base font-bold leading-6 tracking-[-0.32px]">
                  공개
                </span>
              </label>

              <label className="flex p-2 items-center gap-2.5 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => onFormDataChange({ ...formData, isPublic: false })}
                    className="sr-only"
                  />
                  <div className="w-6 h-6 rounded-full border-[1.6px] border-[#6D6D6D] flex items-center justify-center">
                    {!formData.isPublic && <div className="w-3 h-3 rounded-full bg-[#6D6D6D]" />}
                  </div>
                </div>
                <span className="text-[#6D6D6D] font-pretendard text-base font-normal leading-6 tracking-[-0.32px]">
                  비공개
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
