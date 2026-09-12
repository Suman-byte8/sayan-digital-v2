"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

// Not gated behind prefers-reduced-motion, same call as the crossing ribbon
// and footer wordmark: a single count-up on scroll is decorative, not
// disorienting, and gating it caused it to get stuck at 0 (see git history).
export function CountUpNumber({ target, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => Math.round(value).toLocaleString("en-IN"));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, target, duration, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
