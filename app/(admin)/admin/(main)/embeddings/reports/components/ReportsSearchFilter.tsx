"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, RotateCcw, Calendar } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInputWithFilter from "@/components/ui/SearchInputWithFilter";
import DateEdit from "@/components/ui/DateEdit";

interface ReportsSearchFilterProps {
  onSearch: (filters: {
    startDate?: Date;
    endDate?: Date;
    field: string;
    searchFilter: string;
    searchValue: string;
  }) => void;
}

export default function ReportsSearchFilter({ onSearch }: ReportsSearchFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [field, setField] = useState("전체");
  const [searchFilter, setSearchFilter] = useState("제목");
  const [searchValue, setSearchValue] = useState("");
  
  const fieldOptions = [
    "전체",
    "디지털·ICT·AI",
    "제조·산업기술·혁신",
    "문화·콘텐츠·관광",
    "에너지·환경",
    "공공·도시·인프라",
  ];
  
  const searchFilterOptions = ["제목", "ID", "키워드"];

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
    setField("전체");
    setSearchFilter("제목");
    setSearchValue("");
    onSearch({
      startDate: undefined,
      endDate: undefined,
      field: "전체",
      searchFilter: "제목",
      searchValue: "",
    });
  };

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      field,
      searchFilter,
      searchValue,
    });
  };

  return (
    <div className="flex flex-col items-start gap-[18px] w-full p-8 rounded-lg bg-[#ECF5FF]">
      {/* First Row - Date, Field */}
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
      </div>

      {/* Second Row - Search and Buttons */}
      <div className="flex items-center gap-6 w-full">
        <SearchInputWithFilter
          filterValue={searchFilter}
          filterOptions={searchFilterOptions}
          onFilterChange={setSearchFilter}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchValueChange={setSearchValue}
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
            className="w-[120px] h-[43px] border-[1.3px] border-[#07F] bg-white text-[#07F] font-semibold text-base rounded hover:bg-[#F8FBFF]"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
