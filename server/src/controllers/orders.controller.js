import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

function serializeOrder(order) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export async function listOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: orders.map(serializeOrder) });
}

// Human-referenceable (a small business owner reads this back over
// WhatsApp/phone) — date plus enough random entropy that a collision is
// practically impossible without needing a retry loop.
function generateOrderNumber() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SD${date}-${suffix}`;
}

// Creates a real Order + snapshotted OrderItems from the user's current
// cart, then clears it — the cart-to-order transition. Prices are always
// recomputed from the live Product rows here, never trusted from the
// client, so a tampered request body can't under-charge an order.
export async function createOrder(req, res) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
  });
  if (cartItems.length === 0) throw new ApiError(400, "Your cart is empty.");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: req.userId,
        orderNumber: generateOrderNumber(),
        totalAmount,
        paymentMethod: req.validated.body.paymentMethod,
        shippingName: req.validated.body.shippingName,
        shippingPhone: req.validated.body.shippingPhone,
        shippingAddressLine1: req.validated.body.shippingAddressLine1,
        shippingAddressLine2: req.validated.body.shippingAddressLine2,
        shippingCity: req.validated.body.shippingCity,
        shippingState: req.validated.body.shippingState,
        shippingPincode: req.validated.body.shippingPincode,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            image: item.product.images?.[0] ?? null,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cartItem.deleteMany({ where: { userId: req.userId } });

    return created;
  });

  res.status(201).json({ success: true, data: serializeOrder(order) });
}
