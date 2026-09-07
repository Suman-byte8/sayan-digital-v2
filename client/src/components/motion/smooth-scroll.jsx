"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Lenis smooths native window scrolling (no transform-based wrapper), so it
// stays compatible with the Hero's `position: fixed` video and the fixed
// navbar. Skipped entirely under prefers-reduced-motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Anchor links (navbar, mobile menu, in-page CTAs) are plain
    // `href="#id"` tags — Lenis doesn't intercept these on its own.
    // `scrollTo` respects each target's CSS `scroll-margin-top`, so the
    // existing `scroll-mt-*` classes on sections still apply.
    function onClick(event) {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
