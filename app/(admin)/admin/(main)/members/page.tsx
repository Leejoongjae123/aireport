import { Suspense } from "react";
import MembersContent from "./components/MembersContent";
import { MemberSearchParams, MemberListResponse } from "./types";

async function fetchMembers(searchParams: MemberSearchParams): Promise<MemberListResponse> {
  const params = new URLSearchParams();
  
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.limit) params.set("limit", searchParams.limit);
  if (searchParams.startDate) params.set("startDate", searchParams.startDate);
  if (searchParams.endDate) params.set("endDate", searchParams.endDate);
  if (searchParams.businessField) params.set("businessField", searchParams.businessField);
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.searchType) params.set("searchType", searchParams.searchType);
  if (searchParams.searchValue) params.set("searchValue", searchParams.searchValue);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
  
  const response = await fetch(`${baseUrl}/api/admin/members?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: [], total: 0, page: 1, limit: 10 };
  }

  return response.json();
}

interface MembersPageProps {
  searchParams: Promise<MemberSearchParams>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;

  // 회원 데이터 가져오기
  const memberData = await fetchMembers(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MembersContent initialData={memberData} />
    </Suspense>
  );
}
