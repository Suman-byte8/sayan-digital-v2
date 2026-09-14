import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Palette, ShieldCheck, Truck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { ProductCatalogExplorer } from "@/components/products/product-catalog-explorer";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { CATEGORIES, PRODUCT_CATALOG } from "@/constants/products-catalog";

export const metadata = {
  title: "Products — Sayan Digital",
  description:
    "Browse Sayan Digital's full catalog of customized printing products — mugs, ID cards, corporate gifts, apparel, trophies, stationery and more.",
};

const TRUST_PILLS = [
  { icon: Truck, label: "Pan-Bengal Delivery" },
  { icon: Palette, label: "Free Digital Proof" },
  { icon: ShieldCheck, label: "Quality Checked" },
];

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <section className="container-premium pt-8 pb-6 md:pt-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-(--brand)"
            >
              <HomeIcon size={13} />
              Home
            </Link>
            <ChevronRight size={13} />
            <span className="font-medium text-(--brand)">Products</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <Reveal>
                <p className="eyebrow-label">Our Products</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="heading-section mt-4">
                  Made to be <em className="italic">personal</em>.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="body-copy mt-4">
                  Explore our collection of custom-crafted drinkware, apparel, corporate
                  identity, trophies and keepsakes — personalized right here in Malda.
                </p>
              </Reveal>
            </div>

            <Reveal delay={200} className="flex flex-wrap gap-2.5">
              {TRUST_PILLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-premium"
                >
                  <Icon size={16} className="text-(--brand)" />
                  <span className="text-[12px] font-medium text-foreground">{label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <ProductCatalogExplorer products={PRODUCT_CATALOG} categories={CATEGORIES} />

        <section className="container-premium pb-16">
          <Reveal className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-(--paper-muted) px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-serif text-2xl font-light text-foreground">
                Need it in bulk for your business?
              </h2>
              <p className="body-copy mt-2">
                Corporate gifting, ID kits and event merchandise — custom quoted for any order
                size.
              </p>
            </div>
            <Magnetic strength={0.3}>
              <Button
                className="h-auto shrink-0 gap-2 rounded-full px-6 py-3"
                data-cursor="hover"
                asChild
              >
                <Link href="/#contact">Request a Quote</Link>
              </Button>
            </Magnetic>
          </Reveal>
        </section>
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
