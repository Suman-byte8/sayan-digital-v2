import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { bumpVersion, cached, cachedVersioned, invalidate } from "../lib/cache.js";
import { computeSelectionKey, validateVariantPayload } from "../lib/product-variants.js";

const VARIANT_INCLUDE = {
  variantOptions: { orderBy: { position: "asc" } },
  variants: { orderBy: { position: "asc" } },
};

// Prisma returns `price`/variant `price` as Decimal instances; convert to
// plain numbers for a predictable JSON shape. Every existing non-variant
// product gets variantOptions: [] / variants: [] here rather than the
// fields being absent, so nothing consuming this response needs to guard
// against them being undefined.
function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    variantOptions: product.variantOptions ?? [],
    variants: (product.variants ?? []).map((v) => ({
      ...v,
      price: v.price != null ? Number(v.price) : null,
    })),
  };
}

// List keys embed a "products" version that every create/update/delete
// bumps (see lib/cache.js), so a catalog edit shows up in listings right
// away instead of after a TTL — which also lets the TTL be much longer.
const LIST_TTL_SECONDS = 300;
// Individual product lookups (id/slug) have exact, cheap-to-invalidate
// keys, so these ARE actively invalidated on write, on top of a longer TTL.
const PRODUCT_TTL_SECONDS = 300;

function listCacheKey(query) {
  const { page, limit, category, search, type, isActive } = query;
  return `list:${JSON.stringify({ page, limit, category, search, type, isActive })}`;
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

  const body = await cachedVersioned("products", listCacheKey(req.validated.query), LIST_TTL_SECONDS, async () => {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: VARIANT_INCLUDE,
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
    const found = await prisma.product.findUnique({ where: { id }, include: VARIANT_INCLUDE });
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
    const found = await prisma.product.findUnique({ where: { slug }, include: VARIANT_INCLUDE });
    return found ? serializeProduct(found) : null;
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req, res) {
  const { variantOptions, variants, ...productFields } = req.validated.body;
  validateVariantPayload(variantOptions, variants);

  const product = await prisma.product.create({
    data: {
      ...productFields,
      ...(variantOptions
        ? { variantOptions: { create: variantOptions.map((opt, i) => ({ ...opt, position: i })) } }
        : {}),
      ...(variants
        ? {
            variants: {
              create: variants.map(({ id: _id, selection, ...rest }, i) => ({
                ...rest,
                selection,
                selectionKey: computeSelectionKey(selection),
                position: i,
              })),
            },
          }
        : {}),
    },
    include: VARIANT_INCLUDE,
  });
  await bumpVersion("products");
  res.status(201).json({ success: true, data: serializeProduct(product) });
}

export async function updateProduct(req, res) {
  const { id } = req.validated.params;
  const { variantOptions, variants, ...productFields } = req.validated.body;

  // Needed to invalidate the OLD slug's cache key too, if slug is changing.
  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) throw new ApiError(404, "Product not found");

  validateVariantPayload(variantOptions, variants);

  const product = await prisma.$transaction(async (tx) => {
    if (variantOptions) {
      // Nothing else FKs to these rows, so a full replace is safe.
      await tx.productVariantOption.deleteMany({ where: { productId: id } });
      await tx.productVariantOption.createMany({
        data: variantOptions.map((opt, i) => ({ ...opt, productId: id, position: i })),
      });
    }

    if (variants) {
      // Reconcile by id instead of delete-and-recreate: a customer's cart
      // may hold a live CartItem pointing at a variant that isn't changing
      // in this save, and recreating it under a new id would cascade-delete
      // that cart line just because the admin edited a different row.
      const incomingIds = variants.filter((v) => v.id).map((v) => v.id);

      await tx.productVariant.deleteMany({
        where: { productId: id, id: { notIn: incomingIds.length > 0 ? incomingIds : ["__none__"] } },
      });

      for (const [i, { id: variantId, selection, ...rest }] of variants.entries()) {
        const data = { ...rest, selection, selectionKey: computeSelectionKey(selection), position: i };
        if (variantId) {
          await tx.productVariant.update({ where: { id: variantId }, data });
        } else {
          await tx.productVariant.create({ data: { ...data, productId: id } });
        }
      }
    }

    return tx.product.update({ where: { id }, data: productFields, include: VARIANT_INCLUDE });
  });

  await Promise.all([
    invalidate(`product:id:${id}`, `product:slug:${existing.slug}`, `product:slug:${product.slug}`),
    bumpVersion("products"),
  ]);
  res.json({ success: true, data: serializeProduct(product) });
}

export async function deleteProduct(req, res) {
  const { id } = req.validated.params;
  const product = await prisma.product.delete({ where: { id } });
  await Promise.all([
    invalidate(`product:id:${id}`, `product:slug:${product.slug}`),
    bumpVersion("products"),
  ]);
  res.status(204).send();
}
