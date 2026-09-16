"use client";

import Image from "next/image";
import { useState } from "react";
import { asset } from "@/lib/asset";
import {
  featuredEvents,
  galleryFilters,
  galleryPhotos,
  inAction,
  type GalleryCategory,
} from "@/content/events";
import { activityStats, publishable } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 10 - ZSKILLUP IN ACTION
 *
 * The brief renames this away from "Gallery" - "It sounds passive" - and frames
 * it as visual proof that ZSkillup is genuinely active on the ground. Partners
 * gives institutional proof, Testimonials gives learner proof, this gives
 * activity proof.
 *
 * Statistics here are ACTIVITY-specific, never partner or learner counts - those
 * belong to Partners.
 *
 * Still removed, per the brief: the handwritten "Learning beyond classrooms",
 * "More Moments. A Brighter Tomorrow." and "People | Programs | Partnership |
 * Progress". Navy + purple stay the design language; the comp's orange is avoided
 * because it would overlap with Prephasz.
 *
 * Scalability: adding 100+ photographs later changes nothing here - the homepage
 * always shows one featured carousel plus eight tiles.
 *
 * Source order gives the mobile sequence the brief asks for: Featured Event ->
 * filters -> 2-column photo grid -> View More Photos.
 */

const statIcons: IconName[] = ["users", "book", "building", "clipboard"];

export function InAction() {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [featured, setFeatured] = useState(0);
  const stats = publishable(activityStats);

  const visible =
    filter === "all" ? galleryPhotos : galleryPhotos.filter((p) => p.category === filter);

  const go = (dir: -1 | 1) =>
    setFeatured((i) => (i + dir + featuredEvents.length) % featuredEvents.length);

  return (
    <Section id="in-action" tone="lavender" labelledBy="in-action-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <Eyebrow tone="brand" rule="after">
              {inAction.eyebrow}
            </Eyebrow>
            <Heading
              id="in-action-heading"
              plain="ZSkillup"
              accent="in Action."
              accentTone="brand"
              size="lg"
              className="mt-5 max-w-[9ch]"
            />
            <Lede className="mt-5 max-w-[44ch]">{inAction.supporting}</Lede>
          </div>

          {/* Featured event carousel. Every slide ships in the HTML. */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <div
              className="relative"
              role="group"
              aria-roledescription="carousel"
              aria-label="Featured event"
            >
              <div aria-live="polite" aria-atomic="true">
                {featuredEvents.map((event, i) => (
                  <figure
                    key={event.src + i}
                    hidden={i !== featured}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${featuredEvents.length}`}
                    className="relative overflow-hidden rounded-card bg-navy"
                  >
                    <Image
                      src={asset(event.src)}
                      alt={event.alt}
                      width={694}
                      height={340}
                      priority={i === 0}
                      sizes="(min-width: 1024px) 700px, 100vw"
                      className="aspect-[21/10] w-full object-cover"
                    />
                    <span className="absolute top-5 left-5 rounded-full bg-brand px-4 py-2 text-[0.8125rem] font-semibold text-white">
                      {inAction.featuredBadge}
                    </span>
                    {/* Title + short descriptor overlay, as real text. */}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(6,13,26,0.92),rgba(6,13,26,0.5)_50%,transparent)] px-6 pt-16 pb-6">
                      <h3 className="text-lg font-bold text-white sm:text-xl">{event.title}</h3>
                      <p className="mt-1 max-w-[34ch] text-[0.875rem] text-white/75">
                        {event.caption}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="absolute right-5 bottom-5 flex items-center gap-3">
                <p className="text-sm font-semibold tabular-nums text-white/85">
                  <span className="sr-only">Showing item </span>
                  {String(featured + 1).padStart(2, "0")}
                  <span className="text-white/45"> / {String(featuredEvents.length).padStart(2, "0")}</span>
                </p>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous featured event"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  <Icon name="chevronLeft" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next featured event"
                  className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-deep"
                >
                  <Icon name="chevronRight" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity statistics - never corporate scale numbers. */}
          {stats.length > 0 ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end">
              {stats.map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "border-l border-navy/10 pl-4" : ""}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon name={statIcons[i]} className="h-[1rem] w-[1rem]" />
                  </span>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="mt-3 text-[0.8125rem] leading-snug font-bold text-navy">
                    {stat.value ? `${stat.value} ` : ""}
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* Filters */}
        <div
          role="group"
          aria-label="Filter photographs by category"
          className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-1"
        >
          {galleryFilters.map((f) => {
            const selected = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[0.875rem] font-medium transition-colors ${
                  selected
                    ? "bg-navy text-white"
                    : "bg-white text-body hover:text-navy"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Gallery. Two columns on mobile, as the brief asks. */}
        {visible.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visible.map((photo) => (
              <li key={photo.src}>
                <figure className="relative h-full overflow-hidden rounded-tile bg-navy">
                  <Image
                    src={asset(photo.src)}
                    alt={photo.alt}
                    width={410}
                    height={170}
                    loading="lazy"
                    sizes="(min-width: 1024px) 290px, 45vw"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(6,13,26,0.92),transparent)] px-4 pt-12 pb-4">
                    <h3 className="text-[0.9375rem] font-bold text-white">{photo.title}</h3>
                    <p className="mt-0.5 text-[0.8125rem] text-white/75">{photo.caption}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-[0.9375rem] text-muted">No photographs in this category yet.</p>
        )}

        <div className="mt-10 flex justify-center lg:justify-end">
          <Button href={inAction.viewMore.href} variant="primary" size="lg">
            {inAction.viewMore.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
