"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  a: motion.a,
  h1: motion.h1,
  p: motion.p,
};

const INITIAL = { opacity: 0, filter: "blur(20px)", y: 40 };
const ANIMATE = { opacity: 1, filter: "blur(0px)", y: 0 };

export function FadeUp({ as = "div", delay = 0, className, children, ...props }) {
  // Read after mount, not during render: `initial`/`animate` must stay
  // identical between server and client on the first paint, or a visitor
  // with OS-level reduced motion enabled gets a hydration mismatch (the
  // server always renders the full-motion branch since it has no window).
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const onChange = (event) => setReduceMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const MotionTag = MOTION_TAGS[as] ?? motion.div;
  const delaySeconds = delay / 1000;

  const transition = reduceMotion
    ? {
        opacity: { duration: 0.6, delay: delaySeconds, ease: "easeOut" },
        filter: { duration: 0 },
        y: { duration: 0 },
      }
    : { duration: 1.4, delay: delaySeconds, ease: "easeOut" };

  return (
    <MotionTag
      initial={INITIAL}
      animate={ANIMATE}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
