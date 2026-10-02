import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { TRUST_HIGHLIGHTS } from "@/constants/highlights";

export function TrustHighlights() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-border bg-background">
      <h2 id="trust-heading" className="sr-only">
        Why customers choose Sayan Digital
      </h2>
      <div className="container-premium grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:py-16">
        {TRUST_HIGHLIGHTS.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="flex flex-col items-start gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-(--brand)/8 text-(--brand)">
              <Icon name={item.icon} size={20} strokeWidth={1.75} />
            </span>
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
