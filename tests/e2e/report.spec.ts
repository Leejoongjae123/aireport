import { test, expect } from '@playwright/test';

test.describe('리포트 기능 테스트', () => {
  test('리포트 시작 페이지 접근', async ({ page }) => {
    await page.goto('/report/start');
    
    // 리포트 시작 페이지 확인
    await expect(page).toHaveURL(/report\/start/);
  });

  test('리포트 입력 페이지 접근', async ({ page }) => {
    await page.goto('/report/inputs');
    
    // 리포트 입력 페이지 확인
    await expect(page).toHaveURL(/report\/inputs/);
  });

  test('리포트 절차 페이지 접근', async ({ page }) => {
    await page.goto('/report/procedure');
    
    // 리포트 절차 페이지 확인
    await expect(page).toHaveURL(/report\/procedure/);
  });

  test('리포트 에디터 페이지 접근', async ({ page }) => {
    await page.goto('/report/editor');
    
    // 에디터 페이지 확인
    await expect(page).toHaveURL(/report\/editor/);
  });
});
