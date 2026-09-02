import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }) {
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

        <Badge className="absolute top-2.5 left-2.5 max-w-[58%] truncate border-none bg-card/90 px-2 py-0.5 text-[10px] text-foreground backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-xs">
          {product.category}
        </Badge>
        {product.customizable && (
          <Badge className="absolute top-2.5 right-2.5 border-none bg-(--brand) px-2 py-0.5 text-[10px] text-white sm:px-2.5 sm:py-1 sm:text-xs">
            Customizable
          </Badge>
        )}

        <span className="absolute right-3 bottom-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-white text-(--brand) opacity-0 shadow-premium-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="text-[15px] font-semibold text-foreground">{product.name}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>
    </div>
  );
}
