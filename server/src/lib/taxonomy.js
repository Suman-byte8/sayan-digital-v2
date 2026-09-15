import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Google's public Product Taxonomy (google.com/basepages/producttype/
// taxonomy-with-ids.en-US.txt, 2021-09-21 snapshot, 5595 categories) —
// the same taxonomy Google Shopping and most e-commerce catalog
// integrations use, covering the same breadth as Amazon/Flipkart-style
// category trees. Loaded once into memory and searched locally rather
// than calling a live third-party API per keystroke (faster, and doesn't
// depend on an external service being up).
const TAXONOMY = JSON.parse(
  readFileSync(path.join(__dirname, "../data/product-taxonomy.json"), "utf8"),
);

// Ranks matches on the leaf category name first (an exact/prefix match on
// "Mugs" is more useful than a mid-path match on some unrelated category
// that merely contains "mug" in a parent segment).
export function searchTaxonomy(query, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = [];
  for (const entry of TAXONOMY) {
    const nameLower = entry.name.toLowerCase();
    let score;
    if (nameLower === q) score = 0;
    else if (nameLower.startsWith(q)) score = 1;
    else if (nameLower.includes(q)) score = 2;
    else if (entry.path.toLowerCase().includes(q)) score = 3;
    else continue;

    scored.push({ entry, score });
  }

  scored.sort((a, b) => a.score - b.score || a.entry.name.length - b.entry.name.length);
  return scored.slice(0, limit).map((s) => s.entry);
}
