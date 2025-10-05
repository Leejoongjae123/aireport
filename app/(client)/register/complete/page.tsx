"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [businessField, setBusinessField] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FBFCFD" }}
    >
      <div className="w-[420px] flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-[34px]">
          <div className="flex flex-col items-center gap-[18px] w-full">
            <h1 className="text-black text-center font-pretendard text-[32px] font-bold leading-normal">
              서비스 이용하기
            </h1>
            <p className="text-[#6B6B6B] text-center font-pretendard text-[20px] font-medium leading-normal">
              AI 사업 보고서 생성 서비스를 시작해보세요
            </p>
          </div>

          {/* Tab Toggle */}
          <div
            className="flex p-[8px_10px] justify-between items-center w-full rounded-[100px] border border-[#EEF1F7]"
            style={{ backgroundColor: "#EFF2F7" }}
          >
            <button
              onClick={() => router.push("/login")}
              className="flex flex-1 p-[10px] justify-center items-center gap-[10px] rounded-[100px] text-[16px] font-pretendard font-semibold leading-normal bg-transparent text-[#07F]"
            >
              로그인
            </button>
            <button className="flex flex-1 p-[10px] justify-center items-center gap-[10px] rounded-[100px] text-[16px] font-pretendard font-semibold leading-normal bg-[#07F] text-white">
              회원가입
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-6 w-full">
            {/* Name Input */}
            <div className="flex flex-col gap-3 w-full">
              <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                이름
              </Label>
              <div
                className="flex p-[16px_18px] items-center gap-[10px] w-full rounded-lg border bg-white"
                style={{ borderColor: name ? "#07F" : "#E3E5E5" }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 text-[#303030] font-pretendard text-[16px] font-medium leading-6 tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                  placeholder="이름을 입력해주세요"
                />
              </div>
            </div>

            {/* Organization Input */}
            <div className="flex flex-col gap-3 w-full">
              <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                소속
              </Label>
              <div
                className="flex p-[16px_18px] items-center gap-[10px] w-full rounded-lg border bg-white"
                style={{ borderColor: organization ? "#07F" : "#E3E5E5" }}
              >
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="flex-1 text-[#303030] font-pretendard text-[16px] font-medium leading-6 tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                  placeholder="소속을 입력해주세요"
                />
              </div>
            </div>

            {/* Business Field Select */}
            <div className="flex flex-col gap-3 w-full">
              <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                사업분야
              </Label>
              <Select value={businessField} onValueChange={setBusinessField}>
                <SelectTrigger 
                  className="w-full p-[16px_18px] rounded-lg border bg-white font-pretendard text-[16px] font-medium leading-6 tracking-[-0.064px] shadow-none"
                  style={{ 
                    borderColor: businessField ? "#07F" : "#E3E5E5",
                    height: "58.67px"
                  }}
                >
                  <SelectValue 
                    placeholder="사업분야를 선택해주세요" 
                    className="text-[#A6A6A6]"
                  />
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

          {/* Register Button */}
          <button 
            disabled={!name || !organization || !businessField}
            className="flex p-[20px_52px] justify-center items-center gap-2 w-full rounded-[10px] disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#07F]"
          >
            <span className="text-white font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              회원가입 완료
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
