"use client";

import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE } from "@/constants/site";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <FadeUp delay={0} className="text-sm font-medium tracking-[0.28em] text-white">
          {SITE.name}
        </FadeUp>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <FadeUp
              key={link.label}
              as="a"
              href={link.href}
              delay={link.delay}
              className="text-[13px] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </FadeUp>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <FadeUp delay={300} className="hidden lg:block">
            <Button variant="glass" className="h-auto gap-2 px-5 py-2 text-[13px]">
              <Leaf size={16} stroke="#ff7a4a" />
              Reserve a table
            </Button>
          </FadeUp>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-white lg:hidden"
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
