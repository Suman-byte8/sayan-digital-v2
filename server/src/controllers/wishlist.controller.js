import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

function serializeItem(item) {
  return {
    id: item.id,
    createdAt: item.createdAt,
    product: { ...item.product, price: Number(item.product.price) },
  };
}

export async function listWishlist(req, res) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: items.map(serializeItem) });
}

export async function addWishlistItem(req, res) {
  const { productId } = req.validated.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.userId, productId } },
    create: { userId: req.userId, productId },
    update: {},
    include: { product: true },
  });
  res.status(201).json({ success: true, data: serializeItem(item) });
}

export async function removeWishlistItem(req, res) {
  const { id } = req.validated.params;
  const { count } = await prisma.wishlistItem.deleteMany({ where: { id, userId: req.userId } });
  if (count === 0) throw new ApiError(404, "Wishlist item not found");
  res.status(204).send();
}
