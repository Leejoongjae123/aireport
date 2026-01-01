# E2E 테스트 가이드

Playwright를 사용한 End-to-End 테스트 가이드입니다.

## 📋 목차

1. [설치 및 설정](#설치-및-설정)
2. [테스트 실행](#테스트-실행)
3. [테스트 구조](#테스트-구조)
4. [작성된 테스트](#작성된-테스트)
5. [테스트 작성 가이드](#테스트-작성-가이드)
6. [CI/CD 통합](#cicd-통합)
7. [문제 해결](#문제-해결)

## 🚀 설치 및 설정

### 1. Playwright 브라우저 설치

```bash
npx playwright install
```

### 2. 환경 변수 설정

`.env.local` 파일에 테스트용 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 테스트 실행

### 기본 테스트 실행

```bash
# 모든 테스트 실행
npm run test:e2e

# UI 모드로 테스트 실행 (권장)
npm run test:e2e:ui

# 브라우저를 보면서 테스트 실행
npm run test:e2e:headed

# 디버그 모드로 테스트 실행
npm run test:e2e:debug

# 테스트 리포트 보기
npm run test:e2e:report
```

### 특정 테스트만 실행

```bash
# 특정 파일만 실행
npx playwright test tests/e2e/auth.spec.ts

# 특정 브라우저에서만 실행
npx playwright test --project=chromium

# 특정 테스트만 실행
npx playwright test -g "로그인"
```

## 📁 테스트 구조

```
tests/
├── e2e/                          # E2E 테스트 파일들
│   ├── auth.spec.ts             # 인증 관련 테스트
│   ├── navigation.spec.ts       # 네비게이션 테스트
│   ├── report.spec.ts           # 리포트 기능 테스트
│   ├── admin.spec.ts            # 관리자 페이지 테스트
│   ├── mypage.spec.ts           # 마이페이지 테스트
│   ├── accessibility.spec.ts    # 접근성 테스트
│   ├── responsive.spec.ts       # 반응형 디자인 테스트
│   ├── smoke.spec.ts            # 스모크 테스트
│   ├── performance.spec.ts      # 성능 테스트
│   └── security.spec.ts         # 보안 테스트
├── helpers/                     # 테스트 헬퍼 함수들
│   ├── auth.helper.ts          # 인증 헬퍼
│   └── wait.helper.ts          # 대기 헬퍼
├── fixtures/                    # 테스트 데이터
│   └── test-data.ts            # 더미 데이터
└── README.md                    # 테스트 문서
```

## ✅ 작성된 테스트

### 1. 인증 테스트 (`auth.spec.ts`)
- ✅ 클라이언트 로그인 페이지 접근
- ✅ 관리자 로그인 페이지 접근
- ✅ 회원가입 페이지 접근
- ✅ 유효하지 않은 이메일 형식 검증

### 2. 네비게이션 테스트 (`navigation.spec.ts`)
- ✅ 홈페이지 접근
- ✅ 로그인 페이지로 이동
- ✅ 회원가입 페이지로 이동
- ✅ 404 페이지 처리

### 3. 리포트 테스트 (`report.spec.ts`)
- ✅ 리포트 시작 페이지 접근
- ✅ 리포트 입력 페이지 접근
- ✅ 리포트 절차 페이지 접근
- ✅ 리포트 에디터 페이지 접근

### 4. 관리자 페이지 테스트 (`admin.spec.ts`)
- ✅ 관리자 대시보드 접근 (인증 필요)
- ✅ 관리자 회원 관리 페이지 접근
- ✅ 관리자 리포트 관리 페이지 접근
- ✅ 관리자 전문가 컨설팅 요청 페이지 접근
- ✅ 관리자 전문가 평가 요청 페이지 접근
- ✅ 관리자 임베딩 페이지 접근

### 5. 마이페이지 테스트 (`mypage.spec.ts`)
- ✅ 마이페이지 접근 (인증 필요)
- ✅ 리뷰 페이지 접근

### 6. 접근성 테스트 (`accessibility.spec.ts`)
- ✅ 홈페이지 키보드 네비게이션
- ✅ 로그인 폼 키보드 네비게이션
- ✅ 페이지 제목 존재 확인
- ✅ 이미지 alt 속성 확인

### 7. 반응형 디자인 테스트 (`responsive.spec.ts`)
- ✅ Mobile, Tablet, Desktop 뷰포트 테스트
- ✅ 홈페이지 반응형 렌더링
- ✅ 로그인 페이지 반응형 렌더링
- ✅ 모바일 메뉴 토글

### 8. 스모크 테스트 (`smoke.spec.ts`)
- ✅ 주요 페이지 로드 확인
- ✅ API 헬스 체크

### 9. 성능 테스트 (`performance.spec.ts`)
- ✅ 페이지 로드 시간 측정
- ✅ 리소스 크기 확인
- ✅ Core Web Vitals 측정

### 10. 보안 테스트 (`security.spec.ts`)
- ✅ 보안 헤더 확인
- ✅ 민감한 정보 노출 확인
- ✅ 인증되지 않은 사용자의 보호된 페이지 접근 차단
- ✅ XSS 방지 확인

## 📝 테스트 작성 가이드

### 기본 테스트 구조

```typescript
import { test, expect } from '@playwright/test';

test.describe('기능 그룹', () => {
  test.setTimeout(60000); // 타임아웃 설정

  test('테스트 케이스 설명', async ({ page }) => {
    // 페이지 이동
    await page.goto('/path', { waitUntil: 'networkidle' });
    
    // 요소 확인
    await expect(page.locator('selector')).toBeVisible({ timeout: 10000 });
    
    // 액션 수행
    await page.click('button');
    
    // 결과 검증
    await expect(page).toHaveURL(/expected-url/);
  });
});
```

### 헬퍼 함수 사용

```typescript
import { loginAsClient } from '../helpers/auth.helper';
import { waitForNetworkIdle } from '../helpers/wait.helper';

test('로그인 후 작업', async ({ page }) => {
  await loginAsClient(page, 'test@example.com', 'password');
  await waitForNetworkIdle(page);
  
  // 로그인 후 작업 수행
});
```

### 주요 선택자

```typescript
// CSS 선택자
page.locator('selector')

// 역할 기반 선택
page.getByRole('button', { name: '버튼' })

// 텍스트 기반 선택
page.getByText('텍스트')

// 라벨 기반 선택
page.getByLabel('라벨')

// 여러 선택자 조합
page.locator('input[type="email"], input[name="email"]')
```

## 🔄 CI/CD 통합

GitHub Actions를 통해 자동으로 테스트가 실행됩니다.

### 워크플로우 파일

`.github/workflows/playwright.yml` 파일이 자동으로 생성되어 있습니다.

### 트리거

- `main` 또는 `develop` 브랜치에 Push
- `main` 또는 `develop` 브랜치로 Pull Request

### 아티팩트

- 테스트 리포트 (30일 보관)
- 테스트 결과 (30일 보관)

## 🛠️ 문제 해결

### 테스트가 타임아웃되는 경우

```typescript
// 테스트 레벨에서 타임아웃 증가
test.setTimeout(60000);

// 특정 액션에서 타임아웃 증가
await expect(element).toBeVisible({ timeout: 10000 });
```

### 요소를 찾을 수 없는 경우

1. 선택자가 올바른지 확인
2. 페이지 로딩이 완료되었는지 확인
3. `--headed` 모드로 실행하여 시각적으로 확인

```bash
npm run test:e2e:headed
```

### 브라우저 설치 오류

```bash
npx playwright install --with-deps
```

### 네트워크 대기

```typescript
// 네트워크가 안정될 때까지 대기
await page.goto('/path', { waitUntil: 'networkidle' });

// 특정 API 응답 대기
await page.waitForResponse(response => 
  response.url().includes('/api/endpoint')
);
```

## 📊 테스트 리포트

테스트 실행 후 HTML 리포트가 자동으로 생성됩니다:

```bash
# 리포트 보기
npm run test:e2e:report
```

리포트에는 다음 정보가 포함됩니다:
- 테스트 결과 (통과/실패)
- 실행 시간
- 스크린샷 (실패 시)
- 비디오 (설정 시)
- 트레이스 (재시도 시)

## 🎯 베스트 프랙티스

1. **명확한 테스트 이름 사용**
   - 테스트가 무엇을 검증하는지 명확하게 작성

2. **독립적인 테스트 작성**
   - 각 테스트는 다른 테스트에 의존하지 않아야 함

3. **적절한 대기 사용**
   - `waitForSelector`, `waitForLoadState` 등 사용
   - 고정된 `setTimeout`은 최소화

4. **의미있는 선택자 사용**
   - data-testid 속성 활용
   - 역할 기반 선택자 우선 사용

5. **스크린샷 활용**
   - 실패 시 자동으로 스크린샷 저장됨
   - 시각적 회귀 테스트에 활용

6. **타임아웃 설정**
   - 적절한 타임아웃 설정으로 불안정한 테스트 방지

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Next.js Testing](https://nextjs.org/docs/testing)
