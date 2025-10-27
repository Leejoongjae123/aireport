"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { X, Lock, LogOut } from "lucide-react";
import { PasswordChangeModal } from "./PasswordChangeModal";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AdminHeader() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordChangeClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("로그아웃 에러:", error);
        return;
      }

      // 로그아웃 성공 시 로그인 페이지로 이동
      router.push("/admin/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 사용자 이름 추출 (이메일에서 @ 앞부분 또는 user_metadata에서)
  const getUserName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email?.split("@")[0] || "";
  };

  // 사용자 이름의 첫 글자 추출
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-[0_3px_6px_0_rgba(0,0,0,0.16)] h-[78px] flex items-center">
        <div className="w-full mx-auto px-5 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-[15px]">
              {/* <div className="w-[38px] h-[38px] rounded-full bg-[#B2B2B2]"></div>
              <div className="text-[32px] font-bold text-[#B3B3B3] font-pretendard">
                LOGO
              </div> */}
              <Link href="/admin/login">
                <Image src="/images/logo.svg" alt="Logo" width={142} height={38} />
              </Link>
            </div>

            {/* User Profile Section - 로그인된 경우에만 표시 */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-[9px] user-profile cursor-pointer">
                    <div className="w-8 h-[32.899px] px-2 py-1 flex flex-col justify-center items-center gap-2.5 rounded-full bg-[#424040]">
                      <div className="text-white text-base font-semibold font-pretendard">
                        {getUserInitial()}
                      </div>
                    </div>
                    <div className="text-[#303030] text-base font-medium font-pretendard">
                      {getUserName()} 님
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
                          {getUserName()}
                        </div>
                        <div className="text-[#5A5A5A] font-pretendard text-[10px] font-normal leading-[160%] truncate">
                          {user.email}
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

                    <DropdownMenuItem
                      className="flex items-center gap-[6px] py-2 px-3 cursor-pointer hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 text-[#303030]" />
                      <span className="text-[#303030] font-pretendard text-[14px] font-semibold leading-[160%]">
                        로그아웃
                      </span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
