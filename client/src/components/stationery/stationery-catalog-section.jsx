"use client";

import { useState } from "react";
import { ProductCatalogExplorer } from "@/components/products/product-catalog-explorer";
import { StationeryCategoryShowcase } from "@/components/stationery/stationery-category-showcase";

export function StationeryCatalogSection({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("all");

  function handleSelectCategory(slug) {
    setActiveCategory(slug);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <StationeryCategoryShowcase
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />
      <div id="catalog">
        <ProductCatalogExplorer
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
    </>
  );
}
