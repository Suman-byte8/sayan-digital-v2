import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function ServiceDetailRow({ service, reversed = false }) {
  return (
    <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <span
        className={cn(
          "pointer-events-none absolute -top-10 z-0 font-serif text-8xl font-light text-(--brand)/8 select-none lg:text-[140px]",
          reversed ? "right-0 lg:right-6" : "left-0 lg:left-0"
        )}
        aria-hidden
      >
        {service.number}
      </span>

      <Reveal
        className={cn("relative z-10 lg:col-span-6", reversed && "lg:order-2")}
      >
        <div className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-muted shadow-premium">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 36rem, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Reveal>

      <Reveal
        delay={80}
        className={cn("relative z-10 flex flex-col items-start lg:col-span-6", reversed && "lg:order-1")}
      >
        <p className="text-[11px] font-bold tracking-widest text-(--gold) uppercase">
          {service.tag}
        </p>
        <h2 className="heading-section mt-2 text-3xl md:text-4xl">{service.title}</h2>
        <p className="body-copy mt-4">{service.description}</p>

        <div className="mt-5 w-full rounded-xl bg-(--paper-muted) p-4">
          <p className="text-[11px] font-bold tracking-wide text-(--brand) uppercase">
            What&apos;s Included
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[13px] text-foreground"
              >
                <CheckCircle2 size={16} className="shrink-0 text-(--brand)" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={service.ctaHref}
            data-cursor="hover"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-(--brand) px-5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-(--brand)/90"
          >
            {service.ctaLabel}
            <Icon name={service.ctaIcon} size={16} />
          </Link>
          <span className="text-[12px] text-muted-foreground">{service.note}</span>
        </div>
      </Reveal>
    </div>
  );
}
