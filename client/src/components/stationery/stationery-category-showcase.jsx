import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  "notebooks-diaries": "BookOpen",
  "pens-writing": "PenTool",
  "files-folders": "Layers",
  "art-craft": "Palette",
  "office-essentials": "Briefcase",
  gifting: "Gift",
};

export function StationeryCategoryShowcase({ products, categories, activeCategory, onSelect }) {
  const tiles = categories.filter((category) => category.slug !== "all");

  return (
    <section className="container-premium py-12 md:py-16">
      <Reveal>
        <p className="eyebrow-label">Shop by Category</p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="heading-section mt-3">
          Find what you need, <em className="italic">faster</em>.
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((category, i) => {
          const count = products.filter((product) => product.category === category.slug).length;
          const isActive = activeCategory === category.slug;

          return (
            <Reveal key={category.slug} delay={i * 60}>
              <button
                type="button"
                onClick={() => onSelect(category.slug)}
                aria-pressed={isActive}
                data-cursor="hover"
                className={cn(
                  "flex w-full flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300",
                  isActive
                    ? "border-(--brand) bg-(--brand)/5 shadow-premium"
                    : "border-border bg-card hover:-translate-y-1 hover:shadow-premium"
                )}
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-colors",
                    isActive ? "bg-(--brand) text-white" : "bg-muted text-(--brand)"
                  )}
                >
                  <Icon name={CATEGORY_ICONS[category.slug]} size={22} />
                </span>
                <span className="text-[13px] font-semibold text-foreground">{category.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
