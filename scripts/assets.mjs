import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const html = await fs.readFile("docs/source-gallery.html", "utf8");
const urls = [
  ...new Set(
    html.match(
      /https:\/\/s3\.detailcliniclacrosse\.com\/[^\\"<> ]+?\.(?:jpe?g|png|mp4)/g,
    ),
  ),
];
for (const url of urls) {
  const name = path.basename(url);
  if (!['gallery1-1-', 'gallery1-2-', 'gallery1-5-', 'gallery2-1-', 'gallery3-1-', 'gallery4-1-', 'gallery4-2-'].some(prefix => name.startsWith(prefix))) continue;
  if (name.endsWith(".mp4")) continue;
  const data = Buffer.from(await (await fetch(url)).arrayBuffer());
  const outputName = name.startsWith('gallery1-1-') ? 'suv-hyundai.webp'
    : name.startsWith('gallery1-5-') ? 'suv-jeep.webp'
    : name.replace(/\.jpe?g$/, ".webp");
  await sharp(data)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/images/${outputName}`);
  console.log(name);
}
const studio = Buffer.from(await (await fetch('https://www.detailcliniclacrosse.com/images/hero.png')).arrayBuffer());
await sharp(studio)
  .resize({ width: 1920 })
  .webp({ quality: 85 })
  .toFile("public/images/studio.webp");
await sharp("public/images/studio.webp")
  .resize({ width: 900 })
  .toFile("public/images/studio-preview.webp");
const files = [
  [
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb",
    "public/cars/ferrari.glb",
  ],
  [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85",
    "public/images/hero.jpg",
  ],
];
for (const [url, out] of files) {
  const res = await fetch(url);
  if (!res.ok) throw Error(url);
  await fs.writeFile(out, Buffer.from(await res.arrayBuffer()));
}
console.log(JSON.stringify(urls, null, 2));
