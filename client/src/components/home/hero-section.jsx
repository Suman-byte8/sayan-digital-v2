import { HeroBackgroundVideo } from "@/components/home/hero-background-video";
import { HeroScrim } from "@/components/home/hero-scrim";
import { HeroEyebrow } from "@/components/home/hero-eyebrow";
import { HeroHeadline } from "@/components/home/hero-headline";
import { HeroCtaGroup } from "@/components/home/hero-cta-group";
import { HoursPill } from "@/components/home/hours-pill";

// Navbar is rendered by the (site) route group layout, not here — it's a
// position:fixed element so where it mounts in the tree doesn't matter
// visually, but it must only render once per page.
export function HeroSection() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#0a0c0b]">
      <HeroBackgroundVideo />
      <HeroScrim />

      <div className="relative z-10 flex min-h-[calc(100dvh-72px)] max-w-3xl flex-col justify-end px-6 pt-28 pb-24 md:px-12 md:pt-32 md:pb-32 lg:pb-36">
        <HeroEyebrow />
        <HeroHeadline />
        <HeroCtaGroup />
        <HoursPill />
      </div>
    </main>
  );
}
