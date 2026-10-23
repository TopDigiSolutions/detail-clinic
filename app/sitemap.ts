import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.detailcliniclacrosse.com",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://www.detailcliniclacrosse.com/about-us",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
