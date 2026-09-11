"use client";

import { motion } from "framer-motion";
import { usePageEnd } from "@/hooks/use-page-end";

// The "L" (last letter of DIGITAL) lifts once the user actually scrolls to
// the very bottom of the page (usePageEnd) and settles back down the
// moment they scroll away — a single rise/fall, not a continuous loop.
// Not gated behind prefers-reduced-motion, same call as the crossing
// ribbon marquee: one letter moving once is decorative, not disorienting.
export function FooterWordmark() {
  const atPageEnd = usePageEnd();

  return (
    <div className="w-full overflow-hidden border-t border-border py-4 select-none sm:py-8">
      <p
        aria-hidden="true"
        className="flex items-center justify-center whitespace-nowrap text-[12.5vw] leading-none font-bold tracking-[-0.01em] text-foreground sm:text-[12vw]"
      >
        <span>SAYAN&nbsp;DIGITA</span>
        <motion.span
          className="inline-block"
          animate={{ y: atPageEnd ? "-14%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          L
        </motion.span>
      </p>
      <span className="sr-only">Sayan Digital</span>
    </div>
  );
}
