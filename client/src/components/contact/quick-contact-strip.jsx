import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { BRAND } from "@/constants/brand";
import { QUICK_CONTACT_CARDS } from "@/constants/contact-detail";

const TONE_STYLES = {
  brand: {
    iconWrap: "bg-(--brand)/10 text-(--brand) group-hover:bg-(--brand) group-hover:text-white",
    tag: "text-(--brand)",
    button: "bg-muted text-foreground hover:bg-(--brand) hover:text-white",
  },
  whatsapp: {
    iconWrap: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    tag: "text-emerald-700",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  gold: {
    iconWrap: "bg-(--gold)/15 text-(--gold) group-hover:bg-(--gold) group-hover:text-white",
    tag: "text-(--gold)",
    button: "bg-muted text-foreground hover:bg-(--brand) hover:text-white",
  },
};

function ctaHref(card) {
  if (card.key === "phone") return `tel:${BRAND.phone.replace(/\s+/g, "")}`;
  if (card.key === "whatsapp") return `https://wa.me/${BRAND.phone.replace(/\D/g, "")}`;
  return `mailto:${BRAND.email}`;
}

function ctaValue(card) {
  if (card.key === "email") return BRAND.email;
  return BRAND.phone;
}

export function QuickContactStrip() {
  return (
    <section className="pb-16">
      <div className="container-premium grid grid-cols-1 gap-5 md:grid-cols-3">
        {QUICK_CONTACT_CARDS.map((card, i) => {
          const tone = TONE_STYLES[card.tone];
          return (
            <Reveal
              key={card.key}
              delay={i * 70}
              className="group rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl transition-colors",
                  tone.iconWrap
                )}
              >
                <Icon name={card.icon} size={22} />
              </span>
              <p className={cn("mt-4 text-[11px] font-bold tracking-widest uppercase", tone.tag)}>
                {card.tag}
              </p>
              <h3 className="mt-1 text-[15px] font-semibold text-foreground">{card.title}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">{card.description}</p>
              <p className="mt-2 text-[13px] font-semibold text-foreground">{ctaValue(card)}</p>

              <a
                href={ctaHref(card)}
                target={card.key === "whatsapp" ? "_blank" : undefined}
                rel={card.key === "whatsapp" ? "noopener noreferrer" : undefined}
                data-cursor="hover"
                className={cn(
                  "mt-4 flex h-11 items-center justify-between rounded-lg px-4 text-[13px] font-medium transition-colors",
                  tone.button
                )}
              >
                {card.ctaLabel}
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
