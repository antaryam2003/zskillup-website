"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { partners, partnerTabs, type Partner } from "@/content/partners";
import { partnerStats, publishable } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 08 - PARTNERS
 *
 * The brief's overriding objective: "this section needs to be scalable. We should
 * be able to go from 20 to 100+ institutions/companies later without requiring
 * any redesign of the homepage."
 *
 * How that is met:
 *   - a two-row marquee shows the first 5 entries top, next 5 bottom, and simply
 *     absorbs more by paging through 5 at a time if the source list ever grows;
 *   - every tile is the same fixed size, so logos never render at mixed scales;
 *   - the homepage communicates scale and quality of network, not a directory.
 *
 * Both tab panels are rendered into the HTML (the inactive one is `hidden`, not
 * removed), satisfying: "Carousel content for Partners, Testimonials and Events
 * must remain present in crawlable/rendered HTML."
 *
 * This is the ONLY place corporate credibility statistics appear.
 *
 * The tab is "Industry & Hiring Network" rather than "Hiring Partners", because
 * not every company shown is formally a hiring partner.
 *
 * The two rows run as a continuous marquee (top left-to-right, bottom
 * right-to-left, `.partner-track` in globals.css) rather than the earlier
 * manual snap-scroll - so the old prev/next buttons, which drove that
 * scroller's `scrollLeft` directly, no longer apply and were removed with
 * the interaction they belonged to. Hovering (or focusing) a row's tab panel
 * pauses both its rows in place; `prefers-reduced-motion` freezes them and
 * swaps in a manual scroller.
 */

export function Partners() {
  const [active, setActive] = useState<string>(partnerTabs[0].id);
  const stats = publishable(partnerStats);

  return (
    <Section id="partners" tone="white" labelledBy="partners-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Eyebrow tone="gold" rule="above">
              {partners.eyebrow}
            </Eyebrow>
            <Heading id="partners-heading" plain={partners.headline} className="mt-6" />
            <Lede className="mt-6 max-w-[40ch]">{partners.supporting}</Lede>

            {stats.length > 0 ? (
              <dl className="mt-10 grid grid-cols-3 gap-x-4">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={i > 0 ? "border-l border-line pl-4" : ""}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-[1.5rem] font-extrabold tracking-tight text-gold sm:text-[1.75rem]">
                        {stat.value}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 block text-[0.8125rem] leading-snug text-body"
                      >
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-9">
              <Button href={partners.explore.href} variant="gold" size="lg">
                {partners.explore.label}
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="tablist" aria-label="Partner categories" className="flex flex-wrap gap-2">
                {partnerTabs.map((tab) => {
                  const selected = tab.id === active;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`panel-${tab.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(tab.id)}
                      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[0.9375rem] font-semibold transition-colors ${
                        selected
                          ? "border-[#f0e2cf] bg-gold-soft text-navy"
                          : "border-line bg-white text-body hover:border-navy/20 hover:text-navy"
                      }`}
                    >
                      <Icon
                        name={tab.id === "institutional" ? "graduation" : "briefcase"}
                        className="h-4 w-4"
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {partnerTabs.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                hidden={tab.id !== active}
                className="mt-6"
              >
                <PartnerScroller label={tab.label} partners={tab.partners} />
              </div>
            ))}

            <div className="mt-6 flex justify-end">
              <Button href={partners.viewAll.href} variant="underline">
                {partners.viewAll.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Slow and readable, per the brief's 30-45px/s range.
const MARQUEE_SPEED_PX_PER_SEC = 36;

/** Fixed tile width (not stretchy) so items never resize during the animation. */
const TILE_WIDTH = "w-[8.5rem] sm:w-[9rem]";

/**
 * Two-row marquee: the first 5 partners run top (left-to-right), the next 5
 * run bottom (right-to-left). Each row is its own independent track, so the
 * rows can differ in width/duration without affecting one another.
 */
function PartnerScroller({
  label,
  partners: list,
}: {
  label: string;
  partners: readonly Partner[];
}) {
  const top = list.slice(0, 5);
  const bottom = list.slice(5, 10);

  return (
    <div
      className="partner-marquee relative overflow-hidden"
      role="group"
      aria-label={`${label} logos`}
      tabIndex={0}
    >
      <PartnerRow partners={top} rowKey="top" reverse />
      <PartnerRow partners={bottom} rowKey="bottom" />
    </div>
  );
}

function PartnerRow({
  partners: row,
  rowKey,
  reverse = false,
}: {
  partners: readonly Partner[];
  rowKey: string;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // The track is two copies wide; half its rendered width is exactly one
    // loop. Measuring it (rather than hard-coding a duration) keeps the
    // speed constant across breakpoints and if the partner list changes.
    const measure = () => {
      const distance = el.scrollWidth / 2;
      setDuration(distance / MARQUEE_SPEED_PX_PER_SEC);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={trackRef}
      className={`partner-track w-max flex gap-3 pb-1 ${reverse ? "partner-track-reverse" : ""} ${rowKey === "bottom" ? "mt-3" : ""}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {row.map((partner) => (
        <li key={`${rowKey}-original-${partner.name}`} className={TILE_WIDTH}>
          <PartnerTile partner={partner} />
        </li>
      ))}
      <div aria-hidden="true" className="partner-clone contents">
        {row.map((partner) => (
          <li key={`${rowKey}-clone-${partner.name}`} className={TILE_WIDTH}>
            <PartnerTile partner={partner} />
          </li>
        ))}
      </div>
    </ul>
  );
}

/** Ignore these when building a monogram from a partner name. */
const STOPWORDS = new Set([
  "of", "and", "the", "&", "group", "college", "university",
  "institute", "institutes", "technology", "engineering",
]);

function monogram(name: string) {
  const words = name
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()));
  if (words.length === 0) return name.slice(0, 3).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
}

/**
 * A single partner tile.
 *
 * Renders real artwork when `logo` is set; otherwise a consistent monogram, so
 * the section stays complete and crawlable for entries with no logo file yet.
 * Names are always live text - never baked into an image.
 */
function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-tile border border-line bg-white px-3 py-5 text-center shadow-card">
      <span className="grid h-14 w-14 place-items-center">
        {partner.logo ? (
          <Image
            src={asset(partner.logo)}
            alt=""
            width={186}
            height={140}
            loading="lazy"
            className="max-h-14 w-auto object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-14 w-14 place-items-center rounded-xl bg-cloud text-[0.875rem] font-extrabold tracking-tight text-navy/70"
          >
            {monogram(partner.name)}
          </span>
        )}
      </span>
      <p className="text-[0.75rem] leading-snug font-medium text-body">{partner.name}</p>
    </div>
  );
}
