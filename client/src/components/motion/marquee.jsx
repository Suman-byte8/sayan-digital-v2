import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Marquee({ items, tone = "light", className = "" }) {
  const pillClass =
    tone === "dark"
      ? "border-white/15 bg-white/10 text-white/90 backdrop-blur-md"
      : "border-black/5 bg-white/70 text-foreground backdrop-blur-md";
  const iconClass = tone === "dark" ? "text-white/70" : "text-(--brand)";

  return (
    <div className={cn("marquee-fade group overflow-hidden", className)}>
      <div className="animate-marquee group-hover:paused flex w-max items-center gap-3">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 whitespace-nowrap",
              pillClass
            )}
          >
            <Icon name={item.icon} size={14} strokeWidth={2} className={iconClass} />
            <span className="text-[13px] font-medium tracking-[0.08em]">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
