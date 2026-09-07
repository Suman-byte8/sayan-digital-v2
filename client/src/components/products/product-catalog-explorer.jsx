"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CatalogProductCard } from "@/components/products/catalog-product-card";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function ProductCatalogExplorer({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let items = products;

    if (activeCategory !== "all") {
      items = items.filter((product) => product.category === activeCategory);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      items = items.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    if (sort === "price-low") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [products, activeCategory, search, sort]);

  return (
    <>
      <div className="sticky top-20 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-premium flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                data-cursor="hover"
                onClick={() => setActiveCategory(category.slug)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all",
                  activeCategory === category.slug
                    ? "bg-(--brand) text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search catalog..."
                className="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-[13px] text-foreground outline-none transition-shadow focus:ring-2 focus:ring-(--brand)/20 sm:w-56"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                data-cursor="hover"
                className="appearance-none rounded-lg border border-border bg-card py-2 pr-8 pl-3 text-[13px] font-medium text-foreground outline-none focus:ring-2 focus:ring-(--brand)/20"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-premium py-12">
        <p className="mb-6 text-[13px] text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
          {products.length} products
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <Reveal key={product.key} delay={(i % 4) * 60} className="h-full">
                <CatalogProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </div>
    </>
  );
}
