"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";

const ProductsContext = createContext(null);

// Single client-side source of truth for product data: seeded once from a
// server-side fetch (so the initial HTML/SEO is correct — see
// app/(site)/layout.js), then held in memory for the rest of the session
// so any client component anywhere can read it without prop-drilling or
// re-fetching. A product looked up by slug that isn't in the initial list
// (e.g. one created after this page load) is fetched once and cached here,
// not re-fetched on every read.
export function ProductsProvider({ initialPrinting, initialStationery, children }) {
  const [printingProducts] = useState(initialPrinting);
  const [stationeryProducts] = useState(initialStationery);
  const [extraProducts, setExtraProducts] = useState({});
  const pendingFetches = useRef(new Map());

  const allProducts = useMemo(
    () => [...printingProducts, ...stationeryProducts, ...Object.values(extraProducts)],
    [printingProducts, stationeryProducts, extraProducts],
  );

  const getProductBySlug = useCallback(
    async (slug) => {
      const cached = allProducts.find((p) => p.slug === slug);
      if (cached) return cached;

      if (pendingFetches.current.has(slug)) {
        return pendingFetches.current.get(slug);
      }

      const fetchPromise = api
        .getProductBySlug(slug)
        .then((result) => {
          setExtraProducts((prev) => ({ ...prev, [slug]: result.data }));
          return result.data;
        })
        .finally(() => pendingFetches.current.delete(slug));

      pendingFetches.current.set(slug, fetchPromise);
      return fetchPromise;
    },
    [allProducts],
  );

  const value = useMemo(
    () => ({ printingProducts, stationeryProducts, allProducts, getProductBySlug }),
    [printingProducts, stationeryProducts, allProducts, getProductBySlug],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
