import { expect, test } from "@playwright/test";

test("navigation marks the current section on load, scroll, and selection", async ({ page }) => {
  await page.goto("/#tint");
  await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 15000 });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const desktop = page.getByRole("navigation", { name: "Main navigation", includeHidden: true });
  await expect(desktop.locator('[aria-current="location"]')).toHaveAttribute("href", "#tint");

  for (const id of ["gallery", "detailing", "services", "home"]) {
    await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({ behavior: "instant" }));
    await expect(desktop.locator('[aria-current="location"]')).toHaveAttribute("href", `#${id}`);
  }

  if (await desktop.isVisible()) {
    await desktop.getByRole("link", { name: "Gallery", exact: true }).click();
    await expect(desktop.locator('[aria-current="location"]')).toHaveText("Gallery");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobile.locator('[aria-current="location"]')).toHaveCount(1);
  await mobile.getByRole("link", { name: /Contact/ }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
  await expect(page.locator(".menu-current")).toHaveText("Contact");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(mobile.locator('[aria-current="location"]')).toHaveAttribute("href", "#contact");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
});
