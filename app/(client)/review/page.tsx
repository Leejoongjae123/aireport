"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  FileText,
  BarChart3,
  MoreHorizontal,
  Download,
  Trash2,
  Pencil,
} from "lucide-react";
import { ReviewResultModal } from "./components/review-result";
import { ReportPreviewModal } from "./components/report-preview-modal";
import { ExpertRequestsList } from "./components/expert-requests-list";
import { useState } from "react";

interface ReportData {
  id: number;
  title: string;
  field: string;
  status: "submitted" | "review" | "completed" | "consulting";
  createdDate: string;
  expertScore?: string;
}

const mockData: ReportData[] = [
  {
    id: 1,
    title: "AI 헬스케어 계획서",
    field: "디지털·ICT·AI 산업",
    status: "submitted",
    createdDate: "2024-03-10",
  },
  {
    id: 2,
    title: "핀테크 투자제안서",
    field: "공공·도시·인프라",
    status: "submitted",
    createdDate: "2024-03-10",
  },
  {
    id: 3,
    title: "블록체인 기술보고서",
    field: "제조·산업기술·혁신",
    status: "review",
    createdDate: "2024-03-10",
  },
  {
    id: 4,
    title: "IoT 시장분석",
    field: "시장분석보고서",
    status: "consulting",
    createdDate: "2024-03-10",
    expertScore: "8.2/10",
  },
  {
    id: 5,
    title: "AI 헬스케어 계획서",
    field: "문화·콘텐츠·관광",
    status: "completed",
    createdDate: "2024-03-10",
    expertScore: "8.2/10",
  },
  {
    id: 6,
    title: "AI 헬스케어 계획서",
    field: "문화·콘텐츠·관광",
    status: "completed",
    createdDate: "2024-03-10",
    expertScore: "8.2/10",
  },
  {
    id: 7,
    title: "AI 헬스케어 계획서",
    field: "문화·콘텐츠·관광",
    status: "submitted",
    createdDate: "2024-03-10",
  },
];

const StatusBadge = ({ status }: { status: ReportData["status"] }) => {
  const getStatusConfig = (status: ReportData["status"]) => {
    switch (status) {
      case "submitted":
        return {
          text: "평가 요청",
          className:
            "bg-[#FFF1C2] text-[#BF6A02] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "review":
        return {
          text: "평가중",
          className:
            "bg-[#CFF7D3] text-[#009951] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "completed":
        return {
          text: "평가 완료",
          className:
            "bg-[#C7EAFF] text-[#0077FF] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "consulting":
        return {
          text: "컨설팅 요청",
          className:
            "bg-[#FDD3D0] text-[#C00F0C] px-3 py-2 rounded-full text-sm font-semibold",
        };
    }
  };

  const config = getStatusConfig(status);
  return <span className={config.className}>{config.text}</span>;
};

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<"all" | "submitted" | "expert-requests">("all");
  const statusCounts = {
    selected: 24,
    submitted: 1,
    review: 0,
    completed: 22,
    consulting: 1,
  };

  return (
    <div className="w-full bg-[#FAFAFD] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-0 py-5 mt-[131px]">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-[#303030] tracking-[-0.48px]">
              평가 요청
            </h1>

            {/* Filter Buttons and Search */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setActiveTab("all")}
                  className={`px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md ${
                    activeTab === "all"
                      ? "bg-[#0077FF] text-white hover:bg-[#0077FF]/90"
                      : "border-[#0077FF] text-[#0077FF] bg-white border hover:bg-gray-50"
                  }`}
                >
                  선택 ({statusCounts.selected})
                </Button>
                <Button
                  onClick={() => setActiveTab("expert-requests")}
                  variant="outline"
                  className={`border-[#0077FF] text-[#0077FF] bg-white px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md hover:bg-gray-50 ${
                    activeTab === "expert-requests" ? "bg-[#E8F3FF]" : ""
                  }`}
                >
                  평가요청 ({statusCounts.submitted})
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0077FF] text-[#0077FF] bg-white px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md hover:bg-gray-50"
                >
                  평가중 ({statusCounts.review})
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0077FF] text-[#0077FF] bg-white px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md hover:bg-gray-50"
                >
                  평가완료 ({statusCounts.completed})
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0077FF] text-[#0077FF] bg-white px-[18px] h-[38px] text-sm font-semibold tracking-[-0.28px] rounded-md hover:bg-gray-50"
                >
                  컨설팅요청 ({statusCounts.consulting})
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative w-[453px]">
                <Input
                  placeholder="생성하려는 보고서 제목을 입력해주세요."
                  className="w-full px-[18px] h-11 border border-[#E3E5E5] rounded-full bg-white text-base tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#0077FF] stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Table */}
          {activeTab === "expert-requests" ? (
            <ExpertRequestsList isOpen={activeTab === "expert-requests"} />
          ) : (
            <div className="border border-[#D9D9D9]">
              {/* Table Header */}
              <div className="flex h-[50px] bg-[#F5F5F5] border-b border-[#D9D9D9]">
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    제목
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    분야
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    상태
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    생성일
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    보고서
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    전문가 평가
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    평가서
                  </span>
                </div>
                <div className="w-20 flex items-center justify-center px-[10px]">
                  <span className="text-[#5A5A5A] text-xs font-semibold">
                    더보기
                  </span>
                </div>
              </div>

              {/* Table Rows */}
              {mockData.map((report) => (
                <div
                  key={report.id}
                  className="flex py-4 border-b border-[#D9D9D9] last:border-b-0"
                >
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <span className="text-[#444444] text-sm tracking-[-0.28px]">
                      {report.title}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <span className="text-[#444444] text-sm tracking-[-0.28px]">
                      {report.field}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <span className="text-[#444444] text-sm tracking-[-0.28px]">
                      {report.createdDate}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <ReportPreviewModal>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 px-[10px] py-[6px] border border-[#D9D9D9] bg-white rounded text-xs text-[#5A5A5A] hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4" strokeWidth={1.4} />
                        보고서 보기
                      </Button>
                    </ReportPreviewModal>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    <span className="text-[#444444] text-sm tracking-[-0.28px]">
                      {report.expertScore || "-"}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-[10px]">
                    {report.expertScore ? (
                      <ReviewResultModal>
                        <Button
                          variant="outline"
                          className="flex items-center gap-1 px-[10px] py-[6px] border border-[#D9D9D9] bg-white rounded text-xs text-[#5A5A5A] hover:bg-gray-50"
                        >
                          <BarChart3 className="w-4 h-4" strokeWidth={1.4} />
                          평가서 보기
                        </Button>
                      </ReviewResultModal>
                    ) : (
                      <span className="text-[#444444] text-sm tracking-[-0.28px]">
                        -
                      </span>
                    )}
                  </div>
                  <div className="w-20 flex items-center justify-center px-[10px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-8 h-8 text-[#444444]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        alignOffset={0}
                        sideOffset={5}
                        className="p-2 w-auto min-w-fit"
                      >
                        <DropdownMenuItem className="flex items-center gap-[6px] px-3 py-[6px] bg-[#E8F3FF] text-[#0077FF] text-sm font-medium rounded hover:bg-[#E8F3FF]/80 cursor-pointer">
                          <Download className="w-[18px] h-[18px]" />
                          저장
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-[6px] px-3 py-[6px] text-[#767676] text-sm hover:bg-gray-50 cursor-pointer mt-[2px]">
                          <Pencil className="w-[18px] h-[18px]" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-[6px] px-3 py-[6px] text-[#767676] text-sm hover:bg-gray-50 cursor-pointer mt-[2px]">
                          <Trash2 className="w-[18px] h-[18px]" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
