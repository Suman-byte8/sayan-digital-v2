import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";

export function HeroCtaGroup() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <FadeUp delay={700} className="w-full sm:w-auto">
        <Button
          asChild
          variant="solid"
          className="h-auto w-full gap-2 px-7 py-3 font-medium sm:w-auto"
        >
          <Link href="/products" data-cursor="hover">
            <ShoppingBag size={18} />
            Shop Now
          </Link>
        </Button>
      </FadeUp>

      <FadeUp delay={800} className="w-full sm:w-auto">
        <Button asChild variant="glass" className="h-auto w-full px-7 py-3 sm:w-auto">
          <Link href="/contact" data-cursor="hover">
            Get a Quote
          </Link>
        </Button>
      </FadeUp>
    </div>
  );
}
