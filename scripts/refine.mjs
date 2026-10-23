import fs from "node:fs/promises";
async function edit(file, fn) {
  const s = await fs.readFile(file, "utf8");
  await fs.writeFile(file, fn(s), "utf8");
}
await edit("components/sections/Hero.tsx", (s) =>
  s.replace(
    'src="/images/hero.jpg" alt="Silver Porsche with a reflective finish on a winding road"',
    'src="/images/studio.webp" alt="A detailed Mercedes under the inspection lights at Detail Clinic in La Crosse"',
  ),
);
await edit("app/globals.css", (s) =>
  s
    .replace("inset:0 0 0 24%", "inset:0 0 0 10%")
    .replace(
      "linear-gradient(90deg,#0b0e11 0%,#0b0e11eb 21%,#0b0e1140 55%,#0b0e1110 100%),linear-gradient(0deg,#0b0e11 0%,transparent 24%,transparent 77%,#0b0e11aa 100%)",
      "linear-gradient(90deg,#0b0e11 0%,#0b0e11ee 18%,#0b0e1160 55%,#0b0e1100 100%),linear-gradient(0deg,#0b0e11,transparent 40%,#0b0e1190)",
    ),
);
await edit("components/animations/VehicleScene.tsx", (s) =>
  s
    .replace("toneMappingExposure=1.25", "toneMappingExposure=.85")
    .replace("0xe5eaff,0x29211b,2", "0xe5eaff,0x29211b,.3")
    .replace("0xffffff,4", "0xffffff,1.3")
    .replace("color:0xa5aaa9", "color:0x737c82")
    .replace("w/h<1.3?9.8:7.5", "w/h<1.3?8:5.1")
    .replace(
      "distance*.68,2.5,-distance*.72",
      "distance*.68,1.65,-distance*.72",
    )
    .replace("0,1.55,-distance", "0,1.3,-distance")
    .replace("uniform.value=p;", "uniform.value=mode==='tint'?1:p;"),
);
await edit("components/sections/Reviews.tsx", (s) =>
  s
    .replace(
      "Great customer service would have another tint job done if ever in The area",
      "Great customer service",
    )
    .replace(
      "Everything was explained in advance and before the work began they double checked everything",
      "Everything was explained in advance",
    )
    .replace(
      "GOOGLE REVIEW · FROM OUR WEBSITE",
      "GOOGLE REVIEW EXCERPT · FROM OUR WEBSITE",
    ),
);
await edit("app/credits/page.tsx", (s) =>
  s
    .replace(
      /<a href="\/">.*?Back to Detail Clinic<\/a>/,
      '<Link href="/">Back to Detail Clinic</Link>',
    )
    .replace(
      "https://unsplash.com/photos/1503376780353-7e6692767b70",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    ),
);
await edit("tests/site.spec.ts", (s) =>
  s
    .replace(
      ".first()).toBeVisible();expect(await page.locator('a[href=\"tel",
      ".filter({visible:true}).first()).toBeVisible();expect(await page.locator('a[href=\"tel",
    )
    .replace(
      "expect(await page.locator('.transformation-sticky').evaluate(el=>getComputedStyle(el).position)).toBe('relative')",
      "await expect.poll(()=>page.locator('.transformation-sticky').evaluate(el=>getComputedStyle(el).position)).toBe('relative')",
    )
    .replace(
      /toContainText\('doesn.*?identify'\)/,
      "toContainText('dedicated')",
    ),
);
console.log("Refinements applied");
