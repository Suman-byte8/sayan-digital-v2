import Image from "next/image";
import { Building2, MapPin, Palette, Sparkles, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: Sparkles, label: "High Quality Printing" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: Palette, label: "Custom Design Support" },
  { icon: Building2, label: "Corporate Bulk Orders" },
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding scroll-mt-24 bg-background">
      <div className="container-premium grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          {/* Soft glow + floating decorative shape behind the image */}
          <div
            className="absolute -inset-8 -z-10 rounded-[3rem] bg-(--brand)/10 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -top-6 -left-6 -z-10 size-24 rounded-full bg-(--brand)/15 blur-2xl"
            aria-hidden
          />

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl shadow-premium-lg">
            <Image
              src="/assets/custom_mug_product.png"
              alt="Custom printed photo mugs by Sayan Digital"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover object-bottom"
            />
          </div>

          <div className="absolute top-8 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-premium-lg sm:block">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-(--brand)" />
              <span className="text-[12px] font-semibold text-foreground">
                Premium Quality Printing
              </span>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-8 flex aspect-square w-32 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card shadow-premium-lg sm:w-40">
            <MapPin size={22} className="text-(--brand)" />
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Malda, WB
            </span>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow-label">About Sayan Digital</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              Printing that turns <em className="italic">ideas</em> into something you can hold.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-6 max-w-lg">
              Sayan Digital is a customized printing and personalization store based in Malda,
              West Bengal, helping individuals, businesses, schools, organizations and events
              bring their ideas to life through quality printing and customized products.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8 flex flex-wrap gap-2.5">
            {FEATURES.map(({ icon: FeatureIcon, label }) => (
              <Badge
                key={label}
                variant="outline"
                className="h-auto w-fit gap-2 rounded-full px-3.5 py-2 text-[12px] font-medium"
              >
                <FeatureIcon size={14} className="text-(--brand)" />
                {label}
              </Badge>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
