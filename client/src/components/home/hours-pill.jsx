import { Clock } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { SITE } from "@/constants/site";

export function HoursPill() {
  return (
    <FadeUp delay={900} className="mt-8 w-fit">
      <div className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
        <Clock size={14} />
        {SITE.hours}
      </div>
    </FadeUp>
  );
}
