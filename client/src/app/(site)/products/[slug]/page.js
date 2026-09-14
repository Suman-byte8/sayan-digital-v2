import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/cta-section";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { RelatedProducts } from "@/components/products/related-products";
import { PRODUCT_CATALOG } from "@/constants/products-catalog";
import { STATIONERY_CATALOG } from "@/constants/stationery-catalog";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";

// Both catalogs (Sayan Digital printing + Sayan Stationery) share this one
// detail route/component instead of each getting their own — a slug is
// looked up across both, and "related products" stays within whichever
// catalog it was found in.
const CATALOGS = [PRODUCT_CATALOG, STATIONERY_CATALOG];

function findProduct(slug) {
  for (const catalog of CATALOGS) {
    const product = catalog.find((item) => item.key === slug);
    if (product) return { product, catalog };
  }
  return null;
}

export function generateStaticParams() {
  return CATALOGS.flat().map((product) => ({ slug: product.key }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = findProduct(slug);

  if (!found) {
    return { title: "Product Not Found — Sayan Digital", robots: { index: false, follow: true } };
  }

  const { product } = found;

  return buildMetadata({
    title: `${product.name} — Sayan Digital`,
    description: product.description,
    path: `/products/${product.key}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const found = findProduct(slug);

  if (!found) notFound();
  const { product, catalog } = found;

  const relatedProducts = catalog
    .filter(
      (item) => item.category === product.category && item.key !== product.key,
    )
    .slice(0, 4);

  const isStationery = catalog === STATIONERY_CATALOG;
  const catalogHref = isStationery ? "/stationery" : "/products";
  const catalogLabel = isStationery ? "Sayan Stationery" : "Products";
  const productPath = `/products/${product.key}`;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: catalogLabel, path: catalogHref },
            { name: product.name, path: productPath },
          ]),
          buildProductJsonLd(product, productPath),
        ]}
      />
      <main className="bg-background pt-24">
        <ProductDetailView
          product={product}
          catalogHref={catalogHref}
          catalogLabel={isStationery ? "Stationery" : "Products"}
        />
        <RelatedProducts products={relatedProducts} />
      </main>

      <CtaSection />
    </>
  );
}
