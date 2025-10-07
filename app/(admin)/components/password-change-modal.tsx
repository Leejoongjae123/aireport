"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { X } from "lucide-react";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);

  const validatePassword = (password: string) => {
    const isValid = password.length >= 8 && password.length <= 16 && 
                   /^(?=.*[a-zA-Z])(?=.*\d)/.test(password);
    setIsValidPassword(isValid);
    return isValid;
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSubmit = () => {
    if (isValidPassword && newPassword === confirmPassword) {
      // Handle password change logic here
      console.log("Password change submitted");
      onClose();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="436px"
      padding="44px"
      className="border-none"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-[46px] w-full">
        {/* Header */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between items-start w-full">
              <div className="text-[#202224] font-pretendard text-[20px] font-semibold leading-[24px]">
                비밀번호 변경
              </div>
              <button onClick={onClose} className="w-6 h-6 flex items-center justify-center">
                <X className="w-6 h-6 text-[#6D6D6D]" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-3 w-full">
                {/* New Password Input */}
                <div className="flex flex-col gap-3 w-full">
                  <label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                    새 비밀번호
                  </label>
                  <div className="flex justify-between items-center w-full px-[18px] py-4 rounded-[8px] border border-[#E3E5E5] bg-white">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="비밀번호를 입력해주세요."
                      className="flex-1 text-[#A6A6A6] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                    />
                    {newPassword && isValidPassword && (
                      <div className="text-[rgba(0,153,81,1)] font-pretendard text-[16px] font-semibold leading-[24px] tracking-[-0.064px]">
                        사용 가능
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-3 w-full">
                  <label className="text-[#6D6D6D] font-pretendard text-[14px] font-medium leading-[16px] opacity-80">
                    비밀번호 확인
                  </label>
                  <div className="flex items-center gap-[10px] w-full px-[18px] py-4 rounded-[8px] border border-[#E3E5E5] bg-white">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 한 번 더 입력해주세요."
                      className="flex-1 text-[#A6A6A6] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="text-[rgba(118,118,118,1)] font-pretendard text-[12px] font-medium leading-[24px]">
                  8~16자 영문, 숫자 혼용
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full ">
                <button
                  onClick={onClose}
                  className="flex w-1/2 justify-center items-center gap-[10px] h-16 rounded border border-[#07F]"
                >
                  <span className="text-[#07F] font-pretendard text-[18px] font-semibold leading-[24px]">
                    취소
                  </span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex w-1/2 justify-center items-center gap-[10px] h-16 rounded bg-[#07F]"
                >
                  <span className="text-white font-pretendard text-[18px] font-semibold leading-[24px]">
                    저장하기
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
