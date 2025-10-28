"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";

interface MemberPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export default function MemberPagination({
  currentPage,
  totalPages,
  itemsPerPage,
}: MemberPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPageOptions = [
    "10개씩 보기",
    "20개씩 보기",
    "50개씩 보기",
    "100개씩 보기",
  ];

  const currentItemsPerPageLabel = `${itemsPerPage}개씩 보기`;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/members?${params.toString()}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = parseInt(value.match(/\d+/)?.[0] || "10");
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit.toString());
    params.set("page", "1"); // 페이지 사이즈 변경 시 첫 페이지로
    router.push(`/admin/members?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center relative">
      {/* Items per page selector */}
      <div className="absolute left-0">
        <FilterDropdown
          value={currentItemsPerPageLabel}
          options={itemsPerPageOptions}
          onChange={handleItemsPerPageChange}
          width="w-[140px]"
        />
      </div>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
