"use client";

import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ConsultingDetailResponse } from "./types";
import { ConsultingDetailInfo } from "./components/ConsultingDetailInfo";
import { useLoader } from "@/components/hooks/UseLoader";

const ExpertConsultingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ConsultingDetailResponse["data"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const loader = useLoader({ isLoading: isCompleting });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/consulting-requests/${id}`);
        if (!response.ok) {
          setError("데이터를 불러오는데 실패했습니다.");
          return;
        }
        const result: ConsultingDetailResponse = await response.json();
        setData(result.data);
      } catch {
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      pending: { bg: "#fff1c2", text: "#975102", label: "대기" },
      in_progress: { bg: "#c7eaff", text: "#0077ff", label: "진행중" },
      completed: { bg: "#d4f4dd", text: "#0d7a2c", label: "완료" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div
        className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full"
        style={{ backgroundColor: config.bg }}
      >
        <span className="text-xs font-medium" style={{ color: config.text }}>
          {config.label}
        </span>
      </div>
    );
  };

  const TableRow = ({
    label,
    value,
    isFirstRow = false,
  }: {
    label: string;
    value: string | React.ReactNode;
    isFirstRow?: boolean;
  }) => (
    <div
      className={`flex items-stretch ${
        isFirstRow ? "h-[72px]" : "min-h-[72px]"
      } border-b border-[#f5f5f5]`}
    >
      <div className="flex items-center w-[160px] bg-[#f5f5f5] label-name px-6">
        <span className="text-base font-normal text-[#555555] leading-6 tracking-[-0.32px]">
          {label}
        </span>
      </div>
      <div className="flex items-center flex-1 px-6 py-6 gap-6">
        <div className="text-base font-normal text-[#303030] leading-6 tracking-[-0.32px] flex-1">
          {value}
        </div>
      </div>
    </div>
  );

  const TableContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-[#f5f5f5] bg-white">{children}</div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#555555]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">
          {error || "데이터가 없습니다."}
        </div>
      </div>
    );
  }

  const { consultingRequest, expertInfo, reviewInfo } = data;

  const formatRequestId = () => {
    return `CR-${new Date(consultingRequest.created_at).getFullYear()}-${String(
      new Date(consultingRequest.created_at).getMonth() + 1
    ).padStart(2, "0")}${String(
      new Date(consultingRequest.created_at).getDate()
    ).padStart(2, "0")}-${String(consultingRequest.id).padStart(3, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      const response = await fetch(
        `/api/admin/consulting-requests/${id}/complete`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        setIsCompleting(false);
        alert("완료 처리 중 오류가 발생했습니다.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        // 완료 처리 성공 시 목록으로 이동
        router.push("/admin/requests/expert-consulting");
      } else {
        setIsCompleting(false);
        alert("완료 처리 중 오류가 발생했습니다.");
      }
    } catch {
      setIsCompleting(false);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {loader}
      <div className="flex flex-col gap-20 p-11 bg-white min-h-screen font-['Pretendard']">
        {/* Header */}
        <div className="flex flex-col gap-10">
          {/* Page Title */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black leading-8">
              전문가 컨설팅 요청
            </h1>
          </div>

        {/* Basic Request Information Table */}
        <TableContainer>
          <TableRow
            label="요청ID"
            value={formatRequestId()}
            isFirstRow={true}
          />
          <div className="flex">
            <div className="flex-1 border-r border-[#f5f5f5] ">
              <TableRow
                label="요청자"
                value={consultingRequest.profiles?.name || "-"}
              />
            </div>
            <div className="flex-1">
              <TableRow
                label="요청자 ID"
                value={
                  consultingRequest.profiles?.email
                    ? maskEmail(consultingRequest.profiles.email)
                    : "-"
                }
              />
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 border-r border-[#f5f5f5] items-stretch h-full">
              <TableRow
                label="요청일시"
                value={formatDate(consultingRequest.created_at)}
              />
            </div>
            <div className="flex-1">
              <TableRow
                label="상태"
                value={<StatusBadge status={consultingRequest.status} />}
              />
            </div>
          </div>
        </TableContainer>
      </div>

      {/* Request Basic Information & Content */}
      <ConsultingDetailInfo
        consultingRequest={consultingRequest}
        expertInfo={expertInfo}
        reviewInfo={reviewInfo}
      />

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/requests/expert-consulting")}
          className="flex items-center gap-1.5 px-3 h-[45px] border border-[#a0a0a0] bg-white text-[#555555] text-sm font-semibold rounded"
        >
          <Menu className="w-4 h-4" />
          목록으로
        </Button>
        <Button
          className="flex w-[79px] h-[45px] justify-center items-center gap-1.5 rounded-lg bg-[#07F] hover:bg-[#0066CC]"
          onClick={handleComplete}
          disabled={isCompleting || consultingRequest.status === "completed"}
        >
          <span className="text-lg font-bold text-white font-pretendard tracking-[-0.36px]">
            {isCompleting ? "" : "완료"}
          </span>
        </Button>
      </div>
      </div>
    </>
  );
};

export default ExpertConsultingDetailPage;
