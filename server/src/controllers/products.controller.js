import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { cached, invalidate } from "../lib/cache.js";

// Prisma returns `price` as a Decimal instance; convert to a plain number
// for a predictable JSON shape for API consumers.
function serializeProduct(product) {
  return { ...product, price: Number(product.price) };
}

// List queries have many possible filter/page combinations, so rather than
// track every cached variant to invalidate on a write (which would cost
// extra Redis commands on every read just to check a "version" key), this
// just uses a short TTL and lets each cached listing self-expire — a
// product edit becomes visible in a catalog listing within a minute,
// which is an acceptable trade for a small business catalog and keeps
// every read down to exactly one Redis command.
const LIST_TTL_SECONDS = 60;
// Individual product lookups (id/slug) have exact, cheap-to-invalidate
// keys, so these ARE actively invalidated on write, on top of a longer TTL.
const PRODUCT_TTL_SECONDS = 300;

function listCacheKey(query) {
  const { page, limit, category, search, type, isActive } = query;
  return `products:list:${JSON.stringify({ page, limit, category, search, type, isActive })}`;
}

export async function listProducts(req, res) {
  const { page, limit, category, search, type, isActive } = req.validated.query;

  const where = {
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" } }
      : {}),
  };

  const body = await cached(listCacheKey(req.validated.query), LIST_TTL_SECONDS, async () => {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: items.map(serializeProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  });

  res.json(body);
}

export async function getProduct(req, res) {
  const { id } = req.validated.params;

  const product = await cached(`product:id:${id}`, PRODUCT_TTL_SECONDS, async () => {
    const found = await prisma.product.findUnique({ where: { id } });
    return found ? serializeProduct(found) : null;
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: product });
}

export async function getProductBySlug(req, res) {
  const { slug } = req.validated.params;

  const product = await cached(`product:slug:${slug}`, PRODUCT_TTL_SECONDS, async () => {
    const found = await prisma.product.findUnique({ where: { slug } });
    return found ? serializeProduct(found) : null;
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req, res) {
  const product = await prisma.product.create({ data: req.validated.body });
  res.status(201).json({ success: true, data: serializeProduct(product) });
}

export async function updateProduct(req, res) {
  const { id } = req.validated.params;

  // Needed to invalidate the OLD slug's cache key too, if slug is changing.
  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) throw new ApiError(404, "Product not found");

  const product = await prisma.product.update({
    where: { id },
    data: req.validated.body,
  });

  await invalidate(`product:id:${id}`, `product:slug:${existing.slug}`, `product:slug:${product.slug}`);
  res.json({ success: true, data: serializeProduct(product) });
}

export async function deleteProduct(req, res) {
  const { id } = req.validated.params;
  const product = await prisma.product.delete({ where: { id } });
  await invalidate(`product:id:${id}`, `product:slug:${product.slug}`);
  res.status(204).send();
}
