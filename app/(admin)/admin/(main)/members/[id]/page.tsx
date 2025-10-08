"use client";

import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

interface RequestRecord {
  no: number;
  type: string;
  id: string;
  reportName: string;
  requestDate: string;
  status: string;
}

// Sample data for member details
const memberData = {
  memberId: "user1234",
  name: "김이수",
  id: "hong***@gmail.com",
  joinMethod: "Google (OAuth)",
  company: "ABC스타트업",
  field: "IT소프트웨어",
  joinDate: "2023-11-15 12:22:23",
  lastLogin: "2025-05-10 18:41",
  status: "정상",
};

// Sample data for request records
const requestRecords: RequestRecord[] = [
  {
    no: 3,
    type: "전문가 평가",
    id: "REQ-250216-032",
    reportName: "Series-A IR",
    requestDate: "2025-08-25",
    status: "진행중",
  },
  {
    no: 2,
    type: "전문가 평가",
    id: "MT-250216-007",
    reportName: "플랫폼 전략",
    requestDate: "2025-08-25",
    status: "완료",
  },
  {
    no: 1,
    type: "컨설팅 요청",
    id: "MT-250216-007",
    reportName: "Workflow Copilot",
    requestDate: "2025-08-25",
    status: "완료",
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  return (
    <div className="inline-flex px-2.5 py-1.5 items-center justify-center rounded-full bg-[rgba(207,247,211,1)]">
      <span className="text-xs font-medium text-[rgba(2,84,45,1)]">
        {status}
      </span>
    </div>
  );
}

export default function MemberDetailPage() {
  return (
    <div className="flex w-full p-8 mx-auto ">
      <div className="flex flex-col justify-center items-center gap-20 flex-1 p-11 rounded-[5px] bg-white">
        {/* Member Information Section */}
        <div className="flex flex-col items-start gap-10 w-full">
          {/* Title */}
          <div className="flex flex-col items-end gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold text-[rgba(48,48,48,1)] font-['Pretendard']">
                회원관리
              </h1>
            </div>

            {/* Member Details Table */}
            <div className="flex flex-col items-start w-full border border-[rgba(245,245,245,1)]">
              {/* Row 1: 회원ID and 이름 */}
              <div className="flex items-start w-full">
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      회원ID
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.memberId}
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      이름
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: ID and 가입방식 */}
              <div className="flex items-center w-full">
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      ID
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      가입방식
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.joinMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: 소속(회사명) and 스크랩수 */}
              <div className="flex items-center w-full">
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      소속(회사명)
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.company}
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      스크랩수
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.field}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 4: 가입일 and 최근 로그인 */}
              <div className="flex items-start w-full">
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      가입일
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.joinDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
                  <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                    <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                      최근 로그인
                    </span>
                  </div>
                  <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                    <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                      {memberData.lastLogin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 5: 상태 */}
              <div className="flex items-center w-full border-b border-[rgba(245,245,245,1)]">
                <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
                  <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                    상태
                  </span>
                </div>
                <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
                  <StatusBadge status={memberData.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Request Records Section */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold text-[#2A2A2A] font-['Pretendard']">
                요청 기록
              </h2>
            </div>

            {/* Request Records Table */}
            <div className="flex flex-col items-start w-full bg-white">
              {/* Table Header */}
              <div className="flex px-6 py-2.5 justify-between items-center w-full border-b border-[rgba(245,245,245,1)] bg-[rgba(245,245,245,1)]">
                <span className="w-6 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  NO
                </span>
                <span className="w-[116px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  구분
                </span>
                <span className="w-[140px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  ID
                </span>
                <div className="flex w-[200px] max-w-[200px] justify-center items-center gap-10">
                  <span className="w-[200px] max-w-[200px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    보고서명
                  </span>
                </div>
                <span className="w-[100px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  요청일자
                </span>
                <span className="w-20 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  상태
                </span>
                <span className="w-[72px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                  상세
                </span>
              </div>

              {/* Table Rows */}
              {requestRecords.map((record) => (
                <div
                  key={record.no}
                  className="flex px-6 py-2.5 justify-between items-center w-full border-b border-[rgba(245,245,245,1)]"
                >
                  <span className="w-6 text-base text-[rgba(48,48,48,1)] text-center font-['Pretendard'] tracking-[-0.32px]">
                    {record.no}
                  </span>
                  <span className="w-[116px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    {record.type}
                  </span>
                  <span className="w-[140px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    {record.id}
                  </span>
                  <div className="flex w-[200px] max-w-[200px] justify-center items-center gap-10">
                    <span className="w-[200px] max-w-[200px] max-h-6 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                      {record.reportName}
                    </span>
                  </div>
                  <span className="w-[100px] text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    {record.requestDate}
                  </span>
                  <span className="w-20 text-sm font-medium text-[#6A6A6A] text-center font-['Pretendard']">
                    {record.status}
                  </span>
                  <Button
                    variant="outline"
                    className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#07F] bg-white text-sm font-semibold text-[#07F] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F8FBFF]"
                  >
                    상세보기
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-between items-center">
          <Button
            variant="outline"
            className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#A0A0A0] bg-white text-sm font-semibold text-[#555] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F5F5F5]"
          >
            <List className="w-4 h-4" />
            목록으로
          </Button>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded border border-[#07F] bg-white text-sm font-semibold text-[#07F] tracking-[-0.28px] font-['Pretendard'] hover:bg-[#F8FBFF]"
            >
              삭제
            </Button>
            <Button className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded bg-[#07F] text-sm font-semibold text-white tracking-[-0.28px] font-['Pretendard'] hover:bg-[#0066CC]">
              수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
