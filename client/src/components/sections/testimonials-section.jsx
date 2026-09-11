import { Star } from "lucide-react";
import { ReactMarques } from "react-marques";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GOOGLE_RATING, TESTIMONIALS } from "@/constants/testimonials";

function TestimonialCard({ testimonial }) {
  return (
    <SpotlightCard
      data-cursor="hover"
      className="card-premium card-premium-hover flex h-full w-80 shrink-0 flex-col gap-4 rounded-2xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--brand)/30"
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
          <p className="text-[13px] font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </SpotlightCard>
  );
}

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

        <Reveal delay={220} className="mt-14 flex flex-col gap-6">
          <ReactMarques fade pauseOnHover style={{ "--duration": "48s" }}>
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={`row1-${testimonial.initials}`} testimonial={testimonial} />
            ))}
          </ReactMarques>
          <ReactMarques fade pauseOnHover reverse style={{ "--duration": "48s" }}>
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={`row2-${testimonial.initials}`} testimonial={testimonial} />
            ))}
          </ReactMarques>
        </Reveal>

        <Reveal delay={280} className="mt-10 flex justify-center">
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
