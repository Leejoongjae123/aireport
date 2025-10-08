"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import Pagination from "@/components/ui/pagination";
import DateEdit from "@/components/ui/date-edit";

// Sample data for the table
const reportData = [
  {
    no: "12345",
    reportId: "RP10231",
    title: "AI 기반 리테일 수요예측 사업계획서",
    field: "디지털·ICT·AI",
    name: "김이수",
    id: "hong***@gmail.com",
    version: "v12",
    createdAt: "2023-11-15   12:22:23",
    updatedAt: "2023-11-15   12:22:23",
  },
  {
    no: "12345",
    reportId: "RP10231",
    title: "재생에너지 사업화 전략",
    field: "에너지·환경",
    name: "김이수",
    id: "hong***@gmail.com",
    version: "v11.2",
    createdAt: "2023-11-15   12:22:23",
    updatedAt: "2023-11-15   12:22:23",
  },
  // Add more sample data with same structure
  ...Array(8)
    .fill(null)
    .map(() => ({
      no: "12345",
      reportId: "RP10231",
      title:
        "AI 기반 리테일 수요예측 사업계획서 AI 기반 리테일 수요예측 사업계획서",
      field: "디지털·ICT·AI",
      name: "김이수",
      id: "hong***@gmail.com",
      version: "v12",
      createdAt: "2023-11-15   12:22:23",
      updatedAt: "2023-11-15   12:22:23",
    })),
];

export default function ReportsPage() {
  const router = useRouter();

  // 필터 상태
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2025, 7, 8)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [businessField, setBusinessField] = useState("전체");

  // 검색 상태
  const [searchFilter, setSearchFilter] = useState("이름");
  const [searchValue, setSearchValue] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");

  // 옵션들
  const businessFieldOptions = [
    "전체",
    "디지털·ICT·AI",
    "에너지·환경",
    "제조·산업기술·혁신",
  ];
  const searchFilterOptions = ["이름", "ID", "제목"];
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
    setBusinessField("전체");
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

  return (
    <div className="flex flex-col items-center gap-8 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Page Title */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">보고서 생성 관리</h1>
      </div>

      {/* Filter Section */}
      <div className="w-full p-8 rounded-lg bg-[#ECF5FF] flex flex-col gap-4">
        {/* Top Row Filters */}
        <div className="flex items-center gap-6">
          {/* Period Search */}
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

          {/* Business Field */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-base font-semibold text-[#555] whitespace-nowrap">
              사업분야
            </label>
            <FilterDropdown
              value={businessField}
              options={businessFieldOptions}
              onChange={setBusinessField}
            />
          </div>
        </div>

        {/* Search Row */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <SearchInputWithFilter
            filterValue={searchFilter}
            filterOptions={searchFilterOptions}
            onFilterChange={setSearchFilter}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="검색어를 입력해주세요."
          />

          {/* Action Buttons */}
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

      {/* Results Section */}
      <div className="w-full flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">
            <span className="text-[#6D6D6D]">총 </span>
            <span className="text-[#07F]">12,345</span>
            <span className="text-[#6D6D6D]">건</span>
          </div>
          <Button className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9]">
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
          </Button>
        </div>

        {/* Table */}
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="flex items-center px-4 py-4 bg-[#EEE] rounded-t-sm">
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">NO</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">보고서ID</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[2]">
              <span className="text-xs font-bold text-[#515151]">제목</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">분야</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">이름</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">ID</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">버전</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">생성일시</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">수정일시</span>
            </div>
          </div>

          {/* Table Body */}
          {reportData.map((report, index) => (
            <div
              key={index}
              className="flex items-center px-4 h-[50px] bg-white cursor-pointer hover:bg-[#E3EFFE] group transition-colors duration-200"
              onClick={() => router.push(`/admin/reports/${report.reportId}`)}
            >
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.no}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.reportId}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[2]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] text-center truncate transition-colors duration-200">
                  {report.title}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.field}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.name}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.id}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.version}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.createdAt}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {report.updatedAt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center relative">
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
  );
}
