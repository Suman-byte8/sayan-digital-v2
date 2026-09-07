"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";

// Lenis smooths native window scrolling (no transform-based wrapper), so it
// stays compatible with the Hero's `position: fixed` video and the fixed
// navbar. Skipped entirely under prefers-reduced-motion.
export function SmoothScroll() {
  const router = useRouter();

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
      event.preventDefault();
      if (!target) {
        // The section lives on the homepage but we're on a different route
        // (e.g. clicking "About" from /products) — client-side navigate;
        // Next.js's router scrolls to the hash once the route lands.
        router.push(`/${id}`);
        return;
      }
      lenis.scrollTo(target);
    }
    document.addEventListener("click", onClick);

    // Landing on a page with a hash in the URL (e.g. arriving at "/#about"
    // from another page) — snap straight to it instead of visibly scrolling
    // down from the top, matching native browser anchor-load behavior.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() => lenis.scrollTo(target, { immediate: true }));
      }
    }

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [router]);

  return null;
}
