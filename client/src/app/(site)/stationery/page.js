import Link from "next/link";
import {
  ChevronRight,
  Gift,
  Home as HomeIcon,
  Palette,
  Truck,
} from "lucide-react";
import { CtaSection } from "@/components/sections/cta-section";
import { StationeryCatalogSection } from "@/components/stationery/stationery-catalog-section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { api } from "@/lib/api";
import { toCardProducts, deriveCategories } from "@/lib/product-view-model";

export const metadata = buildMetadata({
  title: "Sayan Stationery — Notebooks, Pens & Art Supplies in Malda",
  description:
    "Shop Sayan Stationery in Malda for notebooks, pens, files, art & craft supplies and office essentials — the everyday stationery line from Sayan Digital's studio.",
  path: "/stationery",
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Sayan Stationery", path: "/stationery" },
];

const TRUST_PILLS = [
  { icon: Truck, label: "Pan-Bengal Delivery" },
  { icon: Palette, label: "Personalization Available" },
  { icon: Gift, label: "Gift-Ready Packing" },
];

export default async function StationeryPage() {
  const { data } = await api.listProducts({ type: "STATIONERY" }).catch(() => ({ data: [] }));
  const products = toCardProducts(data);
  const categories = deriveCategories(products, "All Stationery");

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
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
            <span className="font-medium text-(--brand)">Sayan Stationery</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <Reveal>
                <p className="eyebrow-label">Sayan Stationery</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="heading-section mt-4">
                  Everyday stationery, <em className="italic">thoughtfully</em> made in Malda.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="body-copy mt-4">
                  Notebooks, pens, files, art supplies and gifting — the
                  everyday stationery line alongside our print studio, from the
                  same Malda workshop.
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
                  <span className="text-[12px] font-medium text-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <StationeryCatalogSection products={products} categories={categories} />

        <section className="container-premium pb-16">
          <Reveal className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-(--paper-muted) px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-serif text-2xl font-light text-foreground">
                Stocking up for school or office?
              </h2>
              <p className="body-copy mt-2">
                Bulk notebook, file and stationery kits — custom quoted for
                institutions and businesses.
              </p>
            </div>
            <Magnetic strength={0.3}>
              <Button
                className="h-auto shrink-0 gap-2 rounded-full px-6 py-3"
                data-cursor="hover"
                asChild
              >
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </Magnetic>
          </Reveal>
        </section>
      </main>

      <CtaSection />
    </>
  );
}
