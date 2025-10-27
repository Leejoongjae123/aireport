"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CustomModal } from "@/components/ui/CustomModal";

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "로그인에 실패했습니다.");
        setShowErrorModal(true);
        return;
      }

      // 로그인 성공 - 관리자 대시보드로 이동
      router.push("/admin/dashboard");
    } catch {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#F5F6FA] flex items-center justify-center">
      <div className="w-[420px] flex flex-col items-center gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-5">
          {/* <div className="flex items-center gap-[15px]">
            <div className="w-[38px] h-[38px] rounded-full bg-[#B2B2B2]"></div>
            <div className="text-[#B3B3B3] text-[32px] font-[700] leading-normal font-[Pretendard]">
              LOGO
            </div>
          </div> */}
          <Image src="/images/logo.svg" alt="Logo" width={142} height={38} />
          <div className="text-black text-center text-[32px] font-[700] leading-normal font-[Pretendard]">
            관리자 로그인
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-5 w-full">
              {/* Email Input */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-[#202224] text-[14px] font-[700] leading-normal font-[Pretendard] opacity-80">
                  아이디
                </label>
                <div
                  className={`flex p-4 items-center gap-[10px] w-full rounded-[8px] border ${
                    email ? "border-[#07F]" : "border-[#E3E5E5]"
                  } bg-white`}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-[#303030] text-[16px] font-[500] leading-[24px] font-[Pretendard] bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-[#202224] text-[14px] font-[700] leading-normal font-[Pretendard] opacity-80">
                  비밀번호
                </label>
                <div
                  className={`flex p-4 items-center gap-[10px] w-full rounded-[8px] border ${
                    password ? "border-[#07F]" : "border-[#E3E5E5]"
                  } bg-white`}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="flex-1 text-[#A6A6A6] text-[16px] font-[400] leading-[24px] font-[Pretendard] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                  />
                </div>
              </div>
            </div>

            {/* Save Password Checkbox */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1 h-6">
                <div className="w-6 h-6 relative">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                    onClick={() => setSavePassword(!savePassword)}
                  >
                    <path
                      d="M5.66678 20.9473C5.20611 20.9473 4.82178 20.7933 4.51378 20.4853C4.20578 20.1773 4.05145 19.7926 4.05078 19.3313V6.56327C4.05078 6.1026 4.20511 5.71827 4.51378 5.41027C4.82245 5.10227 5.20678 4.94793 5.66678 4.94727H18.4358C18.8958 4.94727 19.2801 5.1016 19.5888 5.41027C19.8974 5.71893 20.0514 6.10327 20.0508 6.56327V19.3323C20.0508 19.7923 19.8968 20.1766 19.5888 20.4853C19.2808 20.7939 18.8961 20.9479 18.4348 20.9473H5.66678ZM5.66678 19.9473H18.4358C18.5891 19.9473 18.7301 19.8833 18.8588 19.7553C18.9874 19.6273 19.0514 19.4859 19.0508 19.3313V6.56327C19.0508 6.40927 18.9868 6.26793 18.8588 6.13927C18.7308 6.0106 18.5894 5.9466 18.4348 5.94727H5.66678C5.51278 5.94727 5.37145 6.01127 5.24278 6.13927C5.11411 6.26727 5.05011 6.4086 5.05078 6.56327V19.3323C5.05078 19.4856 5.11478 19.6266 5.24278 19.7553C5.37078 19.8839 5.51178 19.9479 5.66578 19.9473"
                      fill="#B2B2B2"
                    />
                    <path
                      d="M18.8588 19.7553C18.7301 19.8833 18.5891 19.9473 18.4358 19.9473H5.66579C5.51179 19.9479 5.37079 19.8839 5.24279 19.7553C5.11479 19.6266 5.05079 19.4856 5.05079 19.3323V6.56327C5.05078 6.56168 5.05078 6.56008 5.05079 6.55849C5.05145 6.40569 5.11545 6.26595 5.24279 6.13927C5.37145 6.01127 5.51279 5.94727 5.66679 5.94727H18.4348C18.5895 5.9466 18.7308 6.0106 18.8588 6.13927C18.9868 6.26794 19.0508 6.40927 19.0508 6.56327V19.3313C19.0515 19.4859 18.9875 19.6273 18.8588 19.7553Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </div>
                <span className="text-[#B3B3B3] text-[14px] font-[500] leading-4 font-[Pretendard]">
                  비밀번호 저장
                </span>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex py-5 px-[52px] justify-center items-center gap-2 w-full rounded-[10px] bg-[#07F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-[18px] font-[700] leading-normal font-[Pretendard]">
              {isLoading ? "로그인 중..." : "로그인"}
            </span>
          </button>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center items-center gap-[14px] w-full">
          <div className="flex items-center gap-2 w-full justify-center">
            
            <span className="text-[#5A5A5A] text-[16px] font-[500] leading-normal font-[Pretendard]">
              관리자 계정 생성을 위해서는 시스템 관리자에게 연락바랍니다.
            </span>
          </div>
          <div className="text-[#5A5A5A] text-center text-[16px] font-[500] leading-normal font-[Pretendard]">
            조서연 선임 | 010 3058 5870 | edusyj71@gmail.com
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <CustomModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        width="400px"
        padding="32px"
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-center text-[18px] font-[600] text-[#303030]">
            {errorMessage}
          </div>
          <button
            onClick={() => setShowErrorModal(false)}
            className="w-full py-3 px-6 bg-[#07F] text-white rounded-[8px] font-[600] text-[16px]"
          >
            확인
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default AdminLoginPage;
