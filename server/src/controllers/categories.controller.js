import { prisma } from "../lib/prisma.js";
import { searchTaxonomy } from "../lib/taxonomy.js";

export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
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
  res.status(201).json({ success: true, data: category });
}

export async function deleteCategory(req, res) {
  const { id } = req.validated.params;
  await prisma.category.delete({ where: { id } });
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
