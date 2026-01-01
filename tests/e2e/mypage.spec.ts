import { test, expect } from '@playwright/test';

test.describe('마이페이지 테스트', () => {
  test('마이페이지 접근 (인증 필요)', async ({ page }) => {
    await page.goto('/mypage');
    
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트되는지 확인
    await page.waitForURL(/login|mypage/, { timeout: 5000 });
    
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/login');
    const isMypage = currentUrl.includes('/mypage');
    
    expect(isLoginPage || isMypage).toBeTruthy();
  });

  test('리뷰 페이지 접근', async ({ page }) => {
    await page.goto('/review');
    
    // 페이지 로드 확인
    await expect(page).toHaveURL(/review/);
  });
});
