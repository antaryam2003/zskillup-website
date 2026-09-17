"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { asset } from "@/lib/asset";
import { initials, learnerPhoto } from "@/content/media";
import { testimonials, testimonialsEndCard, testimonialsIntro } from "@/content/testimonials";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 09 - TESTIMONIALS
 *
 * Objective from the brief: "authentic learner voices, not a 'reviews widget.'
 * It should feel editorial and credible rather than promotional." Hence the warm
 * off-white field, the bronze accent and the oversized quote marks.
 *
 * The headline "Real people. Real progress." deliberately echoes the Hero.
 *
 * Still removed, per the brief: the top statistics (500+ / 4.8/5 / 90%), the star
 * ratings (there is no rating data, so the type has no `rating` field at all), the
 * handwritten line, and any partner logos or extra CTA.
 *
 * NOTE: the quotes are sample content - see content/testimonials.ts.
 *
 * The cards run as a continuous right-to-left marquee (CSS `animation` on a
 * flex track holding two copies of the sequence, see `.testimonial-track` in
 * globals.css) rather than the earlier manual snap-scroll - so the old
 * prev/next buttons and page dots, which tracked `scrollLeft`, no longer
 * apply and were removed with the interaction they belonged to. Hover, focus
 * (keyboard) and tap all pause it in place via `animation-play-state`; a
 * `prefers-reduced-motion` query freezes it and swaps in a manual scroller.
 */

const cardTints: Record<string, { card: string; quote: string }> = {
  commerce: { card: "bg-[#fdf1f0]", quote: "text-[#e08b84]" },
  institutions: { card: "bg-[#eef5f1]", quote: "text-[#7ea795]" },
  prephasz: { card: "bg-[#fbf6ee]", quote: "text-[#c9a87b]" },
};

// Slow and readable, per the brief's 25-40px/s range.
const MARQUEE_SPEED_PX_PER_SEC = 32;

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState(60);
  const [tapPaused, setTapPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // The track is two copies wide; half its rendered width is exactly one
    // loop. Measuring it (rather than hard-coding a duration) keeps the
    // speed constant across breakpoints and if the content ever changes.
    const measure = () => {
      const distance = el.scrollWidth / 2;
      setDuration(distance / MARQUEE_SPEED_PX_PER_SEC);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Touch devices have no hover to pause on - a tap toggles it instead.
  // Also works on desktop as a click-to-hold, alongside hover.
  const handleTap = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;
    setTapPaused((paused) => !paused);
  };

  const renderCards = (copy: "original" | "clone") =>
    testimonials
      .map((t) => {
        const tint = cardTints[t.vertical];
        const photo = learnerPhoto(t.slug, t.name);
        return (
          <li
            key={`${copy}-${t.slug}`}
            className="w-[85vw] shrink-0 sm:w-[21rem] lg:w-[22.5rem]"
          >
            <figure className={`flex h-full flex-col rounded-card ${tint.card} p-7`}>
              <p className="eyebrow text-center text-[0.625rem] text-navy/60">{t.category}</p>

              <span
                aria-hidden="true"
                className={`mt-4 font-serif text-[3.5rem] leading-[0.6] ${tint.quote}`}
              >
                &ldquo;
              </span>

              <blockquote className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-navy">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-4">
                {photo ? (
                  <Image
                    src={asset(photo.src)}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="64px"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  /* No photograph for this learner yet - a monogram keeps the
                     card composition intact. See content/media.ts. */
                  <span
                    aria-hidden="true"
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-[1.0625rem] font-bold text-navy/70"
                  >
                    {initials(t.name)}
                  </span>
                )}
                <div>
                  <p className="text-[0.9375rem] font-bold text-navy">{t.name}</p>
                  <p className="text-[0.875rem] text-body">{t.role}</p>
                  <p className="text-[0.875rem] text-muted">{t.institution}</p>
                </div>
              </figcaption>
            </figure>
          </li>
        );
      })
      .concat(
        /* The dark end-card closes the carousel. Navy, with the gradient used
           only on the small arrow - no large coloured area. */
        <li
          key={`${copy}-end`}
          className="w-[85vw] shrink-0 sm:w-[21rem] lg:w-[22.5rem]"
        >
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-navy p-7 text-white">
            <span
              aria-hidden="true"
              className="absolute -top-16 -right-14 h-52 w-52 rounded-full bg-white/[0.04]"
            />
            <div className="relative">
              <h3 className="max-w-[12ch] text-[1.5rem] leading-tight font-extrabold text-white">
                {testimonialsEndCard.heading}
              </h3>
              <span aria-hidden="true" className="bg-gradient-brand mt-6 block h-0.5 w-12" />
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/75">
                {testimonialsEndCard.body}
              </p>
            </div>
            <a
              href={testimonialsEndCard.cta.href}
              tabIndex={copy === "clone" ? -1 : undefined}
              className="group relative mt-8 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-white"
            >
              <span className="bg-gradient-icon grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
              {testimonialsEndCard.cta.label}
            </a>
          </div>
        </li>,
      );

  return (
    <Section id="testimonials" tone="warm" labelledBy="testimonials-heading">
      <Container>
        <div className="max-w-[48rem]">
          <Eyebrow tone="gold" rule="after">
            {testimonialsIntro.eyebrow}
          </Eyebrow>
          <Heading
            id="testimonials-heading"
            plain={testimonialsIntro.headline.plain}
            accent={testimonialsIntro.headline.gradient}
            accentTone="gold"
            className="mt-5"
          />
          <Lede className="mt-5 max-w-[52ch]">{testimonialsIntro.supporting}</Lede>
        </div>

        <div
          className="testimonial-marquee relative mt-12 overflow-hidden"
          role="region"
          aria-label="Learner testimonials"
          data-paused={tapPaused}
          onClick={handleTap}
        >
          <ul
            ref={trackRef}
            className="testimonial-track w-max flex gap-5 pb-2"
            style={{ animationDuration: `${duration}s` }}
          >
            {renderCards("original")}
            {/* aria-hidden (not `inert`) so a tap landing on this half still
                bubbles to the pause toggle below - only the one focusable
                element in here (the CTA link) is pulled out of tab order. */}
            <div aria-hidden="true" className="testimonial-clone contents">
              {renderCards("clone")}
            </div>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
