import { Page } from '@playwright/test';

/**
 * 클라이언트 로그인 헬퍼
 */
export async function loginAsClient(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  
  // 로그인 완료 대기 (리다이렉트 또는 페이지 변경)
  await page.waitForURL(/mypage|report/, { timeout: 10000 });
}

/**
 * 관리자 로그인 헬퍼
 */
export async function loginAsAdmin(page: Page, email: string, password: string) {
  await page.goto('/admin/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  
  // 로그인 완료 대기
  await page.waitForURL(/admin\/dashboard/, { timeout: 10000 });
}

/**
 * 로그아웃 헬퍼
 */
export async function logout(page: Page) {
  // 로그아웃 버튼 찾기 및 클릭
  const logoutButton = page.getByRole('button', { name: /로그아웃|Logout/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
  
  // 로그인 페이지로 리다이렉트 대기
  await page.waitForURL(/login/, { timeout: 5000 });
}

/**
 * 인증 상태 확인
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // 로컬 스토리지나 쿠키에서 인증 상태 확인
  const cookies = await page.context().cookies();
  return cookies.some(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth')
  );
}
