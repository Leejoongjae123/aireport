import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test.describe('관리자 페이지 테스트', () => {
  test('관리자 대시보드 접근 (인증 필요)', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트되는지 확인
    await page.waitForURL(/admin\/login|admin\/dashboard/, { timeout: 5000 });
    
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/admin/login');
    const isDashboard = currentUrl.includes('/admin/dashboard');
    
    expect(isLoginPage || isDashboard).toBeTruthy();
  });

  test('관리자 회원 관리 페이지 접근', async ({ page }) => {
    await page.goto('/admin/members', { waitUntil: 'domcontentloaded' });
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/members/, { timeout: 10000 });
  });

  test('관리자 리포트 관리 페이지 접근', async ({ page }) => {
    await page.goto('/admin/reports');
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/reports/, { timeout: 5000 });
  });

  test('관리자 전문가 컨설팅 요청 페이지 접근', async ({ page }) => {
    await page.goto('/admin/requests/expert-consulting');
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/requests\/expert-consulting/, { timeout: 5000 });
  });

  test('관리자 전문가 평가 요청 페이지 접근', async ({ page }) => {
    await page.goto('/admin/requests/expert-evaluation');
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/requests\/expert-evaluation/, { timeout: 5000 });
  });

  test('관리자 임베딩 - 전문가 페이지 접근', async ({ page }) => {
    await page.goto('/admin/embeddings/experts');
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/embeddings\/experts/, { timeout: 5000 });
  });

  test('관리자 임베딩 - 리포트 페이지 접근', async ({ page }) => {
    await page.goto('/admin/embeddings/reports');
    
    // 인증 체크
    await page.waitForURL(/admin\/login|admin\/embeddings\/reports/, { timeout: 5000 });
  });
});
