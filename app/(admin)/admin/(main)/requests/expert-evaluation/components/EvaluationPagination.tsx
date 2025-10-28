"use client";

import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";

interface EvaluationPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export default function EvaluationPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: EvaluationPaginationProps) {
  const itemsPerPageOptions = [
    "10개씩 보기",
    "20개씩 보기",
    "50개씩 보기",
    "100개씩 보기",
  ];

  return (
    <div className="flex items-center justify-center relative">
      {/* Items per page selector */}
      <div className="absolute left-0">
        <FilterDropdown
          value={itemsPerPage}
          options={itemsPerPageOptions}
          onChange={onItemsPerPageChange}
          width="w-[140px]"
        />
      </div>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
