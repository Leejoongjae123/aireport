"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Lock, LogOut } from "lucide-react";
import { PasswordChangeModal } from "./password-change-modal";

export default function AdminHeader() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handlePasswordChangeClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-[0_3px_6px_0_rgba(0,0,0,0.16)] h-[78px] flex items-center">
        <div className="w-full mx-auto px-5 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-[15px]">
              <div className="w-[38px] h-[38px] rounded-full bg-[#B2B2B2]"></div>
              <div className="text-[32px] font-bold text-[#B3B3B3] font-pretendard">
                LOGO
              </div>
            </div>

            {/* User Profile Section */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-[9px] user-profile cursor-pointer">
                  <div className="w-8 h-[32.899px] px-2 py-1 flex flex-col justify-center items-center gap-2.5 rounded-full bg-[#424040]">
                    <div className="text-white text-base font-semibold font-pretendard">
                      홍
                    </div>
                  </div>
                  <div className="text-[#303030] text-base font-medium font-pretendard">
                    홍길동 님
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[180px] p-3 bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.25)] border-none rounded-[8px]"
                align="end"
                sideOffset={8}
              >
                {/* Close button - positioned absolutely */}
                <div className="flex justify-end mb-2">
                  <X className="w-[14px] h-[14px] text-[#767676] cursor-pointer" />
                </div>

                {/* User Info Section */}
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex h-[42px] py-2 px-3 flex-col justify-center items-center rounded bg-[#F5F5F5]">
                    <div className="w-full flex items-center gap-3">
                      <div className="text-[#303030] font-pretendard text-[12px] font-bold leading-[160%]">
                        홍길동
                      </div>
                      <div className="text-[#5A5A5A] font-pretendard text-[10px] font-normal leading-[160%] truncate">
                        qwer12@gmail.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col">
                  <DropdownMenuItem
                    className="flex items-center gap-[6px] py-2 px-3 cursor-pointer hover:bg-gray-50"
                    onClick={handlePasswordChangeClick}
                  >
                    <Lock className="w-5 h-5 text-[#303030]" />
                    <span className="text-[#303030] font-pretendard text-[14px] font-semibold leading-[160%]">
                      비밀번호 변경
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-[6px] py-2 px-3 cursor-pointer hover:bg-gray-50">
                    <LogOut className="w-5 h-5 text-[#303030]" />
                    <span className="text-[#303030] font-pretendard text-[14px] font-semibold leading-[160%]">
                      로그아웃
                    </span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
      />
    </>
  );
}
