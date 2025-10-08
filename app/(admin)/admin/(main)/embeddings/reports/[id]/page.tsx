"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ReportEmbeddingPage({ params }: PageProps) {
  const [reportTitle, setReportTitle] = useState("");
  const [category, setCategory] = useState("");
  const [field, setField] = useState("");
  const [keywords, setKeywords] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
  };

  const handleEmbedding = () => {
    // Handle embedding action
  };

  return (
    <div className="flex w-full p-8">
      <div className="flex flex-col w-full p-11 gap-20 bg-white rounded-[5px] relative">
        <div className="flex flex-col gap-10 w-full">
          {/* 보고서 임베딩 Section */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-semibold text-black leading-8">
                보고서 임베딩
              </h1>
            </div>

            <div className="flex flex-col border border-[#f5f5f5] w-full">
              {/* 보고서 제목 Row */}
              <div className="flex w-full border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    보고서 제목
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Input
                    placeholder="보고서 제목을 입력해주세요."
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                  />
                </div>
              </div>

              {/* 카테고리 Row */}
              <div className="flex w-full h-22 items-center border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    카테고리
                  </Label>
                </div>
                <div className="flex flex-1 p-4 px-6 items-center">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white">
                      <SelectValue placeholder="선택" className="text-[#A6A6A6] text-base leading-6 tracking-[-0.064px]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category1">카테고리 1</SelectItem>
                      <SelectItem value="category2">카테고리 2</SelectItem>
                      <SelectItem value="category3">카테고리 3</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white">
                      <SelectValue placeholder="선택" className="text-[#A6A6A6] text-base leading-6 tracking-[-0.064px]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="field1">분야 1</SelectItem>
                      <SelectItem value="field2">분야 2</SelectItem>
                      <SelectItem value="field3">분야 3</SelectItem>
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
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
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
                보고서 등록
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
                    <label htmlFor="file-upload">
                      <div className="flex p-3 px-6 justify-center items-center gap-[6px] rounded-lg bg-[#E8F3FF] cursor-pointer">
                        <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={2} />
                        <span className="text-[#07F] text-lg font-semibold tracking-[-0.36px]">
                          파일 첨부
                        </span>
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-1 p-3 px-[18px] items-center border border-[#E3E5E5] rounded-lg bg-white">
                      <span className="text-[#A6A6A6] text-base leading-6 tracking-[-0.064px]">
                        {uploadedFile ? uploadedFile.name : "첨부파일을 업로드해주세요."}
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-[#757575] text-sm font-semibold tracking-[-0.064px] opacity-80">
                    (PDF/Word, 최대 20MB)
                  </div>
                </div>
              </div>

              {/* 미리보기 Row */}
              <div className="flex items-center w-full border-b border-[#f5f5f5]">
                <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                  <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                    미리보기
                  </Label>
                </div>
                <div className="flex flex-1 p-6 items-center gap-6">
                  <div className="flex h-[555px] p-5 px-6 flex-col items-center gap-[10px] flex-1 rounded-xl border border-[#EEEEEF] bg-white relative overflow-hidden">
                    {uploadedFile ? (
                      <div className="flex flex-col items-start flex-1 w-full bg-gray-50 bg-cover bg-center relative">
                        <div className="h-full w-full bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <div className="text-lg font-medium mb-2">문서 미리보기</div>
                            <div className="text-sm">{uploadedFile.name}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start flex-1 w-full bg-gray-50 relative">
                        <div className="h-full w-full"></div>
                      </div>
                    )}
                    
                    {/* Scrollbar */}
                    <div className="absolute right-3 top-5 bottom-5 w-[6px] bg-[#f5f5f5] rounded-full">
                      <div className="w-[6px] h-[317px] bg-[#b2b2b2] rounded-full"></div>
                    </div>
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
            className="flex w-[79px] h-[46px] justify-center items-center gap-[6px] rounded-lg border border-[#07F] bg-white text-[#07F] text-lg font-semibold tracking-[-0.36px] hover:bg-[#f8faff]"
          >
            취소
          </Button>
          <Button
            onClick={handleEmbedding}
            className="flex w-[94px] h-[46px] justify-center items-center gap-[6px] rounded-lg bg-[#07F] text-white text-lg font-semibold tracking-[-0.36px] hover:bg-[#0066e6]"
          >
            임베딩
          </Button>
        </div>


      </div>
    </div>
  );
}
