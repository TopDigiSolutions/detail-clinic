import { chromium } from "playwright";
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
await page.goto("http://localhost:3000");
await page.waitForTimeout(1500);
console.log(
  "overflow",
  await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    items: [...document.querySelectorAll("body *")]
      .map((el) => ({
        tag: el.tagName,
        class: el.className,
        left: el.getBoundingClientRect().left,
        right: el.getBoundingClientRect().right,
      }))
      .filter((x) => x.left < -1 || x.right > innerWidth + 1)
      .slice(0, 45),
  })),
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.locator(".transformation").scrollIntoViewIfNeeded();
await page.waitForSelector(".transformation canvas");
await page.waitForFunction(
  () =>
    document.querySelector(".transformation canvas") &&
    !document.querySelector(".transformation .vehicle-fallback"),
  {},
  { timeout: 60000 },
);
await page.waitForTimeout(1000);
await page.screenshot({ path: "docs/screenshots/vehicle-loaded.png" });
await page.locator("#tint").scrollIntoViewIfNeeded();
await page.waitForSelector("#tint canvas");
await page.waitForFunction(
  () =>
    document.querySelector("#tint canvas") &&
    !document.querySelector("#tint .vehicle-fallback"),
  {},
  { timeout: 60000 },
);
await page.waitForTimeout(1000);
await page.screenshot({ path: "docs/screenshots/tint-loaded.png" });
await browser.close();
