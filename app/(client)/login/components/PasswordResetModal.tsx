"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { X } from "lucide-react";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetModal({
  isOpen,
  onClose,
}: PasswordResetModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset for:", email);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none max-w-none w-[500px] h-[326px]"
        showCloseButton={false}
      >
        <div
          className="relative w-full h-full flex flex-col items-start gap-[31px] rounded-[12px]  bg-white p-[40px]"
          style={{
            boxShadow: "0 0 10px 0 rgba(0, 119, 255, 0.20)",
          }}
        >
          <div className="flex w-[420px] flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-[44px] self-stretch">
              {/* Header with title and close button */}
              <div className="flex justify-between items-center self-stretch">
                <DialogHeader className="p-0">
                  <DialogTitle className="text-black font-pretendard text-[24px] font-bold leading-normal m-0 p-0">
                    비밀번호 찾기
                  </DialogTitle>
                </DialogHeader>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
                </button>
              </div>

              {/* Email input section */}
              <div className="flex flex-col items-start gap-3 self-stretch">
                <label className="self-stretch text-[#202224] font-pretendard text-[14px] font-semibold leading-normal tracking-[-0.064px] opacity-80">
                  이메일
                </label>
                <div className="flex p-[16px_18px] items-center gap-[10px] self-stretch rounded-lg border border-[#E3E5E5] bg-white">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="등록하신 이메일을 입력해주세요."
                    className="flex-1 text-[#A6A6A6] font-pretendard text-[16px] font-normal leading-6 tracking-[-0.064px] bg-transparent border-none outline-none placeholder:text-[#A6A6A6]"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="flex p-[20px_52px] justify-center items-center gap-2 self-stretch rounded-[10px] bg-[#07F] hover:bg-[#0066CC] transition-colors"
            >
              <span className="text-white font-pretendard text-[18px] font-bold leading-normal tracking-[-0.36px]">
                비밀번호 찾기
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
