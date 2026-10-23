import { test, expect } from "@playwright/test";
test("navigation, booking and local SEO are connected", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Detail Clinic.*La Crosse/);
  await expect(page.locator("h1")).toContainText("PRECISION");
  const links = await page
    .locator('a[href^="#"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href")),
    );
  for (const href of links) {
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await expect(
    page
      .locator(
        'a[href="https://app.urable.com/virtual-shop/CKt6z7uwDTRGKiB6ztCk"]',
      )
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  expect(
    await page.locator('a[href="tel:+16087975137"]').count(),
  ).toBeGreaterThan(0);
  expect(
    JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) || "{}",
    )["@type"],
  ).toBe("AutomotiveBusiness");
  expect(errors).toEqual([]);
});
test("service, comparison, filters and reviews work with keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const tab = page.getByRole("tab", { name: /01 Interior/ });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /02 Full/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText(
    "Inside. Outside. All yours.",
  );
  const range = page.getByRole("slider").first();
  await range.focus();
  await page.keyboard.press("ArrowRight");
  await expect(range).toHaveValue("51");
  await page.getByRole("button", { name: "Interior", exact: true }).click();
  await expect(page.locator(".work-photo")).toHaveCount(2);
  await page.getByRole("button", { name: /Enlarge Interior A fresh/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Tint", exact: true }).click();
  await expect(page.locator(".gallery-empty")).toContainText("dedicated");
  await page.getByRole("button", { name: "Next review" }).click();
  await expect(page.locator(".review-name")).toContainText("Kanina");
  await page.getByRole("button", { name: "70%", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "70%", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("responsive layout, images and menu remain usable", async ({
  page,
}, info) => {
  await page.goto("/");
  const widths =
    info.project.name === "chromium-desktop"
      ? [320, 375, 390, 430, 768, 1024, 1440, 1920]
      : [page.viewportSize()!.width];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Services/ })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible();
  await expect(page.locator("#services")).toBeInViewport();
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
  expect(broken).toEqual([]);
});
test("reduced motion removes pinned experiences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".transformation-sticky")).toHaveCSS("position", "relative", { timeout: 15000 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
});

test("tint updates the rendered car without reloading the model", async ({ page }) => {
  const modelRequests: string[] = [];
  page.on("request", request => {
    if (request.url().endsWith(".glb")) modelRequests.push(request.url());
  });
  await page.goto("/");
  await page.locator("#tint .tint-stage").scrollIntoViewIfNeeded();
  const preview = page.locator("#tint .vehicle-render");
  await expect(preview).toHaveAttribute("data-status", "ready", { timeout: 45000 });
  const canvas = preview.locator("canvas");
  await page.getByRole("button", { name: "35%", exact: true }).click();
  const dark = await canvas.screenshot();
  await page.getByRole("button", { name: "70%", exact: true }).click();
  await expect.poll(async () => (await canvas.screenshot()).equals(dark)).toBe(false);
  await expect(preview).toHaveAttribute("aria-label", /70%/);
  expect(modelRequests).toHaveLength(1);
  expect(modelRequests[0]).toContain("porsche-preview.glb");
});

test("failed model loading shows an honest fallback without a larger download", async ({ page }) => {
  await page.route("**/cars/*.glb", route => route.abort());
  await page.goto("/");
  await page.locator("#tint .tint-stage").scrollIntoViewIfNeeded();
  await expect(page.locator("#tint .vehicle-render")).toHaveAttribute("data-status", "fallback", { timeout: 45000 });
  await expect(page.locator("#tint .vehicle-fallback")).toContainText("3D PREVIEW UNAVAILABLE");
  await page.getByRole("button", { name: "50%", exact: true }).click();
  await expect(page.getByRole("button", { name: "50%", exact: true })).toHaveAttribute("aria-pressed", "true");
});
