import { HeroSection } from "@/components/home/hero-section";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { TrustHighlights } from "@/components/sections/trust-highlights";
import { AboutSection } from "@/components/sections/about-section";
import { ProductCategories } from "@/components/sections/product-categories";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ServicesSection } from "@/components/sections/services-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CustomizationShowcase } from "@/components/sections/customization-showcase";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { LocalTrustSection } from "@/components/sections/local-trust-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      {/* #home anchor. Hero is relative + overflow-hidden, fully containing
          its video/scrim layers within its own bounds. */}
      <div id="home">
        <HeroSection />
      </div>
      <div id="hero-end-sentinel" />

      {/* MarqueeStrip sits OUTSIDE the hero div so it is never clipped by
          the hero's overflow-hidden. Negative top margin pulls it up to
          overlap the hero's bottom edge. z-20 paints it above every hero
          layer (video z-0, scrims z-1, content z-10). */}
      <div className="relative z-20 -mt-8 md:-mt-10 lg:-mt-12">
        <MarqueeStrip />
      </div>

      {/* All remaining sections on a solid white base. */}
      <div className="relative z-10 bg-background">
        <TrustHighlights />
        <AboutSection />
        <ProductCategories />
        <WhyChooseUs />
        <ServicesSection />
        <HowItWorks />
        <CustomizationShowcase />
        <TestimonialsSection />
        <LocalTrustSection />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
