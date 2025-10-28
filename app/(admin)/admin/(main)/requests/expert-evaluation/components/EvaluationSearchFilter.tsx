"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInputWithFilter from "@/components/ui/SearchInputWithFilter";
import DateEdit from "@/components/ui/DateEdit";

interface EvaluationSearchFilterProps {
  onSearch: (filters: {
    startDate?: Date;
    endDate?: Date;
    status: string;
    searchFilter: string;
    searchValue: string;
  }) => void;
}

export default function EvaluationSearchFilter({ onSearch }: EvaluationSearchFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [status, setStatus] = useState("전체");
  const [searchFilter, setSearchFilter] = useState("이름");
  const [searchValue, setSearchValue] = useState("");

  const statusOptions = ["전체", "완료", "대기", "지연"];
  const searchFilterOptions = ["이름", "ID", "대상 보고서"];

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "날짜 입력";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus("전체");
    setSearchFilter("이름");
    setSearchValue("");
    onSearch({
      startDate: undefined,
      endDate: undefined,
      status: "전체",
      searchFilter: "이름",
      searchValue: "",
    });
  };

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      status,
      searchFilter,
      searchValue,
    });
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

        {/* Status */}
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
