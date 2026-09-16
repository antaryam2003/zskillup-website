"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
 */

const cardTints: Record<string, { card: string; quote: string }> = {
  commerce: { card: "bg-[#fdf1f0]", quote: "text-[#e08b84]" },
  institutions: { card: "bg-[#eef5f1]", quote: "text-[#7ea795]" },
  prephasz: { card: "bg-[#fbf6ee]", quote: "text-[#c9a87b]" },
};

export function Testimonials() {
  const ref = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, testimonials.length - 2);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const card = el.scrollWidth / testimonials.length;
    setPage(Math.round(el.scrollLeft / Math.max(1, card)));
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  const step = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.scrollWidth / testimonials.length), behavior: "smooth" });
  };

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

        <ul
          ref={ref}
          onScroll={sync}
          tabIndex={0}
          role="group"
          aria-label="Learner testimonials"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {testimonials.map((t) => {
            const tint = cardTints[t.vertical];
            const photo = learnerPhoto(t.slug, t.name);
            return (
              <li
                key={t.slug}
                className="w-[85vw] shrink-0 snap-start sm:w-[21rem] lg:w-[22.5rem]"
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
          })}

          {/* The dark end-card closes the carousel. Navy, with the gradient used
              only on the small arrow - no large coloured area. */}
          <li className="w-[85vw] shrink-0 snap-start sm:w-[21rem] lg:w-[22.5rem]">
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
                className="group relative mt-8 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-white"
              >
                <span className="bg-gradient-icon grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-0.5">
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
                {testimonialsEndCard.cta.label}
              </a>
            </div>
          </li>
        </ul>

        {/* Subtle controls, bottom left, with a rule running to the right. */}
        <div className="mt-10 flex items-center gap-5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous testimonials"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>

          <ul className="flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: pages }, (_, i) => (
              <li
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === Math.min(page, pages - 1) ? "bg-navy" : "bg-navy/20"
                }`}
              />
            ))}
          </ul>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next testimonials"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30"
          >
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>

          <span aria-hidden="true" className="ml-2 hidden h-px flex-1 bg-navy/10 sm:block" />
        </div>
      </Container>
    </Section>
  );
}
