import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GOOGLE_RATING, TESTIMONIALS } from "@/constants/testimonials";

export function TestimonialsSection() {
  return (
    <section id="reviews" className="section-padding bg-background">
      <div className="container-premium">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">Customer Reviews</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section">What customers are saying.</h2>
          </Reveal>

          <Reveal
            delay={160}
            className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-dashed border-border bg-card px-5 py-3 shadow-premium"
          >
            <span className="text-sm font-semibold text-foreground">{GOOGLE_RATING.label}</span>
            <span className="text-sm text-muted-foreground">— {GOOGLE_RATING.note}</span>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.initials} delay={i * 90}>
              <SpotlightCard
                data-cursor="hover"
                className="card-premium card-premium-hover flex h-full flex-col gap-4 rounded-2xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--brand)/30"
              >
                <div className="relative z-10 flex items-center gap-1 text-(--gold)">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="relative z-10 text-[14px] leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="relative z-10 mt-auto flex items-center gap-3 pt-2">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-(--brand)/10 text-xs font-semibold text-(--brand)">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 flex justify-center">
          <Magnetic strength={0.3}>
            <Button data-cursor="hover" variant="outline" className="rounded-full">
              View All Reviews on Google
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
