"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export default function MyPage() {
  const [formData, setFormData] = useState({
    name: "username",
    email: "example@domain.com",
    password: "",
    confirmPassword: "",
    company: "",
    businessField: "IT",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving account settings:", formData);
  };

  const handleWithdraw = () => {
    // Handle account withdrawal logic here
    console.log("Account withdrawal requested");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFD] flex items-center justify-center p-4">
      <div className="w-full max-w-[421px] mt-[131px]">
        {/* Title */}
        <h1 className="text-[32px] font-bold text-black text-center mb-[22px]">
          계정 설정
        </h1>

        {/* Form */}
        <div className="space-y-8">
          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Field - Disabled */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                이름
              </label>
              <div className="flex items-center gap-2.5 p-4 bg-[#F5F5F5] border border-[#E3E5E5] rounded-lg rounded-tr-none">
                <span className="text-base font-normal text-[#B3B3B3] leading-6 tracking-[-0.064px]">
                  username
                </span>
              </div>
            </div>

            {/* Email Field - Disabled */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                이메일
              </label>
              <div className="flex items-center gap-2.5 p-4 bg-[#F5F5F5] border border-[#E3E5E5] rounded-lg">
                <span className="text-base font-normal text-[#B3B3B3] leading-6 tracking-[-0.064px]">
                  example@domain.com
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                비밀번호 변경
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-[56px] px-[18px] py-4 text-base font-normal leading-6 tracking-[-0.064px] border-[#E3E5E5] rounded-lg placeholder:text-[#A6A6A6] bg-white"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                비밀번호 확인
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력해주세요."
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="h-[56px] px-[18px] py-4 text-base font-normal leading-6 tracking-[-0.064px] border-[#E3E5E5] rounded-lg placeholder:text-[#A6A6A6] bg-white"
              />
            </div>

            {/* Company Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                소속 (회사명)
              </label>
              <Input
                type="text"
                placeholder="ABC 스타트업"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="h-[56px] px-[18px] py-4 text-base font-normal leading-6 tracking-[-0.064px] border-[#E3E5E5] rounded-lg placeholder:text-[#A6A6A6] bg-white"
              />
            </div>

            {/* Business Field Dropdown */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                사업분야
              </label>
              <Select
                value={formData.businessField}
                onValueChange={(value) =>
                  handleInputChange("businessField", value)
                }
              >
                <SelectTrigger className="w-full !h-[56px] px-[18px] text-base font-normal leading-6 tracking-[-0.064px] border-[#E3E5E5] rounded-lg text-[#A6A6A6] justify-between bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="금융">금융</SelectItem>
                  <SelectItem value="제조업">제조업</SelectItem>
                  <SelectItem value="서비스업">서비스업</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1">
            {/* Save Button */}
            <Button
              onClick={handleSave}
              className="w-full h-[60px] bg-[#07F] hover:bg-[#07F]/90 text-white text-lg font-bold tracking-[-0.36px] rounded-[10px]"
            >
              저장
            </Button>

            {/* Withdraw Button */}
            <button
              onClick={handleWithdraw}
              className="w-full h-[60px] text-[#07F] text-lg font-bold tracking-[-0.36px] underline hover:no-underline transition-all"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
