import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { ServicesSection } from "@/components/sections/services-section";
import { HowItWorks } from "@/components/sections/how-it-works";

export const metadata = {
  title: "Services — Sayan Digital",
  description:
    "Custom printing services from Sayan Digital in Malda, West Bengal — from design support to bulk corporate orders, handled end to end.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <div className="container-premium pt-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
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
        </div>

        <ServicesSection />
        <HowItWorks />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
