import { Clock, MapPin, Navigation, Palette } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { BRAND } from "@/constants/brand";

const LATITUDE = 24.990411543893927;
const LONGITUDE = 88.14139287491373;

export function ContactLocationCard() {
  const mapsHref = "https://maps.app.goo.gl/XuevnuHAoCRc6p4f8";
  const whatsappHref = `https://wa.me/${BRAND.phone.replace(/\D/g, "")}`;

  return (
    <Reveal delay={120} className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-premium">
        <div className="relative h-48 w-full overflow-hidden">
          <iframe
            src={`https://www.google.com/maps?q=${LATITUDE},${LONGITUDE}&z=16&output=embed`}
            title="Sayan Digital location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
          />
          <span className="pointer-events-none absolute top-4 left-4 rounded-md bg-card/90 px-3 py-1 text-[11px] font-bold tracking-widest text-(--brand) uppercase backdrop-blur-sm">
            Malda Studio
          </span>
        </div>

        <div className="flex flex-col gap-5 p-7">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-(--brand)">
              <MapPin size={17} />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Studio Address
              </p>
              <p className="mt-0.5 text-[14px] font-medium text-foreground">
                {BRAND.addressLine}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-(--brand)">
              <Clock size={17} />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Working Hours
              </p>
              <p className="mt-0.5 text-[14px] font-medium text-foreground">{BRAND.hours}</p>
            </div>
          </div>

          <div className="rounded-xl bg-(--paper-muted) p-4">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-(--gold)" />
              <p className="text-[11px] font-semibold tracking-wide text-foreground uppercase">
                In-Studio Capabilities
              </p>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              Physical material swatch review, on-the-spot color proofing, and same-day
              personalized gift pickup.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-muted text-[13px] font-medium text-foreground transition-colors hover:bg-(--brand) hover:text-white"
            >
              <Navigation size={15} />
              Get Directions
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-(--brand) text-[13px] font-medium text-white transition-colors hover:bg-(--brand)/90"
            >
              Book a Visit
            </a>
          </div>

          <p className="text-[11px] text-muted-foreground/70">
            Contact details shown are placeholders pending final business information.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-(--brand) p-6 text-white shadow-premium">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Palette size={20} />
        </span>
        <div>
          <p className="text-[14px] font-semibold">Direct Studio Proofing</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-white/75">
            No third-party intermediaries — printing, engraving, and finishing all happen under
            our own roof.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
