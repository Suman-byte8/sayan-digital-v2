"use client";

import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";

// Scoped `dark` class so the (site-wide light-only) component reads its
// dark-mode styling here without a global dark-mode toggle.
export function CtaHoleBackground() {
  return (
    <div className="dark absolute inset-0 z-0" aria-hidden>
      <HoleBackground className="size-full" strokeColor="#6c86d1" haloColor="#2f5fd6" />
    </div>
  );
}
