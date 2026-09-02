"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants/navigation";

export function MobileMenu({ open, onNavigate }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-x-0 top-[72px] z-40 bg-[#0a0c0b]/95 backdrop-blur-lg lg:hidden"
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
                className="border-b border-white/10 py-3 text-[15px] text-white/80"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.05, ease: "easeOut" }}
              className="mt-4"
            >
              <Button variant="glass" className="h-auto w-full justify-center gap-2 py-3 text-[13px]">
                <Leaf size={16} stroke="#ff7a4a" />
                Reserve a table
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
