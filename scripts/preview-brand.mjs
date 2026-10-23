import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://localhost:3000');
await page.locator('.preloader').waitFor({ state: 'hidden' });
await page.evaluate(() => document.fonts.ready);
for (const [name, selector] of [['hero', '#home'], ['services', '#services'], ['packages', '#packages'], ['contact', '#contact'], ['cta', '.final-cta']]) {
  await page.locator(selector).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `docs/screenshots/brand-${name}-desktop.png` });
}
await page.setViewportSize({ width: 390, height: 844 });
for (const [name, selector] of [['hero', '#home'], ['services', '#services'], ['packages', '#packages'], ['contact', '#contact'], ['cta', '.final-cta']]) {
  await page.locator(selector).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `docs/screenshots/brand-${name}-mobile.png` });
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) throw new Error('Browser rendering errors found.');
