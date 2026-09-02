import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <Reveal className="relative overflow-hidden rounded-3xl bg-linear-to-br from-(--brand) via-(--brand) to-[#0c2456] px-8 py-16 text-center shadow-premium-lg sm:px-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-4xl font-light tracking-[-0.01em] text-white sm:text-5xl">
              Turn Your Ideas Into Something <em className="italic">You Can Hold</em>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-base">
              From personalized gifts to professional printing, we create products made for
              your moments, your brand and your business.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.3}>
                <Button
                  data-cursor="hover"
                  className="h-auto gap-2 rounded-full bg-white px-7 py-3 font-medium text-(--brand) hover:bg-white/90"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </Button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Button
                  data-cursor="hover"
                  variant="outline"
                  className="h-auto gap-2 rounded-full border-white/30 bg-transparent px-7 py-3 text-white hover:bg-white/10 hover:text-white"
                >
                  <MessageCircle size={18} />
                  Contact Us
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
