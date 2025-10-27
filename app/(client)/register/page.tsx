"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase/client";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      // 회원가입 처리
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/register/complete`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "회원가입에 실패했습니다.");
        return;
      }

      // 프로필에 이메일 업데이트
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            email: email,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id);

        if (profileError) {
          setErrorMessage("프로필 이메일 업데이트에 실패했습니다.");
          return;
        }
      }

      // 회원가입 성공 시 완료 페이지로 이동
      // onAuthStateChange가 자동으로 상태를 업데이트합니다
      router.push("/register/complete");
    } catch {
      setErrorMessage("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ backgroundColor: "#FBFCFD" }}
    >
      <div className="w-[420px] flex flex-col gap-6 mt-[224px] mb-[244px]">
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
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-5 w-full">
                {/* Email Input */}
                <div className="flex flex-col gap-3 w-full">
                  <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                    이메일
                  </Label>
                  <div
                    className="flex p-[16px_18px] items-center gap-[10px] w-full rounded-lg border bg-white"
                    style={{ borderColor: email ? "#07F" : "#E3E5E5" }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-[#303030] font-pretendard text-[16px] font-medium leading-6 tracking-[-0.064px] bg-transparent border-none outline-none"
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-3 w-full">
                  <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                    비밀번호
                  </Label>
                  <div
                    className="flex p-[16px_18px] items-center gap-[10px] w-full rounded-lg border bg-white"
                    style={{ borderColor: password ? "#07F" : "#E3E5E5" }}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (
                          confirmPassword &&
                          e.target.value !== confirmPassword
                        ) {
                          setPasswordError("비밀번호가 일치하지 않습니다.");
                        } else {
                          setPasswordError("");
                        }
                      }}
                      className="flex-1 font-pretendard text-[16px] font-normal leading-6 tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                      placeholder="비밀번호를 입력해주세요."
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-3 w-full">
                  <Label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                    비밀번호 확인
                  </Label>
                  <div
                    className="flex p-[16px_18px] items-center gap-[10px] w-full rounded-lg border bg-white"
                    style={{
                      borderColor: passwordError
                        ? "#FF3B30"
                        : confirmPassword
                        ? "#07F"
                        : "#E3E5E5",
                    }}
                  >
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (password && password !== e.target.value) {
                          setPasswordError("비밀번호가 일치하지 않습니다.");
                        } else {
                          setPasswordError("");
                        }
                      }}
                      className="flex-1 font-pretendard text-[16px] font-normal leading-6 tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                      placeholder="비밀번호를 다시 입력해주세요."
                    />
                  </div>
                  {passwordError && (
                    <p className="text-[#FF3B30] font-pretendard text-[12px] font-medium leading-normal">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Password & Forgot Password */}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-[#FF3B30] font-pretendard text-[14px] font-medium leading-normal text-center">
                {errorMessage}
              </p>
            )}

            {/* Register Button */}
            <button
              disabled={
                !email ||
                !password ||
                !confirmPassword ||
                passwordError !== "" ||
                password !== confirmPassword ||
                isLoading
              }
              onClick={handleRegister}
              className="flex p-[20px_52px] justify-center items-center gap-2 w-full rounded-[10px] disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#07F]"
            >
              <span className="text-white font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
                {isLoading ? "처리 중..." : "이메일로 회원가입"}
              </span>
            </button>
          </div>

          {/* Divider and Social Login */}
          <div className="flex flex-col gap-8 w-full">
            {/* Divider */}
            <div className="flex justify-center items-center gap-[18px] w-full">
              <div className="w-[174.751px] h-px bg-[#DCDCDC]"></div>
              <span className="text-[#5A5A5A] font-pretendard text-[18px] font-medium leading-normal tracking-[-0.064px] opacity-60">
                또는
              </span>
              <div className="w-[174.751px] h-px bg-[#DCDCDC]"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-4 w-full">
              {/* Google Login */}
              <button
                onClick={() => router.push("/register/complete")}
                className="flex p-4 justify-center items-center gap-[10px] w-full rounded-[10px] border border-[#EEEEEF] bg-white"
              >
                <div className="w-6 h-6">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <span className="text-[#303030] font-pretendard text-[18px] font-semibold leading-normal tracking-[-0.36px]">
                  구글 회원가입
                </span>
              </button>

              {/* Kakao Login */}
              <button
                onClick={() => router.push("/register/complete")}
                className="flex p-4 justify-center items-center gap-[10px] w-full rounded-[10px]"
                style={{ backgroundColor: "#FBE84C" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.001 3C6.59144 3 2.20459 6.46794 2.20459 10.7451C2.20459 13.5292 4.06396 15.9685 6.85203 17.3342C6.6463 18.0983 6.10946 20.1046 6.00365 20.5337C5.87042 21.0666 6.19762 21.0588 6.41315 20.9157C6.58164 20.8041 9.09737 19.0936 10.1828 18.355C10.7726 18.4431 11.3799 18.4882 12.001 18.4882C17.4106 18.4882 21.7975 15.0202 21.7975 10.7431C21.7975 6.46598 17.4106 3 12.001 3Z"
                    fill="#212223"
                  />
                </svg>
                <span className="text-[#303030] font-pretendard text-[18px] font-semibold leading-normal tracking-[-0.36px]">
                  카카오 회원가입
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
