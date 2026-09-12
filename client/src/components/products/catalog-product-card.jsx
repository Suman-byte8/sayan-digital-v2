"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const CONTAINER_SPRING = { type: "spring", stiffness: 300, damping: 26, mass: 0.7 };
const OVERLAY_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  staggerChildren: 0.08,
  delayChildren: 0.08,
};
const ITEM_SPRING = { type: "spring", stiffness: 320, damping: 26 };
const HEART_BOUNCE = { duration: 0.45, ease: "easeInOut" };

const containerVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.015, transition: CONTAINER_SPRING },
};

const overlayVariants = {
  rest: { y: "100%", opacity: 0 },
  hover: { y: "0%", opacity: 1, transition: OVERLAY_SPRING },
};

const itemVariants = {
  rest: { opacity: 0, y: 14 },
  hover: { opacity: 1, y: 0, transition: ITEM_SPRING },
};

const heartVariants = {
  rest: { scale: 1, rotate: 0 },
  saved: { scale: [1, 1.3, 1], rotate: [0, 12, -12, 0], transition: HEART_BOUNCE },
};

export function CatalogProductCard({ product }) {
  const {
    name,
    description,
    categoryLabel,
    badge,
    badgeTone = "accent",
    price,
    unit,
    minQty,
    minQtyTone = "plain",
    image,
  } = product;

  const isHoverDevice = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [isSaved, setIsSaved] = useState(false);

  function handleSave(event) {
    event.preventDefault();
    setIsSaved((saved) => !saved);
  }

  return (
    <motion.article
      data-cursor="hover"
      initial="rest"
      whileHover={isHoverDevice ? "hover" : undefined}
      animate="rest"
      variants={containerVariants}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <span className="absolute top-3 left-3 max-w-[60%] truncate rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-(--brand) uppercase backdrop-blur-sm">
          {categoryLabel}
        </span>

        {badge && (
          <span
            className={cn(
              "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm",
              badgeTone === "accent"
                ? "bg-(--gold)/20 text-[#8a6a1f]"
                : "bg-card/90 text-muted-foreground"
            )}
          >
            {badgeTone === "accent" && (
              <span className="size-1.5 rounded-full bg-(--gold)" aria-hidden />
            )}
            {badge}
          </span>
        )}

        <motion.button
          type="button"
          aria-label={isSaved ? `Remove ${name} from saved ideas` : `Save ${name} for later`}
          aria-pressed={isSaved}
          onClick={handleSave}
          variants={heartVariants}
          animate={isSaved ? "saved" : "rest"}
          className={cn(
            "absolute bottom-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-premium backdrop-blur-sm transition-opacity duration-200",
            isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          )}
        >
          <Heart size={15} className={isSaved ? "fill-red-500 text-red-500" : ""} />
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-(--brand)">
            {name}
          </h3>
          {/* Touch devices get the full description inline — the hover
              reveal panel below never opens without a real hover. */}
          <p
            className={cn(
              "mt-1 text-[13px] leading-relaxed text-muted-foreground",
              isHoverDevice ? "line-clamp-2" : "line-clamp-3"
            )}
          >
            {description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="block text-[11px] text-muted-foreground">Starting at</span>
              <span className="text-lg font-bold text-(--brand)">
                ₹{price}
                <span className="ml-1 text-[12px] font-normal text-muted-foreground">/ {unit}</span>
              </span>
            </div>
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium",
                minQtyTone === "strong"
                  ? "bg-(--gold)/20 font-semibold text-[#8a6a1f]"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {minQty}
            </span>
          </div>

          {/* Touch/no-hover devices: CTA is always visible here. Hover
              devices get it inside the reveal panel instead, so it isn't
              shown twice. */}
          {!isHoverDevice && (
            <Link
              href="/contact"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--brand) py-2.5 text-[13px] font-medium text-white transition-colors duration-200"
            >
              Enquire Now
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>

      {isHoverDevice && (
        <motion.div
          variants={overlayVariants}
          className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-background/96 backdrop-blur-xl group-hover:pointer-events-auto"
        >
          <div className="flex flex-col gap-4 p-5">
            <motion.div variants={itemVariants}>
              <h4 className="mb-1.5 text-[13px] font-semibold text-foreground">Product Details</h4>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5 text-center text-[11px]">
              <div className="rounded-lg bg-muted/60 p-2">
                <div className="font-semibold text-foreground">
                  ₹{price} / {unit}
                </div>
                <div className="text-muted-foreground">Starting price</div>
              </div>
              <div className="rounded-lg bg-muted/60 p-2">
                <div className="font-semibold text-foreground">{minQty}</div>
                <div className="text-muted-foreground">Order quantity</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--brand) py-2.5 text-[13px] font-medium text-white transition-transform duration-150 active:scale-[0.97]"
              >
                Enquire Now
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
