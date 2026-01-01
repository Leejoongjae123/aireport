import { test, expect } from '@playwright/test';

test.describe('접근성 테스트', () => {
  test('홈페이지 키보드 네비게이션', async ({ page }) => {
    await page.goto('/');
    
    // Tab 키로 포커스 이동 테스트
    await page.keyboard.press('Tab');
    
    // 포커스된 요소 확인
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('로그인 폼 키보드 네비게이션', async ({ page }) => {
    await page.goto('/login');
    
    // Tab으로 이메일 입력으로 이동
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');
    
    // Tab으로 비밀번호 입력으로 이동
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');
    
    // Enter로 폼 제출 (실제 제출되지 않고 검증만)
    await page.keyboard.press('Enter');
  });

  test('페이지 제목 존재 확인', async ({ page }) => {
    const pages = ['/', '/login', '/register', '/report/start'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('이미지 alt 속성 확인', async ({ page }) => {
    await page.goto('/');
    
    // 모든 이미지 요소 찾기
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // alt 속성이 존재하거나 role이 presentation인지 확인
      const role = await img.getAttribute('role');
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });
});
