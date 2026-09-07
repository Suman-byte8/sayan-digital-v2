"use client";

import { useSyncExternalStore } from "react";

// SSR-safe replacement for a useState+IntersectionObserver effect — avoids
// a synchronous setState-in-effect and follows the same useSyncExternalStore
// pattern as use-media-query.js, so there's no hydration mismatch.
function subscribe(callback) {
  const sentinel = document.getElementById("hero-end-sentinel");
  if (!sentinel) return () => {};

  const observer = new IntersectionObserver(callback, { threshold: 0 });
  observer.observe(sentinel);
  return () => observer.disconnect();
}

function getSnapshot() {
  const sentinel = document.getElementById("hero-end-sentinel");
  // No sentinel means this page has no Hero to render transparently over
  // (e.g. /products) — the navbar should always render solid there.
  if (!sentinel) return true;
  // isIntersecting alone can't tell "not yet scrolled to" from "already
  // scrolled past" — boundingClientRect.top's sign disambiguates.
  return sentinel.getBoundingClientRect().top < 0;
}

function getServerSnapshot() {
  return false;
}

export function useNavbarSolid() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
