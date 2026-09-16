"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { profileApi } from "@/lib/auth-api";

const WishlistContext = createContext(null);

// Single source of truth for "what's in my wishlist" — the navbar badge,
// the heart button on every product card/detail page, and the profile
// page's Wishlist tab all read from this one place instead of each doing
// their own fetch, so toggling a heart anywhere updates everywhere.
export function WishlistProvider({ children }) {
  const { status, accessToken } = useAuth();
  // Raw fetched data — may still hold a previous session's items for a
  // moment after logout, which is why every read below goes through the
  // derived `items` (gated on `status`) rather than this directly.
  const [rawItems, setRawItems] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    profileApi.listWishlist(accessToken).then(({ data }) => {
      if (!cancelled) setRawItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, [status, accessToken]);

  const items = useMemo(() => (status === "authenticated" ? rawItems : []), [status, rawItems]);
  const productIds = useMemo(() => new Set(items.map((item) => item.product.id)), [items]);

  const add = useCallback(
    async (productId) => {
      const { data } = await profileApi.addWishlistItem(accessToken, productId);
      setRawItems((prev) => [data, ...prev.filter((item) => item.product.id !== productId)]);
      return data;
    },
    [accessToken],
  );

  const remove = useCallback(
    async (id) => {
      await profileApi.removeWishlistItem(accessToken, id);
      setRawItems((prev) => prev.filter((item) => item.id !== id));
    },
    [accessToken],
  );

  // Cards only know the productId, not the wishlist row's own id — this is
  // what the heart button actually calls.
  const toggleProduct = useCallback(
    async (productId) => {
      const existing = items.find((item) => item.product.id === productId);
      if (existing) await remove(existing.id);
      else await add(productId);
    },
    [items, add, remove],
  );

  const value = { items, loading: status === "loading", productIds, add, remove, toggleProduct };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
