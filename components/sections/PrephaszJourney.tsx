"use client";

import { useRef, useState, type ComponentProps, type CSSProperties } from "react";
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
 * Panels overlap by --ov, each one tucked under its neighbour on the side
 * facing the active card, so every rounded corner shows against a tint rather
 * than a gap. Stacking order is therefore "closest to the active card on top".
 *
 * ---- Layout stability: nothing about the ACTIVE card may size the carousel ----
 *
 * The carousel is a fixed-geometry VIEWPORT. Its height is set by a hidden
 * "sizer" that stacks the expanded face of ALL six cards in one grid cell at
 * the open-card width, so the viewport is always as tall as the tallest card
 * and never depends on which one is open. The accordion itself is absolutely
 * filled into that viewport; every card just stretches to it.
 *
 *   wrapper (relative)
 *   |- viewport (relative, container, height = tallest face)
 *   |    |- sizer   (invisible, in flow: gives the viewport its height)
 *   |    `- <ul>    (absolute inset-0: the accordion)
 *   `- arrows       (md+: absolute against the wrapper, top-1/2 -translate-y-1/2;
 *                    <md: a centred pair in flow beneath the fixed viewport)
 *
 * Only widths animate. Each expanded face is laid out at the FINAL open width
 * (--open) for its whole life and is merely revealed / clipped by its card's
 * growing box, so its copy never re-wraps mid-transition.
 *
 * Every card mounts BOTH its expanded and its compact layer and crossfades
 * between them, rather than swapping markup - that is what lets the width
 * animation read as one panel opening instead of two different components.
 * The white field, the pastel field and the active outline are likewise
 * separate layers that fade, because a gradient cannot be transitioned and
 * a border would change the box.
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
/** How far each panel tucks under its neighbour (md / lg). */
const OVERLAP_MD = "1rem";
const OVERLAP_LG = "1.5rem";
const SWIPE_PX = 40;

const pad = (n: number) => String(n + 1).padStart(2, "0");

type Pillar = (typeof pillars)[number];

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
      // --arrow / --arrow-gap: the arrow buttons' size and their distance from
      // the viewport at md+, where they sit in the wrapper's side gutters.
      className="relative mt-8 [--arrow:2.25rem] [--arrow-gap:0.5rem] sm:mt-10 lg:[--arrow:2.625rem] lg:[--arrow-gap:1rem]"
    >
      {/* ---- The fixed viewport. `container-type` makes 100cqw its own width,
          which is how --open (the open card's width) is computed for the
          sizer and the faces below without measuring anything in JS.
          --g / --ov are the open-card grow ratio and the overlap at the
          current breakpoint; the flex row is
            free = 100cqw + 5 * ov,   open = free * g / (g + 5). ---- */}
      <div
        style={
          {
            "--g-md": OPEN_GROW_MD,
            "--g-lg": OPEN_GROW_LG,
            "--ov-md": OVERLAP_MD,
            "--ov-lg": OVERLAP_LG,
            "--open": "calc((100cqw + 5 * var(--ov)) * var(--g) / (var(--g) + 5))",
          } as CSSProperties
        }
        className="relative [--g:var(--g-md)] [--ov:var(--ov-md)] [container-type:inline-size] md:mx-[calc(var(--arrow)+var(--arrow-gap))] lg:[--g:var(--g-lg)] lg:[--ov:var(--ov-lg)]"
      >
        {/* Sizer: all six expanded faces stacked in ONE grid cell at the open
            width. Invisible and inert; its only job is to make the viewport
            exactly as tall as the tallest face. */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible grid w-full select-none md:w-[var(--open)]"
        >
          {pillars.map((pillar, i) => (
            <ExpandedFace
              key={pillar.title}
              pillar={pillar}
              index={i}
              className="relative col-start-1 row-start-1"
            />
          ))}
        </div>

        <ul className="absolute inset-0 flex">
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
                style={{ flexGrow: isActive ? "var(--g)" : 1, zIndex: 10 - Math.abs(i - active) }}
                className={`relative min-w-0 basis-0 overflow-hidden rounded-[1.5rem] bg-white transition-[flex-grow,box-shadow] duration-300 ease-out motion-reduce:transition-none md:rounded-[1.625rem] ${
                  i > 0 ? "md:-ml-[var(--ov)]" : ""
                } ${isActive ? "block" : "hidden md:block"} ${
                  isActive
                    ? "shadow-[0_2px_8px_rgb(12_21_38/0.05),0_22px_44px_-20px_rgb(12_21_38/0.22)]"
                    : "shadow-[0_10px_30px_-22px_rgb(12_21_38/0.35)] hover:brightness-[0.985]"
                }`}
              >
                {/* Pastel field, faded out (not swapped) as the card opens. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${tint.card} transition-opacity duration-300 motion-reduce:transition-none ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* ---- Expanded layer. Always out of flow and always laid out at
                    the final open width, so it never sizes the row and its copy
                    never re-wraps while the card's box animates. ---- */}
                <ExpandedFace
                  pillar={pillar}
                  index={i}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  className={`absolute top-0 left-0 h-full transition-opacity duration-300 motion-reduce:transition-none ${
                    isActive ? "opacity-100 delay-100" : "pointer-events-none opacity-0"
                  }`}
                />

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

                {/* The active card's 1px outline: an overlay, so it fades in
                    and never takes up (or changes) any layout box. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 rounded-[inherit] border transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? "border-[#e6e9f2]" : "border-transparent"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* md+: both arrows leave the flow and hang off the wrapper, centred on
          the fixed viewport (which is the wrapper's only in-flow child, so
          `top-1/2` is always the viewport's middle). <md: a centred pair
          beneath the viewport; still stable, since the viewport never changes
          height. `md:contents` lets the buttons position against the wrapper. */}
      <div className="mt-6 flex justify-center gap-3 md:contents">
        <ArrowButton
          direction="prev"
          onClick={prev}
          className="md:absolute md:top-1/2 md:left-0 md:-translate-y-1/2"
        />
        <ArrowButton
          direction="next"
          onClick={next}
          className="md:absolute md:top-1/2 md:right-0 md:-translate-y-1/2"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {`Step ${active + 1} of ${COUNT}: ${pillars[active].title}`}
      </p>
    </div>
  );
}

/**
 * A card's open state (number, icon, title, description, pills). Rendered twice
 * from this one component: once per card for real, and once per card inside the
 * hidden sizer - so the two are guaranteed to lay out identically and the sizer
 * always measures exactly what the open card will contain.
 *
 * Its width is the open card's width (`--open`) from md, the full width below.
 */
function ExpandedFace({
  pillar,
  index: i,
  className = "",
  ...rest
}: { pillar: Pillar; index: number } & ComponentProps<"div">) {
  const tint = tints[i];

  return (
    <div
      {...rest}
      className={`w-full px-5 pt-[1.125rem] pb-4 sm:px-8 md:w-[var(--open)] md:px-5 lg:px-8 ${className}`}
    >
      <span className="absolute top-5 right-5 text-lg font-medium text-[#5b6a92] sm:top-6 sm:right-8 sm:text-xl md:right-5 lg:right-8 min-[75rem]:text-[1.375rem]">
        {pad(i)}
      </span>

      {/* The card's whole internal layout is this one padded box: the icon,
          heading, description and pills are all its direct children, so they
          share the box's left padding edge by construction (no per-element
          offsets). Vertical rhythm is set once, as the gap above each block. */}
      <span
        className={`grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full sm:h-[4.25rem] sm:w-[4.25rem] md:h-[3.7rem] md:w-[3.7rem] lg:h-[4.25rem] lg:w-[4.25rem] ${tint.well}`}
      >
        <Icon
          name={icons[i]}
          className={`h-[1.625rem] w-[1.625rem] sm:h-9 sm:w-9 md:h-[1.85rem] md:w-[1.85rem] lg:h-9 lg:w-9 ${tint.icon}`}
        />
      </span>

      <h4 className="mt-2 text-[1.5rem] leading-none font-extrabold tracking-[-0.03em] text-navy sm:text-[1.95rem] md:text-[1.75rem] lg:text-[1.95rem] min-[75rem]:text-[2.1rem]">
        {pillar.title}
      </h4>

      {/* Width cap is in em, so the description keeps the same measure as its
          type scales. */}
      <p className="mt-1.5 max-w-[18.5em] text-pretty text-[0.834rem] leading-snug font-medium text-[#5b6a92] sm:text-[0.979rem] md:text-[0.834rem] lg:text-[0.979rem] min-[75rem]:text-[1.09rem]">
        {pillar.tagline}
      </p>

      {/* Pills wear the card's icon-well tint. Their shape, padding and type
          are unchanged; height now comes from that padding + type alone (the old
          per-breakpoint min-heights only existed to hold the card height fixed). */}
      <ul className="mt-3 flex flex-wrap gap-x-[0.556rem] gap-y-2">
        {pillar.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center rounded-full px-[0.89rem] py-2 text-[0.694rem] leading-tight font-medium text-[#485a8a] sm:px-4 sm:text-[0.779rem] md:px-[0.89rem] md:text-[0.694rem] lg:px-4 lg:text-[0.779rem] min-[75rem]:px-[1.1125rem] min-[75rem]:py-2.5 min-[75rem]:text-[0.89rem] ${tint.well}`}
          >
            {feature}
          </li>
        ))}
      </ul>
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
      className={`grid h-10 w-10 place-items-center rounded-full border border-[#e3e6ef] bg-white/80 text-[#3a4a78] shadow-[0_4px_12px_-6px_rgb(12_21_38/0.25)] transition-[background-color,box-shadow,border-color] duration-200 hover:border-[#cfd5e6] hover:bg-white hover:shadow-[0_6px_16px_-6px_rgb(12_21_38/0.3)] md:h-[var(--arrow)] md:w-[var(--arrow)] ${className}`}
    >
      <Icon name="arrowRight" className={`h-[1.05rem] w-[1.05rem] ${direction === "prev" ? "rotate-180" : ""}`} />
    </button>
  );
}
