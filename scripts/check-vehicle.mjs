import { chromium } from "playwright";
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("console", (m) => console.log(m.type(), m.text()));
page.on("pageerror", (e) => console.log("ERROR", e.message));
page.on("response", (r) => {
  if (r.url().includes("draco") || r.url().includes("ferrari"))
    console.log(r.status(), r.url());
});
await page.goto("http://localhost:3000");
await page.locator(".transformation").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => !document.querySelector(".transformation .vehicle-fallback"),
  {},
  { timeout: 60000 },
);
await page.screenshot({ path: "docs/screenshots/vehicle-ready.png" });
await page.locator("#tint").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => !document.querySelector("#tint .vehicle-fallback"),
  {},
  { timeout: 60000 },
);
await page.screenshot({ path: "docs/screenshots/tint-ready.png" });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.evaluate(() => {
  const img = document.querySelector(".hero-image img");
  img.removeAttribute("srcset");
  img.src = "/images/studio.webp";
  document.querySelector(".hero-image").style.inset = "0 0 0 10%";
  document.querySelector(".hero-shade").style.background =
    "linear-gradient(90deg,#0b0e11 0%,#0b0e11ee 18%,#0b0e1160 55%,#0b0e1100 100%),linear-gradient(0deg,#0b0e11,transparent 40%,#0b0e1190)";
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "docs/screenshots/studio-hero-option.png" });
await browser.close();
