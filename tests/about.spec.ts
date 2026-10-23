import { expect, test } from "@playwright/test";

test("About story opens locally and its navigation returns to the homepage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/cars/**", route => route.abort());
  await page.goto("/#about");
  await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 15000 });
  await page.locator("#about").getByRole("link", { name: "Read our story" }).click();
  await expect(page).toHaveURL(/\/about-us$/);
  await expect(page.getByRole("heading", { name: "About Us", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why choose us" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "About Detail Clinic" })).toBeAttached();
  await expect(page.locator("main").getByRole("link", { name: "Book now" }).first())
    .toHaveAttribute("href", "https://app.urable.com/virtual-shop/CKt6z7uwDTRGKiB6ztCk");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const desktop = page.getByRole("navigation", { name: "Main navigation" });
  if (await desktop.isVisible()) {
    await desktop.getByRole("link", { name: "Services", exact: true }).click();
  } else {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Services/ }).click();
  }
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 15000 });
  await expect(page.locator("#services")).toBeInViewport();
});

test("About navigation opens the dedicated page from the menu and footer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/cars/**", route => route.abort());
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 15000 });
  const desktop = page.getByRole("navigation", { name: "Main navigation" });
  if (await desktop.isVisible()) {
    await desktop.getByRole("link", { name: "About", exact: true }).click();
  } else {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /About/ }).click();
  }
  await expect(page).toHaveURL(/\/about-us$/);
  await expect(page.getByRole("navigation", { name: "Main navigation", includeHidden: true })
    .getByRole("link", { name: "About", exact: true, includeHidden: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".footer-nav").getByRole("link", { name: "About", exact: true }))
    .toHaveAttribute("href", "/about-us");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/");
  await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 15000 });
  await page.locator(".footer-nav").getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about-us$/);
  expect(errors).toEqual([]);
});
