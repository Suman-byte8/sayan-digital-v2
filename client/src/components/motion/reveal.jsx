"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
};

const INITIAL = { opacity: 0, y: 28 };
const ANIMATE = { opacity: 1, y: 0 };

export function Reveal({ as = "div", delay = 0, className, children, ...props }) {
  // Same SSR-safe pattern as FadeUp: initial/whileInView never change
  // between server and client, only the transition timing adjusts.
  const reduceMotion = useReducedMotion();

  const MotionTag = MOTION_TAGS[as] ?? motion.div;
  const delaySeconds = delay / 1000;

  const transition = reduceMotion
    ? { opacity: { duration: 0.4, delay: delaySeconds }, y: { duration: 0 } }
    : { duration: 0.7, delay: delaySeconds, ease: "easeOut" };

  return (
    <MotionTag
      initial={INITIAL}
      whileInView={ANIMATE}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
