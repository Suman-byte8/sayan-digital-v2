import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { QuickContactStrip } from "@/components/contact/quick-contact-strip";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactLocationCard } from "@/components/contact/contact-location-card";
import { ContactFaqSection } from "@/components/contact/contact-faq-section";
import { Reveal } from "@/components/motion/reveal";
import { BRAND } from "@/constants/brand";

export const metadata = {
  title: "Contact Us — Sayan Digital",
  description:
    "Get in touch with Sayan Digital, a customized printing and personalization studio in Malda, West Bengal — call, WhatsApp, email, or send a quote request.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="bg-background pt-24">
        <section className="relative overflow-hidden pb-4">
          <div
            className="pointer-events-none absolute -top-24 right-1/4 size-96 rounded-full bg-(--brand)/8 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-10 size-72 rounded-full bg-(--gold)/10 blur-3xl"
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
              <span className="font-medium text-(--brand)">Contact</span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Reveal>
                  <p className="eyebrow-label">Get in Touch</p>
                </Reveal>
                <Reveal delay={80}>
                  <h1 className="heading-section mt-4">
                    Let&apos;s bring your idea to <em className="italic">print</em>.
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="body-copy mt-5">
                    Visit our studio in Malda, send your artwork for a quote, or reach out
                    directly on WhatsApp for a tailored consultation.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={200} className="text-left lg:text-right">
                <p className="text-[13px] font-semibold text-foreground">{BRAND.location}</p>
                <p className="text-[12px] text-muted-foreground">{BRAND.hours}</p>
              </Reveal>
            </div>
          </div>
        </section>

        <QuickContactStrip />

        <section className="pb-24">
          <div className="container-premium grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <ContactLocationCard />
            </div>
          </div>
        </section>

        <ContactFaqSection />
      </main>

      <CtaSection />
      <Footer />
    </>
  );
}
