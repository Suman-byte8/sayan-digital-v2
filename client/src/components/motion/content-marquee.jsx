import { cn } from "@/lib/utils";

// Same seamless-loop technique as InfiniteRibbon (marquee-strip.jsx): the
// content is duplicated once and the track animates translateX(0 -> -50%),
// so the "reset" is pixel-identical to the start — no visible seam. Reuses
// the existing .ribbon-track / .ribbon-track-reverse keyframes in
// globals.css rather than a third-party marquee library — the previously
// used `react-marques` package injects its own runtime <style> tag with
// unscoped class names (.flex, .flex-col, .overflow-hidden, ...) that
// collide with and override Tailwind's own utilities anywhere the
// component mounts, breaking unrelated responsive layouts elsewhere on
// the same page.
export function ContentMarquee({
  children,
  reverse = false,
  duration = 40,
  pauseOnHover = false,
  className,
}) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={cn("marquee-fade group w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-stretch gap-6",
          reverse ? "ribbon-track-reverse" : "ribbon-track",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--ribbon-duration": `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
