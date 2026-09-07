import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

  return (
    <article
      data-cursor="hover"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium-lg"
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={1}>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>

        <Badge className="absolute top-3 left-3 max-w-[60%] truncate border-none bg-card/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-(--brand) uppercase backdrop-blur-sm">
          {categoryLabel}
        </Badge>

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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-(--brand)">
            {name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="block text-[11px] text-muted-foreground">Starting at</span>
              <span className="text-lg font-bold text-(--brand)">
                ₹{price}
                <span className="ml-1 text-[12px] font-normal text-muted-foreground">
                  / {unit}
                </span>
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

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-muted py-2.5 text-[13px] font-medium text-(--brand) transition-colors duration-200 group-hover:bg-(--brand) group-hover:text-white"
          >
            Customize &amp; Order
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}
