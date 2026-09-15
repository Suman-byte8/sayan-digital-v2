// Seeds the managed category list with whatever categories are already in
// use by existing products (so "Manage Categories" isn't empty on first
// visit) — safe to re-run, upserts by name.
import { prisma } from "../src/lib/prisma.js";

async function seed() {
  const products = await prisma.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  const names = [...new Set(products.map((p) => p.category).filter(Boolean))];

  for (const name of names) {
    await prisma.category.upsert({
      where: { name },
      create: { name, source: "custom" },
      update: {},
    });
  }

  console.log(`Seeded ${names.length} categories from existing products.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
