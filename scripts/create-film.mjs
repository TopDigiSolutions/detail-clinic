import { chromium } from "playwright";
import fs from "node:fs/promises";
const files = [
  "studio.webp",
  "gallery2-1-b61af160-7bf8-49fc-8ca3-806d59c01b88.webp",
  "gallery1-2-afcde4f0-b480-478b-978a-f6806dba7c07.webp",
];
const images = await Promise.all(
  files.map(
    async (file) =>
      "data:image/webp;base64," +
      (await fs.readFile(`public/images/${file}`)).toString("base64"),
  ),
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const data = await page.evaluate(async (sources) => {
  const images = await Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        }),
    ),
  );
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  const stream = canvas.captureStream(24);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp8",
    videoBitsPerSecond: 1500000,
  });
  const chunks = [];
  const finished = new Promise((resolve) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
      let result = "";
      for (let i = 0; i < bytes.length; i += 32768)
        result += String.fromCharCode(...bytes.subarray(i, i + 32768));
      resolve(btoa(result));
    };
  });
  const start = performance.now();
  recorder.start();
  function draw(now) {
    const t = (now - start) / 1000;
    const index = Math.min(2, Math.floor(t / 4));
    const p = (t % 4) / 4;
    const img = images[index];
    const scale = Math.max(1280 / img.width, 720 / img.height) * (1 + p * 0.06);
    const w = img.width * scale,
      h = img.height * scale;
    ctx.fillStyle = "#101112";
    ctx.fillRect(0, 0, 1280, 720);
    ctx.drawImage(img, (1280 - w) / 2, (720 - h) / 2, w, h);
    const fade = Math.min(1, p * 10, (1 - p) * 10);
    ctx.fillStyle = `rgba(10,12,14,${1 - fade})`;
    ctx.fillRect(0, 0, 1280, 720);
    if (t < 11.95) requestAnimationFrame(draw);
    else recorder.stop();
  }
  requestAnimationFrame(draw);
  return await finished;
}, images);
await fs.writeFile(
  "public/videos/studio-film.webm",
  Buffer.from(data, "base64"),
);
await browser.close();
console.log("Studio film created");
