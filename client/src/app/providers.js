"use client";

import { useRef } from "react";
import { animate } from "framer-motion";
import { TransitionRouter } from "next-transition-router";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Two-layer curtain wipe (same structure as next-transition-router's own
// GSAP demo): fixed full-bleed panels slide up to cover the screen, then
// slide further up to reveal the new page. They're siblings of the page
// content (not a wrapping/transformed ancestor), so the fixed Navbar is
// never affected.
const DURATION = 0.5;
const OVERLAP = 0.5;
const EASE = "circInOut";

export function Providers({ children }) {
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const reduceMotion = useReducedMotion();

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        if (reduceMotion || !layer1Ref.current || !layer2Ref.current) {
          next();
          return;
        }
        const a1 = animate(
          layer1Ref.current,
          { y: ["100%", "0%"] },
          { duration: DURATION, ease: EASE },
        );
        const timer = setTimeout(() => {
          const a2 = animate(
            layer2Ref.current,
            { y: ["100%", "0%"] },
            { duration: DURATION, ease: EASE, onComplete: next },
          );
          layer2Ref.current.__controls = a2;
        }, DURATION * OVERLAP * 1000);

        return () => {
          a1.stop();
          clearTimeout(timer);
          layer2Ref.current?.__controls?.stop();
        };
      }}
      enter={(next) => {
        if (reduceMotion || !layer1Ref.current || !layer2Ref.current) {
          next();
          return;
        }
        const a2 = animate(
          layer2Ref.current,
          { y: ["0%", "-100%"] },
          { duration: DURATION, ease: EASE },
        );
        const timer = setTimeout(() => {
          const a1 = animate(
            layer1Ref.current,
            { y: ["0%", "-100%"] },
            { duration: DURATION, ease: EASE, onComplete: next },
          );
          layer1Ref.current.__controls = a1;
        }, DURATION * OVERLAP * 1000);

        return () => {
          a2.stop();
          clearTimeout(timer);
          layer1Ref.current?.__controls?.stop();
        };
      }}
    >
      {children}

      <div
        ref={layer1Ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-100 translate-y-full bg-primary"
      />
      <div
        ref={layer2Ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-100 translate-y-full bg-foreground"
      />
    </TransitionRouter>
  );
}
