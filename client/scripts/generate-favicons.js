// One-off generation script for the favicon/icon set from the real brand
// logo (public/assets/favicon.png, 512x512). Not part of the app build —
// run manually with `node scripts/generate-favicons.js` whenever the
// source logo changes, then commit the generated files.
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "public", "assets", "favicon.png");
const APP_DIR = path.join(__dirname, "..", "src", "app");
const ICONS_DIR = path.join(__dirname, "..", "public", "icons");

async function resizePng(size) {
  return sharp(SRC).resize(size, size).png().toBuffer();
}

// Minimal ICO container that embeds PNG-compressed frames — supported by
// every modern OS/browser since Windows Vista, avoids needing a BMP encoder.
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256)
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function main() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  // Browser tab favicons (Next.js app/ file convention — auto-detected,
  // sizes/type read from the actual file by Next at build time).
  await sharp(SRC).resize(16, 16).png().toFile(path.join(APP_DIR, "icon1.png"));
  await sharp(SRC).resize(32, 32).png().toFile(path.join(APP_DIR, "icon2.png"));
  await sharp(SRC).resize(48, 48).png().toFile(path.join(APP_DIR, "icon3.png"));

  // iOS home-screen icon (Next.js apple-icon convention).
  await sharp(SRC).resize(180, 180).png().toFile(path.join(APP_DIR, "apple-icon.png"));

  // Legacy favicon.ico (multi-resolution, PNG-in-ICO) for the root shortcut icon.
  const icoSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSizes.map(async (size) => ({ size, buffer: await resizePng(size) })),
  );
  fs.writeFileSync(path.join(APP_DIR, "favicon.ico"), buildIco(icoBuffers));

  // Android/PWA manifest icons (referenced by URL, not auto-detected).
  await sharp(SRC).resize(192, 192).png().toFile(path.join(ICONS_DIR, "icon-192.png"));
  await sharp(SRC).resize(512, 512).png().toFile(path.join(ICONS_DIR, "icon-512.png"));

  console.log("Favicon set generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
