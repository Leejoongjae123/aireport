import { test, expect } from '@playwright/test';

/**
 * 보안 테스트 - 기본적인 보안 헤더 및 취약점 확인
 */
test.describe('보안 테스트', () => {
  test.setTimeout(30000);

  test('보안 헤더 확인', async ({ page }) => {
    const response = await page.goto('/');
    
    if (response) {
      const headers = response.headers();
      
      // X-Frame-Options 확인 (클릭재킹 방지)
      console.log('X-Frame-Options:', headers['x-frame-options'] || 'Not set');
      
      // X-Content-Type-Options 확인
      console.log('X-Content-Type-Options:', headers['x-content-type-options'] || 'Not set');
      
      // Strict-Transport-Security 확인 (HTTPS 강제)
      console.log('Strict-Transport-Security:', headers['strict-transport-security'] || 'Not set');
      
      // Content-Security-Policy 확인
      console.log('Content-Security-Policy:', headers['content-security-policy'] || 'Not set');
    }
  });

  test('민감한 정보 노출 확인', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 소스에서 민감한 정보 검색
    const content = await page.content();
    
    // API 키나 비밀번호가 노출되지 않았는지 확인
    expect(content).not.toContain('password');
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('secret');
    expect(content).not.toContain('private_key');
  });

  test('HTTPS 리다이렉트 확인 (프로덕션)', async ({ page }) => {
    // 로컬 개발 환경에서는 스킵
    if (process.env.NODE_ENV !== 'production') {
      test.skip();
    }
    
    const response = await page.goto('http://localhost:3000');
    
    if (response) {
      // HTTPS로 리다이렉트되는지 확인
      const finalUrl = page.url();
      expect(finalUrl).toMatch(/^https:/);
    }
  });

  test('인증되지 않은 사용자의 보호된 페이지 접근 차단', async ({ page }) => {
    // 쿠키 및 로컬 스토리지 클리어
    await page.context().clearCookies();
    
    // 보호된 페이지 접근 시도
    await page.goto('/mypage');
    
    // 로그인 페이지로 리다이렉트되는지 확인
    await page.waitForURL(/login/, { timeout: 10000 });
    expect(page.url()).toContain('login');
  });

  test('관리자 페이지 접근 제어', async ({ page }) => {
    // 쿠키 및 로컬 스토리지 클리어
    await page.context().clearCookies();
    
    // 관리자 페이지 접근 시도
    await page.goto('/admin/dashboard');
    
    // 관리자 로그인 페이지로 리다이렉트되는지 확인
    await page.waitForURL(/admin\/login/, { timeout: 10000 });
    expect(page.url()).toContain('admin/login');
  });

  test('XSS 방지 확인', async ({ page }) => {
    await page.goto('/login');
    
    // XSS 공격 시도
    const xssPayload = '<script>alert("XSS")</script>';
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    
    await emailInput.fill(xssPayload);
    
    // 스크립트가 실행되지 않는지 확인
    const dialogPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
    
    await page.locator('button[type="submit"]').first().click();
    
    const dialog = await dialogPromise;
    expect(dialog).toBeNull();
  });
});
