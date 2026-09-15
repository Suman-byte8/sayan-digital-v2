import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { LEGAL_LAST_UPDATED } from "@/constants/legal";

export function LegalPageView({ title, breadcrumbLabel, sections }) {
  return (
    <main className="bg-background pt-24 pb-20">
      <div className="container-premium max-w-3xl py-8 md:py-14">
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
          <span className="font-medium text-(--brand)">{breadcrumbLabel}</span>
        </nav>

        <Reveal>
          <h1 className="heading-section">{title}</h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={Math.min(120 + index * 40, 400)}>
              <section>
                <h2 className="font-serif text-xl font-medium text-foreground md:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="body-copy">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
