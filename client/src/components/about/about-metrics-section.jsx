import { CountUpNumber } from "@/components/motion/count-up-number";
import { Reveal } from "@/components/motion/reveal";
import { ABOUT_METRICS } from "@/constants/about";

export function AboutMetricsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <Reveal className="rounded-2xl border border-border bg-card p-8 shadow-premium md:p-12">
          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_METRICS.map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                <span className="font-serif text-5xl font-bold text-(--brand)">
                  <CountUpNumber target={metric.target} suffix={metric.suffix} />
                </span>
                <span className="mt-2 text-[15px] font-semibold text-foreground">
                  {metric.label}
                </span>
                <span className="mt-1 text-[12px] text-muted-foreground">{metric.sublabel}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
