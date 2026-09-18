import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

// Never send the bcrypt hash back, even to the admin panel.
function serializeUser(user) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

function serializeOrder(order) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

// No auth — the admin panel has none of its own yet (see server/README.md's
// note on POST /uploads/image), same trust model as the products/categories
// admin endpoints this mirrors. Never cached (see products.controller.js's
// LIST_TTL_SECONDS comment for why that pattern exists there) — this is a
// low-traffic internal tool where correctness matters more than shaving a
// DB round trip.
export async function listUsers(req, res) {
  const { page, limit, search } = req.validated.query;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { orders: true, addresses: true, wishlistItems: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users.map(serializeUser),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

export async function getUserDetail(req, res) {
  const { id } = req.validated.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: { createdAt: "desc" } },
      paymentMethods: { orderBy: { createdAt: "desc" } },
      proofs: { orderBy: { submittedAt: "desc" } },
      wishlistItems: { include: { product: true }, orderBy: { createdAt: "desc" } },
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) throw new ApiError(404, "Customer not found");

  const { orders, ...rest } = user;
  res.json({
    success: true,
    data: { ...serializeUser(rest), orders: orders.map(serializeOrder) },
  });
}

export async function updateUser(req, res) {
  const { id } = req.validated.params;
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Customer not found");

  const user = await prisma.user.update({ where: { id }, data: req.validated.body });
  res.json({ success: true, data: serializeUser(user) });
}

export async function deleteUser(req, res) {
  const { id } = req.validated.params;

  // Cascades to sessions/addresses/wishlistItems/orders/paymentMethods/proofs
  // (all `onDelete: Cascade` in schema.prisma).
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "Customer not found");

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
}
