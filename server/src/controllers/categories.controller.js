import { prisma } from "../lib/prisma.js";
import { searchTaxonomy } from "../lib/taxonomy.js";
import { cached, invalidate } from "../lib/cache.js";

// Small, low-write-frequency (admin-only edits) list — a longer TTL plus
// active invalidation on write is cheap here, unlike the products list.
const CATEGORIES_TTL_SECONDS = 600;
const CATEGORIES_CACHE_KEY = "categories:list";

export async function listCategories(req, res) {
  const categories = await cached(CATEGORIES_CACHE_KEY, CATEGORIES_TTL_SECONDS, () =>
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  );
  res.json({ success: true, data: categories });
}

export async function createCategory(req, res) {
  const { name, source } = req.validated.body;

  // Dedupe case-insensitively (Postgres unique index on `name` is
  // case-sensitive, so "Mugs" and "mugs" wouldn't otherwise collide).
  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const category = await prisma.category.create({ data: { name, source } });
  await invalidate(CATEGORIES_CACHE_KEY);
  res.status(201).json({ success: true, data: category });
}

export async function deleteCategory(req, res) {
  const { id } = req.validated.params;
  await prisma.category.delete({ where: { id } });
  await invalidate(CATEGORIES_CACHE_KEY);
  res.status(204).send();
}

export async function searchTaxonomyCategories(req, res) {
  const { q } = req.validated.query;
  const results = searchTaxonomy(q);

  const existingNames = new Set(
    (
      await prisma.category.findMany({
        where: { name: { in: results.map((r) => r.name) } },
        select: { name: true },
      })
    ).map((c) => c.name.toLowerCase()),
  );

  res.json({
    success: true,
    data: results.map((r) => ({ ...r, alreadySaved: existingNames.has(r.name.toLowerCase()) })),
  });
}
