"use client";

import { useEffect, useState } from "react";
import { ExpertRequest } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Trash2, Pencil } from "lucide-react";

interface ExpertRequestsListProps {
  isOpen: boolean;
}

export function ExpertRequestsList({ isOpen }: ExpertRequestsListProps) {
  const [requests, setRequests] = useState<ExpertRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchExpertRequests();
    }
  }, [isOpen]);

  const fetchExpertRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/expert/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "대기중",
          className:
            "bg-[#FFF1C2] text-[#BF6A02] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "accepted":
        return {
          text: "수락됨",
          className:
            "bg-[#CFF7D3] text-[#009951] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "completed":
        return {
          text: "완료됨",
          className:
            "bg-[#C7EAFF] text-[#0077FF] px-3 py-2 rounded-full text-sm font-semibold",
        };
      case "rejected":
        return {
          text: "거절됨",
          className:
            "bg-[#FDD3D0] text-[#C00F0C] px-3 py-2 rounded-full text-sm font-semibold",
        };
      default:
        return {
          text: status,
          className:
            "bg-[#F0F0F0] text-[#666666] px-3 py-2 rounded-full text-sm font-semibold",
        };
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center py-8 text-[#999999]">평가요청 내역이 없습니다.</div>;
  }

  return (
    <div className="border border-[#D9D9D9]">
      {/* Table Header */}
      <div className="flex h-[50px] bg-[#F5F5F5] border-b border-[#D9D9D9]">
        <div className="flex-1 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">제목</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">분야</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">
            선택된 전문가
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">상태</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">요청일</span>
        </div>
        <div className="w-20 flex items-center justify-center px-[10px]">
          <span className="text-[#5A5A5A] text-xs font-semibold">더보기</span>
        </div>
      </div>

      {/* Table Rows */}
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex py-4 border-b border-[#D9D9D9] last:border-b-0"
        >
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#444444] text-sm tracking-[-0.28px]">
              {request.report_create.title}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#444444] text-sm tracking-[-0.28px]">
              {request.report_create.business_field}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#444444] text-sm tracking-[-0.28px]">
              {request.selected_expert.name}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span
              className={getStatusConfig(request.status).className}
            >
              {getStatusConfig(request.status).text}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-[10px]">
            <span className="text-[#444444] text-sm tracking-[-0.28px]">
              {new Date(request.created_at).toLocaleDateString("ko-KR")}
            </span>
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
  );
}
