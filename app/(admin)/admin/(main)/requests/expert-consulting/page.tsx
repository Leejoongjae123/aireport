"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterDropdown from "@/components/ui/filter-dropdown";
import Pagination from "@/components/ui/pagination";

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
  const [startDate, setStartDate] = useState<string>("2025-08-08");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [expertFilter, setExpertFilter] = useState<string>("전문가");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const itemsPerPageOptions = [
    "10개씩 보기",
    "20개씩 보기",
    "50개씩 보기",
    "100개씩 보기",
  ];

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setStartDate("2025-08-08");
    setEndDate("");
    setStatusFilter("전체");
    setExpertFilter("전문가");
    setSearchTerm("");
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
    <div className="p-11 bg-white min-h-screen">
      <div className="w-full">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[#2A2A2A] mb-8 font-pretendard">
          전문가 컨설팅 요청
        </h1>

        {/* Search/Filter Section */}
        <div className="bg-[#ECF5FF] rounded-lg p-8 mb-8">
          <div className="flex items-start gap-6 mb-5">
            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#555] font-pretendard">
                기간 검색
              </span>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-[140px] h-[38px] px-3 border border-[#EBEBEB] rounded-md text-sm font-bold text-[#0077FF] font-pretendard bg-white"
                    placeholder="날짜 입력"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#727272]" />
                </div>
                <span className="text-xs font-bold text-[#727272] font-pretendard">
                  -
                </span>
                <div className="relative">
                  <Input
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-[140px] h-[38px] px-3 border border-[#EBEBEB] rounded-md text-sm text-[#727272] font-pretendard bg-white"
                    placeholder="날짜 입력"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#727272]" />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-base font-bold text-[#555] font-pretendard">
                상태
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 h-[38px] px-3 border border-[#EBEBEB] rounded-md bg-white">
                  <SelectValue />
                  <ChevronDown className="w-2.5 h-2.5 text-[#0077FF]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                  <SelectItem value="대기">대기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expert Filter and Search */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 flex-1">
              <Select value={expertFilter} onValueChange={setExpertFilter}>
                <SelectTrigger className="w-auto px-3 h-[38px] border border-[#EBEBEB] rounded-md bg-white">
                  <SelectValue />
                  <ChevronDown className="w-2.5 h-2.5 text-[#0077FF]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전문��">전문가</SelectItem>
                  <SelectItem value="김이수">김이수</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력해주세요."
                className="flex-1 h-[38px] px-3 border border-[#EBEBEB] rounded-md text-sm text-[#727272] font-pretendard bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSearch}
                className="w-[120px] h-[38px] bg-[#0077FF] hover:bg-[#0066DD] text-white rounded px-0 py-3 flex items-center justify-center gap-2.5 text-base font-bold font-pretendard"
              >
                <Search className="w-4 h-4" />
                검색
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-[120px] h-[38px] border-[1.3px] border-[#0077FF] bg-white hover:bg-gray-50 text-[#0077FF] rounded px-0 py-3 flex items-center justify-center gap-2.5 text-base font-bold font-pretendard"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="flex items-start gap-4 mb-6">
          <Card className="p-4 border border-[#d9d9d9] rounded-lg bg-white flex flex-col items-center gap-4 min-w-[188px]">
            <Badge className="bg-[#ECF5FF] text-[#0077FF] hover:bg-[#ECF5FF] rounded-full px-2.5 py-1.5 text-xs font-normal">
              전체
            </Badge>
            <span className="text-xl font-bold text-[#303030] font-pretendard">
              52건
            </span>
          </Card>

          <Card className="p-4 border border-[#d9d9d9] rounded-lg bg-white flex flex-col items-center gap-4 min-w-[188px]">
            <Badge className="bg-[#cff7d3] text-[#025420] hover:bg-[#cff7d3] rounded-full px-2.5 py-1.5 text-xs font-normal">
              완료
            </Badge>
            <span className="text-xl font-bold text-[#303030] font-pretendard">
              52건
            </span>
          </Card>

          <Card className="p-4 border border-[#d9d9d9] rounded-lg bg-white flex flex-col items-center gap-4 min-w-[188px]">
            <Badge className="bg-[#fff1c2] text-[#975102] hover:bg-[#fff1c2] rounded-full px-2.5 py-1.5 text-xs font-normal">
              대기
            </Badge>
            <span className="text-xl font-bold text-[#303030] font-pretendard">
              52건
            </span>
          </Card>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-normal text-[#6d6d6d] font-pretendard">
            총 <span className="text-[#0077FF]">12,345</span>건
          </div>
          <Button
            onClick={handleExcelDownload}
            variant="outline"
            className="border-[1.6px] border-[#4CA452] bg-white hover:bg-gray-50 text-[#4CA452] rounded px-3 py-2.5 flex items-center gap-3 text-sm font-bold font-pretendard"
          >
            <FileSpreadsheet className="w-4 h-4" />
            엑셀 다운로드
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
          {/* Table Header */}
          <div className="h-[50px] bg-[#EEE] flex items-center px-4">
            <div className="flex items-center justify-center w-[60px] text-xs font-bold text-[#515151] font-pretendard">
              NO
            </div>
            <div className="flex items-center justify-center w-[68px] text-xs font-bold text-[#515151] font-pretendard">
              보고서ID
            </div>
            <div className="flex items-center justify-center w-[80px] text-xs font-bold text-[#515151] font-pretendard">
              이름
            </div>
            <div className="flex items-center justify-center w-[180px] text-xs font-bold text-[#515151] font-pretendard">
              ID
            </div>
            <div className="flex items-center justify-center w-[140px] text-xs font-bold text-[#515151] font-pretendard">
              대상 보고서
            </div>
            <div className="flex items-center justify-center w-[80px] text-xs font-bold text-[#515151] font-pretendard">
              전문가
            </div>
            <div className="flex items-center justify-center w-[140px] text-xs font-bold text-[#515151] font-pretendard">
              분야
            </div>
            <div className="flex items-center justify-center w-[281px] text-xs font-bold text-[#515151] font-pretendard">
              상태
            </div>
            <div className="flex items-center justify-center w-[140px] text-xs font-bold text-[#515151] font-pretendard">
              요청일시
            </div>
            <div className="flex items-center justify-center w-[140px] text-xs font-bold text-[#515151] font-pretendard">
              완료일시
            </div>
          </div>

          {/* Table Body */}
          {currentRequests.map((request) => (
            <div
              key={request.id}
              className={`h-[50px] flex items-center px-4 ${
                request.isSelected ? "bg-[#E3EFFE]" : "bg-white"
              }`}
            >
              <div
                className={`flex items-center justify-center w-[60px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard`}
              >
                {request.no}
              </div>
              <div
                className={`flex items-center justify-center w-[68px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard`}
              >
                {request.reportId}
              </div>
              <div
                className={`flex items-center justify-center w-[80px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard truncate`}
              >
                {request.name}
              </div>
              <div
                className={`flex items-center justify-center w-[180px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard`}
              >
                {request.email}
              </div>
              <div
                className={`flex items-center justify-center w-[140px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard truncate`}
              >
                {request.targetReport}
              </div>
              <div
                className={`flex items-center justify-center w-[80px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard truncate`}
              >
                {request.expert}
              </div>
              <div
                className={`flex items-center justify-center w-[140px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard truncate`}
              >
                {request.field}
              </div>
              <div className="flex items-center justify-center w-[281px]">
                <StatusBadge status={request.status} />
              </div>
              <div
                className={`flex items-center justify-center w-[140px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard`}
              >
                {request.requestDate}
              </div>
              <div
                className={`flex items-center justify-center w-[140px] text-xs ${
                  request.isSelected ? "text-[#0077FF]" : "text-[#686868]"
                } font-pretendard`}
              >
                {request.completionDate || "-"}
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
