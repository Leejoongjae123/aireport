"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const RegisterCompletePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 이미 프로필이 완성되었는지 확인
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_completed")
          .eq("id", user.id)
          .single();

        if (profile?.profile_completed) {
          // 이미 프로필이 완성된 경우 홈으로 리다이렉트
          router.push("/");
        }
      } catch {
        // 에러가 발생해도 페이지는 표시
      }
    };

    checkProfile();
  }, [router]);

  const handleCompleteProfile = async () => {
    if (!name || !organization || !businessField) {
      setErrorMessage("모든 정보를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          organization,
          business_field: businessField,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setErrorMessage(error.message || "프로필 업데이트에 실패했습니다.");
        return;
      }

      // 프로필 업데이트 성공 시 홈으로 이동
      // onAuthStateChange가 USER_UPDATED 이벤트를 발생시킵니다
      router.push("/");
    } catch {
      setErrorMessage("프로필 업데이트 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
                    height: "58.67px",
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

          {/* Error Message */}
          {errorMessage && (
            <p className="text-[#FF3B30] font-pretendard text-[14px] font-medium leading-normal text-center">
              {errorMessage}
            </p>
          )}

          {/* Register Button */}
          <button
            disabled={!name || !organization || !businessField || isLoading}
            onClick={handleCompleteProfile}
            className="flex p-[20px_52px] justify-center items-center gap-2 w-full rounded-[10px] disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#07F]"
          >
            <span className="text-white font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
              {isLoading ? "처리 중..." : "회원가입 완료"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompletePage;
