import { test, expect } from '@playwright/test';

/**
 * 성능 테스트 - 페이지 로드 시간 및 성능 메트릭 확인
 */
test.describe('성능 테스트', () => {
  test.setTimeout(60000);

  test('홈페이지 로드 시간', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // 10초 이내에 로드되어야 함
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`홈페이지 로드 시간: ${loadTime}ms`);
  });

  test('로그인 페이지 로드 시간', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // 10초 이내에 로드되어야 함
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`로그인 페이지 로드 시간: ${loadTime}ms`);
  });

  test('페이지 리소스 크기 확인', async ({ page }) => {
    const resources: { url: string; size: number }[] = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentLength = headers['content-length'];
      
      if (contentLength) {
        resources.push({
          url,
          size: parseInt(contentLength, 10)
        });
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // 총 리소스 크기 계산
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);
    
    console.log(`총 리소스 크기: ${totalSizeMB.toFixed(2)}MB`);
    
    // 10MB 이하여야 함 (권장사항)
    expect(totalSizeMB).toBeLessThan(10);
  });

  test('Core Web Vitals 측정', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Web Vitals 측정
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals: Record<string, number> = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                const navEntry = entry as PerformanceNavigationTiming;
                vitals.loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
              }
            });
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['navigation'] });
          
          setTimeout(() => resolve({}), 5000);
        } else {
          resolve({});
        }
      });
    });
    
    console.log('Performance Metrics:', metrics);
  });
});
