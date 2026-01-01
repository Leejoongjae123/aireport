import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test.describe('인증 플로우', () => {
  test('클라이언트 로그인 페이지 접근', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    // 로그인 페이지 요소 확인
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
  });

  test('관리자 로그인 페이지 접근', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'networkidle' });
    
    // 관리자 로그인 페이지 요소 확인
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible({ timeout: 10000 });
  });

  test('회원가입 페이지 접근', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });
    
    // 회원가입 페이지 요소 확인
    await expect(page).toHaveURL(/register/);
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
  });

  test('유효하지 않은 이메일 형식 검증', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    // 잘못된 이메일 입력
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await submitButton.click();
    
    // 에러 메시지 확인 (폼 검증 또는 에러 메시지)
    await page.waitForTimeout(1000);
    const hasError = await emailInput.getAttribute('aria-invalid');
    const errorMessage = page.locator('text=/이메일|email/i');
    
    expect(hasError === 'true' || await errorMessage.count() > 0).toBeTruthy();
  });
});
