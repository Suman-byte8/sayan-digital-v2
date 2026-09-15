import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

export async function listAddresses(req, res) {
  const addresses = await prisma.address.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: addresses });
}

// If the new/updated address is marked default (shipping and/or billing),
// unset that flag on the user's other addresses first, so "default" stays
// meaningful (at most one per user).
async function clearOtherDefaults(userId, { isDefaultShipping, isDefaultBilling }, excludeId) {
  if (!isDefaultShipping && !isDefaultBilling) return;

  await prisma.address.updateMany({
    where: { userId, id: excludeId ? { not: excludeId } : undefined },
    data: {
      ...(isDefaultShipping ? { isDefaultShipping: false } : {}),
      ...(isDefaultBilling ? { isDefaultBilling: false } : {}),
    },
  });
}

export async function createAddress(req, res) {
  await clearOtherDefaults(req.userId, req.validated.body, null);
  const address = await prisma.address.create({
    data: { ...req.validated.body, userId: req.userId },
  });
  res.status(201).json({ success: true, data: address });
}

export async function updateAddress(req, res) {
  const { id } = req.validated.params;

  const existing = await prisma.address.findFirst({ where: { id, userId: req.userId } });
  if (!existing) throw new ApiError(404, "Address not found");

  await clearOtherDefaults(req.userId, req.validated.body, id);
  const address = await prisma.address.update({ where: { id }, data: req.validated.body });
  res.json({ success: true, data: address });
}

export async function deleteAddress(req, res) {
  const { id } = req.validated.params;
  const { count } = await prisma.address.deleteMany({ where: { id, userId: req.userId } });
  if (count === 0) throw new ApiError(404, "Address not found");
  res.status(204).send();
}
