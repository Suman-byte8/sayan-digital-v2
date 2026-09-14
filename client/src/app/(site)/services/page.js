import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { ServiceDetailRow } from "@/components/services/service-detail-row";
import { ServicesProcessSection } from "@/components/services/services-process-section";
import { ServicesBenchmarksSection } from "@/components/services/services-benchmarks-section";
import { Reveal } from "@/components/motion/reveal";
import { SERVICE_DETAILS, SERVICE_TELEMETRY } from "@/constants/services-detail";

export const metadata = {
  title: "Services — Sayan Digital",
  description:
    "Custom printing services from Sayan Digital in Malda, West Bengal — personalized gifting, corporate merchandise, ID cards, apparel, engraving, signage and bulk fulfillment.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -left-20 size-96 rounded-full bg-(--brand)/8 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-1/3 -right-32 size-120 rounded-full bg-(--gold)/10 blur-3xl"
            aria-hidden
          />

          <div className="container-premium relative py-8 md:py-14">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition-colors hover:text-(--brand)"
              >
                <HomeIcon size={13} />
                Home
              </Link>
              <ChevronRight size={13} />
              <span className="font-medium text-(--brand)">Services</span>
            </nav>

            <div className="max-w-3xl">
              <Reveal>
                <p className="eyebrow-label w-fit rounded-full bg-(--brand)/10 px-3 py-1">
                  Our Services
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="heading-section mt-4">
                  Every print, handled <em className="italic">end to end</em>.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="body-copy mt-5 max-w-2xl">
                  From concept and design adjustment to press and delivery across Malda and West
                  Bengal — the same careful standard whether it&apos;s one gift or a bulk order.
                </p>
              </Reveal>
            </div>

            <Reveal
              delay={240}
              className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4"
            >
              {SERVICE_TELEMETRY.map((item) => (
                <div key={item.label}>
                  <span className="block text-[11px] font-semibold tracking-wider text-(--gold) uppercase">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[16px] font-semibold text-foreground">
                    {item.value}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted-foreground">
                    {item.note}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section-padding bg-(--paper-muted)">
          <div className="container-premium flex flex-col gap-24 md:gap-28">
            {SERVICE_DETAILS.map((service, i) => (
              <ServiceDetailRow key={service.key} service={service} reversed={i % 2 === 1} />
            ))}
          </div>
        </section>

        <ServicesProcessSection />
        <ServicesBenchmarksSection />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
