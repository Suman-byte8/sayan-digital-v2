import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SERVICES } from "@/constants/services";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding scroll-mt-24 bg-(--paper-muted)">
      <div className="container-premium">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow-label">Our Services</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">Printing services, done properly.</h2>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.name} delay={(i % 4) * 70}>
              <SpotlightCard
                data-cursor="hover"
                className="card-premium card-premium-hover flex h-full flex-col gap-5 rounded-2xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--brand)/30"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-(--brand)/8 text-(--brand)">
                    <Icon name={service.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <span className="font-serif text-2xl font-light text-foreground/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-[15px] font-semibold text-foreground">{service.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
