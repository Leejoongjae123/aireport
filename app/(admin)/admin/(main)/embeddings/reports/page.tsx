"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

// Mock data for the table
const mockReports = [
  {
    no: "12345",
    reportId: "RPT-001",
    title: "기계제작 및 설치 서비스 고도화",
    category: "강소기업",
    field: "디지털·ICT·AI",
    keywords: "산업바이오, 전통장류, 산업바이오, 전통장류,",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: false,
  },
  {
    no: "12345",
    reportId: "RPT-001",
    title: "K-종가집 장류명품화 및 글로벌 확산",
    category: "위기대응",
    field: "제조·산업기술·혁신",
    keywords: "산업바이오, 전통장류, 산업바이오, 전통장류,",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: true,
  },
  {
    no: "12345",
    reportId: "RPT-001",
    title: "BI 솔루션 시장 확대",
    category: "시제품",
    field: "문화·콘텐츠·관광",
    keywords: "산업바이오, 전통장류, 산업바이오, 전통장류,",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: false,
  },
  {
    no: "12345",
    reportId: "RPT-001",
    title: "에너지 세이빙을 위한 스마트 펌프 ...",
    category: "지역수요",
    field: "에너지·환경",
    keywords: "산업바이오, 전통장류, 산업바이오, 전통장류,",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: false,
  },
  {
    no: "12345",
    reportId: "RPT-001",
    title: "탄소중립 기술컨설팅",
    category: "선도기업",
    field: "공공·도시·인프라",
    keywords: "산업바이오, 전통장류, 산업바이오, 전통장류,",
    embeddingDate: "2025-09-10 15:32",
    isHighlighted: false,
  },
];

export default function ExpertEvaluationRequestPage() {
  // 필터 상태
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2025, 7, 8)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [category, setCategory] = useState("전체");
  const [field, setField] = useState("전체");

  // 검색 상태
  const [searchFilter, setSearchFilter] = useState("이름");
  const [searchValue, setSearchValue] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");

  // 옵션들
  const categoryOptions = [
    "전체",
    "강소기업",
    "위기대응",
    "시제품",
    "지역수요",
    "선도기업",
  ];
  const fieldOptions = [
    "전체",
    "디지털·ICT·AI",
    "제조·산업기술·혁신",
    "문화·콘텐츠·관광",
    "에너지·환경",
    "공공·도시·인프라",
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
    setCategory("전체");
    setField("전체");
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
    <div className="flex flex-col p-11 gap-8 bg-white min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#2A2A2A] font-pretendard">
        전문가 평가 요청
      </h1>

      <div className="flex flex-col gap-8">
        {/* Search Filter Section */}
        <div className="flex flex-col gap-4 p-8 bg-[#ECF5FF] rounded-lg">
          {/* First Row - Date Range, Category, Field */}
          <div className="flex items-start gap-6">
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

            {/* Category Select */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-base font-semibold text-[#555] whitespace-nowrap">
                분류
              </label>
              <FilterDropdown
                value={category}
                options={categoryOptions}
                onChange={setCategory}
              />
            </div>

            {/* Field Select */}
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
          </div>

          {/* Second Row - Search Input and Buttons */}
          <div className="flex items-center gap-6">
            {/* Search Input */}
            <SearchInputWithFilter
              filterValue={searchFilter}
              filterOptions={searchFilterOptions}
              onFilterChange={setSearchFilter}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              placeholder="검색어를 입력해주세요."
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
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
        <div className="flex items-start gap-4">
          <Card className="flex flex-col items-center gap-4 p-4 border border-[#D9D9D9] rounded-lg">
            <Badge className="px-2.5 py-1.5 bg-[#ECF5FF] text-[#0077FF] text-xs font-medium rounded-full">
              등록 보고서
            </Badge>
            <div className="text-xl font-bold text-[#303030] text-center w-[100px]">
              152건
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-4 p-4 border border-[#D9D9D9] rounded-lg">
            <Badge className="px-2.5 py-1.5 bg-[#ECF5FF] text-[#0077FF] text-xs font-medium rounded-full">
              이번달 신규
            </Badge>
            <div className="text-xl font-bold text-[#303030] text-center w-[100px]">
              12건
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-4 p-4 border border-[#D9D9D9] rounded-lg">
            <Badge className="px-2.5 py-1.5 bg-[#ECF5FF] text-[#0077FF] text-xs font-medium rounded-full">
              최신 임베딩일
            </Badge>
            <div className="flex items-center gap-1">
              <div className="text-base font-bold text-[#303030] text-center w-[100px]">
                2025-09-10
              </div>
              <div className="text-[10px] font-medium text-[#878A8F] leading-tight">
                15:32
              </div>
            </div>
          </Card>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center gap-6">
          {/* Header with Total Count and Action Buttons */}
          <div className="flex justify-between items-center w-full">
            <div className="text-xl font-medium text-[#6D6D6D] tracking-[-0.4px] leading-6">
              총 <span className="text-[#0077FF]">12,345</span>건
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[1.6px] border-[#4CA452] text-[#4CA452] font-bold text-sm px-3 py-2.5 rounded bg-white hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-3"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.66797 5.47331V2.47331C2.66797 2.2965 2.73821 2.12693 2.86323 2.0019C2.98826 1.87688 3.15782 1.80664 3.33464 1.80664H12.668C12.8448 1.80664 13.0143 1.87688 13.1394 2.0019C13.2644 2.12693 13.3346 2.2965 13.3346 2.47331V14.4733C13.3346 14.6501 13.2644 14.8197 13.1394 14.9447C13.0143 15.0697 12.8448 15.14 12.668 15.14H3.33464C3.15782 15.14 2.98826 15.0697 2.86323 14.9447C2.73821 14.8197 2.66797 14.6501 2.66797 14.4733V11.4733"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.334 5.47266H11.334M9.33398 8.13932H11.334M9.33398 10.806H11.334"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.33398 7.47266L5.33398 9.47266M5.33398 7.47266L3.33398 9.47266M1.33398 5.47266H7.33398V11.4727H1.33398V5.47266Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                엑셀 다운로드
              </Button>
              <Button className="w-[127px] bg-[#0077FF] text-white font-bold text-sm px-3 py-2.5 rounded hover:bg-[#0077FF]/90">
                보고서 등록
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex flex-col w-full">
            {/* Table Header */}
            <div className="flex h-[50px] px-4 justify-between items-center bg-[#EEEEEE] rounded-sm">
              <div className="flex items-center justify-center w-10 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  NO
                </span>
              </div>
              <div className="flex items-center justify-center w-20 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  보고서ID
                </span>
              </div>
              <div className="flex items-center justify-center w-[220px] px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  제목
                </span>
              </div>
              <div className="flex items-center justify-center w-15 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  카테고리
                </span>
              </div>
              <div className="flex items-center justify-center w-25 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  분야
                </span>
              </div>
              <div className="flex items-center justify-center w-40 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  키워드
                </span>
              </div>
              <div className="flex items-center justify-center w-15 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  파일
                </span>
              </div>
              <div className="flex items-center justify-center w-30 px-2.5 py-4">
                <span className="text-xs font-bold text-[#515151] text-center">
                  임베딩 일시
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {mockReports.map((report, index) => (
              <div
                key={index}
                className={`flex h-[50px] px-4 justify-between items-center rounded ${
                  report.isHighlighted ? "bg-[#E3EFFE]" : ""
                }`}
              >
                <div className="flex items-center justify-center w-10 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.no}
                  </span>
                </div>
                <div className="flex items-center justify-center w-20 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.reportId}
                  </span>
                </div>
                <div className="flex items-center justify-center w-[220px] px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center max-h-[14px] ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.title}
                  </span>
                </div>
                <div className="flex items-center justify-center w-15 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center max-w-[60px] ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.category}
                  </span>
                </div>
                <div className="flex items-center justify-center w-25 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center max-w-[100px] ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.field}
                  </span>
                </div>
                <div className="flex items-center justify-center w-40 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center max-h-[14px] ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.keywords}
                  </span>
                </div>
                <div className="flex items-center justify-center w-15 px-2.5 py-4">
                  <Button
                    variant="outline"
                    className="h-6 px-2 py-1 border border-[#BAD1EC] bg-white text-xs font-medium text-[#5A5A5A] rounded"
                  >
                    다운로드
                  </Button>
                </div>
                <div className="flex items-center justify-center w-30 px-2.5 py-4">
                  <span
                    className={`text-xs font-medium text-center ${
                      report.isHighlighted ? "text-[#0077FF]" : "text-[#686868]"
                    }`}
                  >
                    {report.embeddingDate}
                  </span>
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
  );
}
