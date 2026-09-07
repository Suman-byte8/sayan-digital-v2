import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { LocalTrustSection } from "@/components/sections/local-trust-section";

export const metadata = {
  title: "Contact Us — Sayan Digital",
  description:
    "Get in touch with Sayan Digital, a customized printing and personalization studio in Malda, West Bengal.",
};

export default function ContactPage() {
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
            <span className="font-medium text-(--brand)">Contact</span>
          </nav>
        </div>

        <LocalTrustSection />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
