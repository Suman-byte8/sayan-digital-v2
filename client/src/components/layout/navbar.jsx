"use client";

import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";
import { Magnetic } from "@/components/motion/magnetic";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NAV_LINKS, STATIONARY_LINK } from "@/constants/navigation";
import { BRAND } from "@/constants/brand";
import { useNavbarSolid } from "@/hooks/use-navbar-solid";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavbarSolid();

  // The mobile menu panel drops an opaque light background under the nav
  // bar, so the "transparent over hero" white-text treatment must not
  // apply while it's open, or the wordmark/close icon go illegible.
  const solid = scrolled || menuOpen;

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 md:px-12 ${
          solid
            ? "border-b border-border bg-background/90 py-4 shadow-premium backdrop-blur-lg"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <FadeUp
          as="a"
          href="#home"
          delay={0}
          className={`text-sm font-semibold tracking-[0.18em] transition-colors duration-300 ${
            solid ? "text-foreground" : "text-white"
          }`}
        >
          {BRAND.name.toUpperCase()}
        </FadeUp>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <FadeUp
              key={link.label}
              as="a"
              href={link.href}
              delay={link.delay}
              data-cursor="hover"
              className={`relative text-[13px] font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
                solid ? "text-muted-foreground hover:text-foreground" : "text-white/75 hover:text-white"
              }`}
            >
              {link.label}
            </FadeUp>
          ))}

          <FadeUp
            as="a"
            href={STATIONARY_LINK.href}
            delay={STATIONARY_LINK.delay}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors duration-300 ${
              solid
                ? "border-(--brand)/25 text-(--brand) hover:bg-(--brand)/5"
                : "border-white/35 text-white hover:bg-white/10"
            }`}
          >
            {STATIONARY_LINK.label}
          </FadeUp>
        </div>

        <div className="flex items-center gap-3">
          <FadeUp delay={340} className="hidden lg:block">
            <Magnetic strength={0.3}>
              <Button
                data-cursor="hover"
                variant={solid ? "default" : "solid"}
                className="h-auto gap-2 rounded-full px-5 py-2 text-[13px]"
              >
                <ShoppingBag size={15} />
                {BRAND.navCta}
              </Button>
            </Magnetic>
          </FadeUp>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`transition-colors duration-300 lg:hidden ${solid ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  );
}
