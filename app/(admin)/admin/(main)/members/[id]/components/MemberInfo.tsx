import { MemberDetail } from "../types";

interface MemberInfoProps {
  member: MemberDetail;
}

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

// Provider 한글 변환 함수
function getProviderText(provider: string | null): string {
  if (!provider) return '-';
  const providerMap: Record<string, string> = {
    'local': '이메일',
    'google': 'Google (OAuth)',
    'kakao': 'Kakao (OAuth)',
  };
  return providerMap[provider] || provider;
}

// 날짜 포맷 함수
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\. /g, '-').replace('.', '');
}

export default function MemberInfo({ member }: MemberInfoProps) {
  return (
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
                {member.id}
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
                {member.name || '-'}
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
                {member.email || '-'}
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
                {getProviderText(member.provider)}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: 소속(회사명) and 분야 */}
        <div className="flex items-center w-full">
          <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
            <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
              <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                소속(회사명)
              </span>
            </div>
            <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
              <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                {member.organization || '-'}
              </span>
            </div>
          </div>
          <div className="flex items-center flex-1 border-b border-[rgba(245,245,245,1)]">
            <div className="flex w-40 px-6 py-6 items-center gap-2.5 bg-[rgba(245,245,245,1)]">
              <span className="text-base text-[#555] font-['Pretendard'] tracking-[-0.32px]">
                분야
              </span>
            </div>
            <div className="flex px-6 py-6 items-center gap-2.5 flex-1">
              <span className="text-base text-[rgba(48,48,48,1)] font-['Pretendard'] tracking-[-0.32px]">
                {member.business_field || '-'}
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
                {formatDate(member.created_at)}
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
                {formatDate(member.updated_at)}
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
            <StatusBadge status="정상" />
          </div>
        </div>
      </div>
    </div>
  );
}
