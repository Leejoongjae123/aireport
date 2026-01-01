import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* 병렬 테스트 실행 */
  fullyParallel: true,
  
  /* CI 환경에서 재시도 설정 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  /* CI 환경에서 워커 수 조정 */
  workers: process.env.CI ? 1 : undefined,
  
  /* 리포터 설정 */
  reporter: 'html',
  
  /* 모든 테스트에 공통으로 적용되는 설정 */
  use: {
    /* 베이스 URL */
    baseURL: 'http://localhost:3000',
    
    /* 실패 시 스크린샷 및 트레이스 수집 */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* 테스트 전에 개발 서버 실행 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* 다양한 브라우저 환경에서 테스트 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 모바일 뷰포트 테스트 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
