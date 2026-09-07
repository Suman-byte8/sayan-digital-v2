import { DrawLine } from "@/components/motion/draw-line";
import { Reveal } from "@/components/motion/reveal";
import { SERVICE_PROCESS_STEPS } from "@/constants/services-detail";

export function ServicesProcessSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">Simple Process</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              How we bring your <em className="italic">vision</em> to life.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-4">
              Transparent, collaborative milestones from digital upload to final handover.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-8 right-0 left-0 hidden h-px bg-border lg:block" aria-hidden />
          <DrawLine
            className="absolute top-8 right-0 left-0 hidden h-px bg-(--brand)/40 lg:block"
            delay={0.15}
          />
          {SERVICE_PROCESS_STEPS.map((step, i) => (
            <Reveal
              key={step.step}
              delay={i * 100}
              className="relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-premium"
            >
              <span className="relative z-10 flex size-16 items-center justify-center rounded-full bg-(--brand) text-lg font-semibold text-white shadow-premium">
                {step.step}
              </span>
              <span className="mt-4 text-xs font-semibold tracking-[0.2em] text-(--gold) uppercase">
                {step.tag}
              </span>
              <h3 className="mt-2 text-[15px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
