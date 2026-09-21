"use client";

import { useRef, useState, type CSSProperties } from "react";
import { prephasz } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * "A Simple Journey on prephasz" - the six pillars as a horizontal journey.
 *
 * md+ : an accordion of overlapping panels. One card is expanded (icon, title,
 *       description, feature pills); the other five collapse to a narrow tinted
 *       panel (icon, step number, title). Flex-grow is what animates, so the
 *       widths ease rather than snap.
 * <md : there is no room for six panels, so only the active card is shown at
 *       full width and the same arrows / swipe step through them.
 *
 * Panels overlap by OVERLAP px, each one tucked under its neighbour on the side
 * facing the active card, so every rounded corner shows against a tint rather
 * than a gap. Stacking order is therefore "closest to the active card on top".
 *
 * Every card mounts BOTH its expanded and its compact layer and crossfades
 * between them, rather than swapping markup - that is what lets the width
 * animation read as one panel opening instead of two different components.
 */

const icons: IconName[] = ["book", "file", "chart", "graduation", "briefcase", "trending"];

/** Tints sampled from the reference: icon well, icon stroke, and the card's own
 *  pastel field when collapsed (top -> bottom, fading lighter). */
const tints: { well: string; icon: string; card: string }[] = [
  { well: "bg-[#fdefc9]", icon: "text-[#a86f00]", card: "from-[#fdf4dc] to-[#fef9ec]" },
  { well: "bg-[#dde9fe]", icon: "text-[#1a68f0]", card: "from-[#e9f0fe] to-[#f4f7fe]" },
  { well: "bg-[#fde0e4]", icon: "text-[#d3204f]", card: "from-[#fdecef] to-[#fef5f6]" },
  { well: "bg-[#d5f5e2]", icon: "text-[#0a8a4e]", card: "from-[#e6f8ee] to-[#f2fbf6]" },
  { well: "bg-[#eadffd]", icon: "text-[#8b2fe0]", card: "from-[#f2ebfe] to-[#f8f4ff]" },
  { well: "bg-[#d7f6ee]", icon: "text-[#0f9a78]", card: "from-[#e4f9f5] to-[#f1fcfa]" },
];

const pillars = prephasz.pillars;
const COUNT = pillars.length;
/** How much wider the open card is than a collapsed one (flex-grow ratio):
 *  a touch smaller on tablet, where six panels share far less width. */
const OPEN_GROW_MD = 3.4;
const OPEN_GROW_LG = 4.4;
const SWIPE_PX = 40;

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function PrephaszJourney() {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (i: number) => setActive(((i % COUNT) + COUNT) % COUNT);
  // Functional updates, so back-to-back presses never act on a stale `active`.
  const step = (delta: number) => setActive((a) => (a + delta + COUNT) % COUNT);
  const prev = () => step(-1);
  const next = () => step(1);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="A simple journey on prephasz"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        else if (e.key === "ArrowRight") next();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) >= SWIPE_PX) (dx < 0 ? next : prev)();
      }}
      // md+: [prev] [cards] [next] on one row.
      // Mobile: cards on top, then [prev] [next] as a centred pair beneath -
      // the same buttons, re-placed by grid position only.
      className="mt-8 grid grid-cols-2 items-center gap-x-3 gap-y-6 sm:mt-10 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-2 lg:gap-x-4"
    >
      <ul className="col-span-2 row-start-1 flex md:col-span-1 md:col-start-2">
        {pillars.map((pillar, i) => {
          const isActive = i === active;
          const tint = tints[i];
          // Left of the active card the NEXT card sits on top of this one's
          // right edge; right of it the PREVIOUS card sits on top of this
          // one's left edge. Pad the compact content away from whichever side
          // is covered so it stays centred on what's actually visible.
          const coveredLeft = i > active;
          const coveredRight = i < active;

          return (
            <li
              key={pillar.title}
              style={
                {
                  "--grow-md": isActive ? OPEN_GROW_MD : 1,
                  "--grow-lg": isActive ? OPEN_GROW_LG : 1,
                  zIndex: 10 - Math.abs(i - active),
                } as CSSProperties
              }
              className={`relative min-w-0 grow-[var(--grow-md)] basis-0 overflow-hidden rounded-[1.5rem] transition-[flex-grow,box-shadow,background-color] duration-300 ease-out md:min-h-[20rem] md:rounded-[1.625rem] lg:grow-[var(--grow-lg)] min-[75rem]:min-h-[20.375rem] ${
                i > 0 ? "md:-ml-4 lg:-ml-6" : ""
              } ${isActive ? "flex" : "hidden md:flex"} ${
                isActive
                  ? "border border-[#e6e9f2] bg-white shadow-[0_2px_8px_rgb(12_21_38/0.05),0_22px_44px_-20px_rgb(12_21_38/0.22)]"
                  : `bg-gradient-to-b ${tint.card} shadow-[0_10px_30px_-22px_rgb(12_21_38/0.35)] hover:brightness-[0.985]`
              }`}
            >
              {/* ---- Expanded layer (in flow only while open, so it sets the
                  row height; absolutely parked otherwise). min-w keeps the copy
                  from re-wrapping on every frame of the width animation. ---- */}
              <div
                aria-hidden={!isActive}
                inert={!isActive}
                className={`min-w-[19rem] flex-1 px-6 py-6 transition-opacity duration-300 sm:px-8 sm:py-7 md:min-w-[17.5rem] md:px-6 lg:min-w-[22rem] lg:px-8 ${
                  isActive
                    ? "relative opacity-100 delay-100"
                    : "pointer-events-none absolute inset-y-0 left-0 w-full opacity-0"
                }`}
              >
                <span className="absolute top-5 right-6 text-lg font-medium text-[#5b6a92] sm:top-6 sm:right-8 sm:text-xl md:right-6 lg:right-8 min-[75rem]:text-[1.375rem]">
                  {pad(i)}
                </span>

                <div className="flex items-center gap-4 sm:gap-5">
                  <span
                    className={`grid h-16 w-16 shrink-0 place-items-center rounded-full sm:h-[5.25rem] sm:w-[5.25rem] md:h-[4.5rem] md:w-[4.5rem] lg:h-[5.25rem] lg:w-[5.25rem] ${tint.well}`}
                  >
                    <Icon
                      name={icons[i]}
                      className={`h-8 w-8 sm:h-11 sm:w-11 md:h-9 md:w-9 lg:h-11 lg:w-11 ${tint.icon}`}
                    />
                  </span>
                  <h4 className="text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-navy sm:text-[2.25rem] md:text-[2rem] lg:text-[2.25rem] min-[75rem]:text-[2.4rem]">
                    {pillar.title}
                  </h4>
                </div>

                {/* Width cap is in em (26rem at the old 22.4px size) so the
                    description keeps the same line breaks as its type shrinks. */}
                <p className="mt-5 min-h-[2.578rem] w-[89%] max-w-[18.5em] text-pretty text-[0.834rem] leading-snug font-medium text-[#5b6a92] sm:min-h-[3.025rem] sm:text-[0.979rem] md:min-h-[2.578rem] md:text-[0.834rem] lg:min-h-[3.025rem] lg:text-[0.979rem] min-[75rem]:min-h-[3.369rem] min-[75rem]:text-[1.09rem]">
                  {pillar.tagline}
                </p>

                {/* Description and pill type, pill padding and the pills'
                    horizontal gap are all scaled by 0.89 against the previous
                    size, and each block is 89% of the card's width - so the
                    text shrinks as one block and wraps exactly as it did
                    before instead of re-flowing into the freed room.
                    The min-heights are the previous element heights, so the
                    smaller type never changes the card's height either. */}
                <ul className="mt-5 flex w-[89%] flex-wrap gap-x-[0.556rem] gap-y-2.5">
                  {pillar.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex min-h-[1.975rem] items-center rounded-full bg-[#eef1f8] px-[0.89rem] py-2 text-[0.694rem] leading-tight font-medium text-[#485a8a] sm:min-h-[2.094rem] sm:px-4 sm:text-[0.779rem] md:min-h-[1.975rem] md:px-[0.89rem] md:text-[0.694rem] lg:min-h-[2.094rem] lg:px-4 lg:text-[0.779rem] min-[75rem]:min-h-[2.5rem] min-[75rem]:px-[1.1125rem] min-[75rem]:py-2.5 min-[75rem]:text-[0.89rem]"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---- Compact layer (md+ only: below md an inactive card is
                  simply not shown). ---- */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex flex-col items-center px-1 pt-8 text-center transition-opacity duration-200 lg:px-1.5 ${
                  coveredLeft ? "pl-4 lg:pl-7" : ""
                } ${coveredRight ? "pr-4 lg:pr-7" : ""} ${isActive ? "opacity-0" : "opacity-100 delay-100"}`}
              >
                <span
                  className={`grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full lg:h-[4.5rem] lg:w-[4.5rem] ${tint.well}`}
                >
                  <Icon name={icons[i]} className={`h-6 w-6 lg:h-8 lg:w-8 ${tint.icon}`} />
                </span>
                <span className="mt-4 text-base font-medium text-[#485a8a] lg:mt-5 lg:text-xl">
                  {pad(i)}
                </span>
                <span className="mt-1.5 text-[0.75rem] leading-tight font-semibold text-navy lg:mt-2 lg:text-[0.95rem] min-[75rem]:text-[1.05rem]">
                  {pillar.title}
                </span>
              </div>

              {/* Whole collapsed card is the hit target for jumping to it. */}
              {!isActive ? (
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Step ${i + 1} of ${COUNT}: ${pillar.title}`}
                  className="absolute inset-0 hidden cursor-pointer rounded-[inherit] md:block"
                />
              ) : null}
            </li>
          );
        })}
      </ul>

      <ArrowButton
        direction="prev"
        onClick={prev}
        className="col-start-1 row-start-2 justify-self-end md:col-start-1 md:row-start-1 md:justify-self-auto"
      />

      <ArrowButton
        direction="next"
        onClick={next}
        className="col-start-2 row-start-2 justify-self-start md:col-start-3 md:row-start-1 md:justify-self-auto"
      />

      <p className="sr-only" aria-live="polite">
        {`Step ${active + 1} of ${COUNT}: ${pillars[active].title}`}
      </p>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous step" : "Next step"}
      className={`grid h-10 w-10 place-items-center rounded-full border border-[#e3e6ef] bg-white/80 text-[#3a4a78] shadow-[0_4px_12px_-6px_rgb(12_21_38/0.25)] transition-[background-color,box-shadow,border-color] duration-200 hover:border-[#cfd5e6] hover:bg-white hover:shadow-[0_6px_16px_-6px_rgb(12_21_38/0.3)] md:h-9 md:w-9 lg:h-[2.625rem] lg:w-[2.625rem] ${className}`}
    >
      <Icon name="arrowRight" className={`h-[1.05rem] w-[1.05rem] ${direction === "prev" ? "rotate-180" : ""}`} />
    </button>
  );
}
