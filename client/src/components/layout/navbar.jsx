"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";
import { Magnetic } from "@/components/motion/magnetic";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NAV_LINKS, STATIONERY_LINK } from "@/constants/navigation";
import { BRAND } from "@/constants/brand";
import { useNavbarSolid } from "@/hooks/use-navbar-solid";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavbarSolid();
  const { items: wishlistItems } = useWishlist();
  const { count: cartCount } = useCart();

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
        <FadeUp as="a" href="/" delay={0} aria-label={BRAND.name} className="flex items-center">
          <Image
            src={BRAND.logoSrc}
            alt={BRAND.name}
            width={160}
            height={40}
            priority
            className="h-6 w-auto object-contain"
          />
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
            href={STATIONERY_LINK.href}
            delay={STATIONERY_LINK.delay}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors duration-300 ${
              solid
                ? "border-(--brand)/25 text-(--brand) hover:bg-(--brand)/5"
                : "border-white/35 text-white hover:bg-white/10"
            }`}
          >
            {STATIONERY_LINK.label}
          </FadeUp>
        </div>

        <div className="flex items-center gap-3">
          <FadeUp delay={280} className="hidden lg:block">
            <Magnetic strength={0.3}>
              <Link
                href="/profile?tab=wishlist"
                data-cursor="hover"
                aria-label={`Wishlist${wishlistItems.length ? ` (${wishlistItems.length})` : ""}`}
                className={`relative flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                  solid
                    ? "border-border text-foreground hover:bg-(--paper-muted) hover:border-(--brand)/40"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <Heart size={15} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex min-w-4.5 items-center justify-center rounded-full bg-(--brand) px-1 text-[10px] font-semibold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </Magnetic>
          </FadeUp>

          <FadeUp delay={300} className="hidden lg:block">
            <Magnetic strength={0.3}>
              <Link
                href="/cart"
                data-cursor="hover"
                aria-label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                className={`relative flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                  solid
                    ? "border-border text-foreground hover:bg-(--paper-muted) hover:border-(--brand)/40"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <ShoppingCart size={15} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex min-w-4.5 items-center justify-center rounded-full bg-(--brand) px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Magnetic>
          </FadeUp>

          <FadeUp delay={320} className="hidden lg:block">
            <Magnetic strength={0.3}>
              <Link
                href="/profile"
                data-cursor="hover"
                aria-label="My Account & Orders"
                className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                  solid
                    ? "border-border text-foreground hover:bg-(--paper-muted) hover:border-(--brand)/40"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <User size={15} />
              </Link>
            </Magnetic>
          </FadeUp>

          <FadeUp delay={340} className="hidden lg:block">
            <Magnetic strength={0.3}>
              <Button
                asChild
                data-cursor="hover"
                variant={solid ? "default" : "solid"}
                className="h-auto gap-2 rounded-full px-5 py-2 text-[13px]"
              >
                <Link href="/products">
                  <ShoppingBag size={15} />
                  {BRAND.navCta}
                </Link>
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
