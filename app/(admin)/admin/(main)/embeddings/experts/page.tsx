"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import Pagination from "@/components/ui/pagination";
import DateEdit from "@/components/ui/date-edit";

export default function ExpertsPage() {
  // 필터 상태
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2025, 7, 8)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [field, setField] = useState("전체");
  const [status, setStatus] = useState("전체");

  // 검색 상태
  const [searchFilter, setSearchFilter] = useState("이름");
  const [searchValue, setSearchValue] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");

  // 옵션들
  const fieldOptions = ["전체", "헬스케어", "AI", "바이오", "IT"];
  const statusOptions = ["전체", "공개", "비공개"];
  const searchFilterOptions = ["이름", "ID", "소속"];
  const itemsPerPageOptions = [
    "10개씩 보기",
    "20개씩 보기",
    "50개씩 보기",
    "100개씩 보기",
  ];

  // 날짜 포맷 함수
  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "날짜 입력";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 초기화 함수
  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setField("전체");
    setStatus("전체");
    setSearchFilter("이름");
    setSearchValue("");
    setCurrentPage(1);
    setItemsPerPage("10개씩 보기");
  };

  // 검색 함수
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 전체 페이지 수 계산
  const totalItems = 12345;
  const itemsPerPageNum = parseInt(itemsPerPage.match(/\d+/)?.[0] || "10");
  const totalPages = Math.ceil(totalItems / itemsPerPageNum);

  // Sample data for the table
  const experts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    expertId: "EXP-001234",
    name: "김철수",
    affiliation: "㈜천연스토리 대표이사",
    experience: "15년",
    specialization: "헬스케어 IT",
    keywords: "헬스케어, AI의료기기, 빅데이터...",
    status: index === 1 ? "비공개" : "공개",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: index === 1,
  }));

  return (
    <div className="flex flex-col items-center gap-[34px] p-[44px] bg-white min-h-screen">
      <div className="flex flex-col items-start gap-[34px] w-full">
        {/* Title */}
        <h1 className="text-[24px] font-bold leading-[32px] text-[#2A2A2A] font-['Pretendard']">
          전문가 평가 요청
        </h1>

        {/* Filter Section */}
        <div className="flex flex-col items-start gap-[18px] w-full p-[32px] rounded-[8px] bg-[#ECF5FF]">
          {/* First Row - Date, Field, Status */}
          <div className="flex items-start gap-6 w-full">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-[#555] whitespace-nowrap">
                기간 검색
              </label>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <button
                    onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                    className="relative flex items-center justify-between w-[140px] px-3 py-3 bg-white border border-[#EBEBEB] rounded-md hover:bg-[#E8F3FF]"
                  >
                    <span
                      className={`text-sm font-semibold ${
                        startDate ? "text-[#07F]" : "text-[#727272]"
                      }`}
                    >
                      {formatDate(startDate)}
                    </span>
                    <Calendar className="w-3 h-3 text-[#727272]" />
                  </button>
                  {showStartDatePicker && (
                    <div className="absolute top-full mt-2 z-50">
                      <DateEdit
                        value={startDate}
                        onChange={setStartDate}
                        onConfirm={(date) => {
                          setStartDate(date);
                          setShowStartDatePicker(false);
                        }}
                        onCancel={() => setShowStartDatePicker(false)}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#727272]">-</span>
                <div className="relative">
                  <button
                    onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                    className="relative flex items-center justify-between w-[140px] px-3 py-3 bg-white border border-[#EBEBEB] rounded-md hover:bg-[#E8F3FF]"
                  >
                    <span
                      className={`text-sm font-medium ${
                        endDate ? "text-[#07F]" : "text-[#727272]"
                      }`}
                    >
                      {formatDate(endDate)}
                    </span>
                    <Calendar className="w-3 h-3 text-[#727272]" />
                  </button>
                  {showEndDatePicker && (
                    <div className="absolute top-full mt-2 z-50">
                      <DateEdit
                        value={endDate}
                        onChange={setEndDate}
                        onConfirm={(date) => {
                          setEndDate(date);
                          setShowEndDatePicker(false);
                        }}
                        onCancel={() => setShowEndDatePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Field Dropdown */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-base font-semibold text-[#555] whitespace-nowrap">
                분야
              </label>
              <FilterDropdown
                value={field}
                options={fieldOptions}
                onChange={setField}
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-base font-semibold text-[#555] whitespace-nowrap">
                상태
              </label>
              <FilterDropdown
                value={status}
                options={statusOptions}
                onChange={setStatus}
              />
            </div>
          </div>

          {/* Second Row - Search and Buttons */}
          <div className="flex items-center gap-6 w-full">
            <SearchInputWithFilter
              filterValue={searchFilter}
              filterOptions={searchFilterOptions}
              onFilterChange={setSearchFilter}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              placeholder="검색어를 입력해주세요."
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSearch}
                className="w-[120px] h-[43px] bg-[#07F] text-white font-semibold text-base rounded hover:bg-[#0066CC]"
              >
                <Search className="w-4 h-4" />
                검색
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-[120px] h-[43px] border-[1.3px] border-[#07F] bg-white text-[#07F] font-semibold text-base rounded hover:bg-[#F8FBFF] hover:text-none"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex items-start gap-[16px]">
          <Card className="flex p-[16px_44px] flex-col justify-center items-center gap-[16px] rounded-[8px] border border-[#D9D9D9] bg-white">
            <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-[12px] font-normal text-[#07F] font-['Pretendard'] hover:bg-[#ECF5FF]">
              등록 전문가
            </Badge>
            <div className="w-[100px] text-center text-[20px] font-bold text-[#303030] font-['Pretendard']">
              85명
            </div>
          </Card>

          <Card className="flex p-[16px_44px] flex-col justify-center items-center gap-[16px] rounded-[8px] border border-[#D9D9D9] bg-white">
            <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-[12px] font-normal text-[#07F] font-['Pretendard'] hover:bg-[#ECF5FF]">
              이번달 신규
            </Badge>
            <div className="w-[100px] text-center text-[20px] font-bold text-[#303030] font-['Pretendard']">
              5명
            </div>
          </Card>

          <Card className="flex p-[16px_44px] flex-col justify-center items-center gap-[16px] rounded-[8px] border border-[#D9D9D9] bg-white">
            <Badge className="flex p-[6px_10px] justify-center items-center rounded-full bg-[#ECF5FF] text-[12px] font-normal text-[#07F] font-['Pretendard'] hover:bg-[#ECF5FF]">
              최신 임베딩일
            </Badge>
            <div className="flex items-center gap-[4px]">
              <div className="w-[100px] text-center text-[16px] font-bold text-[#303030] font-['Pretendard']">
                2025-09-10
              </div>
              <div className="text-[10px] font-normal text-[#878A8F] font-['Pretendard'] leading-[9px]">
                15:32
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-[24px] w-full">
          {/* Header with Total Count and Action Buttons */}
          <div className="flex flex-col items-end gap-[16px] w-full">
            <div className="flex justify-between items-center w-full">
              <div className="text-[20px] font-normal text-[#6D6D6D] font-['Pretendard'] leading-[24px] tracking-[-0.4px]">
                총 <span className="text-[#07F]">12,345</span>건
              </div>
              <div className="flex justify-end items-start gap-[12px]">
                <Button
                  variant="outline"
                  className="flex p-[10px_12px] items-center gap-[12px] rounded-[4px] border-[1.6px] border-[#4CA452] bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-[16px] h-[16px]"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <span className="text-[14px] font-bold text-[#4CA452] font-['Pretendard'] leading-[16px] tracking-[-0.28px]">
                    엑셀 다운로드
                  </span>
                </Button>
                <Button className="flex w-[127px] p-[10px_12px] justify-center items-center gap-[10px] rounded-[4px] bg-[#07F] hover:bg-[#0066dd]">
                  <span className="text-[14px] font-bold text-white font-['Pretendard'] leading-[16px] tracking-[-0.28px]">
                    전문가 등록
                  </span>
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="flex flex-col items-start w-full">
              {/* Table Header */}
              <div className="flex h-[50px] px-[16px] justify-between items-center w-full rounded-[2px] bg-[#EEE]">
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[40px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    NO
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[80px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    전문가ID
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[60px] max-w-[60px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    이름
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[160px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    소속/직책
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[32px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    경력
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[100px] max-w-[100px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    전문 분야
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[160px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    키워드
                  </div>
                </div>
                <div className="flex w-[72px] p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[41px] max-w-[41px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    상태
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[58px] max-w-[58px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    파일
                  </div>
                </div>
                <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                  <div className="w-[120px] text-center text-[12px] font-bold text-[#515151] font-['Pretendard']">
                    임베딩 일시
                  </div>
                </div>
              </div>

              {/* Table Rows */}
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className={`flex h-[50px] px-[16px] justify-between items-center w-full ${
                    expert.isHighlighted
                      ? "rounded-[2px] bg-[#E3EFFE]"
                      : "rounded-[4px]"
                  }`}
                >
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[40px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      12345
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[80px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.expertId}
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[60px] max-w-[60px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.name}
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[160px] max-h-[14px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.affiliation}
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[32px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.experience}
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[100px] max-w-[100px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.specialization}
                    </div>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[160px] max-h-[14px] text-center text-[12px] font-normal leading-[16px] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#313131]"
                      }`}
                      style={{ fontFamily: "Inter" }}
                    >
                      {expert.keywords}
                    </div>
                  </div>
                  <div className="flex w-[72px] p-[16px_10px] justify-center items-center gap-[10px]">
                    <Badge
                      className={`flex p-[6px_10px] justify-center items-center rounded-full text-[12px] font-normal font-['Pretendard'] hover:bg-current ${
                        expert.status === "공개"
                          ? "bg-[#ECF5FF] text-[#07F]"
                          : "bg-[#E3E3E3] text-[#5A5A5A]"
                      }`}
                    >
                      {expert.status}
                    </Badge>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <Button
                      variant="outline"
                      className="flex h-[24px] p-[4px_8px] justify-center items-center gap-[4px] rounded-[4px] border border-[#BAD1EC] bg-white hover:bg-gray-50"
                    >
                      <span className="text-[12px] font-normal text-[#5A5A5A] font-['Pretendard'] leading-[16px]">
                        다운로드
                      </span>
                    </Button>
                  </div>
                  <div className="flex p-[16px_10px] justify-center items-center gap-[10px]">
                    <div
                      className={`w-[120px] text-center text-[12px] font-normal font-['Pretendard'] ${
                        expert.isHighlighted ? "text-[#07F]" : "text-[#686868]"
                      }`}
                    >
                      {expert.embeddingDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center relative w-full">
              {/* Items per page selector */}
              <div className="absolute left-0">
                <FilterDropdown
                  value={itemsPerPage}
                  options={itemsPerPageOptions}
                  onChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                  width="w-[140px]"
                />
              </div>

              {/* Pagination controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
