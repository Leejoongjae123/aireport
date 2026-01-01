import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.setTimeout(60000);

// 스크린샷 디렉토리 생성
const screenshotDir = path.join(process.cwd(), 'tests', 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('반응형 디자인 테스트', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} - 홈페이지 렌더링`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // 페이지 로드 확인
      await expect(page.locator('main')).toBeVisible();
      
      // 스크린샷 저장 (시각적 회귀 테스트용)
      await page.screenshot({ 
        path: `tests/screenshots/home-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
    });

    test(`${viewport.name} - 로그인 페이지 렌더링`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/login', { waitUntil: 'networkidle' });
      
      // 로그인 폼 요소 확인
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
    });
  }

  test('모바일 메뉴 토글', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 모바일 메뉴 버튼 찾기
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="메뉴" i]');
    
    if (await menuButton.isVisible()) {
      // 메뉴 열기
      await menuButton.click();
      await page.waitForTimeout(300); // 애니메이션 대기
      
      // 메뉴 닫기
      await menuButton.click();
      await page.waitForTimeout(300);
    }
  });
});
