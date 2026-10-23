import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Image & Model Credits | Detail Clinic",
  alternates: { canonical: "/credits" },
  robots: { index: false, follow: true },
};
export default function Credits() {
  return (
    <main className="credits wrap">
      <Link href="/" title="Back to Detail Clinic homepage">Back to Detail Clinic</Link>
      <h1>IMAGE & MODEL CREDITS</h1>
      <p>
        Studio and customer-work photography is sourced from{" "}
        <a href="https://www.detailcliniclacrosse.com/gallery" title="View Detail Clinic's existing photo gallery website">
          Detail Clinic's existing website
        </a>
        . The studio film is an animated photographic montage, not footage of a
        detailing appointment.
      </p>
      <p>
        Automotive lifestyle photography is sourced from{" "}
        <a href="https://images.unsplash.com/photo-1503376780353-7e6692767b70" title="View automotive lifestyle photo on Unsplash">
          Unsplash
        </a>
        . Lifestyle imagery is illustrative and does not represent Detail Clinic
        customer work.
      </p>
      <p>
        The interactive car uses the{" "}
        <a href="https://sketchfab.com/3d-models/ferrari-458-italia-57bf6cc56931426e87494f554df1dab6" title="View Ferrari 458 Italia 3D model by vicent091036 on Sketchfab">
          Ferrari 458 Italia model by vicent091036
        </a>
        , distributed through the{" "}
        <a href="https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf" title="View Three.js GLTF model examples on GitHub">
          Three.js examples
        </a>
        , under{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/" title="View Creative Commons Attribution 4.0 International License">
          Creative Commons Attribution 4.0
        </a>
        . Materials, lighting, the cleaning visualization, and glass appearance
        have been modified for this experience. No affiliation with or
        endorsement by Ferrari is implied.
      </p>
      <p>
        The 3D cleaning and tint demonstrations are visual illustrations. They
        are not customer before-and-after images or film specifications.
      </p>
      <p>
        Review excerpts, starting prices, address, phone number, hours, and
        booking links were checked against the existing Detail Clinic website on
        September 17, 2026. The displayed 5.0 Google rating is the rating
        published on that site, not a live Google API feed.
      </p>
    </main>
  );
}
