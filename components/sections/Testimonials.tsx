"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { asset } from "@/lib/asset";
import { initials, learnerPhoto } from "@/content/media";
import { testimonials, testimonialsIntro } from "@/content/testimonials";
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

// Slow and readable, per the brief's 25-40px/s range. 34.5 (was 32, +7.8%)
// is a very slight speed-up - still comfortably inside that range. Duration
// is distance/speed (see below), so this scales the loop's existing
// duration down proportionally; it doesn't touch the loop mechanism (two
// back-to-back copies of the track, see `.testimonial-track` in
// globals.css) that makes the repeat seamless, the card gap, or the
// hover/tap pause behaviour, so none of those change.
const MARQUEE_SPEED_PX_PER_SEC = 34.5;

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
    testimonials.map((t) => {
      const tint = cardTints[t.vertical];
      const photo = learnerPhoto(t.slug, t.name);
      return (
        <li
          key={`${copy}-${t.slug}`}
          className="w-[85vw] shrink-0 sm:w-[21rem] lg:w-[22.5rem]"
        >
          {/* Category heading removed (was a small "PREPHASZ" / "INSTITUTIONAL
              PROGRAM" / "COMMERCE CAREER PATHWAY" label above the quote
              mark) - the quote mark's own margin, which used to space it
              away from that heading, is dropped too rather than left over
              as unearned top whitespace; the card's own p-7 padding already
              gives it a consistent inset. The blockquote's gap to the quote
              mark is likewise cut down, so the whole card reads tighter -
              its height (all three stay equal via the track's flex stretch,
              unchanged) shrinks to match, not because anything was hard-
              coded shorter. */}
          <figure className={`flex h-full flex-col rounded-card ${tint.card} p-7`}>
            <span
              aria-hidden="true"
              className={`font-serif text-[3.5rem] leading-[0.6] ${tint.quote}`}
            >
              &ldquo;
            </span>

            <blockquote className="mt-1 flex-1 text-[0.9375rem] leading-relaxed text-navy">
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
    });

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
