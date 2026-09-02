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
      {/* #home anchor + scroll sentinel live here, outside the Hero's own
          files, so the Hero itself needs zero changes. */}
      <div id="home">
        <HeroSection />
      </div>
      <div id="hero-end-sentinel" />

      {/*
        The Hero's own background video is `position: fixed` (by its
        original single-viewport design) and sits at z-0, which — per CSS
        stacking rules — paints ABOVE plain static-flow siblings regardless
        of DOM order. This wrapper gives everything after the Hero its own
        stacking context above that fixed layer.
      */}
      <div className="relative z-10 bg-background">
        <TrustHighlights />
        <MarqueeStrip />
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
