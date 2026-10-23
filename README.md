# Detail Clinic

A custom Next.js website for Detail Clinic in La Crosse, Wisconsin. Built with Next.js 16.3.5, React, TypeScript, Tailwind CSS 4, Motion, GSAP/ScrollTrigger, Three.js, and Lucide.

## Run locally

Node.js 20.9 or newer is required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm start
```

## Architecture

- `app/`: homepage, metadata, schema, robots, sitemap, credits, design system.
- `components/layout/`: sticky navigation, mobile menu, footer, final CTA.
- `components/sections/`: independent homepage sections and interactions.
- `components/animations/`: shared reveal and lazy-loaded vehicle renderer.
- `components/ui/`: buttons, eyebrows, keyboard-accessible comparison slider.
- `lib/content.ts`: business information, external booking/quote links, services, photo paths.
- `public/`: local optimized imagery, compressed vehicle model/decoder, studio film.
- `tests/`: Playwright navigation, interaction, responsive, and reduced-motion tests.
- `docs/`: source provenance, QA evidence, screenshots.

## Signature experiences

1. A real 3D vehicle rotates with scroll. A directional shader removes the illustrative dirt while paint and wheels become glossier. Desktop turns through 360 degrees; narrow screens use 180 degrees. Reduced motion presents the finished state without rotation or pinning.
2. A side-view car previews 35%, 50%, and 70% tint. Only its glass material changes. These are illustrative VLT previews, not a claim about available products or legal suitability.
3. Two genuine before/after pairs from the original gallery use pointer/touch and keyboard-operated reveal sliders. Originals have different camera angles, disclosed below the gallery.

The car renderer and decoder load close to their sections. Rendering occurs only on changes and pauses out of view. Pixel density is capped. GSAP loads near the process section. Video downloads only after Play and pauses offscreen. Browser-native scrolling is preserved.

## Content and media

Verified source: https://www.detailcliniclacrosse.com/ and its `/gallery`, checked September 17, 2026. Existing Urable booking and inquiry links are preserved; no booking backend or dummy submission is used.

Interior starts at $150; full service starts at $200; adding exterior to interior is $50. No other prices or package inclusions are invented. Google rating is explicitly attributed to the existing website, not a live feed. Review excerpts preserve the original wording.

Customer work and the hero use the business's actual photography. The 12-second, click-to-play WebM is a cinematic photo montage: live-action detailing footage was not provided. Replace it with approved footage at `public/videos/studio-film.webm` if available. The public `/credits` page identifies illustrative lifestyle media, the CC BY 4.0 car model, and modifications.

The published gallery does not classify full-detail, tint, or paint-correction projects. Those filters show an honest contact prompt rather than invented project evidence. No unverified social profiles are linked.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium webkit
# Start the production server separately, then:
npm test
```

`npm test -- --project=chromium-desktop --project=mobile --project=tablet` runs the Chromium targets independently of WebKit. WebKit on Windows is not Safari; final Safari/iPhone validation requires macOS/iOS. See `docs/QA.md` for actual checks and outstanding launch items.

## Deploy

Deploy the repository to a Next.js-compatible host (for example Vercel), or use `npm run build` followed by `npm start` on a Node server. No environment variables or API keys are required. Next/Image requires the Next server; this is not a plain static-export build.

The canonical URL is the existing business domain. Confirm current hours, pricing, image rights, Google rating, and Urable destinations with the owner before changing DNS. Deployment and DNS changes have not been performed.

### Optimized vehicle preview

`node scripts/optimize-car.mjs` regenerates `public/cars/porsche-preview.glb` from the original Porsche asset. It keeps geometry and material names while removing textures that the procedural preview replaces (4.06 MB to 1.61 MB). Keep the source model for regeneration. The two previews share decoded geometry, but own their renderer environments and display materials.

For a server on another port, set `PLAYWRIGHT_BASE_URL` before running tests. The suite includes rendered tint changes and model-download failure handling.
