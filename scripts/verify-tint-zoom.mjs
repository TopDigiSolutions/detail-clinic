import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const mobileOnly = process.argv.includes('--mobile-only');
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://localhost:3000/#tint');
await page.locator('.preloader').waitFor({ state: 'hidden' });
await page.locator('#tint .vehicle-render[data-status="ready"]').waitFor({ timeout: 60000 });
for (const width of mobileOnly ? [390] : [1440, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const level of mobileOnly ? [70] : [35, 50, 70, 35]) {
    await page.getByRole('button', { name: `${level}%`, exact: true }).click();
    await page.waitForTimeout(1400);
    await page.locator('.tint-stage').screenshot({ path: `docs/screenshots/tint-zoom-${width}-${level}.png` });
    if (await page.getByRole('button', { name: `${level}%`, exact: true }).getAttribute('aria-pressed') !== 'true') {
      errors.push(`Tint selection failed: ${level}`);
    }
  }
}
await page.getByRole('button', { name: '70%', exact: true }).click();
await page.getByRole('button', { name: '50%', exact: true }).click();
await page.getByRole('button', { name: '35%', exact: true }).click();
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.getByRole('button', { name: '70%', exact: true }).click();
await page.waitForTimeout(500);
console.log({ errors, status: await page.locator('#tint .vehicle-render').getAttribute('data-status') });
await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
