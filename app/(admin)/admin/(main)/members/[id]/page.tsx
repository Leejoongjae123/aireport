import { Button } from "@/components/ui/Button";
import { List } from "lucide-react";
import MemberInfo from "./components/MemberInfo";
import RequestHistory from "./components/RequestHistory";
import { MemberDetailResponse } from "./types";
import Link from "next/link";

interface MemberDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchMemberDetail(id: string): Promise<MemberDetailResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    return { member: null, requests: [] };
  }
  
  const response = await fetch(`${baseUrl}/api/admin/members/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { member: null, requests: [] };
  }

  return response.json();
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { id } = await params;
  const { member, requests } = await fetchMemberDetail(id);

  if (!member) {
    return (
      <div className="flex w-full p-8 mx-auto">
        <div className="flex flex-col justify-center items-center gap-20 flex-1 p-11 rounded-[5px] bg-white">
          <div className="text-xl text-[#6A6A6A]">
            회원 정보를 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full p-8 mx-auto">
      <div className="flex flex-col justify-center items-center gap-20 flex-1 p-11 rounded-[5px] bg-white">
        {/* Member Information Section */}
        <div className="flex flex-col items-start gap-10 w-full">
          <MemberInfo member={member} />
          <RequestHistory requests={requests} />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-between items-center">
          <Link href="/admin/members">
            <Button
              variant="outline"
              className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#A0A0A0] bg-white text-sm font-semibold text-[#555] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F5F5F5]"
            >
              <List className="w-4 h-4" />
            목록으로
          </Button>
          </Link>
          {/* <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#07F] bg-white text-sm font-semibold text-[#07F] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F8FBFF]"
            >
              삭제
            </Button>
            <Button className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded bg-[#07F] text-sm font-semibold text-white tracking-[-0.28px] font-['Pretendard'] hover:bg-[#0066CC]">
              수정
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
