import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { ABOUT_VALUES } from "@/constants/about";

export function AboutValuesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">Our Core Values</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              Craftsmanship in every <em className="italic">detail</em>.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-4">
              Every project is handled with exacting care, blending industrial printing
              accuracy with the intimate touch of hand-finished assembly.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ABOUT_VALUES.map((value, i) => (
            <Reveal
              key={value.title}
              delay={(i % 4) * 60}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
            >
              <div>
                <span className="flex size-11 items-center justify-center rounded-xl bg-(--brand) text-white transition-colors group-hover:bg-(--brand)/85">
                  <Icon name={value.icon} size={20} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
              <p className="mt-5 flex items-center gap-1 text-[11px] font-semibold tracking-wide text-(--brand) uppercase">
                {value.tag}
                <ArrowRight size={13} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
