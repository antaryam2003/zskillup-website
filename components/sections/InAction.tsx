"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { asset } from "@/lib/asset";
import {
  badgeColors,
  badgeLabels,
  featuredEvents,
  galleryFilters,
  galleryPhotos,
  inAction,
  type GalleryCategory,
} from "@/content/events";
import { activityStats, publishable } from "@/content/stats";
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

const statIcons: IconName[] = ["users", "book", "building", "graduation"];

export function InAction() {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [featured, setFeatured] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const scrollFilters = (dir: -1 | 1) =>
    filterRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  const stats = publishable(activityStats);

  const visible =
    filter === "all" ? galleryPhotos : galleryPhotos.filter((p) => p.category === filter);

  const go = (dir: -1 | 1) =>
    setFeatured((i) => (i + dir + featuredEvents.length) % featuredEvents.length);

  return (
    <Section id="in-action" tone="lavender" labelledBy="in-action-heading" className="relative overflow-hidden">
      {/* Decorative background wave blobs — z-0 so they stay behind all content */}
      <svg aria-hidden="true" className="pointer-events-none absolute -right-16 top-0 z-0 w-[44%] opacity-55" viewBox="0 0 520 560" fill="none">
        <path d="M480,40 C524,105 522,210 492,308 C462,406 388,462 298,472 C208,482 118,442 78,358 C38,274 58,166 112,96 C166,26 256,-12 344,8 C392,18 444,-4 480,40Z" fill="#dbd5ef"/>
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-16 z-0 w-[32%] opacity-40" viewBox="0 0 420 420" fill="none">
        <path d="M376,58 C418,112 428,202 398,284 C368,366 288,418 198,410 C108,402 28,334 8,244 C-12,154 38,62 118,30 C198,0 300,0 358,28 C368,38 372,48 376,58Z" fill="#dbd5ef"/>
      </svg>
      <Container className="relative z-[1]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4 lg:col-start-1">
            <Eyebrow tone="brand" rule="after">
              {inAction.eyebrow}
            </Eyebrow>
            <Heading
              id="in-action-heading"
              plain="ZSkillup"
              accent="in Action."
              accentTone="brand"
              size="md"
              className="mt-3 max-w-[9ch]"
            />
            <p className="mt-3 text-sm leading-relaxed text-body">{inAction.supporting}</p>

            {/* Activity statistics */}
            {stats.length > 0 ? (
              <dl className="mt-5 grid grid-cols-4 gap-x-3 gap-y-4">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={i > 0 ? "border-l border-navy/10 pl-3" : ""}>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
                      <Icon name={statIcons[i]} className="h-[1rem] w-[1rem]" />
                    </span>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="mt-1.5">
                      <span className="block text-lg font-bold tabular-nums text-navy">{stat.value}</span>
                      <span className="block text-[0.5625rem] leading-snug text-body whitespace-pre-line">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {/* Featured event carousel. Every slide ships in the HTML. */}
          <div className="relative lg:col-span-8 lg:col-start-5">
            {/* Decorative sunburst — short arcs fanning from card's top-right corner */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 -right-4"
              width="32" height="30" viewBox="0 0 32 30" fill="none"
            >
              <path d="M2 26 Q6 16 10 8" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 28 Q16 18 20 12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 30 Q24 22 30 18" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
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
                    className="relative overflow-hidden rounded-card bg-navy shadow-xl"
                  >
                    <Image
                      src={asset(event.src)}
                      alt={event.alt}
                      width={694}
                      height={340}
                      priority={i === 0}
                      sizes="(min-width: 1024px) 700px, 100vw"
                      className="aspect-[694/340] w-full object-cover"
                    />
                    <p
                      aria-hidden="true"
                      className="handwritten absolute top-5 right-5 -rotate-[8deg] text-right text-[0.95rem] leading-snug text-white/80"
                    >
                      People<br />Skills<br />Better Tomorrows
                    </p>
                    <span className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#9B6BF2_0%,#4a1fa8_100%)] px-4 py-2 text-[0.8125rem] font-semibold text-white">
                      <Icon name="star" className="h-3.5 w-3.5" />
                      {inAction.featuredBadge}
                    </span>
                    {/* Title + short descriptor overlay, as real text. */}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(6,13,26,0.92),rgba(6,13,26,0.5)_50%,transparent)] px-6 pt-16 pb-6">
                      {event.date && (
                        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-widest text-white/60">
                          {event.date.toUpperCase()}{event.location ? ` · ${event.location.toUpperCase()}` : ""}
                        </p>
                      )}
                      <h3 className="text-lg font-bold text-white sm:text-xl">{event.title}</h3>
                      <p className="mt-1 max-w-[34ch] text-[0.875rem] text-white/75">
                        {event.caption}
                      </p>
                      <button
                        type="button"
                        className="mt-3 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[0.8125rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                      >
                        <Icon name="play" className="h-4 w-4" />
                        Watch Highlights
                      </button>
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
                  className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#9B6BF2_0%,#4a1fa8_100%)] text-white transition-opacity hover:opacity-90"
                >
                  <Icon name="chevronRight" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="mt-12 flex items-center gap-3">
          <div
            ref={filterRef}
            role="group"
            aria-label="Filter photographs by category"
            className="no-scrollbar flex flex-1 gap-2 overflow-x-auto pb-1"
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
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollFilters(-1)}
              aria-label="Scroll filters left"
              className="grid h-9 w-9 place-items-center rounded-full border border-navy/20 text-body transition-colors hover:border-navy/40 hover:text-navy"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollFilters(1)}
              aria-label="Scroll filters right"
              className="grid h-9 w-9 place-items-center rounded-full border border-navy/20 text-body transition-colors hover:border-navy/40 hover:text-navy"
            >
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Gallery — 1 row of 4. */}
        {visible.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visible.slice(0, 4).map((photo) => {
              const badgeColor = badgeColors[photo.category] ?? "bg-brand-soft text-brand";
              const badgeLabel = badgeLabels[photo.category] ?? photo.category;
              return (
                <li key={photo.src}>
                  <figure className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy/5">
                    <div className="relative">
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        width={410}
                        height={220}
                        loading="lazy"
                        sizes="(min-width: 1024px) 290px, 45vw"
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[0.6875rem] font-semibold backdrop-blur-sm ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                    </div>
                    <figcaption className="px-4 pb-4 pt-3">
                      {photo.date && (
                        <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-muted">
                          <Icon name="calendar" className="h-3 w-3" />
                          {photo.date.toUpperCase()}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-start justify-between gap-2">
                        <h3 className="text-[0.9375rem] font-bold leading-snug text-navy">{photo.title}</h3>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-navy/15 text-navy">
                          <Icon name="arrowRight" className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <p className="mt-0.5 text-[0.8125rem] text-body">{photo.caption}</p>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-[0.9375rem] text-muted">No photographs in this category yet.</p>
        )}

        <div className="mt-10 flex justify-center">
          <a
            href={inAction.viewMore.href}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3.5 text-[0.9375rem] font-semibold text-white transition-opacity hover:opacity-90"
          >
            {inAction.viewMore.label}
            <Icon name="arrowRight" className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 text-center text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-navy/30">
          More People. More Stories. A Brighter Tomorrow.
        </p>
      </Container>
    </Section>
  );
}
