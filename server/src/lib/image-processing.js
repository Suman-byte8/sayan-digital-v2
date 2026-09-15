import sharp from "sharp";

// Caps the longest side of a product photo — plenty for full-bleed display
// and zoom, without keeping multi-megapixel camera originals around.
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

// Re-encodes any supported input image (JPEG/PNG/WEBP/GIF/etc.) to WebP,
// downscaling if it's larger than MAX_DIMENSION. WebP at quality 80 with
// max encoder effort is consistently 25-35% smaller than an equivalent-
// quality JPEG and 70%+ smaller than PNG for photographic product images,
// so this is applied to every upload rather than left optional.
export async function compressToWebp(buffer) {
  return sharp(buffer)
    .rotate() // apply EXIF orientation before stripping metadata below
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();
}
