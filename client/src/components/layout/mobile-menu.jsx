"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, STATIONERY_LINK } from "@/constants/navigation";
import { BRAND } from "@/constants/brand";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export function MobileMenu({ open, onNavigate }) {
  const { items: wishlistItems } = useWishlist();
  const { count: cartCount } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 pt-20 shadow-premium backdrop-blur-lg lg:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={onNavigate}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                className="border-b border-border py-3 text-[15px] text-foreground/80"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href={STATIONERY_LINK.href}
              onClick={onNavigate}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.05, ease: "easeOut" }}
              className="py-3 text-[15px] font-semibold text-(--brand)"
            >
              {STATIONERY_LINK.label}
            </motion.a>

            <motion.a
              href="/profile?tab=wishlist"
              onClick={onNavigate}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 0.5) * 0.05, ease: "easeOut" }}
              className="flex items-center justify-between border-t border-border/70 py-3 text-[15px] font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} />
                Wishlist
              </span>
              {wishlistItems.length > 0 && (
                <span className="rounded-full bg-(--brand)/10 px-2 py-0.5 text-[11px] font-semibold text-(--brand)">
                  {wishlistItems.length}
                </span>
              )}
            </motion.a>

            <motion.a
              href="/cart"
              onClick={onNavigate}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 0.75) * 0.05, ease: "easeOut" }}
              className="flex items-center justify-between border-b border-border/70 py-3 text-[15px] font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="rounded-full bg-(--brand)/10 px-2 py-0.5 text-[11px] font-semibold text-(--brand)">
                  {cartCount}
                </span>
              )}
            </motion.a>

            <motion.a
              href="/profile"
              onClick={onNavigate}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 1) * 0.05, ease: "easeOut" }}
              className="flex items-center justify-between py-3 text-[15px] font-medium text-foreground"
            >
              <span>My Account & Orders</span>
              <span className="rounded-full bg-(--brand)/10 px-2 py-0.5 text-[11px] font-semibold text-(--brand)">
                VIP
              </span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 1.25) * 0.05, ease: "easeOut" }}
              className="mt-3"
            >
              <Button className="h-auto w-full justify-center gap-2 rounded-full py-3 text-[13px]">
                <ShoppingBag size={16} />
                {BRAND.navCta}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
