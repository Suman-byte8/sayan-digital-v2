import { FadeUp } from "@/components/motion/fade-up";
import { SITE } from "@/constants/site";

export function HeroHeadline() {
  return (
    <>
      <FadeUp
        as="h1"
        delay={400}
        className="hero-text-shadow font-serif text-5xl font-light tracking-[-0.01em] text-white sm:text-6xl md:text-8xl"
      >
        Prints made to be <em className="italic">kept</em>.
      </FadeUp>

      <FadeUp
        as="p"
        delay={550}
        className="hero-text-shadow mt-5 max-w-xl text-lg text-white/75 md:text-xl"
      >
        {SITE.subline}
      </FadeUp>
    </>
  );
}
