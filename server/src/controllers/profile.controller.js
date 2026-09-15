import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword, verifyPassword } from "../lib/auth.js";

function serializeUser(user) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
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
