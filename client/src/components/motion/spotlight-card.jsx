"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function SpotlightCard({ children, className = "", ...props }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(21,57,138,0.10), transparent 75%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative isolate ${className}`}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
        aria-hidden
      />
      {children}
    </div>
  );
}
