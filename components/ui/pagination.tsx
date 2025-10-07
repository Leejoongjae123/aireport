"use client";

import Arrow from "@/components/icons/Arrow";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // 총 페이지가 7개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 총 페이지가 7개 초과인 경우
      if (currentPage <= 4) {
        // 현재 페이지가 앞쪽에 있을 때
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 현재 페이지가 뒤쪽에 있을 때
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 현재 페이지가 중간에 있을 때
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="disabled:cursor-not-allowed"
      >
        <Arrow
          direction="left"
          size={24}
          color={currentPage === 1 ? "#A0A0A0" : "#0077FF"}
        />
      </button>

      {/* 페이지 번호 */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="flex h-6 w-6 items-center justify-center">
                <span className="text-sm text-[#CCBCAB]">...</span>
              </div>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                className={`flex h-6 w-6 items-center justify-center rounded-sm ${
                  currentPage === page ? "bg-[#0077FF]" : ""
                }`}
              >
                <span
                  className={`text-sm ${
                    currentPage === page ? "text-white" : "text-[#CCBCAB]"
                  }`}
                >
                  {page}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="disabled:cursor-not-allowed"
      >
        <Arrow
          direction="right"
          size={24}
          color={currentPage === totalPages ? "#A0A0A0" : "#0077FF"}
        />
      </button>
    </div>
  );
}
