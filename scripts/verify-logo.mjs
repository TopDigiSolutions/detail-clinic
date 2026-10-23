import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
// Logo layout checks do not need the heavy interactive vehicle assets.
await page.route('**/cars/**', route => route.abort());
await page.goto('http://localhost:3000');
await page.evaluate(() => document.fonts.ready);
await page.locator('.preloader').waitFor({ state: 'hidden' });
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
  for (const [name, selector] of [['header', '#home'], ['footer', '.footer']]) {
    await page.locator(selector).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await page.screenshot({ path: `docs/screenshots/logo-${name}-${width}.png` });
  }
  const result = await page.evaluate(() => ({
    header: getComputedStyle(document.querySelector('.header')).backgroundColor,
    footer: getComputedStyle(document.querySelector('.footer')).backgroundColor,
    footerWidth: document.querySelector('.footer').getBoundingClientRect().width,
    viewport: innerWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  console.log(result);
  if (result.header !== result.footer || result.overflow || result.footerWidth !== width) errors.push(`Layout mismatch at ${width}`);
}
await page.getByRole('button', { name: 'Open navigation' }).click();
await page.screenshot({ path: 'docs/screenshots/logo-menu-mobile.png' });
await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
