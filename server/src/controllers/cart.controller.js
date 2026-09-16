import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

function serializeItem(item) {
  return {
    id: item.id,
    quantity: item.quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: { ...item.product, price: Number(item.product.price) },
  };
}

export async function listCart(req, res) {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: items.map(serializeItem) });
}

// Adding an already-cart'd product increments its quantity rather than
// resetting it — matches the "Add to Cart" button being clickable again to
// add more, same as most storefronts. Caps at Product.stock (when tracked)
// so a customer can't request more than what's actually in stock; cart
// itself doesn't reserve/decrement stock, only a real order would.
export async function addCartItem(req, res) {
  const { productId, quantity } = req.validated.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");
  if (!product.isActive) throw new ApiError(400, "This product is currently unavailable.");

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.userId, productId } },
  });

  const requestedQuantity = (existing?.quantity ?? 0) + quantity;
  const cappedQuantity = product.stock > 0 ? Math.min(requestedQuantity, product.stock) : requestedQuantity;

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.userId, productId } },
    create: { userId: req.userId, productId, quantity: cappedQuantity },
    update: { quantity: cappedQuantity },
    include: { product: true },
  });

  res.status(201).json({ success: true, data: serializeItem(item) });
}

export async function updateCartItem(req, res) {
  const { id } = req.validated.params;
  const { quantity } = req.validated.body;

  const existing = await prisma.cartItem.findFirst({
    where: { id, userId: req.userId },
    include: { product: true },
  });
  if (!existing) throw new ApiError(404, "Cart item not found");

  const cappedQuantity =
    existing.product.stock > 0 ? Math.min(quantity, existing.product.stock) : quantity;

  const item = await prisma.cartItem.update({
    where: { id },
    data: { quantity: cappedQuantity },
    include: { product: true },
  });

  res.json({ success: true, data: serializeItem(item) });
}

export async function removeCartItem(req, res) {
  const { id } = req.validated.params;
  const { count } = await prisma.cartItem.deleteMany({ where: { id, userId: req.userId } });
  if (count === 0) throw new ApiError(404, "Cart item not found");
  res.status(204).send();
}

export async function clearCart(req, res) {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
  res.status(204).send();
}
