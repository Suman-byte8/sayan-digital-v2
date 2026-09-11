"use client";

import { useSyncExternalStore } from "react";

// A few px of slack for subpixel/zoom rounding and (on Lenis) momentum
// settling — otherwise "true bottom" can be a fraction of a pixel the
// browser never quite reports as reached.
const BOTTOM_TOLERANCE_PX = 48;

function subscribe(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getSnapshot() {
  const scrolledToBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  return scrolledToBottom >= pageHeight - BOTTOM_TOLERANCE_PX;
}

function getServerSnapshot() {
  return false;
}

export function usePageEnd() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
