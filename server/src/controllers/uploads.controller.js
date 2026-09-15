import path from "node:path";
import { uploadImageToDrive } from "../lib/google-drive.js";
import { compressToWebp } from "../lib/image-processing.js";

export async function uploadImage(req, res) {
  const { buffer, originalname } = req.file;

  const compressed = await compressToWebp(buffer);
  const baseName = path.parse(originalname).name;

  const { url, fileId } = await uploadImageToDrive({
    buffer: compressed,
    filename: `${Date.now()}-${baseName}.webp`,
    mimeType: "image/webp",
  });

  res.status(201).json({
    success: true,
    data: {
      url,
      fileId,
      originalSize: buffer.length,
      compressedSize: compressed.length,
    },
  });
}
