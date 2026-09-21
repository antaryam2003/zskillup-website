import type { Metadata } from "next";
import Image from "next/image";
import { asset } from "@/lib/asset";
import {
  featuredEvents,
  galleryFilters,
  galleryPhotos,
  inAction,
  type GalleryCategory,
} from "@/content/events";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Events & Moments",
  description:
    "A glimpse of ZSkillup in action — across campuses, classrooms, industry interactions and community events.",
  alternates: { canonical: "/events" },
};

const badgeColors: Record<string, string> = {
  "campus-programs": "bg-[#ede9fe] text-[#6d28d9]",
  "community":       "bg-[#dcfce7] text-[#16a34a]",
  "industry":        "bg-[#fff3e0] text-[#ea6c00]",
  "workshops":       "bg-[#ede9fe] text-[#6d28d9]",
  "events":          "bg-[#fce7f3] text-[#be185d]",
  "expert-talks":    "bg-[#fff3e0] text-[#ea6c00]",
};

const badgeLabels: Record<string, string> = {
  "campus-programs": "Campus Program",
  "community":       "Community",
  "industry":        "Industry",
  "workshops":       "Workshop",
  "events":          "Event",
  "expert-talks":    "Expert Talk",
};

const featured = featuredEvents[0];

export default function EventsPage() {
  return (
    <>
      {/* Hero: Featured Event */}
      <Section tone="lavender" className="!py-0 !scroll-mt-0">
        <div className="p-4 sm:p-5">
          {/* Featured card — image fades into white left panel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-navy/5" style={{minHeight: "calc(100dvh - 240px)"}}>
            {/* Image fills the right ~65%, absolutely positioned */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[65%]">
              <Image
                src={asset(featured.src)}
                alt={featured.alt}
                fill
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover object-center"
                priority
              />
              {/* White fade gradient — left edge blends into card background */}
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white via-white/80 to-transparent" />
              {/* Handwritten overlay */}
              <p
                aria-hidden="true"
                className="handwritten absolute top-6 right-7 -rotate-[8deg] text-right text-[1.1rem] leading-snug text-white/90 drop-shadow"
              >
                Ideas<br />People<br />Opportunities
              </p>
              {/* Large circular play button, centered on visible image area */}
              <button
                type="button"
                aria-label="Watch highlights video"
                className="absolute right-[28%] top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm ring-2 ring-white/50 transition-colors hover:bg-white/35"
              >
                <Icon name="play" className="h-6 w-6 translate-x-0.5" />
              </button>
              {/* Thumbnail strip — bottom, starting at left edge of visible image */}
              <div className="absolute bottom-5 right-5 flex items-end gap-2.5">
                {galleryPhotos.slice(0, 3).map((p, i) => (
                  <div key={p.src + i} className="relative h-[120px] w-[160px] overflow-hidden rounded-xl ring-2 ring-white/70">
                    <Image src={asset(p.src)} alt="" fill sizes="160px" className="object-cover" />
                  </div>
                ))}
                <div className="grid h-[120px] w-[120px] place-items-center rounded-xl bg-black/60 text-center text-[0.875rem] font-bold leading-tight text-white ring-2 ring-white/70 backdrop-blur-sm">
                  +{galleryPhotos.length - 3}<br />photos
                </div>
              </div>
            </div>

            {/* Text content — absolutely fills full height of left panel */}
            <div className="absolute inset-y-0 left-0 z-10 flex w-full flex-col justify-center px-10 py-10 lg:w-[44%] lg:px-14 lg:py-14">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-[0.8125rem] font-semibold uppercase tracking-wide text-brand">
                <Icon name="star" className="h-3.5 w-3.5" />
                {inAction.featuredBadge}
              </span>

              <h2 className="mt-5 text-[1.75rem] font-extrabold leading-tight text-navy sm:text-[2.25rem]">
                {featured.title}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.9375rem] text-body">
                {featured.date && (
                  <span className="flex items-center gap-2">
                    <Icon name="calendar" className="h-4 w-4 shrink-0 text-brand" />
                    {featured.date}
                  </span>
                )}
                {featured.location && (
                  <span className="flex items-center gap-2">
                    <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" />
                    {featured.location}
                  </span>
                )}
              </div>

              <p className="mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-body">
                {featured.caption}
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#all-events"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-[0.9375rem] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  View Full Album
                  <Icon name="arrowRight" className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-navy/25 px-6 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/50"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-navy/30">
                    <Icon name="play" className="h-3.5 w-3.5 translate-x-px" />
                  </span>
                  Watch Highlights
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Gallery grid */}
      <Section id="all-events" tone="white" labelledBy="all-events-heading">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="all-events-heading" className="text-[1.375rem] font-extrabold text-navy sm:text-2xl">
              More Events &amp; Moments
            </h2>
            <a
              href="#all-events"
              className="flex shrink-0 items-center gap-1.5 text-[0.875rem] font-semibold text-brand hover:underline"
            >
              View All Events
              <Icon name="arrowRight" className="h-4 w-4" />
            </a>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryPhotos.map((photo) => {
              const badgeColor = badgeColors[photo.category] ?? "bg-brand-soft text-brand";
              const badgeLabel = badgeLabels[photo.category] ?? photo.category;
              return (
                <li key={photo.src}>
                  <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy/5 transition-shadow hover:shadow-md">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-5 pb-5 pt-4">
                      {photo.date && (
                        <p className="flex items-center gap-1.5 text-[0.75rem] text-muted">
                          <Icon name="calendar" className="h-3 w-3 shrink-0" />
                          {photo.date}
                        </p>
                      )}
                      <h3 className="mt-1.5 text-[1rem] font-bold leading-snug text-navy">
                        {photo.title}
                      </h3>
                      <p className="mt-1 text-[0.8125rem] leading-snug text-body">
                        {photo.caption}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                        <a
                          href="#"
                          className="flex items-center gap-1 text-[0.8125rem] font-semibold text-brand hover:underline"
                        >
                          View Album
                          <Icon name="arrowRight" className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
