import { expect, test } from "@playwright/test";

test("branded curtain releases even when the hero image stalls", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_next/image**", async (route) => {
    if (route.request().url().includes("studio.webp")) await held;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loader = page.locator(".preloader");
    await expect(loader).toBeVisible();
    await expect(loader).toContainText("PRECISION IN EVERY DETAIL.");
    await page.waitForTimeout(650);
    await page.screenshot({ path: `test-results/preloader-${test.info().project.name}.png` });
    await expect(loader).not.toBeVisible({ timeout: 6000 });
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally {
    release();
  }
});

test("ready homepage removes the intro and accepts navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0, { timeout: 15000 });
  await page.locator(".hero").getByRole("link", { name: /Explore services/ }).click();
  await expect(page).toHaveURL(/#services$/);
});

test("reduced motion bypasses the curtain", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".preloader")).not.toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

test("server-rendered homepage remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL || "http://localhost:3000");
  await expect(page.locator(".preloader")).not.toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await context.close();
});
