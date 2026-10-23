// The preview replaces every material. Keep geometry unchanged and omit unused textures.
import fs from 'node:fs';
const source = fs.readFileSync('public/cars/porsche-911.glb');
const jsonLength = source.readUInt32LE(12);
const doc = JSON.parse(source.subarray(20, 20 + jsonLength).toString());
const binary = source.subarray(28 + jsonLength);
const imageViews = new Set(doc.images.map(image => image.bufferView));
delete doc.images;
delete doc.textures;
delete doc.samplers;
doc.materials = doc.materials.map(({ name }) => ({ name }));
const remap = new Map();
const chunks = [];
let offset = 0;
doc.bufferViews = doc.bufferViews.flatMap((view, index) => {
  if (imageViews.has(index)) return [];
  remap.set(index, remap.size);
  const data = binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
  const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
  data.copy(padded);
  chunks.push(padded);
  const result = { ...view, byteOffset: offset };
  offset += padded.length;
  return [result];
});
function updateViews(value) {
  if (!value || typeof value !== 'object') return;
  for (const key of Object.keys(value)) {
    if (key === 'bufferView') {
      if (!remap.has(value[key])) throw new Error('Unexpected reference to removed image');
      value[key] = remap.get(value[key]);
    } else updateViews(value[key]);
  }
}
updateViews(doc);
doc.buffers[0].byteLength = offset;
const json = Buffer.from(JSON.stringify(doc));
const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(paddedJson);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + paddedJson.length + offset, 8);
header.writeUInt32LE(paddedJson.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(offset, 0);
binHeader.writeUInt32LE(0x004e4942, 4);
const result = Buffer.concat([header, paddedJson, binHeader, ...chunks]);
fs.writeFileSync('public/cars/porsche-preview.glb', result);
console.log(`Preview: ${source.length} -> ${result.length} bytes (${Math.round((1-result.length/source.length)*100)}% smaller)`);
