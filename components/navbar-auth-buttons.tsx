"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface NavbarAuthButtonsProps {
  isAuthenticated: boolean;
}

export default function NavbarAuthButtons({
  isAuthenticated: initialAuth,
}: NavbarAuthButtonsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 확인
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        setIsAuthenticated(!!session);
        // 서버 컴포넌트를 새로고침하여 최신 상태 반영
        router.refresh();
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        router.refresh();
      } else if (event === "INITIAL_SESSION") {
        setIsAuthenticated(!!session);
      }
    });

    // 클린업
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      // onAuthStateChange가 자동으로 SIGNED_OUT 이벤트를 발생시킵니다
      router.push("/");
    }

    setIsLoading(false);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-[14px]">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex w-32 items-center justify-center gap-2 rounded-full bg-[#E8F3FF] py-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.00267 14.5H11.6667C12.4033 14.5 13 13.7327 13 12.786V4.21333C13 3.26733 12.4033 2.5 11.6667 2.5H7"
              stroke="#0077FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.33329 10.8333L9.66663 8.5L7.33329 6.16666M2.99996 8.49733H9.66663"
              stroke="#0077FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-base font-bold text-[#0077FF]">
            {isLoading ? "로그아웃 중..." : "로그아웃"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[14px]">
      <Link
        href="/login"
        className="flex w-32 items-center justify-center gap-2 rounded-full bg-[#E8F3FF] py-[14px]"
      >
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.00267 14.5H11.6667C12.4033 14.5 13 13.7327 13 12.786V4.21333C13 3.26733 12.4033 2.5 11.6667 2.5H7"
            stroke="#0077FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.33329 10.8333L9.66663 8.5L7.33329 6.16666M2.99996 8.49733H9.66663"
            stroke="#0077FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-base font-bold text-[#0077FF]">로그인</span>
      </Link>
      <Link
        href="/register"
        className="flex w-32 items-center justify-center gap-2 rounded-full bg-[#0077FF] py-[14px]"
      >
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99996 8.5C9.47329 8.5 10.6666 7.30666 10.6666 5.83333C10.6666 4.36 9.47329 3.16666 7.99996 3.16666C6.52663 3.16666 5.33329 4.36 5.33329 5.83333C5.33329 7.30666 6.52663 8.5 7.99996 8.5ZM7.99996 9.83333C6.21996 9.83333 2.66663 10.7267 2.66663 12.5V13.8333H13.3333V12.5C13.3333 10.7267 9.77996 9.83333 7.99996 9.83333Z"
            fill="white"
          />
        </svg>
        <span className="text-base font-bold text-white">회원가입</span>
      </Link>
    </div>
  );
}
