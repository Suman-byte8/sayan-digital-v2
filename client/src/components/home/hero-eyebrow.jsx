import { FadeUp } from "@/components/motion/fade-up";
import { SITE } from "@/constants/site";

export function HeroEyebrow() {
  return (
    <FadeUp delay={250} className="relative mb-6 inline-flex w-fit items-center gap-2">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="animate-ripple absolute h-2 w-2 rounded-full border border-[#ff7a4a]/50" />
        <span className="relative h-2 w-2 rounded-full bg-[#ff7a4a]" />
      </span>
      <span className="text-[11px] uppercase tracking-[0.24em] text-[#ff7a4a]">
        {SITE.tagline}
      </span>
    </FadeUp>
  );
}
