# E2E 테스트 가이드

이 프로젝트는 Playwright를 사용하여 E2E 테스트를 수행합니다.

## 테스트 실행

### 모든 테스트 실행
```bash
npm run test:e2e
```

### UI 모드로 테스트 실행 (권장)
```bash
npm run test:e2e:ui
```

### 브라우저를 보면서 테스트 실행
```bash
npm run test:e2e:headed
```

### 디버그 모드로 테스트 실행
```bash
npm run test:e2e:debug
```

### 테스트 리포트 보기
```bash
npm run test:e2e:report
```

## 테스트 구조

```
tests/
├── e2e/                    # E2E 테스트 파일들
│   ├── auth.spec.ts       # 인증 관련 테스트
│   ├── navigation.spec.ts # 네비게이션 테스트
│   ├── report.spec.ts     # 리포트 기능 테스트
│   ├── admin.spec.ts      # 관리자 페이지 테스트
│   ├── mypage.spec.ts     # 마이페이지 테스트
│   ├── accessibility.spec.ts # 접근성 테스트
│   └── responsive.spec.ts # 반응형 디자인 테스트
├── helpers/               # 테스트 헬퍼 함수들
│   ├── auth.helper.ts    # 인증 헬퍼
│   └── wait.helper.ts    # 대기 헬퍼
└── fixtures/             # 테스트 데이터
    └── test-data.ts      # 더미 데이터

```

## 테스트 작성 가이드

### 기본 테스트 구조

```typescript
import { test, expect } from '@playwright/test';

test.describe('기능 그룹', () => {
  test('테스트 케이스 설명', async ({ page }) => {
    // 페이지 이동
    await page.goto('/path');
    
    // 요소 확인
    await expect(page.locator('selector')).toBeVisible();
    
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

## 주요 선택자

- `page.locator('selector')` - CSS 선택자
- `page.getByRole('button', { name: '버튼' })` - 역할 기반 선택
- `page.getByText('텍스트')` - 텍스트 기반 선택
- `page.getByLabel('라벨')` - 라벨 기반 선택

## 베스트 프랙티스

1. **명확한 테스트 이름 사용**
   - 테스트가 무엇을 검증하는지 명확하게 작성

2. **독립적인 테스트 작성**
   - 각 테스트는 다른 테스트에 의존하지 않아야 함

3. **적절한 대기 사용**
   - `waitForSelector`, `waitForLoadState` 등 사용
   - 고정된 `setTimeout`은 피하기

4. **의미있는 선택자 사용**
   - data-testid 속성 활용
   - 역할 기반 선택자 우선 사용

5. **스크린샷 활용**
   - 실패 시 자동으로 스크린샷 저장됨
   - 시각적 회귀 테스트에 활용

## CI/CD 통합

GitHub Actions를 통해 자동으로 테스트가 실행됩니다.
- Push 또는 PR 시 자동 실행
- 테스트 결과는 Artifacts로 저장

## 문제 해결

### 테스트가 타임아웃되는 경우
- `timeout` 옵션을 늘려보세요
- 네트워크 상태를 확인하세요

### 요소를 찾을 수 없는 경우
- 선택자가 올바른지 확인
- 페이지 로딩이 완료되었는지 확인
- `--headed` 모드로 실행하여 시각적으로 확인

### 브라우저 설치 오류
```bash
npx playwright install
```
