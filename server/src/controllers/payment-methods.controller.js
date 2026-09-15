import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

export async function listPaymentMethods(req, res) {
  const methods = await prisma.paymentMethod.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: methods });
}

export async function createPaymentMethod(req, res) {
  if (req.validated.body.isPrimary) {
    await prisma.paymentMethod.updateMany({
      where: { userId: req.userId },
      data: { isPrimary: false },
    });
  }

  const method = await prisma.paymentMethod.create({
    data: { ...req.validated.body, userId: req.userId },
  });
  res.status(201).json({ success: true, data: method });
}

export async function setPrimaryPaymentMethod(req, res) {
  const { id } = req.validated.params;

  const existing = await prisma.paymentMethod.findFirst({ where: { id, userId: req.userId } });
  if (!existing) throw new ApiError(404, "Payment method not found");

  await prisma.paymentMethod.updateMany({
    where: { userId: req.userId },
    data: { isPrimary: false },
  });
  const method = await prisma.paymentMethod.update({ where: { id }, data: { isPrimary: true } });
  res.json({ success: true, data: method });
}

export async function deletePaymentMethod(req, res) {
  const { id } = req.validated.params;
  const { count } = await prisma.paymentMethod.deleteMany({ where: { id, userId: req.userId } });
  if (count === 0) throw new ApiError(404, "Payment method not found");
  res.status(204).send();
}
