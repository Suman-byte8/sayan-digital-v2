import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";

export function HeroCtaGroup() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <FadeUp delay={700} className="w-full sm:w-auto">
        <Button variant="solid" className="h-auto w-full gap-2 px-7 py-3 font-medium sm:w-auto">
          <Leaf size={18} />
          Reserve a table
        </Button>
      </FadeUp>

      <FadeUp delay={800} className="w-full sm:w-auto">
        <Button variant="glass" className="h-auto w-full px-7 py-3 sm:w-auto">
          View the tea menu
        </Button>
      </FadeUp>
    </div>
  );
}
