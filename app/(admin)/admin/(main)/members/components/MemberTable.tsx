"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { MemberData } from "../types";

interface MemberTableProps {
  members: MemberData[];
  currentPage: number;
  itemsPerPage: number;
}

function StatusBadge({ status }: { status: "정상" | "탈퇴" }) {
  if (status === "정상") {
    return (
      <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[rgba(207,247,211,1)] text-[rgba(2,84,45,1)] border-none">
        정상
      </Badge>
    );
  }
  return (
    <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[rgba(253,211,208,1)] text-[rgba(144,11,9,1)] border-none">
      탈퇴
    </Badge>
  );
}

function getProviderName(provider: string): string {
  switch (provider) {
    case "google":
      return "구글";
    case "kakao":
      return "카카오";
    case "local":
      return "이메일";
    default:
      return provider;
  }
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export default function MemberTable({ members, currentPage, itemsPerPage }: MemberTableProps) {
  const router = useRouter();
  
  // 페이지네이션을 고려한 시작 번호 계산
  const startNumber = (currentPage - 1) * itemsPerPage;

  return (
    <div className="flex flex-col">
      {/* Table Header */}
      <div className="grid grid-cols-10 items-center px-4 py-4 bg-[#EEE] rounded-t-sm h-[50px]">
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">NO</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">회원ID</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">이름</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">ID</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">가입방식</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">
            소속 (회사명)
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">사업분야</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">
            최근 로그인
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">상태</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-[#515151]">가입일시</span>
        </div>
      </div>

      {/* Table Body */}
      {members.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] bg-white border-b border-gray-100">
          <span className="text-sm text-[#686868]">검색 결과가 없습니다.</span>
        </div>
      ) : (
        members.map((member, index) => (
          <div
            key={member.id}
            className="group grid grid-cols-10 items-center px-4 h-[50px] cursor-pointer border-b border-gray-100 bg-white hover:bg-[#E3EFFE] transition-colors duration-200"
            onClick={() => {
              router.push(`/admin/members/${member.id}`);
            }}
          >
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {startNumber + index + 1}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {member.user_id.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {member.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {member.email}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {getProviderName(member.provider)}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {member.organization || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {member.business_field || "-"}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {formatDate(member.last_sign_in_at)}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <StatusBadge status={member.status} />
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                {formatDateTime(member.created_at)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
