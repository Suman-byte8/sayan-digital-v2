import { Sparkles } from "lucide-react";
import { InfiniteRibbon } from "@/components/motion/infinite-ribbon";

const ITEMS = [
  "Sublimation Printing",
  "Customized Mugs",
  "ID Cards",
  "Lanyard Printing",
  "Photo Frames",
  "Corporate Merchandise",
  "Personalized Gifts",
  "Bulk Printing",
];

function RibbonText() {
  return (
    <span className="flex items-center">
      {ITEMS.map((item, index) => (
        <span key={item} className="flex items-center gap-6">
          {item}
          {index < ITEMS.length - 1 && (
            <Sparkles size={10} className="mx-6 shrink-0" aria-hidden />
          )}
        </span>
      ))}
    </span>
  );
}

export function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden bg-background pt-6 pb-20 md:pt-10 md:pb-28">
      <div className="relative flex flex-col gap-0">
        <InfiniteRibbon tone="brand" rotation={-3.5} duration={55}>
          <RibbonText />
        </InfiniteRibbon>
        <InfiniteRibbon tone="royal" rotation={3.5} duration={60} reverse className="-mt-8">
          <RibbonText />
        </InfiniteRibbon>
      </div>
    </div>
  );
}
