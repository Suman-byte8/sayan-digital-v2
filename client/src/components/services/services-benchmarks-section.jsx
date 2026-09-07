import { MapPin, ShieldCheck, Timer } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { SERVICE_BENCHMARKS } from "@/constants/services-detail";

export function ServicesBenchmarksSection() {
  return (
    <section className="section-padding bg-(--paper-muted)">
      <div className="container-premium grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow-label inline-flex items-center gap-2">
              <ShieldCheck size={14} />
              Atelier Benchmarks
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4 text-3xl md:text-4xl">
              Craftsmanship backed by technical discipline.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-4">
              We don&apos;t think custom printing needs long waits or unpredictable results —
              every substrate we stock is tested for durability before it reaches production.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-premium">
              <MapPin size={14} className="text-(--brand)" />
              Malda Town Workshop
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-premium">
              <Timer size={14} className="text-(--brand)" />
              Express 24h Queue
            </span>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {SERVICE_BENCHMARKS.map((item, i) => (
            <Reveal
              key={item.title}
              delay={(i % 4) * 60}
              className="rounded-xl border border-border bg-card p-5 shadow-premium"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-(--brand)/10 text-(--brand)">
                <Icon name={item.icon} size={20} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
