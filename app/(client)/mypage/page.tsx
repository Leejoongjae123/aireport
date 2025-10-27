"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { createClient } from '@/lib/supabase/client';
import { useLoader } from '@/components/hooks/UseLoader';
import { CustomModal } from "@/components/ui/CustomModal";

import { Profile } from './types';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    businessField: "IT",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, email, provider, organization, business_field')
          .eq('id', user.id)
          .single();

        if (profileData && !error) {
          setProfile(profileData);
          setFormData({
            name: profileData.name || "",
            email: profileData.email || "",
            password: "",
            confirmPassword: "",
            company: profileData.organization || "",
            businessField: profileData.business_field || "IT",
          });
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 비밀번호 변경 검증
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
        }
        if (formData.password.length < 6) {
          alert('비밀번호는 6자리 이상이어야 합니다.');
          return;
        }
      }

      // 프로필 업데이트
      const updateData = {
        name: formData.name,
        organization: formData.company,
        business_field: formData.businessField,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (profileError) {
        alert('프로필 업데이트에 실패했습니다.');
        return;
      }

      // 비밀번호 변경
      if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password,
        });

        if (passwordError) {
          alert('비밀번호 변경에 실패했습니다.');
          return;
        }
      }

      setIsModalOpen(true);
      
      // 폼 데이터 리셋 (비밀번호 필드)
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

    } catch {
      alert('오류가 발생했습니다.');
    }
  };

  const handleWithdraw = () => {
    // Handle account withdrawal logic here
    console.log("Account withdrawal requested");
  };

  return (
    <>
      {useLoader({ isLoading })}
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
            {/* Name Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                이름
              </label>
              <Input
                type="text"
                placeholder="이름을 입력해주세요."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={profile?.provider !== 'local'}
                className="h-[56px] px-[18px] py-4 text-base font-normal leading-6 tracking-[-0.064px] border-[#E3E5E5] rounded-lg placeholder:text-[#A6A6A6] bg-white"
              />
            </div>

            {/* Email Field - Disabled */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#202224] opacity-80 tracking-[-0.064px]">
                이메일
              </label>
              <div className="flex items-center gap-2.5 p-4 bg-[#F5F5F5] border border-[#E3E5E5] rounded-lg">
                <span className="text-base font-normal text-[#B3B3B3] leading-6 tracking-[-0.064px]">
                  {formData.email}
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
                disabled={profile?.provider !== 'local'}
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
                disabled={profile?.provider !== 'local'}
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
                  <SelectItem value="AI/ICT">AI/ICT</SelectItem>
                  <SelectItem value="제조">제조</SelectItem>
                  <SelectItem value="콘텐츠/문화">콘텐츠/문화</SelectItem>
                  <SelectItem value="공공/인프라">공공/인프라</SelectItem>
                  <SelectItem value="에너지">에너지</SelectItem>
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
    <CustomModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="알림"
      footer={
        <Button
          onClick={() => setIsModalOpen(false)}
          className="w-full h-[50px] bg-[#07F] hover:bg-[#07F]/90 text-white text-base font-bold rounded-[10px]"
        >
          확인
        </Button>
      }
    >
      <p className="text-center text-xl font-medium">저장을 완료하였습니다.</p>
    </CustomModal>
    </>
  );
}
