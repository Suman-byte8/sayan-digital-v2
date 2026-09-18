"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { profileApi } from "@/lib/auth-api";

const CartContext = createContext(null);

// Same "seed once, circulate everywhere via context" pattern as
// AuthContext/WishlistContext — the navbar badge, the cart page, and the
// PDP's Add to Cart button all share this one fetched-once list instead of
// each fetching independently.
export function CartProvider({ children }) {
  const { status, accessToken } = useAuth();
  // Raw fetched data — may still hold a previous session's items for a
  // moment after logout, which is why every read below goes through the
  // derived `items` (gated on `status`) rather than this directly.
  const [rawItems, setRawItems] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    profileApi.listCart(accessToken).then(({ data }) => {
      if (!cancelled) setRawItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, [status, accessToken]);

  const items = useMemo(() => (status === "authenticated" ? rawItems : []), [status, rawItems]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const { data } = await profileApi.addCartItem(accessToken, productId, quantity);
      setRawItems((prev) => [data, ...prev.filter((item) => item.id !== data.id)]);
      return data;
    },
    [accessToken],
  );

  const updateItem = useCallback(
    async (id, quantity) => {
      const { data } = await profileApi.updateCartItem(accessToken, id, quantity);
      setRawItems((prev) => prev.map((item) => (item.id === id ? data : item)));
      return data;
    },
    [accessToken],
  );

  const removeItem = useCallback(
    async (id) => {
      await profileApi.removeCartItem(accessToken, id);
      setRawItems((prev) => prev.filter((item) => item.id !== id));
    },
    [accessToken],
  );

  const clearCart = useCallback(async () => {
    await profileApi.clearCart(accessToken);
    setRawItems([]);
  }, [accessToken]);

  // Distinct products in the cart, not the summed quantity — e.g. adding
  // one product 3 times is still "1" here, not "3".
  const count = items.length;
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const value = {
    items,
    loading: status === "loading",
    count,
    subtotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
