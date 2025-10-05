# AI 사업보고서 자동 생성 서비스

<p align="center">
  <strong>AI 기반 보고서 자동 생성, 전문가 피드백, 컨설팅까지 한 번에!</strong>
</p>

<p align="center">
  <a href="#주요-기능"><strong>주요 기능</strong></a> ·
  <a href="#기술-스택"><strong>기술 스택</strong></a> ·
  <a href="#시작하기"><strong>시작하기</strong></a> ·
  <a href="#프로젝트-구조"><strong>프로젝트 구조</strong></a> ·
  <a href="#환경-변수-설정"><strong>환경 변수 설정</strong></a>
</p>

---

## 📝 프로젝트 소개

AI 기반 사업보고서 자동 생성 서비스는 창업자와 사업가들이 5분 만에 전문적인 사업보고서를 작성할 수 있도록 돕는 혁신적인 플랫폼입니다. 단순 입력만으로 AI가 자동으로 보고서를 생성하고, 자동 진단과 전문가 피드백을 통해 보고서의 완성도를 높일 수 있습니다.

### 보고서를 쓰는 시간, 이제는 아이디어에 투자하세요

---

## ✨ 주요 기능

### 🤖 AI Report Generator
- 단순 입력만으로 전문적인 사업보고서 자동 생성
- 업종/목표투자/핵심가치 입력 시 5분 내 초안 완성
- 체계적인 보고서 구조와 전문적인 문장 자동 생성

### 📊 AI Diagnosis & Insights
- 생성된 보고서를 AI가 자동으로 분석하고 점수화
- 항목별 피드백과 개선 가이드 제공
- 데이터 기반 객관적 평가와 실시간 보고서 품질 진단

### 👨‍💼 Expert Evaluation
- 업계 전문가에게 직접 평가 요청 가능
- 전문가의 학력/경력/분야 기반 피드백
- 필요 시 컨설팅 연계 서비스 제공

### 📄 보고서 관리
- 여러 보고서 작성 및 관리
- 보고서 복제 및 버전 관리
- 실시간 저장 및 자동 백업

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js (App Router) - React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend & Database
- **Backend**: Next.js Route Handlers & Server Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (@supabase/ssr)
- **Real-time**: Supabase Realtime

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript 5
- **CSS Framework**: PostCSS, Autoprefixer

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm 또는 yarn
- Supabase 계정 (프로젝트 생성 필요)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd 146_2.ai_report_based_supabase
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Supabase URL과 Anon Key는 [Supabase Dashboard](https://supabase.com/dashboard)의 프로젝트 설정에서 확인할 수 있습니다.

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

5. **프로덕션 빌드**
   ```bash
   npm run build
   npm start
   ```

---

## 📁 프로젝트 구조

```
146_2.ai_report_based_supabase/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # 관리자 페이지 (라우트 그룹)
│   ├── (client)/                 # 클라이언트 페이지 (라우트 그룹)
│   │   ├── login/                # 로그인 페이지
│   │   │   └── components/       # 로그인 관련 컴포넌트
│   │   ├── register/             # 회원가입 페이지
│   │   │   └── complete/         # 회원가입 완료 페이지
│   │   ├── mypage/               # 마이페이지
│   │   ├── report/               # 보고서 관련 페이지
│   │   │   ├── components/       # 보고서 공통 컴포넌트
│   │   │   │   └── store/        # Zustand 상태 관리
│   │   │   ├── start/            # 보고서 시작 페이지
│   │   │   │   └── components/   # 시작 페이지 컴포넌트
│   │   │   ├── inputs/           # 보고서 입력 페이지
│   │   │   ├── procedure/        # 보고서 절차 페이지
│   │   │   ├── editor/           # 보고서 에디터 페이지
│   │   │   └── layout.tsx        # 보고서 레이아웃
│   │   ├── review/               # 리뷰 페이지
│   │   ├── layout.tsx            # 클라이언트 레이아웃
│   │   └── page.tsx              # 메인 페이지
│   └── globals.css               # 전역 스타일
├── components/                   # 공용 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── ...                       # 인증, 네비게이션 등 공용 컴포넌트
├── lib/                          # 유틸리티 함수
│   ├── supabase/                 # Supabase 클라이언트 설정
│   │   ├── client.ts             # 클라이언트 사이드 Supabase
│   │   ├── server.ts             # 서버 사이드 Supabase
│   │   └── middleware.ts         # Supabase 미들웨어
│   └── utils.ts                  # 기타 유틸리티
├── public/                       # 정적 파일
│   └── images/                   # 이미지 파일
├── middleware.ts                 # Next.js 미들웨어
├── components.json               # shadcn/ui 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 프로젝트 의존성
```

### 주요 디렉토리 설명

- **`app/(client)/`**: 클라이언트용 페이지들을 라우트 그룹으로 관리
- **`app/(admin)/`**: 관리자용 페이지들을 라우트 그룹으로 관리
- **`components/`**: 프로젝트 전체에서 사용되는 공용 컴포넌트
- **`lib/supabase/`**: Supabase 클라이언트 설정 (클라이언트/서버/미들웨어)
- **페이지별 components 폴더**: 각 페이지의 기능별 컴포넌트 분리

---

## 🔐 환경 변수 설정

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key | ✅ 필수 |

### Supabase 설정 방법

1. [Supabase Dashboard](https://database.new)에서 새 프로젝트 생성
2. 프로젝트 설정 > API 섹션에서 URL과 Anon Key 확인
3. `.env.local` 파일에 환경 변수 추가

---

## 📋 개발 가이드라인

### 1. Next.js 라우팅
- **App Router** 사용 (Pages Router 사용 금지)
- 모든 API는 **Route Handler** 우선 사용
- Server Action은 단순 폼 제출에만 제한적 사용
- `params` 사용 시 비동기 처리: `const { id } = await params`

### 2. 컴포넌트 구조
- 페이지는 가급적 **Server Component**로 구성
- 필요 시 세부 컴포넌트만 Client Component로 분리
- 페이지별 기능은 `components` 폴더로 분리하여 관리
- 타입 정의는 동일 경로의 `types.ts`에 통합

### 3. 상태 관리
- 전역 상태 관리: **Zustand** 사용
- Store 파일 위치: `components/store/` 또는 페이지별 `components/store/`

### 4. Supabase 사용
- Server Component: `@/lib/supabase/server.ts` 사용
- Client Component: `@/lib/supabase/client.ts` 사용
- API Route: `const supabase = await createClient();` 형식 사용

### 5. UI 컴포넌트
- **shadcn/ui** 컴포넌트 우선 사용
- 공용 컴포넌트(`components/ui/`, `components/common/`) 수정 지양
- 수정 필요 시 유사 컴포넌트 생성 또는 콜백 형태로 구현

### 6. 주의사항
- `throw` 문 사용 금지
- `console.error` 사용 금지
- `@supabase/auth-helpers-nextjs` 사용 금지 (대신 `@supabase/ssr` 사용)
- `useSearchParams`, `usePathname` 사용 시 `Suspense`로 감싸기

---

## 📦 주요 의존성

```json
{
  "dependencies": {
    "next": "latest",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "zustand": "^5.0.8",
    "tailwindcss": "^3.4.1",
    "lucide-react": "^0.511.0",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.14"
  }
}
```

---

## 🧪 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 검사
npm run lint
```

---

## 📸 스크린샷

### 메인 페이지
![Hero Section](public/images/hero1.png)

AI 사업보고서를 5분 만에 생성하는 혁신적인 플랫폼의 메인 화면입니다.

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 내부 프로젝트로 외부 배포가 제한됩니다.

---

## 📞 문의

프로젝트 관련 문의사항은 다음으로 연락주세요:

- **대표전화**: 02-123-1234
- **이메일**: absd123@anchor.com
- **주소**: 서울시 강남구 테헤란로 123

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 기반으로 제작되었습니다:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

<p align="center">
  Made with ❤️ by AI Report Service Team
</p>