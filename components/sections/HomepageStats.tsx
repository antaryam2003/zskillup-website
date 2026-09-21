"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { heroCredibilityStats } from "@/content/stats";
import { Handwritten } from "@/components/ui/Stats";

/**
 * CREDIBILITY STRIP - sits directly between Hero and About.
 *
 * A compact row of six figures, now introduced by its own eyebrow/heading/
 * supporting copy - "Real People. Real Progress." - per the reference this
 * was built from. Kept as its own lightweight section (not the shared
 * <Section> shell) because that component's standard py-20/24/28 vertical
 * padding reads as too generous for how compact the reference's own
 * spacing is; this strip uses its own tighter rhythm instead.
 *
 * "Leading" in the heading reuses the site's existing handwritten accent
 * (Caveat, via the shared `Handwritten` component/`.handwritten` CSS class,
 * swoosh underline included) rather than a plain italic sans fallback - the
 * only script/serif-flavoured treatment already in the type system, and
 * this is the accent's 3rd use on the homepage (the brief's own cap is
 * "2-3" - see globals.css and Stats.tsx).
 *
 * The outer field is `bg-white` - the same tone About ZSkillup uses
 * (`<Section tone="white">`), per the brief. The light cards pick up a
 * `border-line` hairline (not carried before, when `bg-cloud` alone did
 * that job) so they still read as distinct cards against a same-toned page
 * rather than flattening into it. Figures are `text-navy`, the same
 * "black" the rest of the site's dark text uses, rather than a literal
 * `text-black` this design system doesn't otherwise use anywhere.
 *
 * Deliberately NOT the shared <Container> (max-w-[1240px]): six cards in one
 * row leaves each just ~179px wide inside that width - checked directly
 * against this layout, that's too narrow for the longest label ("Universities
 * & Colleges onboarded") to read comfortably. A dedicated, wider max-width -
 * the same fix the Hero cards row uses for the same reason - gives every
 * card real room to spare once six-across is safe.
 *
 * Six-across only switches on at 1450px (checked directly against this
 * content, not guessed), not at the `lg` grid's usual 1024px: below that,
 * six cards genuinely can't hold their labels at a legible size no matter
 * how the width is redistributed, so the strip stays 3x2 for every width
 * from tablet up through smaller desktop screens, and only becomes a single
 * row once there's genuinely enough room for it.
 *
 * The 3-up and 6-up breakpoints below both use `min-[Npx]:` rather than the
 * named `sm:` - mixing a named breakpoint with an arbitrary one on the same
 * property compiles fine but loses the cascade at wide viewports (both
 * conditions end up true at once, and the named variant's rule sorts after
 * the arbitrary one regardless of which is visually wider, so `sm:` silently
 * wins and 1450px+ never applies). Sticking to `min-[]:` throughout keeps
 * every tier sorted by its actual pixel value, so the widest matching
 * breakpoint reliably wins.
 *
 * ONE HIGHLIGHTED CARD: `stat.highlight` (content/stats.ts) marks exactly
 * one figure ("Placements") to render on the brand-purple fill instead of
 * white - the one deliberate accent among six otherwise-uniform cards, per
 * the reference this was built from. Every other card stays white/light;
 * this is not a per-card colour system.
 *
 * CARD ARTWORK: each stat's `image` (content/stats.ts) is the officially
 * supplied card visual, not an icon this component draws itself - every
 * file already bakes in its own rounded-card look (and, for "Placements",
 * the purple highlight fill), so the card is just that image plus the
 * number/label overlaid on top, not a second background/border/shadow of
 * this component's own layered underneath it (that would double up on what
 * the artwork already provides). `fill` + `object-contain` inside an
 * `aspect-square` box shows each image at its own natural proportions,
 * uncropped, regardless of how close to 1:1 any particular file's own
 * dimensions are - `aspect-square` also gives all six cards the same
 * footprint without the min-h reservations the previous icon-drawn version
 * needed. The number/label sit in the blank upper portion every supplied
 * image already reserves for them - a purely decorative fill, so `alt=""`.
 *
 * COUNT-UP ANIMATION: each figure parses into a numeric target plus the
 * exact prefix/suffix text around it (" LPA", "+", "%" and so on) and how
 * many decimal places it originally had (one for "5.6 LPA", zero for every
 * other figure) - so intermediate frames re-attach the same prefix/suffix
 * and decimal precision the final value has, and the animation can never
 * land on anything but the exact original string. Triggered once, by a
 * single IntersectionObserver on the whole strip (not one per card, so all
 * six start together) - it disconnects itself the moment it fires, which is
 * what guarantees "play once" and rules out a restart from scrolling away
 * and back. `prefers-reduced-motion` skips the animation and renders the
 * final values immediately, consistent with how decorative (not user-
 * driven) motion is handled elsewhere on this site. */

const NUMBER_SIZE = "text-[1.25rem] min-[640px]:text-[1.875rem] min-[1450px]:text-[2.25rem]";
/** Every card is `aspect-square` now (see below), so height parity across
    the row no longer needs the min-h reservation the previous icon-drawn
    version relied on - the card's own footprint is fixed regardless of how
    many lines a given label wraps to.

    The base (2-column, <640px) tier is deliberately smaller than the sm+
    tiers: at that width the card itself is only ~150-160px square, and the
    longest labels ("Universities & Colleges onboarded", "Placement Success
    Rate") wrap to 3 and 2 lines respectively - at the old base size that
    text block ran tall enough to visually collide with the supplied
    artwork's own illustration underneath it. Shrinking text/padding here
    only (sm+ unchanged) buys back enough vertical room to clear it without
    touching the images themselves. */
const LABEL_SIZE = "text-[0.6875rem] min-[640px]:text-base min-[1450px]:text-[1.0625rem]";

const COUNT_DURATION_MS = 1600;

/** "₹5.6 LPA" -> { prefix: "₹", target: 5.6, decimals: 1, suffix: " LPA" }.
    Figures with no digits at all (shouldn't occur in this content, but kept
    defensive) fall back to rendering the original string verbatim. */
function parseStatValue(value: string) {
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!match) return null;
  const [, prefix, numberText, suffix] = match;
  const target = Number.parseFloat(numberText);
  if (Number.isNaN(target)) return null;
  const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;
  return { prefix, target, decimals, suffix };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedStatValue({ value, startWhenReady }: { value: string; startWhenReady: boolean }) {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}${(0).toFixed(parsed.decimals)}${parsed.suffix}` : value));
  const hasStarted = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value (matchMedia), same pattern used elsewhere in this codebase for reduced-motion checks.
      setDisplay(value);
      hasStarted.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (!startWhenReady || !parsed || hasStarted.current) return;
    hasStarted.current = true;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
      const eased = easeOutCubic(progress);
      const current = parsed.target * eased;
      setDisplay(`${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Land on the exact original string, not a toFixed() reconstruction,
        // so there's no possibility of drift from the source content.
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startWhenReady, parsed, value]);

  return <>{display}</>;
}

export function HomepageStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-label="ZSkillup at a glance" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1450px] px-5 sm:px-8">
        <div className="mx-auto max-w-[42rem] text-center">
          <p className="flex items-center justify-center gap-3 text-[0.75rem] font-bold tracking-[0.2em] text-brand uppercase">
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-brand/40" />
            Real People. Real Progress.
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-brand/40" />
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold text-navy sm:text-[2.5rem] lg:text-[3rem]">
            From Learning to{" "}
            <Handwritten
              underline
              className="text-[2.75rem] text-brand sm:text-[3.25rem] lg:text-[3.75rem]"
            >
              Leading
            </Handwritten>
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted sm:text-[1.0625rem]">
            Stronger partnerships. Bigger opportunities. Brighter futures.
            <br />
            Our numbers reflect real learners, real companies and real career growth.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 min-[640px]:grid-cols-3 min-[640px]:gap-4 min-[1450px]:mt-12 min-[1450px]:grid-cols-6 min-[1450px]:gap-5">
          {heroCredibilityStats.map((stat) => (
            <li key={stat.label}>
              <div className="relative aspect-square overflow-hidden rounded-card transition-transform duration-200 hover:-translate-y-0.5">
                <Image
                  src={asset(stat.image.src)}
                  alt=""
                  fill
                  sizes="(min-width: 1450px) 15vw, (min-width: 640px) 30vw, 45vw"
                  className="object-contain"
                />
                <div className="relative flex h-full flex-col px-3 py-3 sm:px-5 sm:py-6">
                  <p
                    className={`${NUMBER_SIZE} leading-none font-extrabold tracking-tight whitespace-nowrap tabular-nums ${
                      stat.highlight ? "text-white" : "text-navy"
                    }`}
                  >
                    <AnimatedStatValue value={stat.value} startWhenReady={inView} />
                  </p>
                  <p
                    className={`${LABEL_SIZE} mt-1 leading-tight font-semibold min-[640px]:mt-2 min-[640px]:leading-snug ${
                      stat.highlight ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
