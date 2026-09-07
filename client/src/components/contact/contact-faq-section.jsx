import { ChevronDown, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { BRAND } from "@/constants/brand";
import { CONTACT_FAQS } from "@/constants/contact-detail";

export function ContactFaqSection() {
  const whatsappHref = `https://wa.me/${BRAND.phone.replace(/\D/g, "")}`;

  return (
    <section className="section-padding bg-(--paper-muted)">
      <div className="container-premium">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow-label justify-center">Frequent Questions</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="heading-section mt-4">
              Everything you need to <em className="italic">know</em>.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-copy mt-4">
              Turnaround times, artwork requirements, single-piece orders, and regional delivery
              details.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
          {CONTACT_FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={(i % 4) * 50}>
              <details className="group rounded-xl border border-border bg-card shadow-premium open:shadow-premium-lg">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[15px] font-semibold text-foreground">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="body-copy px-5 pb-5">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={200}
          className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-2 rounded-2xl border border-border bg-card p-7 text-center shadow-premium"
        >
          <h3 className="text-[16px] font-semibold text-foreground">
            Have a complex or bespoke requirement?
          </h3>
          <p className="text-[13px] text-muted-foreground">
            Our team is happy to walk through custom requirements one-on-one.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-(--brand) px-6 text-[13px] font-medium text-white transition-colors hover:bg-(--brand)/90"
          >
            <MessageCircle size={16} />
            Start a Studio Consultation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
