import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

function serializeOrder(order) {
  const { user, ...rest } = order;
  return {
    ...rest,
    totalAmount: Number(rest.totalAmount),
    items: rest.items.map((item) => ({ ...item, price: Number(item.price) })),
    ...(user ? { customer: { id: user.id, name: user.name, email: user.email, phone: user.phone } } : {}),
  };
}

const CUSTOMER_SELECT = { select: { id: true, name: true, email: true, phone: true } };

// No auth — same trust model as the rest of the admin-facing endpoints
// (see admin-users.controller.js).
export async function listOrders(req, res) {
  const { page, limit, status, search } = req.validated.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: true, user: CUSTOMER_SELECT },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    success: true,
    data: orders.map(serializeOrder),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

export async function getOrderDetail(req, res) {
  const { id } = req.validated.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: CUSTOMER_SELECT },
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ success: true, data: serializeOrder(order) });
}

export async function updateOrder(req, res) {
  const { id } = req.validated.params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Order not found");

  const data = { ...req.validated.body };
  // First time an order is marked DELIVERED, timestamp it — doesn't
  // overwrite an already-set deliveredAt (e.g. re-saving other fields
  // shouldn't reset the original delivery time).
  if (data.status === "DELIVERED" && !existing.deliveredAt) {
    data.deliveredAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id },
    data,
    include: { items: true, user: CUSTOMER_SELECT },
  });

  res.json({ success: true, data: serializeOrder(order) });
}
