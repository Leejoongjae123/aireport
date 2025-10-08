"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Plus, Minus } from "lucide-react";

interface CoreCareerEntry {
  id: string;
  workYear: string;
  workMonth: string;
  position: string;
}

interface AchievementEntry {
  id: string;
  year: string;
  field: string;
  description: string;
}

export default function ExpertEmbeddingPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    expertise: "",
    summary: "",
    experienceYears: "",
    recentAffiliation: "",
    isPublic: true,
  });

  const [coreCareerEntries, setCoreCareerEntries] = useState<CoreCareerEntry[]>([
    { id: "1", workYear: "", workMonth: "", position: "" },
    { id: "2", workYear: "", workMonth: "", position: "" },
  ]);

  const [achievementEntries, setAchievementEntries] = useState<AchievementEntry[]>([
    { id: "1", year: "", field: "", description: "" },
    { id: "2", year: "", field: "", description: "" },
  ]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const addCoreCareerEntry = () => {
    const newId = Date.now().toString();
    setCoreCareerEntries([
      ...coreCareerEntries,
      { id: newId, workYear: "", workMonth: "", position: "" },
    ]);
  };

  const removeCoreCareerEntry = (id: string) => {
    if (coreCareerEntries.length > 1) {
      setCoreCareerEntries(coreCareerEntries.filter((entry) => entry.id !== id));
    }
  };

  const addAchievementEntry = () => {
    const newId = Date.now().toString();
    setAchievementEntries([
      ...achievementEntries,
      { id: newId, year: "", field: "", description: "" },
    ]);
  };

  const removeAchievementEntry = (id: string) => {
    if (achievementEntries.length > 1) {
      setAchievementEntries(achievementEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", {
      ...formData,
      coreCareerEntries,
      achievementEntries,
      uploadedFile,
    });
  };

  const handleCancel = () => {
    // Handle form cancellation
    console.log("Form cancelled");
  };

  return (
    <div className="flex w-full p-8 items-start gap-2.5">
      <div className="flex w-full p-11 flex-col items-end gap-20 rounded-[5px] bg-white">
        <div className="flex flex-col items-start gap-10 self-stretch">
          {/* 전문가 임베딩 Section */}
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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
                    전문분야
                  </div>
                </div>
                <div className="flex p-4 px-6 items-center gap-2.5 flex-1">
                  <Select value={formData.expertise} onValueChange={(value) => setFormData({ ...formData, expertise: value })}>
                    <SelectTrigger className="flex-1 h-[56px] rounded-lg border border-[#E3E5E5] bg-white p-4 text-base">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">헬스케어</SelectItem>
                      <SelectItem value="ai">인공지능</SelectItem>
                      <SelectItem value="fintech">핀테크</SelectItem>
                      <SelectItem value="biotech">바이오테크</SelectItem>
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
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="flex h-[138px] p-4 items-start gap-2.5 flex-1 rounded-lg border border-[#E3E5E5] bg-white text-base placeholder:text-[#A6A6A6] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 소속 및 주요 경력 Section */}
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
                  <Select value={formData.experienceYears} onValueChange={(value) => setFormData({ ...formData, experienceYears: value })}>
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
                      onChange={(e) => setFormData({ ...formData, recentAffiliation: e.target.value })}
                      className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 경력 Section */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
                핵심 경력
              </h2>
              <button
                onClick={addCoreCareerEntry}
                className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
              >
                <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex flex-col items-start gap-4 self-stretch">
              {coreCareerEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 self-stretch">
                  <div className="flex items-center gap-4 flex-1 self-stretch">
                    <Select>
                      <SelectTrigger className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]">
                        <SelectValue placeholder="근무 년" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}년
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]">
                        <SelectValue placeholder="근무 개월" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}개월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    placeholder="예: 사단법인 한국창업융합컨설팅학회 상임이사"
                    className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
                  />
                  
                  <button
                    onClick={() => removeCoreCareerEntry(entry.id)}
                    className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
                  >
                    <Minus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 성과 및 전문성 Section */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
                성과 및 전문성
              </h2>
              <button
                onClick={addAchievementEntry}
                className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
              >
                <Plus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex flex-col items-start gap-4 self-stretch">
              {achievementEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 self-stretch">
                  <div className="flex items-center gap-4 flex-1 self-stretch">
                    <Select>
                      <SelectTrigger className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]">
                        <SelectValue placeholder="연도" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}년
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]">
                        <SelectValue placeholder="분야" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research">연구</SelectItem>
                        <SelectItem value="development">개발</SelectItem>
                        <SelectItem value="consulting">컨설팅</SelectItem>
                        <SelectItem value="management">경영</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    placeholder="예 : 지역특화산업육성+(R&D) 지역주력사업(중소기업벤처부)"
                    className="flex-1 rounded-lg border border-[#E3E5E5] bg-white p-4 text-base h-[56px]"
                  />
                  
                  <button
                    onClick={() => removeAchievementEntry(entry.id)}
                    className="flex w-11 h-11 items-center justify-center rounded-md bg-[#ECF5FF]"
                  >
                    <Minus className="w-6 h-6 text-[#0077FF]" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 첨부자료 Section */}
          <div className="flex flex-col items-end gap-4 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <h2 className="text-[#2A2A2A] font-pretendard text-lg font-bold leading-6">
                첨부자료
              </h2>
            </div>
            
            <div className="flex flex-col items-start self-stretch border border-[#F5F5F5]">
              {/* 파일첨부 Row */}
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
                      accept=".pdf,.doc,.docx"
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
                    (PDF/Word, 최대 20MB)
                  </div>
                </div>
              </div>

              {/* 노출 여부 Row */}
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
                          onChange={() => setFormData({ ...formData, isPublic: true })}
                          className="sr-only"
                        />
                        <div className="w-6 h-6 rounded-full border-[1.6px] border-[#07F] flex items-center justify-center">
                          {formData.isPublic && (
                            <div className="w-3 h-3 rounded-full bg-[#07F]" />
                          )}
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
                          onChange={() => setFormData({ ...formData, isPublic: false })}
                          className="sr-only"
                        />
                        <div className="w-6 h-6 rounded-full border-[1.6px] border-[#6D6D6D] flex items-center justify-center">
                          {!formData.isPublic && (
                            <div className="w-3 h-3 rounded-full bg-[#6D6D6D]" />
                          )}
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex w-[79px] h-[46px] justify-center items-center gap-1.5 rounded-lg border border-[#07F] bg-white text-[#07F] font-pretendard text-lg font-bold tracking-[-0.36px] hover:bg-[#F8FCFF]"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex w-[79px] h-[46px] justify-center items-center gap-1.5 rounded-lg bg-[#07F] text-white font-pretendard text-lg font-bold tracking-[-0.36px] hover:bg-[#0066CC]"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
