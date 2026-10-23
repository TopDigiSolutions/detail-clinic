import { expect, test } from "@playwright/test";

test("body attributes injected before hydration do not warn or break navigation", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /hydrat|didn't match/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on("pageerror", error => hydrationErrors.push(error.message));

  // Reproduce the extension's DOM change before any React scripts execute.
  await page.addInitScript(() => {
    const inject = () => {
      if (!document.body) return false;
      document.body.setAttribute("cz-shortcut-listen", "true");
      return true;
    };
    if (inject()) return;
    const observer = new MutationObserver(() => {
      if (inject()) observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about-us");
  await expect(page.locator("body")).toHaveAttribute("cz-shortcut-listen", "true");
  // The server-rendered button may be visible before its event handler hydrates.
  await expect(async () => {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
  expect(hydrationErrors).toEqual([]);
});
