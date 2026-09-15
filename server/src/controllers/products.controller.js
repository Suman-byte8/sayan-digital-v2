import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

// Prisma returns `price` as a Decimal instance; convert to a plain number
// for a predictable JSON shape for API consumers.
function serializeProduct(product) {
  return { ...product, price: Number(product.price) };
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

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: items.map(serializeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
}

export async function getProduct(req, res) {
  const { id } = req.validated.params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: serializeProduct(product) });
}

export async function getProductBySlug(req, res) {
  const { slug } = req.validated.params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: serializeProduct(product) });
}

export async function createProduct(req, res) {
  const product = await prisma.product.create({ data: req.validated.body });
  res.status(201).json({ success: true, data: serializeProduct(product) });
}

export async function updateProduct(req, res) {
  const { id } = req.validated.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.validated.body,
  });
  res.json({ success: true, data: serializeProduct(product) });
}

export async function deleteProduct(req, res) {
  const { id } = req.validated.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}
