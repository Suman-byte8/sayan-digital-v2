import Image from "next/image";
import { PenTool, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function AboutStorySection() {
  return (
    <section className="section-padding bg-(--paper-muted)">
      <div className="container-premium grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-3xl shadow-premium-lg">
            <div className="relative aspect-4/3 w-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7JIsrOPkki0NfPL7_pjO3xUUUYwrMzQeFU_moTMwkM_KPaPpYeE761zqDmQJW9NAMbBsUWGfKR12GI09CjGkUeSiusJO72HMC3MPKVRsge4cSDng_uiXV0BikGBbk4y5MPn0qlLyu-V9072umhFq5f3JCXcifa28fLAdSTpYi9o9PUL00UQgahcl54wm8D2n15IvTghcqNW5G-ruqx6y8YXrfe4auAa4rr-DBzHezKT8P8_8ZXEbAbQ"
                alt="Inside the Sayan Digital printing workshop in Malda"
                fill
                sizes="(min-width: 1024px) 42rem, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 shadow-premium backdrop-blur-sm">
            <span className="size-2 rounded-full bg-(--gold)" aria-hidden />
            <span className="text-[12px] font-semibold text-foreground">
              Malda Studio Workshop
            </span>
          </div>

          <div className="absolute -right-4 -bottom-8 hidden max-w-56 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-premium-lg sm:flex">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--brand)/10 text-(--brand)">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">100% In-House</p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Calibrated color profiles &amp; tactile finishing
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow-label inline-flex items-center gap-2 text-(--gold)">
              <PenTool size={14} />
              Artisanal Precision in Malda
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              From solitary keepsakes to district-wide institutional production.
            </h2>
          </Reveal>

          <Reveal delay={160} className="mt-6 space-y-4">
            <p className="body-copy">
              Nestled in the heart of Malda, West Bengal, <strong>Sayan Digital</strong> was
              built on a simple principle: customized merchandise should never feel
              disposable. Whether commemorating a family milestone, honoring academic
              distinction, or building a cohesive corporate identity, every piece we print
              carries a story.
            </p>
            <p className="body-copy">
              We work seamlessly across scales — from a single custom mug crafted for an
              intimate birthday, to large corporate identity kits dispatched to schools and
              trade events. Volume never discounts our attention to detail; our process holds
              tight registration and color consistency across substrates ranging from cast
              acrylic to heavyweight poly-cotton textiles.
            </p>
            <p className="rounded-xl bg-card p-4 text-[13px] leading-relaxed text-muted-foreground italic shadow-premium">
              Operating out of Malda since [Founding Year — placeholder], our studio
              maintains active inventory, dedicated proofing stations, and finishing
              equipment under one roof.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-6 flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-(--brand)">
              <Sparkles size={16} />
              Sublimation Dye Longevity
            </span>
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-(--brand)">
              <ShieldCheck size={16} />
              True-to-Pantone Calibration
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
