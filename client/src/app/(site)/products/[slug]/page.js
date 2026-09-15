import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/cta-section";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { RelatedProducts } from "@/components/products/related-products";
import { api, ApiRequestError } from "@/lib/api";
import { toCardProduct, toCardProducts } from "@/lib/product-view-model";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";

async function fetchProductBySlug(slug) {
  try {
    const { data } = await api.getProductBySlug(slug);
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await api.listProducts({});
    return data.map((product) => ({ slug: product.slug }));
  } catch {
    // Backend unreachable at build time — fall back to on-demand rendering
    // for every slug instead of failing the whole build.
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug).catch(() => null);

  if (!product) {
    return { title: "Product Not Found — Sayan Digital", robots: { index: false, follow: true } };
  }

  const card = toCardProduct(product);

  return buildMetadata({
    title: `${product.name} — Sayan Digital`,
    description: product.description ?? card.description,
    path: `/products/${product.slug}`,
    image: card.image,
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  const isStationery = product.type === "STATIONERY";
  const catalogHref = isStationery ? "/stationery" : "/products";
  const catalogLabel = isStationery ? "Sayan Stationery" : "Products";
  const productPath = `/products/${product.slug}`;
  const card = toCardProduct(product);

  const { data: sameCategory } = await api
    .listProducts({ type: product.type, category: product.category ?? undefined })
    .catch(() => ({ data: [] }));

  const relatedProducts = toCardProducts(
    sameCategory.filter((item) => item.slug !== product.slug).slice(0, 4),
  );

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: catalogLabel, path: catalogHref },
            { name: product.name, path: productPath },
          ]),
          buildProductJsonLd(card, productPath),
        ]}
      />
      <main className="bg-background pt-24">
        <ProductDetailView
          product={card}
          catalogHref={catalogHref}
          catalogLabel={isStationery ? "Stationery" : "Products"}
        />
        <RelatedProducts products={relatedProducts} />
      </main>

      <CtaSection />
    </>
  );
}
