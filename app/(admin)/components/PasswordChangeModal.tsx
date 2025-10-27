"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomModal } from "@/components/ui/CustomModal";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Zod 스키마 정의
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .max(16, "비밀번호는 최대 16자까지 가능합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 영문과 숫자를 포함해야 합니다."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword");
  const isValidPassword =
    newPassword &&
    newPassword.length >= 8 &&
    newPassword.length <= 16 &&
    /^(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword);

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();

      // Supabase를 사용하여 비밀번호 변경
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        setErrorMessage(error.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
      reset();

      // 1.5초 후 모달 닫기
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error("비밀번호 변경 중 오류:", error);
      setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      width="436px"
      padding="44px"
      className="border-none"
      showCloseButton={false}
    >
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[46px] w-full">
          {/* Header */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-start w-full">
                <div className="text-[#202224] font-pretendard text-[20px] font-semibold leading-[24px]">
                  비밀번호 변경
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-6 h-6 text-[#6D6D6D]" strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="text-green-600 font-pretendard text-[14px] font-medium text-center bg-green-50 py-2 rounded">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 font-pretendard text-[14px] font-medium text-center bg-red-50 py-2 rounded">
                {errorMessage}
              </div>
            )}

            {/* Form Content */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-3 w-full">
                  {/* New Password Input */}
                  <div className="flex flex-col gap-3 w-full">
                    <label className="text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                      새 비밀번호
                    </label>
                    <div
                      className={`flex justify-between items-center w-full px-[18px] py-4 rounded-[8px] border ${
                        errors.newPassword ? "border-red-500" : "border-[#E3E5E5]"
                      } bg-white`}
                    >
                      <input
                        type="password"
                        {...register("newPassword")}
                        placeholder="비밀번호를 입력해주세요."
                        className="flex-1 text-[#303030] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                      />
                      {newPassword && isValidPassword && !errors.newPassword && (
                        <div className="text-[rgba(0,153,81,1)] font-pretendard text-[16px] font-semibold leading-[24px] tracking-[-0.064px]">
                          사용 가능
                        </div>
                      )}
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 font-pretendard text-[12px] font-medium">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex flex-col gap-3 w-full">
                    <label className="text-[#6D6D6D] font-pretendard text-[14px] font-medium leading-[16px] opacity-80">
                      비밀번호 확인
                    </label>
                    <div
                      className={`flex items-center gap-[10px] w-full px-[18px] py-4 rounded-[8px] border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#E3E5E5]"
                      } bg-white`}
                    >
                      <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="비밀번호를 한 번 더 입력해주세요."
                        className="flex-1 text-[#303030] font-pretendard text-[16px] font-normal leading-[24px] tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 font-pretendard text-[12px] font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="text-[rgba(118,118,118,1)] font-pretendard text-[12px] font-medium leading-[24px]">
                    8~16자 영문, 숫자 혼용
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex w-1/2 justify-center items-center gap-[10px] h-16 rounded border border-[#07F] disabled:opacity-50"
                  >
                    <span className="text-[#07F] font-pretendard text-[18px] font-semibold leading-[24px]">
                      취소
                    </span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-1/2 justify-center items-center gap-[10px] h-16 rounded bg-[#07F] disabled:opacity-50"
                  >
                    <span className="text-white font-pretendard text-[18px] font-semibold leading-[24px]">
                      {isLoading ? "저장 중..." : "저장하기"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};
