import Link from "next/link";
export default function Navbar() {
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
      </nav>
    </div>
  );
}
