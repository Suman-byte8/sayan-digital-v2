import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: { bg: "bg-(--brand)", text: "text-white/90", icon: "text-(--gold)" },
  royal: { bg: "bg-[#1d4ed8]", text: "text-white/90", icon: "text-(--gold)" },
};

// Seamless loop technique: the content is duplicated into `repeat * 2` equal
// copies and the track animates exactly half its own width (translateX to
// -50%), so the moment it "resets" the second half is pixel-identical to
// the first — no visible seam. Keyframes + the two direction classes live in
// globals.css (`.ribbon-track` / `.ribbon-track-reverse`), not inline, since
// a custom-property-substituted `animation-name` inside the `animation`
// shorthand is unreliable across build/minify pipelines.
export function InfiniteRibbon({
  repeat = 4,
  duration = 26,
  reverse = false,
  rotation = 0,
  tone = "brand",
  children,
  className,
}) {
  const repeatCount = Math.max(1, Math.floor(repeat));
  const { bg, text, icon } = TONES[tone] ?? TONES.brand;

  return (
    <div
      className={cn("w-full max-w-full overflow-hidden py-3.5 shadow-premium-lg", bg, className)}
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      <span className="sr-only">{children}</span>
      <div
        aria-hidden="true"
        className={cn(
          "flex w-max items-center whitespace-nowrap",
          reverse ? "ribbon-track-reverse" : "ribbon-track",
        )}
        style={{ "--ribbon-duration": `${Math.max(0.1, duration)}s` }}
      >
        {Array.from({ length: repeatCount * 2 }, (_, index) => (
          <span key={index} className="flex items-center select-none">
            <span className={cn("text-[13px] font-medium tracking-[0.24em] uppercase sm:text-sm", text)}>
              {children}
            </span>
            <Sparkles size={13} className={cn("mx-7 shrink-0", icon)} aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
