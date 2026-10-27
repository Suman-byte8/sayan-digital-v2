"use client";

import { LazyMotion, domAnimation } from "framer-motion";

// Components use the slim `m.*` elements instead of `motion.*`, which bundle
// every feature (layout/projection, drag) whether used or not. domAnimation
// covers what the site uses: animate/exit, variants, hover/tap and
// whileInView. `strict` throws if a full `motion.*` component sneaks back in.
// Loaded synchronously (not a dynamic import) so the Hero's entrance
// animation doesn't wait on an extra network request.
export function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
