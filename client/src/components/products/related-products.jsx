import { Reveal } from "@/components/motion/reveal";
import { CatalogProductCard } from "@/components/products/catalog-product-card";

export function RelatedProducts({ products }) {
  if (products.length === 0) return null;

  return (
    <section className="container-premium border-t border-border pt-10 pb-16">
      <Reveal>
        <h2 className="font-serif text-2xl font-light text-foreground">You May Also Like</h2>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.key} delay={i * 70}>
            <CatalogProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
