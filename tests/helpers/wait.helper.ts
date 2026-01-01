import { Page } from '@playwright/test';

/**
 * 네트워크 요청 완료 대기
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * API 응답 대기
 */
export async function waitForApiResponse(
  page: Page, 
  urlPattern: string | RegExp,
  timeout = 10000
) {
  return await page.waitForResponse(
    response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * 특정 텍스트가 나타날 때까지 대기
 */
export async function waitForText(
  page: Page, 
  text: string | RegExp,
  timeout = 5000
) {
  await page.waitForSelector(`text=${text}`, { timeout });
}

/**
 * 로딩 완료 대기
 */
export async function waitForLoadingComplete(page: Page, timeout = 10000) {
  // 로딩 스피너나 로딩 인디케이터가 사라질 때까지 대기
  const loadingSelectors = [
    '[data-loading="true"]',
    '.loading',
    '.spinner',
    '[aria-busy="true"]'
  ];
  
  for (const selector of loadingSelectors) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      await element.waitFor({ state: 'hidden', timeout });
    }
  }
}
