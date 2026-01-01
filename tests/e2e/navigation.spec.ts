import { test, expect } from '@playwright/test';

test.describe('네비게이션 테스트', () => {
  test('홈페이지 접근', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 로드 확인
    await expect(page).toHaveURL('/');
    
    // 주요 요소 확인
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('로그인 페이지로 이동', async ({ page }) => {
    await page.goto('/');
    
    // 로그인 링크 찾기 및 클릭
    const loginLink = page.getByRole('link', { name: /로그인|Login/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });

  test('회원가입 페이지로 이동', async ({ page }) => {
    await page.goto('/login');
    
    // 회원가입 링크 찾기 및 클릭
    const registerLink = page.getByRole('link', { name: /회원가입|가입|Register|Sign up/i });
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });

  test('404 페이지 처리', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    
    // 404 상태 코드 확인
    expect(response?.status()).toBe(404);
  });
});
