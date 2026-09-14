import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { AboutStorySection } from "@/components/about/about-story-section";
import { AboutValuesSection } from "@/components/about/about-values-section";
import { AboutCapabilitiesSection } from "@/components/about/about-capabilities-section";
import { AboutMetricsSection } from "@/components/about/about-metrics-section";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "About Us — Sayan Digital",
  description:
    "Sayan Digital is a customized printing and personalization studio in Malda, West Bengal — the story, values and craftsmanship behind every print.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-(--brand)/8 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-(--gold)/10 blur-3xl"
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
              <span className="font-medium text-(--brand)">About</span>
            </nav>

            <div className="max-w-2xl">
              <Reveal>
                <p className="eyebrow-label w-fit rounded-full bg-(--brand)/10 px-3 py-1">
                  About Sayan Digital
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="heading-section mt-4">
                  The story behind every <em className="italic">print</em>.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="body-copy mt-5">
                  From our Malda workshop, we bring artisanal craftsmanship together with
                  modern digital printing to turn your moments, brand identities and ideas
                  into lasting physical keepsakes.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <AboutStorySection />
        <AboutValuesSection />
        <AboutCapabilitiesSection />
        <AboutMetricsSection />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
