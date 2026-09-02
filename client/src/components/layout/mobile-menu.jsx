"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, STATIONARY_LINK } from "@/constants/navigation";
import { BRAND } from "@/constants/brand";

export function MobileMenu({ open, onNavigate }) {
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
              href={STATIONARY_LINK.href}
              onClick={onNavigate}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.05, ease: "easeOut" }}
              className="py-3 text-[15px] font-semibold text-(--brand)"
            >
              {STATIONARY_LINK.label}
            </motion.a>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 1) * 0.05, ease: "easeOut" }}
              className="mt-4"
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
