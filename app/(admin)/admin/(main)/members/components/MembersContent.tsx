"use client";

import { Button } from "@/components/ui/Button";
import MemberSearchFilter from "./MemberSearchFilter";
import MemberTable from "./MemberTable";
import MemberPagination from "./MemberPagination";
import { MemberListResponse, MemberData } from "../types";
import { useExcelDownload } from "@/components/hooks/UseExcelDownload";
import { useCustomToast } from "@/components/hooks/UseCustomToast";

interface MembersContentProps {
  initialData: MemberListResponse;
}

export default function MembersContent({ initialData }: MembersContentProps) {
  const data = initialData;
  const currentPage = initialData.page;
  const itemsPerPage = initialData.limit;

  const { showSuccess, showError } = useCustomToast();
  const { downloadExcel, isDownloading } = useExcelDownload<MemberData>({
    filename: `회원목록_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "회원 목록",
    dataTransformer: (members) =>
      members.map((member, index: number) => ({
        번호: index + 1,
        이름: member.name || "",
        ID: member.email || "",
        회사명: member.organization || "",
        사업분야: member.business_field || "",
        가입경로:
          member.provider === "google"
            ? "구글"
            : member.provider === "kakao"
            ? "카카오"
            : "이메일",
        가입일시: member.created_at
          ? new Date(member.created_at).toLocaleDateString("ko-KR")
          : "",
        "최근 로그인": member.last_sign_in_at
          ? new Date(member.last_sign_in_at).toLocaleDateString("ko-KR")
          : "-",
        상태: member.status,
      })),
  });

  const handleExcelDownload = async () => {
    try {
      const response = await fetch("/api/admin/members/all");
      if (!response.ok) {
        showError("회원 정보를 불러오는데 실패했습니다.");
        return;
      }

      const { data: allMembers } = await response.json();
      const result = await downloadExcel(allMembers);

      if (result.success) {
        showSuccess("엑셀 파일이 다운로드되었습니다.");
      } else {
        showError("엑셀 다운로드에 실패했습니다.");
      }
    } catch {
      showError("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Page Title */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">회원관리</h1>
      </div>

      {/* Filter Section */}
      <MemberSearchFilter />

      {/* Results Section */}
      <div className="w-full flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">
            <span className="text-[#6D6D6D]">총 </span>
            <span className="text-[#07F]">{data.total.toLocaleString()}</span>
            <span className="text-[#6D6D6D]">건</span>
          </div>
          <Button
            onClick={handleExcelDownload}
            disabled={isDownloading}
            className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                다운로드 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
                  <path
                    d="M2.66797 5.47233V2.47233C2.66797 2.29552 2.73821 2.12595 2.86323 2.00093C2.98826 1.8759 3.15782 1.80566 3.33464 1.80566H12.668C12.8448 1.80566 13.0143 1.8759 13.1394 2.00093C13.2644 2.12595 13.3346 2.29552 13.3346 2.47233V14.4723C13.3346 14.6491 13.2644 14.8187 13.1394 14.9437C13.0143 15.0688 12.8448 15.139 12.668 15.139H3.33464C3.15782 15.139 2.98826 15.0688 2.86323 14.9437C2.73821 14.8187 2.66797 14.6491 2.66797 14.4723V11.4723"
                    stroke="#4CA452"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.334 5.47266H11.334M9.33398 8.13932H11.334M9.33398 10.806H11.334"
                    stroke="#4CA452"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.33398 7.47266L5.33398 9.47266M5.33398 7.47266L3.33398 9.47266M1.33398 5.47266H7.33398V11.4727H1.33398V5.47266Z"
                    stroke="#4CA452"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                엑셀 다운로드
              </>
            )}
          </Button>
        </div>

        {/* Table */}
        <MemberTable
          members={data.data}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        {/* Pagination */}
        <MemberPagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.total / itemsPerPage)}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
