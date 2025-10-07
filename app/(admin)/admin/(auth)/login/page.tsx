"use client";

import React, { useState } from "react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#F5F6FA] flex items-center justify-center">
      <div className="w-[420px] flex flex-col items-center gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-[15px]">
            <div className="w-[38px] h-[38px] rounded-full bg-[#B2B2B2]"></div>
            <div className="text-[#B3B3B3] text-[32px] font-[700] leading-normal font-[Pretendard]">
              LOGO
            </div>
          </div>
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
          <button className="flex py-5 px-[52px] justify-center items-center gap-2 w-full rounded-[10px] bg-[#07F]">
            <span className="text-white text-[18px] font-[700] leading-normal font-[Pretendard]">
              로그인
            </span>
          </button>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center items-center gap-[14px] w-full">
          <div className="flex items-center gap-2 w-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_939_908)">
                <path
                  d="M9.99936 18.3337C11.0939 18.335 12.1779 18.1201 13.1892 17.7012C14.2004 17.2823 15.1189 16.6678 15.8919 15.8928C16.6668 15.1198 17.2813 14.2014 17.7002 13.1901C18.1191 12.1789 18.334 11.0949 18.3327 10.0003C18.334 8.90579 18.1191 7.82176 17.7002 6.81054C17.2813 5.79931 16.6668 4.88082 15.8919 4.10783C15.1189 3.3329 14.2004 2.71834 13.1892 2.29946C12.1779 1.88059 11.0939 1.66565 9.99936 1.667C8.90481 1.66565 7.82078 1.88059 6.80956 2.29946C5.79834 2.71834 4.87984 3.3329 4.10686 4.10783C3.33192 4.88082 2.71736 5.79931 2.29849 6.81054C1.87961 7.82176 1.66467 8.90579 1.66602 10.0003C1.66467 11.0949 1.87961 12.1789 2.29849 13.1901C2.71736 14.2014 3.33192 15.1198 4.10686 15.8928C4.87984 16.6678 5.79834 17.2823 6.80956 17.7012C7.82078 18.1201 8.90481 18.335 9.99936 18.3337Z"
                  stroke="#767676"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.9987 4.58398C10.275 4.58398 10.5399 4.69373 10.7353 4.88908C10.9306 5.08443 11.0404 5.34938 11.0404 5.62565C11.0404 5.90192 10.9306 6.16687 10.7353 6.36222C10.5399 6.55757 10.275 6.66732 9.9987 6.66732C9.72243 6.66732 9.45748 6.55757 9.26213 6.36222C9.06678 6.16687 8.95703 5.90192 8.95703 5.62565C8.95703 5.34938 9.06678 5.08443 9.26213 4.88908C9.45748 4.69373 9.72243 4.58398 9.9987 4.58398Z"
                  fill="#767676"
                />
                <path
                  d="M10.2083 14.1673V8.33398H9.375M8.75 14.1673H11.6667"
                  stroke="#767676"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_939_908">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-[#5A5A5A] text-[16px] font-[500] leading-normal font-[Pretendard]">
              관리자 계정 생성을 위해서는 시스템 관리자에게 연락바랍니다.
            </span>
          </div>
          <div className="text-[#5A5A5A] text-center text-[16px] font-[500] leading-normal font-[Pretendard]">
            홍길동 과장 | 02-1234-1234 | admin@000.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
