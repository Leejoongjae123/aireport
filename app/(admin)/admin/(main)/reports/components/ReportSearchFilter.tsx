"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInputWithFilter from "@/components/ui/SearchInputWithFilter";
import DateEdit from "@/components/ui/DateEdit";

export default function ReportSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 searchParams에서 초기값 가져오기
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [businessField, setBusinessField] = useState(
    searchParams.get("businessField") || "전체"
  );
  const [searchFilter, setSearchFilter] = useState(
    searchParams.get("searchType") || "이름"
  );
  const [searchValue, setSearchValue] = useState(
    searchParams.get("searchValue") || ""
  );

  // 옵션들
  const businessFieldOptions = [
    "전체",
    "AI/ICT",
    "제조",
    "콘텐츠/문화",
    "공공/인프라/에너지",
  ];
  const searchFilterOptions = ["이름", "ID", "제목"];

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
    router.push("/admin/reports");
  };

  // 검색 함수
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (startDate) {
      params.set("startDate", formatDate(startDate));
    }
    if (endDate) {
      params.set("endDate", formatDate(endDate));
    }
    if (businessField && businessField !== "전체") {
      params.set("businessField", businessField);
    }
    if (searchValue) {
      params.set("searchType", searchFilter);
      params.set("searchValue", searchValue);
    }
    
    // 페이지는 1로 리셋
    params.set("page", "1");
    
    router.push(`/admin/reports?${params.toString()}`);
  };

  return (
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
  );
}
