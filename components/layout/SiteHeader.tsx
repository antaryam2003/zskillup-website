"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { headerCta, nav } from "@/content/site";
import { PrephaszLogo, ZSkillupLogoMark } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { SiteSearch } from "./SiteSearch";

/**
 * Final navigation, exactly as the brief locks it:
 *   Institutions | Prephasz | B.Com + ACCA | Why ZSkillup | Insights | About
 * with "Partner With Us" as the prominent top-right CTA.
 *
 * "Programs" was deliberately removed - it is no longer a top-level website
 * architecture term, which is also why the hero CTA says "Explore What We Offer"
 * rather than "Explore Our Programs".
 *
 * The comp's search control is kept (see SiteSearch) - it finds sections,
 * offerings and FAQs on the page and jumps to them.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile panel, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          {/* Aligns the logo's left edge with the Hero's own left grid line.
              Both this header's <Container> and the Hero's text wrapper share
              the identical px-5/sm:px-8 padding - they only diverge once the
              viewport passes Container's own max-w-[1240px] cap, where
              Container starts centering (adding growing left margin) while
              the Hero (deliberately uncapped, see Hero.tsx) does not. That
              growing margin is exactly `max(0px, (100vw - 1240px) / 2)` -
              pulling the logo left by that same computed amount cancels it
              out and lands the logo back on the Hero's edge at every width,
              rather than a guessed fixed offset. Below 1240px the margin is
              already 0, so this is a no-op there. A transform (not a
              margin) so it only moves the logo visually - it does not
              re-flow or shift the nav links/CTA/search/menu button, which
              keep their exact current position and spacing. */}
          <Link
            href="/"
            aria-label="ZSkillup home"
            className="shrink-0 [transform:translateX(min(0px,(1240px_-_100vw)/2))]"
          >
            <ZSkillupLogoMark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            {/* Divider pipes between items, as in the design. */}
            <ul className="flex items-center">
              {nav.map((item, i) => (
                <li key={item.label} className="flex items-center">
                  {i > 0 ? (
                    <span aria-hidden="true" className="h-4 w-px bg-navy/15" />
                  ) : null}
                  <Link
                    href={item.href}
                    aria-label={item.label === "prephasz" ? "prephasz, Powered by ZSkillup" : undefined}
                    className="rounded-full px-4 py-2 text-[0.9375rem] font-medium text-navy/85 transition-colors hover:text-navy"
                  >
                    {item.label === "prephasz" ? <PrephaszLogo className="h-6" /> : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href={headerCta.href} variant="primary" size="sm" className="hidden sm:inline-flex">
              {headerCta.label}
            </Button>

            <div className="hidden sm:block">
              <SiteSearch />
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile panel. Content order matches the desktop navigation exactly -
          the brief asks that mobile preserve hierarchy, not just visual order. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <Container className="py-5">
          <nav aria-label="Primary (mobile)">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-label={item.label === "prephasz" ? "prephasz, Powered by ZSkillup" : undefined}
                    className="block border-b border-line-soft py-3.5 text-lg font-semibold text-navy"
                  >
                    {item.label === "prephasz" ? <PrephaszLogo className="h-7" /> : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            href={headerCta.href}
            variant="brand"
            className="mt-6 w-full"
          >
            {headerCta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
