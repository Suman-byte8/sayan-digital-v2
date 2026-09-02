import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { CRAFT_TECHNIQUES } from "@/constants/craft";

export function CustomizationShowcase() {
  return (
    <section className="section-padding bg-(--paper-muted)">
      <div className="container-premium">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">Our Craft</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">The techniques behind every print.</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-4">
              A range of finishing techniques, chosen to suit the product and the occasion.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CRAFT_TECHNIQUES.map((technique, i) => (
            <Reveal key={technique.title} delay={(i % 4) * 50}>
              <div
                data-cursor="hover"
                className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-300 hover:border-(--brand)/40"
              >
                <span className="group-hover-float flex size-9 items-center justify-center rounded-lg bg-(--brand)/8 text-(--brand) transition-colors duration-300 group-hover:bg-(--brand) group-hover:text-white">
                  <Icon name={technique.icon} size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">
                    {technique.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                    {technique.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
