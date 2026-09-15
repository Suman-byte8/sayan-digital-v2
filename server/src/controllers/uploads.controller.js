import { uploadImageToDrive } from "../lib/google-drive.js";

export async function uploadImage(req, res) {
  const { buffer, originalname, mimetype } = req.file;

  const { url, fileId } = await uploadImageToDrive({
    buffer,
    filename: `${Date.now()}-${originalname}`,
    mimeType: mimetype,
  });

  res.status(201).json({ success: true, data: { url, fileId } });
}
