// Adapts a raw API product (server's shape: images[], minOrderQty, unit,
// badge, category as free text) into the prop shape the existing product
// UI components were already built around (CatalogProductCard,
// ProductDetailView, ProductCard, RelatedProducts) — key/categoryLabel/
// minQty-as-formatted-string/image-singular/etc. Keeping this mapping in
// one place meant zero changes to those already-designed, already-tested
// components when the data source switched from static constants to the
// live API.
const FALLBACK_IMAGE = "/assets/sayan_digital_logo.png";

export function toCardProduct(product) {
  const unit = product.unit || "pc";
  const hasMinQty = Boolean(product.minOrderQty);

  return {
    id: product.id,
    key: product.slug,
    name: product.name,
    description: product.description ?? "",
    category: product.category ?? "",
    categoryLabel: product.category ?? "",
    badge: product.badge || undefined,
    badgeTone: "accent",
    price: product.price,
    unit,
    minQty: hasMinQty ? `Min: ${product.minOrderQty} ${unit}` : `Min: 1 ${unit}`,
    minQtyTone: hasMinQty && product.minOrderQty > 1 ? "strong" : "plain",
    image: product.images?.[0] || FALLBACK_IMAGE,
    // Every Sayan Digital product is personalization-friendly by nature of
    // the business — used only by the homepage teaser's "Customizable" tag.
    customizable: true,
  };
}

export function toCardProducts(products) {
  return products.map(toCardProduct);
}

// Derives filter-tab categories from whatever categories are actually in
// use, instead of a hardcoded taxonomy that drifts out of sync with what
// the admin panel actually creates.
export function deriveCategories(products, allLabel) {
  const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
  return [{ slug: "all", label: allLabel }, ...unique.map((c) => ({ slug: c, label: c }))];
}
