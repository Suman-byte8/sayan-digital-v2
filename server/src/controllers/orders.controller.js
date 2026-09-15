import { prisma } from "../lib/prisma.js";

function serializeOrder(order) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

// Read-only for now — no checkout/cart flow exists to create an order yet
// (see server/README.md). Genuinely returns an empty list for every user
// until that's built, rather than seeded/fake data.
export async function listOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: orders.map(serializeOrder) });
}
