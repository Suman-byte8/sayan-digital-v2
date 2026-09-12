"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const BADGE_SPRING = { type: "spring", bounce: 0.35, duration: 0.5 };

export function ProductCard({ product, className }) {
  const reduceMotion = useReducedMotion();
  const [isSaved, setIsSaved] = useState(false);

  function handleWishlist(event) {
    event.preventDefault();
    setIsSaved((saved) => !saved);
  }

  return (
    <div
      data-cursor="hover"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium-lg",
        className
      )}
    >
      {/* Gradient border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1,
          background: "linear-gradient(135deg, rgba(21,57,138,0.55), transparent 60%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden
      />

      <div className="relative overflow-hidden">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </AspectRatio>

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges spring in once the card is on screen */}
        <motion.div
          className="absolute top-2.5 left-2.5 flex max-w-[70%] flex-wrap gap-1.5"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduceMotion ? { duration: 0 } : { ...BADGE_SPRING, delay: 0.25 }}
        >
          <Badge className="max-w-full truncate border-none bg-card/90 px-2 py-0.5 text-[10px] text-foreground backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-xs">
            {product.category}
          </Badge>
          {product.customizable && (
            <Badge className="border-none bg-(--brand) px-2 py-0.5 text-[10px] text-white sm:px-2.5 sm:py-1 sm:text-xs">
              Customizable
            </Badge>
          )}
        </motion.div>

        {/* Save-for-later heart — local UI state only, no wishlist backend */}
        <motion.button
          type="button"
          aria-label={
            isSaved ? `Remove ${product.name} from saved ideas` : `Save ${product.name} for later`
          }
          aria-pressed={isSaved}
          onClick={handleWishlist}
          className={cn(
            "absolute top-2.5 right-2.5 z-20 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-premium backdrop-blur-sm transition-opacity duration-200",
            isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          )}
          whileTap={reduceMotion ? undefined : { scale: 0.8 }}
        >
          <Heart size={15} className={isSaved ? "fill-red-500 text-red-500" : ""} />
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="text-[15px] font-semibold text-foreground">{product.name}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto pt-3">
          <Button asChild variant="default" size="sm" className="w-full justify-center gap-1.5 rounded-full">
            <Link href="/products" data-cursor="hover">
              View in Catalog
              <ArrowUpRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
