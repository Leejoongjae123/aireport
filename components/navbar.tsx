import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarAuthButtons from "./navbar-auth-buttons";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center bg-[#FBFCFD] pt-[52px] max-w-[1440px] mx-auto ">
      <nav className="flex w-[1200px] h-[79px] items-center justify-between rounded-full border border-[#EEF1F7] bg-white px-6 py-4 shadow-[0_0_10px_0_rgba(60,123,194,0.12)]">
        <div className="flex items-center gap-11">
          <Link href="/" className="flex items-center gap-[15px]">
            <div className="h-[38px] w-[38px] rounded-full bg-[#B2B2B2]"></div>
            <span className="text-[32px] font-bold text-[#B3B3B3]">LOGO</span>
          </Link>
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2.5 px-6 py-2.5"
            >
              <span className="text-base font-bold text-[#313131]">
                서비스 소개
              </span>
            </Link>
            <Link
              href="/report/start"
              className="flex items-center justify-center gap-2.5 px-6 py-2.5"
            >
              <span className="text-base font-normal text-[#6B6B6B]">
                AI보고서
              </span>
            </Link>
            <Link
              href="/review"
              className="flex items-center justify-center gap-2.5 px-6 py-2.5"
            >
              <span className="text-base font-normal text-[#6B6B6B]">
                평가요청
              </span>
            </Link>
            <Link
              href="/mypage"
              className="flex items-center justify-center gap-2.5 px-6 py-2.5"
            >
              <span className="text-base font-normal text-[#6B6B6B]">
                계정설정
              </span>
            </Link>
          </div>
        </div>
        <NavbarAuthButtons isAuthenticated={isAuthenticated} />
      </nav>
    </div>
  );
}
