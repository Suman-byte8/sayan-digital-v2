import { Icon } from "@/lib/icons";
import { DrawLine } from "@/components/motion/draw-line";
import { Reveal } from "@/components/motion/reveal";
import { PROCESS_STEPS } from "@/constants/process-steps";

export function HowItWorks() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">How It Works</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">From idea to finished product.</h2>
          </Reveal>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-8 right-0 left-0 hidden h-px bg-border lg:block" aria-hidden />
          <DrawLine
            className="absolute top-8 right-0 left-0 hidden h-px bg-(--brand)/40 lg:block"
            delay={0.15}
          />
          {PROCESS_STEPS.map((step, i) => (
            <Reveal
              key={step.step}
              delay={i * 100}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border bg-card text-(--brand) shadow-premium">
                <Icon name={step.icon} size={26} strokeWidth={1.5} />
              </span>
              <span className="mt-4 text-xs font-semibold tracking-[0.2em] text-(--brand)">
                STEP {step.step}
              </span>
              <h3 className="mt-2 text-[15px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 max-w-[220px] text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
