import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/constants/brand";

const WHO_WE_SERVE = [
  "Individuals",
  "Businesses",
  "Schools",
  "Colleges",
  "Clubs & Organizations",
  "Events",
  "Corporate Customers",
];

export function LocalTrustSection() {
  return (
    <section id="contact" className="section-padding scroll-mt-24 bg-(--paper-muted)">
      <div className="container-premium grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <p className="eyebrow-label">Local &amp; Trusted</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">Your Local Printing Partner in Malda.</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-6 max-w-lg">
              Based in Malda, West Bengal, Sayan Digital works with people and organizations
              across the region — bringing the same quality and attention to every order,
              large or small.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8 flex flex-wrap gap-2">
            {WHO_WE_SERVE.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="h-auto rounded-full px-3 py-1.5 text-[12px]"
              >
                {label}
              </Badge>
            ))}
          </Reveal>
        </div>

        <Reveal delay={120}>
          <Card className="gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-premium ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-(--brand)/30 hover:shadow-premium-lg">
            {/* Decorative map preview — no live map is wired up yet */}
            <div className="relative h-36 w-full overflow-hidden bg-(--brand)/5">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(21,57,138,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(21,57,138,0.15) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-(--brand) text-white shadow-premium-lg">
                  <MapPin size={20} />
                </span>
              </div>
            </div>

            <CardContent className="flex flex-col gap-5 p-8">
              <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                Visit or Reach Us
              </h3>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-(--brand)" />
                <span className="text-sm text-muted-foreground">{BRAND.addressLine}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-(--brand)" />
                <span className="text-sm text-muted-foreground">{BRAND.hours}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-(--brand)" />
                <span className="text-sm text-muted-foreground">{BRAND.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-(--brand)" />
                <span className="text-sm text-muted-foreground">{BRAND.email}</span>
              </div>

              <Button data-cursor="hover" className="mt-1 w-full gap-2 rounded-full">
                <MapPin size={16} />
                Visit Our Store
              </Button>

              <p className="text-[11px] text-muted-foreground/70">
                Contact details shown are placeholders pending final business information.
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
