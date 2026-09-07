"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], [data-cursor='hover']";
const TEXT_SELECTOR = "[data-cursor='text']";

export function CustomCursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const [variant, setVariant] = useState("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 550, damping: 32, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 550, damping: 32, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 1000, damping: 40, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1000, damping: 40, mass: 0.2 });

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("custom-cursor-active");

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const over = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(TEXT_SELECTOR)) setVariant("text");
      else if (target.closest(INTERACTIVE_SELECTOR)) setVariant("hover");
      else setVariant("default");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [finePointer, x, y]);

  if (!finePointer) return null;

  const isHover = variant === "hover";
  const isText = variant === "text";

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full bg-white mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: isHover ? 0 : 6, height: isHover ? 0 : 6, opacity: isHover ? 0 : 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full border border-white mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isText ? 4 : isHover ? 64 : 28,
          height: isText ? 40 : isHover ? 64 : 28,
          backgroundColor: isHover ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </>
  );
}
