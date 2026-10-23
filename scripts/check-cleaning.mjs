import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(90000);
await page.goto('http://localhost:3000');
const section = page.locator('.transformation');
await section.scrollIntoViewIfNeeded();
await page.locator('.transformation .vehicle-render').waitFor();
await page.waitForFunction(() => document.querySelector('.transformation .vehicle-render')?.getAttribute('data-status') === 'ready');
for (const progress of [0.17, 0.197, 0.24, 0.4, 0.95]) {
  await section.evaluate((el, p) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - window.innerHeight) * p, behavior: 'instant' }), progress);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `docs/screenshots/cleaning-${progress}.png` });
}
await browser.close();
