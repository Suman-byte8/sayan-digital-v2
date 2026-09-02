"use client";

import { motion } from "framer-motion";

export function DrawLine({ className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: "left" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: "easeInOut", delay }}
      aria-hidden
    />
  );
}
