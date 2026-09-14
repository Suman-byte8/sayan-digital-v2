import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { RelatedProducts } from "@/components/products/related-products";
import { PRODUCT_CATALOG } from "@/constants/products-catalog";

export function generateStaticParams() {
  return PRODUCT_CATALOG.map((product) => ({ slug: product.key }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = PRODUCT_CATALOG.find((item) => item.key === slug);

  if (!product) {
    return { title: "Product Not Found — Sayan Digital" };
  }

  return {
    title: `${product.name} — Sayan Digital`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = PRODUCT_CATALOG.find((item) => item.key === slug);

  if (!product) notFound();

  const relatedProducts = PRODUCT_CATALOG.filter(
    (item) => item.category === product.category && item.key !== product.key
  ).slice(0, 4);

  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <ProductDetailView product={product} />
        <RelatedProducts products={relatedProducts} />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
