import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { WHY_CHOOSE_US } from "@/constants/features";

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium grid gap-16 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow-label">Why Choose Us</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              A printing partner built for <em className="italic">precision</em>.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-6 max-w-sm">
              From single personalized gifts to large corporate orders, every product leaves
              Sayan Digital held to the same standard.
            </p>
          </Reveal>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal
              key={item.title}
              delay={(i % 4) * 60}
              className="flex items-start gap-5 py-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--brand)/8 text-(--brand)">
                <Icon name={item.icon} size={18} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
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
