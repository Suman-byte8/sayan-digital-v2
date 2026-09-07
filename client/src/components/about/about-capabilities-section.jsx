import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { ABOUT_CAPABILITIES } from "@/constants/about";

export function AboutCapabilitiesSection() {
  return (
    <section className="section-padding bg-(--paper-muted)">
      <div className="container-premium">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow-label">Techniques &amp; Workshop</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="heading-section mt-4">
                Precision printing <em className="italic">methods</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="body-copy max-w-md">
              Advanced machinery paired with careful substrate selection lets us personalize
              almost any physical medium with lasting results.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_CAPABILITIES.map((item, i) => (
            <Reveal
              key={item.title}
              delay={(i % 4) * 50}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-premium transition-colors duration-300 hover:border-(--brand)/40"
            >
              <span className="group-hover-float flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-(--brand)">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
