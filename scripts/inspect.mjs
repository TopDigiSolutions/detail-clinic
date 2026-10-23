import { chromium } from "playwright";
import fs from "node:fs/promises";
await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning")
    errors.push(message.text());
});
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3000");
await page.waitForTimeout(2200);
await page.screenshot({ path: "docs/screenshots/desktop-hero.png" });
for (const [name, selector] of [
  ["transformation", ".transformation"],
  ["tint", "#tint"],
  ["services", "#services"],
  ["gallery", "#gallery"],
]) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `docs/screenshots/${name}.png` });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(500);
await page.screenshot({ path: "docs/screenshots/mobile-hero.png" });
await fs.writeFile(
  "docs/browser-console.json",
  JSON.stringify(errors, null, 2),
);
console.log(errors);
await browser.close();
