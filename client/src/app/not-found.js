import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Page Not Found — Sayan Digital",
  description: "The page you are looking for doesn't exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#f7f8f6] px-4 py-12 selection:bg-[#0d3932] selection:text-white">
      {/* Giant 404 watermark spanning across the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-sans font-bold leading-none text-[#1b221d]/[0.055] text-[25vw] sm:text-[26vw] md:text-[21rem] lg:text-[25rem] tracking-tight"
      >
        <span>4</span>
        <span className="mx-3 sm:mx-8 md:mx-14 lg:mx-20">0</span>
        <span>4</span>
      </div>

      {/* Foreground content centered over the 0 */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="font-sans text-3xl font-medium tracking-tight text-[#1a1d1b] sm:text-4xl md:text-[2.6rem]">
          Page not found
        </h1>

        <p className="mt-2.5 max-w-[270px] text-xs leading-relaxed text-[#717873] sm:mt-3 sm:max-w-xs sm:text-[13px]">
          Duis dolor sit amet, consectetur adipiscing elit vestibulum in pharetra.
        </p>

        <Link
          href="/"
          data-cursor="hover"
          className="group mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0d3932] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#124b42] hover:shadow-md sm:mt-7 sm:px-6 sm:py-2.5 sm:text-[13px]"
        >
          <span>Go to Home</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}


