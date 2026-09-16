"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useState } from "react";
import {
  featuredEvents,
  galleryFilters,
  galleryPhotos,
  inAction,
  type GalleryCategory,
} from "@/content/events";
import { activityStats } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { FeaturedCarousel } from "@/components/ui/Carousel";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";
import { StatList } from "@/components/ui/Stats";

/**
 * 10 - ZSKILLUP IN ACTION (Design 1 base)
 *
 * The brief renames this away from "Gallery" - "It sounds passive" - and frames
 * it as visual proof that ZSkillup is genuinely active on the ground. Partners
 * gives institutional proof, Testimonials gives learner proof, this gives
 * activity proof. That distinction is why the section stays on the homepage.
 *
 * Kept: the large featured photograph (the strongest differentiator versus the
 * alternative comp), now a carousel with a counter so important events can be
 * showcased one by one; the eight-photo gallery; the category filters; and
 * "View More Photos" to the full collection.
 *
 * Changed per the brief:
 *   - headline is "ZSkillup in Action.";
 *   - "Webinars" dropped from the filters;
 *   - statistics are ACTIVITY-specific, never partner or learner counts - those
 *     belong to Partners;
 *   - the handwritten "Learning beyond classrooms", "More Moments. A Brighter
 *     Tomorrow." and "People | Programs | Partnership | Progress" are all removed
 *     and the space left as whitespace;
 *   - navy + purple stay the design language. The comp's orange/yellow is avoided
 *     here because it would start overlapping with Prephasz.
 *
 * Scalability: adding 100+ photographs later changes nothing about this layout -
 * the homepage always shows one featured carousel plus eight tiles.
 *
 * Source order gives the mobile sequence the brief asks for: Featured Event ->
 * filters -> 2-column photo grid -> View More Photos.
 */
export function InAction() {
  const [filter, setFilter] = useState<GalleryCategory>("all");

  const visible =
    filter === "all" ? galleryPhotos : galleryPhotos.filter((p) => p.category === filter);

  return (
    <Section id="in-action" tone="white" labelledBy="in-action-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <Eyebrow tone="brand">{inAction.eyebrow}</Eyebrow>
            <Heading id="in-action-heading" plain={inAction.headline} className="mt-5" />
            <Lede className="mt-5 max-w-[42ch]">{inAction.supporting}</Lede>
          </div>

          {/* Featured event carousel */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <FeaturedCarousel
              label="Featured event"
              count={featuredEvents.length}
              renderControls={(controls) => (
                <div className="pointer-events-none absolute right-5 bottom-5 z-10 flex justify-end">
                  <div className="pointer-events-auto">{controls}</div>
                </div>
              )}
            >
              {(i) => {
                const event = featuredEvents[i];
                return (
                  <figure className="relative overflow-hidden rounded-card bg-navy">
                    <Image
                      src={asset(event.src)}
                      alt={event.alt}
                      width={739}
                      height={362}
                      priority={i === 0}
                      sizes="(min-width: 1024px) 700px, 100vw"
                      className="aspect-[21/10] w-full object-cover"
                    />
                    <span className="absolute top-5 left-5 rounded-full bg-gradient-brand px-3.5 py-1.5 text-[0.75rem] font-semibold text-white">
                      {inAction.featuredBadge}
                    </span>
                    {/* Title + short descriptor overlay, as real text. */}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(3,17,46,0.92),rgba(3,17,46,0.55)_45%,transparent)] px-5 pt-16 pb-6">
                      <h3 className="text-lg font-bold text-white sm:text-xl">{event.title}</h3>
                      <p className="mt-1 max-w-[34ch] text-[0.875rem] text-white/75">
                        {event.caption}
                      </p>
                    </figcaption>
                  </figure>
                );
              }}
            </FeaturedCarousel>
          </div>

          {/* Activity statistics - never corporate scale numbers. */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end">
            <StatList stats={activityStats} layout="columns" className="max-w-sm" />
          </div>
        </div>

        {/* Filters */}
        <div
          role="group"
          aria-label="Filter photographs by category"
          className="no-scrollbar mt-14 flex gap-2 overflow-x-auto pb-1"
        >
          {galleryFilters.map((f) => {
            const selected = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors ${
                  selected
                    ? "border-transparent bg-brand text-white"
                    : "border-line bg-white text-body hover:border-navy/25 hover:text-navy"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Gallery. Two columns on mobile, as the brief asks. */}
        {visible.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {visible.map((photo) => (
              <li key={photo.src}>
                <figure className="relative h-full overflow-hidden rounded-tile bg-navy">
                  <Image
                    src={asset(photo.src)}
                    alt={photo.alt}
                    width={422}
                    height={189}
                    loading="lazy"
                    sizes="(min-width: 1024px) 280px, 45vw"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(3,17,46,0.9),transparent)] px-4 pt-10 pb-4">
                    <h3 className="text-[0.875rem] font-bold text-white">{photo.title}</h3>
                    <p className="mt-0.5 text-[0.75rem] text-white/70">{photo.caption}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-[0.9375rem] text-muted">
            No photographs in this category yet.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Button href={inAction.viewMore.href} variant="primary">
            {inAction.viewMore.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
