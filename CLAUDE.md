1. api 요청할때 별도로 api 라우트를 만들어야 함
2. api 라우트에서 supabase client를 사용할때는 await createClient()를 사용해야 함
3. supabase를 쓸때는 가급적 mcp로 테이블 확인 필요


# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고할 가이드를 제공합니다.

## 프로젝트 개요

Next.js 15, React 19, Supabase로 구축된 AI 기반 사업계획서 생성 서비스입니다. 사용자는 AI 지원을 통해 5분 만에 전문적인 사업계획서를 생성하고, 자동 진단을 받으며, 전문가 피드백을 요청할 수 있습니다.

## 개발 명령어

```bash
# Turbopack을 사용한 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# 린팅
npm run lint
```

## 아키텍처 및 주요 패턴

### 라우트 그룹 및 애플리케이션 구조

애플리케이션은 Next.js App Router를 사용하며 다음과 같은 라우트 그룹으로 구분됩니다:

- **`app/(client)/`** - 고객용 페이지 (보고서 작성, 검토, 마이페이지)
- **`app/(admin)/`** - 관리자 대시보드 및 관리
- **`app/api/`** - 모든 백엔드 작업을 위한 API Route Handlers

각 라우트 그룹은 자체 레이아웃과 인증 흐름을 가집니다. 라우트 그룹은 URL 구조에 영향을 주지 않지만 코드베이스를 논리적으로 구성합니다.

### Supabase 클라이언트 사용 패턴

**중요**: 항상 컨텍스트에 맞는 올바른 Supabase 클라이언트를 사용하세요:

```typescript
// Server Components & Server Actions
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client Components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// API Route Handlers
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

서버 클라이언트는 비동기이며 반드시 await 해야 합니다. 서버 클라이언트를 전역 변수에 넣지 마세요 - 항상 함수 내에서 새 인스턴스를 생성하세요.

### 인증 흐름

인증은 미들웨어에서 세션 관리를 처리하는 Supabase Auth를 사용합니다:

1. 미들웨어 (`middleware.ts`)가 모든 요청에서 `updateSession()`을 호출
2. 서버 컴포넌트는 `supabase.auth.getUser()`를 통해 인증 확인
3. 클라이언트 컴포넌트는 반응형 업데이트를 위해 `supabase.auth.onAuthStateChange()` 사용
4. 관리자 라우트는 특정 역할 확인 필요

**관리자 로그인**: 커스텀 `/api/admin/login` 엔드포인트 사용, 성공 시 `/admin/dashboard`로 리다이렉트.

**클라이언트 인증**: `/api/auth/callback`에서 Supabase OAuth 콜백 사용.

### API Route Handler 패턴

모든 API 라우트는 다음 구조를 따릅니다:

```typescript
export async function GET/POST/PUT/DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params는 비동기
) {
  const supabase = await createClient();
  const { id } = await params; // 항상 params를 await

  // 인증된 사용자 가져오기
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 데이터베이스 작업
  const { data, error } = await supabase.from("table_name")...

  // JSON 응답 반환
  return NextResponse.json({ success: true, data });
}
```

**Server Actions는 절대 사용하지 마세요** - 모든 백엔드 로직은 Route Handlers를 통해 처리합니다.

### 데이터베이스 스키마 (주요 테이블)

- **`report_create`** - 메인 보고서 테이블
  - `uuid` (기본 키, 자동 생성)
  - `user_id` - auth.users에 대한 외래 키
  - `title`, `business_field`
  - `step` - 현재 워크플로우 단계 (inputs, procedure, editor, review)
  - `is_complete` - 완료 상태 Boolean
  - `created_at` - 필터링용 타임스탬프

- **`profiles`** - 확장 사용자 정보
- **`expert_requests`** - 전문가 평가 요청

### Zustand를 사용한 상태 관리

전역 상태는 `components/store/` 또는 페이지별 `components/store/`에 위치한 Zustand 스토어를 사용합니다:

```typescript
import { create } from 'zustand';

interface StoreState {
  value: string;
  setValue: (value: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

Zustand 사용 대상:
- 보고서 워크플로우 상태
- 다단계 폼 데이터
- 컴포넌트 간 공유 상태

React state 사용 대상:
- 컴포넌트 로컬 UI 상태
- 폼 입력 (react-hook-form 선호)

### 폼 검증 패턴

폼은 react-hook-form + zod를 사용합니다:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  field: z.string().min(1, "Required"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  mode: "onChange", // 실시간 검증
});
```

### 컴포넌트 아키텍처

**Server Components (기본)**: 페이지와 레이아웃에 사용. async/await로 직접 데이터 가져오기.

**Client Components**: 다음이 필요한 경우에만 사용:
- 사용자 상호작용 (onClick, onChange)
- Hooks (useState, useEffect, useRouter)
- 브라우저 API
- 브라우저 컨텍스트가 필요한 서드파티 라이브러리

파일 상단에 `"use client"` 표시.

**컴포넌트 구성**:
```
page/
├── page.tsx          # Server Component (페이지 진입점)
├── layout.tsx        # 레이아웃 래퍼
└── components/       # 페이지별 컴포넌트
    ├── ClientComponent.tsx  # "use client"
    └── store/        # 페이지별 Zustand 스토어
```

공유 컴포넌트는 `components/ui/` (shadcn/ui) 또는 `components/` (커스텀 공유)에 위치.

### UI 컴포넌트 가이드라인

**shadcn/ui 컴포넌트**는 `components/ui/`에 있습니다:
- Button, Input, Dialog, Card, Checkbox, Select 등
- **직접 수정하지 마세요**
- 래퍼 컴포넌트를 만들거나 컴포지션 사용

**커스텀 재사용 가능 컴포넌트**:
- `FilterDropdown.tsx` - 드롭다운 필터
- `SearchInputWithFilter.tsx` - 검색 + 필터 결합
- `Pagination.tsx` - 페이지 네비게이션
- `DateEdit.tsx` - 날짜 입력 (useRef 패턴 사용)
- `CustomModal.tsx` - 커스텀 스타일링이 있는 모달 래퍼

### 중요 규칙 및 제약사항

1. **절대 `throw` 문 사용 금지** - 조건부 반환으로 오류 처리
2. **절대 `console.error` 사용 금지** - `console.log` 사용 또는 제거
3. **절대 `@supabase/auth-helpers-nextjs` 사용 금지** - 대신 `@supabase/ssr` 사용
4. **Suspense로 감싸기** - `useSearchParams()` 또는 `usePathname()` 사용하는 컴포넌트
5. **항상 params await** - 라우트 핸들러에서: `const { id } = await params`
6. **파일명은 PascalCase** - 모든 컴포넌트 파일은 PascalCase 사용 (예: `AdminHeader.tsx`)

### 환경 변수

`.env.local`에 필요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
```

참고: 환경 변수 이름이 일반적인 Supabase 설정과 다릅니다 - `ANON_KEY` 대신 `PUBLISHABLE_OR_ANON_KEY` 사용.

### 보고서 생성 워크플로우

`report_create`의 `step` 필드를 통해 추적되는 다단계 프로세스:

1. **start** - 초기 설정 (제목, 사업 분야)
2. **inputs** - 상세 사업 정보 입력
3. **procedure** - 보고서 생성 진행 중
4. **editor** - 사용자가 생성된 콘텐츠 편집
5. **review** - 최종 검토 및 내보내기

각 단계는 `app/(client)/report/[step]/` 아래에 전용 페이지가 있습니다.

### TipTap 에디터 통합

보고서 콘텐츠를 위한 리치 텍스트 에디터:

```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    Underline,
    // 커스텀 확장
  ],
  content: initialContent,
});
```

`app/(client)/report/editor/`에 위치.

### Word 문서 내보내기

`docx` 라이브러리 사용 (`app/api/download-word/`):
- HTML/JSON을 .docx 형식으로 변환
- 서식, 이미지, 테이블 보존
- 한글 폰트 적절히 처리

## 일반적인 패턴

### 날짜 필터링 (오늘 기록)

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayStart = today.toISOString();

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const todayEnd = tomorrow.toISOString();

const { data } = await supabase
  .from("report_create")
  .select("*")
  .gte("created_at", todayStart)
  .lt("created_at", todayEnd);
```

### 실시간 업데이트

```typescript
useEffect(() => {
  const supabase = createClient();

  const channel = supabase
    .channel('table-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'report_create' },
      (payload) => {
        // 변경사항 처리
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Supabase로 비밀번호 변경

```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

## 테스팅 및 디버깅

- 현재 공식 테스트 스위트 없음
- 브라우저 DevTools 및 Network 탭 사용
- 데이터베이스 오류는 Supabase 로그 확인
- 개발 환경에서 상세 로깅 활성화

## 주요 의존성

- **Next.js 15** - App Router, Server Components
- **React 19** - 최신 React 기능
- **Supabase** - Auth + Database (@supabase/ssr)
- **TipTap** - 리치 텍스트 에디터
- **Zustand** - 상태 관리
- **react-hook-form + zod** - 폼 검증
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **docx** - Word 문서 생성
- **OpenAI SDK** - AI 보고서 생성

## 파일 명명 규칙

- 컴포넌트: PascalCase (`AdminHeader.tsx`, `ReportCard.tsx`)
- 페이지: lowercase (`page.tsx`, `layout.tsx`)
- Utils/Libs: camelCase (`utils.ts`, `supabase/client.ts`)
- 타입: PascalCase 또는 컴포넌트 이름과 일치

## 추가 참고사항

- 개발 모드에서 Turbopack이 기본으로 활성화됨
- 이미지 최적화는 구성된 도메인과 함께 `next/image` 사용
- 반응형 디자인은 데스크톱 우선, 모바일 적응형
- UI 전반에 걸쳐 한국어 지원
