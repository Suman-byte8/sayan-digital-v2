import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword, verifyPassword } from "../lib/auth.js";
import { uploadImageToDrive, deleteImageFromDrive } from "../lib/google-drive.js";
import { compressToWebp } from "../lib/image-processing.js";

function serializeUser(user) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

// Our own uploadImageToDrive URLs always look like
// https://lh3.googleusercontent.com/d/<fileId> — extract the id back out
// so a replaced avatar's old Drive file can be cleaned up. Anything else
// (no avatar yet, or a URL from elsewhere) is just skipped, not an error.
function driveFileIdFromUrl(url) {
  return url?.match(/\/d\/([^/]+)$/)?.[1] ?? null;
}

export async function getProfile(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw new ApiError(401, "Account no longer exists.");
  res.json({ success: true, data: serializeUser(user) });
}

export async function updateProfile(req, res) {
  const user = await prisma.user.update({ where: { id: req.userId }, data: req.validated.body });
  res.json({ success: true, data: serializeUser(user) });
}

export async function uploadAvatar(req, res) {
  const previousUser = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!previousUser) throw new ApiError(401, "Account no longer exists.");

  const compressed = await compressToWebp(req.file.buffer);
  const { url } = await uploadImageToDrive({
    buffer: compressed,
    filename: `avatar-${req.userId}-${Date.now()}.webp`,
    mimeType: "image/webp",
  });

  const user = await prisma.user.update({ where: { id: req.userId }, data: { avatarUrl: url } });

  // Best-effort cleanup — a failure here shouldn't fail the upload the
  // user is actually waiting on.
  const previousFileId = driveFileIdFromUrl(previousUser.avatarUrl);
  if (previousFileId) {
    deleteImageFromDrive(previousFileId).catch(() => {});
  }

  res.status(201).json({ success: true, data: serializeUser(user) });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.validated.body;

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: req.userId }, data: { passwordHash } });
  res.json({ success: true, data: { message: "Password updated." } });
}
