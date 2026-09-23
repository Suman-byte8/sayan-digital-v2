import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { formatVariantLabel } from "../lib/product-variants.js";

function serializeItem(item) {
  return {
    id: item.id,
    quantity: item.quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: { ...item.product, price: Number(item.product.price) },
    variant: item.variant
      ? {
          ...item.variant,
          price: item.variant.price != null ? Number(item.variant.price) : null,
        }
      : null,
    variantLabel: item.variant ? formatVariantLabel(item.variant.selection) : null,
  };
}

export async function listCart(req, res) {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true, variant: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: items.map(serializeItem) });
}

// Adding an already-cart'd product+variant increments its quantity rather
// than resetting it — matches the "Add to Cart" button being clickable
// again to add more, same as most storefronts. Caps at the variant's stock
// (or the product's, for non-variant products) so a customer can't request
// more than what's actually in stock; cart itself doesn't reserve/decrement
// stock, only a real order would.
export async function addCartItem(req, res) {
  const { productId, variantId, quantity } = req.validated.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { where: { isActive: true } } },
  });
  if (!product) throw new ApiError(404, "Product not found");
  if (!product.isActive) throw new ApiError(400, "This product is currently unavailable.");

  if (product.variants.length > 0 && !variantId) {
    throw new ApiError(400, "Please select options for this product.");
  }

  let variant = null;
  if (variantId) {
    variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new ApiError(404, "Selected variant not found.");
    // Unlike Product.stock (where 0 conventionally means "untracked,
    // made-to-order" for this business), variant stock is real inventory
    // the user explicitly wants enforced — 0 genuinely means sold out.
    if (variant.stock <= 0) throw new ApiError(400, "This option is currently out of stock.");
  }

  // Always variantId when one is chosen, else the product itself — see the
  // CartItem.variantKey comment in schema.prisma for why this can't just
  // be variantId directly (NULL != NULL breaks per-product uniqueness).
  const variantKey = variantId ?? productId;
  const stockLimit = variant ? variant.stock : product.stock;

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId_variantKey: { userId: req.userId, productId, variantKey } },
  });

  const requestedQuantity = (existing?.quantity ?? 0) + quantity;
  const cappedQuantity = stockLimit > 0 ? Math.min(requestedQuantity, stockLimit) : requestedQuantity;

  const item = await prisma.cartItem.upsert({
    where: { userId_productId_variantKey: { userId: req.userId, productId, variantKey } },
    create: { userId: req.userId, productId, variantId: variantId ?? null, variantKey, quantity: cappedQuantity },
    update: { quantity: cappedQuantity },
    include: { product: true, variant: true },
  });

  res.status(201).json({ success: true, data: serializeItem(item) });
}

export async function updateCartItem(req, res) {
  const { id } = req.validated.params;
  const { quantity } = req.validated.body;

  const existing = await prisma.cartItem.findFirst({
    where: { id, userId: req.userId },
    include: { product: true, variant: true },
  });
  if (!existing) throw new ApiError(404, "Cart item not found");

  if (existing.variant && existing.variant.stock <= 0) {
    throw new ApiError(400, "This option is out of stock — remove it from your cart.");
  }

  const stockLimit = existing.variant ? existing.variant.stock : existing.product.stock;
  const cappedQuantity = stockLimit > 0 ? Math.min(quantity, stockLimit) : quantity;

  const item = await prisma.cartItem.update({
    where: { id },
    data: { quantity: cappedQuantity },
    include: { product: true, variant: true },
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
