import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/sections/product-card";
import { PRODUCT_SHOWCASE } from "@/constants/products-showcase";

export function ProductCategories() {
  return (
    <section id="products" className="section-padding scroll-mt-24 bg-(--paper-muted)">
      <div className="container-premium">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow-label">Our Products</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="heading-section mt-4">Customized for every occasion.</h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <Magnetic strength={0.3}>
              <Button variant="outline" className="gap-2 rounded-full" data-cursor="hover" asChild>
                <Link href="/products">
                  View All Products
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PRODUCT_SHOWCASE.map((product, i) => (
            <Reveal key={product.key} delay={(i % 4) * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
