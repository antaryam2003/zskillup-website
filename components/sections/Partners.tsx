"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useCallback, useEffect, useRef, useState } from "react";
import { partners, partnerTabs, type Partner } from "@/content/partners";
import { partnerStats } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";
import { StatList } from "@/components/ui/Stats";

/**
 * 08 - PARTNERS (Design 2 structure: left messaging, right logo area)
 *
 * The brief's overriding objective: "this section needs to be scalable. We should
 * be able to go from 20 to 100+ institutions/companies later without requiring
 * any redesign of the homepage."
 *
 * How that is met:
 *   - a two-row horizontal scroller shows roughly 8-10 tiles at a time on desktop
 *     and 2 per row on mobile, and simply absorbs more entries;
 *   - every tile is the same fixed size, so logos never render at mixed scales;
 *   - the homepage communicates scale and quality of network, not a logo
 *     directory - the full list lives behind "View All Partners".
 *
 * Both tab panels are rendered into the HTML (the inactive one is `hidden`, not
 * removed) and every tile exists server-side, satisfying: "Carousel content for
 * Partners, Testimonials and Events must remain present in crawlable/rendered
 * HTML and should not depend exclusively on a click/swipe before the content
 * exists."
 *
 * This is the ONLY place corporate credibility statistics appear. The same three
 * numbers were removed from Choose Your Route to avoid repetition.
 *
 * The tab is called "Industry & Hiring Network" rather than "Hiring Partners",
 * because not every company shown is formally a hiring partner.
 *
 * The handwritten "Education partners for a better tomorrow" from the comp is
 * removed - handwriting is already used elsewhere and should not be overused.
 */

export function Partners() {
  const [active, setActive] = useState<string>(partnerTabs[0].id);

  return (
    <Section id="partners" tone="warm" labelledBy="partners-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Eyebrow>{partners.eyebrow}</Eyebrow>
            <Heading id="partners-heading" plain={partners.headline} className="mt-5" />
            <Lede className="mt-6 max-w-[38ch]">{partners.supporting}</Lede>

            <StatList stats={partnerStats} layout="columns" className="mt-10" />

            <div className="mt-9">
              <Button href={partners.viewAll.href} variant="outline">
                {partners.viewAll.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            {/* Tabs */}
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
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors ${
                      selected
                        ? "border-transparent bg-navy text-white"
                        : "border-line bg-white text-body hover:border-navy/25 hover:text-navy"
                    }`}
                  >
                    <Icon
                      name={tab.id === "institutional" ? "building" : "briefcase"}
                      className="h-4 w-4"
                    />
                    {tab.label}
                  </button>
                );
              })}
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
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Two-row horizontal scroller. Adding partners never changes the layout. */
function PartnerScroller({
  label,
  partners: list,
}: {
  label: string;
  partners: readonly Partner[];
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const page = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        onScroll={sync}
        tabIndex={0}
        role="group"
        aria-label={`${label} logos`}
        className="no-scrollbar grid snap-x snap-mandatory grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-smooth pb-1 auto-cols-[minmax(8.5rem,47%)] sm:auto-cols-[minmax(9rem,31%)] lg:auto-cols-[minmax(9rem,19.2%)]"
      >
        {list.map((partner) => (
          <li key={partner.name} className="snap-start">
            <PartnerTile partner={partner} />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label={`Previous ${label.toLowerCase()}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label={`Next ${label.toLowerCase()}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Ignore these when building a monogram from a partner name. */
const STOPWORDS = new Set(["of", "and", "the", "&", "group", "college", "university", "institute", "institutes", "technology", "engineering"]);

function monogram(name: string) {
  const words = name
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()));
  if (words.length === 0) return name.slice(0, 3).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * A single partner tile.
 *
 * Renders real artwork when `logo` is set; otherwise a consistent monogram +
 * name, so the section is complete and crawlable with no logo files at all.
 * Names are always live text - never baked into an image.
 */
function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-tile border border-line bg-white px-3 py-5 text-center">
      <span className="grid h-12 w-12 place-items-center">
        {partner.logo ? (
          <Image
            src={asset(partner.logo)}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            className="max-h-12 w-auto object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-12 w-12 place-items-center rounded-xl bg-cloud text-[0.8125rem] font-extrabold tracking-tight text-navy/70"
          >
            {monogram(partner.name)}
          </span>
        )}
      </span>
      <p className="text-[0.75rem] leading-snug font-medium text-body">{partner.name}</p>
    </div>
  );
}
