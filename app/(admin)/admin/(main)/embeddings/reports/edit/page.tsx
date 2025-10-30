"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Plus } from "lucide-react";
import { useLoader } from "@/components/hooks/UseLoader";
import { useToast } from "@/components/hooks/UseToast";
import { ToastContainer } from "@/components/ToastContainer";

export default function ReportCreatePage() {
  const router = useRouter();
  const [번호, set번호] = useState("");
  const [제목, set제목] = useState("");
  const [분야, set분야] = useState("");
  const [키워드, set키워드] = useState("");
  const [보고서파일명, set보고서파일명] = useState("");
  const [분야번호, set분야번호] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const loader = useLoader({ isLoading: isSubmitting || isUploading });
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // PDF 파일 검증
    if (file.type !== 'application/pdf') {
      showError("PDF 파일만 업로드 가능합니다.");
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      return;
    }

    // 파일 크기 검증 (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("파일 크기는 20MB를 초과할 수 없습니다.");
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);

    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${fastApiUrl}/api/reports/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // 중복 파일 체크 (success: false인 경우)
      if (!result.success) {
        showError(result.message || "S3에 이미 동일한 파일명이 존재합니다. 파일명을 변경해주세요.");
        setSelectedFile(null);
        setIsUploading(false);
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        return;
      }

      // 업로드 성공
      set보고서파일명(result.file_name);
      showSuccess("파일이 성공적으로 업로드되었습니다.");
      
      // input 초기화 (같은 파일 재선택 가능하도록)
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      showError(`파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
      setSelectedFile(null);
      
      // 에러 시에도 input 초기화
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const fieldOptions = [
    { value: "1)디지털·ICT·AI 산업", label: "1)디지털·ICT·AI 산업", number: 1 },
    { value: "2)제조·산업기술·혁신", label: "2)제조·산업기술·혁신", number: 2 },
    { value: "3)문화·콘텐츠·관광", label: "3)문화·콘텐츠·관광", number: 3 },
    { value: "4)공공·도시·인프라", label: "4)공공·도시·인프라", number: 4 },
    { value: "5)에너지·환경", label: "5)에너지·환경", number: 5 },
  ];

  const handleCancel = () => {
    // 초기화
    set번호("");
    set제목("");
    set분야("");
    set키워드("");
    set보고서파일명("");
    set분야번호("");
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    // 필수 필드 검증 (번호는 선택적)
    if (!제목 || !분야 || !키워드 || !보고서파일명) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: Record<string, string | number> = {
        제목,
        분야,
        키워드,
        보고서파일명,
      };

      // 번호가 입력된 경우에만 추가
      if (번호) {
        requestBody.번호 = parseInt(번호);
      }

      // 분야번호가 있는 경우에만 추가
      if (분야번호) {
        requestBody.분야번호 = parseInt(분야번호);
      }

      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`등록 실패: ${error.error}`);
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();
      const embedId = result.data?.id;

      if (!embedId) {
        alert("등록은 성공했으나 ID를 받지 못했습니다.");
        setIsSubmitting(false);
        return;
      }

      // 임베딩 처리 요청
      try {
        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
        const embedResponse = await fetch(`${fastApiUrl}/api/reports/embed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: 보고서파일명,
            embed_id: String(embedId),
          }),
        });

        if (!embedResponse.ok) {
          const embedError = await embedResponse.json();
          showError(`임베딩 처리 요청 실패: ${embedError.detail || "알 수 없는 오류"}`);
        } else {
          showSuccess("보고서가 등록되었으며 임베딩 처리가 시작되었습니다.");
        }
      } catch (embedError) {
        showError(`임베딩 처리 요청 중 오류: ${embedError instanceof Error ? embedError.message : "알 수 없는 오류"}`);
      }

      // 성공 시 목록으로 이동 (로더는 계속 표시)
      setTimeout(() => {
        router.push("/admin/embeddings/reports");
      }, 1500);
    } catch (error) {
      alert(`등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loader}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="flex w-full p-8">
        <div className="flex flex-col w-full p-11 gap-20 bg-white rounded-[5px] relative">
        <div className="flex flex-col gap-10 w-full">
          {/* 보고서 임베딩 Section */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-semibold text-black leading-8">
                보고서 등록
              </h1>
            </div>

            <div className="flex flex-col border border-[#f5f5f5] w-full">
              {/* 번호 Row */}
              <div className="flex w-full border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    번호
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Input
                    placeholder="번호를 입력해주세요."
                    value={번호}
                    onChange={(e) => set번호(e.target.value)}
                    type="number"
                      className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-gray-200 text-gray-500 text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6] cursor-not-allowed opacity-60"
                      disabled
                  />
                </div>
              </div>

              {/* 제목 Row */}
              <div className="flex w-full border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    제목
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Input
                    placeholder="보고서 제목을 입력해주세요."
                    value={제목}
                    onChange={(e) => set제목(e.target.value)}
                    className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                  />
                </div>
              </div>

              {/* 분야 Row */}
              <div className="flex w-full h-22 items-center border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    분야
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Select 
                    value={분야} 
                    onValueChange={(value) => {
                      set분야(value);
                      const selected = fieldOptions.find(opt => opt.value === value);
                      if (selected) {
                        set분야번호(selected.number.toString());
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white">
                      <SelectValue
                        placeholder="선택"
                        className="text-[#A6A6A6] text-base leading-6 tracking-[-0.064px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 키워드 Row */}
              <div className="flex w-full border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    키워드
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Input
                    placeholder="키워드를 입력해주세요. 쉼표(,)로 구분합니다."
                    value={키워드}
                    onChange={(e) => set키워드(e.target.value)}
                    className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 보고서 등록 Section */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold text-[#2A2A2A] leading-6">
                보고서 파일
              </h2>
            </div>

            <div className="flex flex-col border border-[#f5f5f5] w-full">
              {/* 파일첨부 Row */}
              <div className="flex w-full items-center border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    파일첨부
                  </Label>
                </div>
                <div className="flex flex-1 p-6 flex-col justify-center items-start gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <label htmlFor="file-upload" className={isUploading ? "cursor-not-allowed opacity-50" : ""}>
                      <div className={`flex p-3 px-6 justify-center items-center gap-[6px] rounded-lg bg-[#E8F3FF] ${isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        <Plus
                          className="w-6 h-6 text-[#0077FF]"
                          strokeWidth={2}
                        />
                        <span className="text-[#07F] text-lg font-semibold tracking-[-0.36px]">
                          {isUploading ? "업로드 중..." : "파일 첨부"}
                        </span>
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="flex flex-1 p-3 px-[18px] items-center border border-[#E3E5E5] rounded-lg bg-white">
                      <span className={`text-base leading-6 tracking-[-0.064px] ${보고서파일명 ? 'text-black' : 'text-[#A6A6A6]'}`}>
                        {보고서파일명 || (selectedFile ? `업로드 중: ${selectedFile.name}` : "첨부파일을 업로드해주세요.")}
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-[#757575] text-sm font-semibold tracking-[-0.064px] opacity-80">
                    (PDF/Word, 최대 20MB)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 w-full">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSubmitting}
            className="flex w-[79px] h-[46px] justify-center items-center gap-[6px] rounded-lg border border-[#07F] bg-white text-[#07F] text-lg font-semibold tracking-[-0.36px] hover:bg-[#f8faff]"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-[94px] h-[46px] justify-center items-center gap-[6px] rounded-lg bg-[#07F] text-white text-lg font-semibold tracking-[-0.36px] hover:bg-[#0066e6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
