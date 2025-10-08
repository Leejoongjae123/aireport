"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import Pagination from "@/components/ui/pagination";
import DateEdit from "@/components/ui/date-edit";

interface ConsultingRequest {
  id: string;
  no: number;
  reportId: string;
  name: string;
  email: string;
  targetReport: string;
  expert: string;
  field: string;
  status: "completed" | "waiting" | "all";
  requestDate: string;
  completionDate: string | null;
  isSelected?: boolean;
}

const ExpertConsultingPage = () => {
  const router = useRouter();

  // 필터 상태
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2025, 7, 8)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState("전체");

  // 검색 상태
  const [searchFilter, setSearchFilter] = useState("이름");
  const [searchValue, setSearchValue] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");

  // Mock data
  const consultingRequests: ConsultingRequest[] = Array.from(
    { length: 100 },
    (_, i) => ({
      id: `req-${i + 1}`,
      no: 12345 + i,
      reportId: "CR001",
      name: "김이수",
      email: "hong***@gmail.com",
      targetReport: "Series-A IR 초안",
      expert: "김이수",
      field: "IR 자료 보강 컨설팅 요청",
      status: i === 1 ? "waiting" : i % 3 === 0 ? "waiting" : "completed",
      requestDate: "2025-09-12 09:30",
      completionDate: i % 3 === 0 ? null : "2025-09-12 09:30",
      isSelected: i === 1,
    })
  );

  // 옵션들
  const statusOptions = ["전체", "완료", "대기"];
  const searchFilterOptions = ["이름", "ID", "대상 보고서"];
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
    setStatusFilter("전체");
    setSearchFilter("이름");
    setSearchValue("");
    setCurrentPage(1);
    setItemsPerPage("10개씩 보기");
  };

  // 검색 함수
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // const totalRequests = consultingRequests.length
  // const completedCount = consultingRequests.filter(req => req.status === 'completed').length
  // const waitingCount = consultingRequests.filter(req => req.status === 'waiting').length

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "completed") {
      return (
        <Badge className="bg-[#cff7d3] text-[#025420] hover:bg-[#cff7d3] rounded-full px-2.5 py-1.5 text-xs font-normal">
          완료
        </Badge>
      );
    } else if (status === "waiting") {
      return (
        <Badge className="bg-[#fff1c2] text-[#975102] hover:bg-[#fff1c2] rounded-full px-2.5 py-1.5 text-xs font-normal">
          대기
        </Badge>
      );
    }
    return null;
  };

  const handleExcelDownload = () => {
    // Implement Excel download functionality
  };

  // 전체 페이지 수 계산
  const totalItems = 12345;
  const itemsPerPageNum = parseInt(itemsPerPage.match(/\d+/)?.[0] || "10");
  const totalPages = Math.ceil(totalItems / itemsPerPageNum);
  const startIndex = (currentPage - 1) * itemsPerPageNum;
  const endIndex = startIndex + itemsPerPageNum;
  const currentRequests = consultingRequests.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col items-center gap-8 p-11 bg-white min-h-screen font-['Pretendard']">
      {/* Page Title */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">
          전문가 컨설팅 요청
        </h1>
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-base font-semibold text-[#555] whitespace-nowrap">
              상태
            </label>
            <FilterDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Search Row */}
        <div className="flex items-center gap-6">
          {/* Expert Filter */}

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

      {/* Status Cards */}
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
          <div className="w-[41px] h-[26px] bg-[#ECF5FF] rounded-full flex items-center justify-center">
            <span className="text-xs font-normal text-[#07F]">전체</span>
          </div>
          <div className="w-[100px] text-center">
            <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
              52건
            </span>
          </div>
        </div>

        {/* Completed Status Card */}
        <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
          <div className="w-[41px] h-[26px] bg-[rgba(207,247,211,1)] rounded-full flex items-center justify-center">
            <span className="text-xs font-normal text-[rgba(2,84,45,1)]">
              완료
            </span>
          </div>
          <div className="w-[100px] text-center">
            <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
              52건
            </span>
          </div>
        </div>

        {/* Waiting Status Card */}
        <div className="flex flex-col items-center gap-4 border border-[rgba(217,217,217,1)] bg-white rounded-[8px] w-[180px] h-[98px] justify-center items-center">
          <div className="w-[41px] h-[26px] bg-[rgba(255,241,194,1)] rounded-full flex items-center justify-center">
            <span className="text-xs font-normal text-[rgba(151,81,2,1)]">
              대기
            </span>
          </div>
          <div className="w-[100px] text-center">
            <span className="text-xl font-semibold text-[rgba(48,48,48,1)]">
              52건
            </span>
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
          <Button
            onClick={handleExcelDownload}
            className="flex items-center gap-3 px-3 py-2.5 border-[1.6px] border-[#4CA452] bg-white text-[#4CA452] font-semibold text-sm rounded hover:bg-[#F8FFF9]"
          >
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
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">이름</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">ID</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">
                대상 보고서
              </span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">전문가</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">분야</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-1">
              <span className="text-xs font-bold text-[#515151]">상태</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">요청일시</span>
            </div>
            <div className="flex items-center justify-center px-2.5 flex-[1.5]">
              <span className="text-xs font-bold text-[#515151]">완료일시</span>
            </div>
          </div>

          {/* Table Body */}
          {currentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center px-4 h-[50px] bg-white cursor-pointer hover:bg-[#E3EFFE] group transition-colors duration-200"
              onClick={() =>
                router.push(`/admin/requests/expert-consulting/${request.id}`)
              }
            >
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.no}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.reportId}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.name}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.email}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] max-h-[14px] overflow-hidden text-center truncate transition-colors duration-200">
                  {request.targetReport}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.expert}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.field}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-1">
                <StatusBadge status={request.status} />
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.requestDate}
                </span>
              </div>
              <div className="flex items-center justify-center px-2.5 flex-[1.5]">
                <span className="text-xs font-medium text-[#686868] group-hover:text-[#07F] transition-colors duration-200">
                  {request.completionDate || "-"}
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
};

export default ExpertConsultingPage;
