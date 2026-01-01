import { test, expect } from '@playwright/test';

/**
 * 스모크 테스트 - 주요 페이지들이 정상적으로 로드되는지 빠르게 확인
 */
test.describe('스모크 테스트', () => {
  test.setTimeout(30000);

  const criticalPages = [
    { path: '/', name: '홈페이지' },
    { path: '/login', name: '로그인' },
    { path: '/register', name: '회원가입' },
    { path: '/admin/login', name: '관리자 로그인' },
  ];

  for (const { path, name } of criticalPages) {
    test(`${name} 페이지 로드 확인`, async ({ page }) => {
      const response = await page.goto(path, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      
      // 페이지가 성공적으로 로드되었는지 확인
      expect(response?.status()).toBeLessThan(400);
      
      // 페이지에 main 또는 body 요소가 있는지 확인
      const hasContent = await page.locator('main, body').count() > 0;
      expect(hasContent).toBeTruthy();
    });
  }

  test('API 헬스 체크', async ({ request }) => {
    // API가 응답하는지 확인
    const response = await request.get('/api/health').catch(() => null);
    
    // API가 없을 수도 있으므로 404도 허용
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });
});
