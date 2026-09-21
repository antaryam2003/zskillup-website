"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { heroCredibilityStats } from "@/content/stats";
import { Icon } from "@/components/ui/Icon";
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
 * DECORATIVE ICON: each stat also carries an `icon` name, rendered small,
 * low-opacity and pinned to the bottom of the card via `mt-auto` (normal
 * flow, not absolutely positioned) - so it can never overlap the number or a
 * wrapped label regardless of how long that card's text runs, and always
 * reads as a quiet watermark rather than a competing visual. A shared
 * `GroundShape` SVG (one soft wave, tinted per card) sits behind it as an
 * absolutely-positioned backdrop clipped to the card's own rounded corners
 * (`overflow-hidden` on the card) - matching the reference's "illustration
 * sitting on a low hill" silhouette without needing a bespoke shape per
 * card, except "Placement Success Rate" (target icon), which the reference
 * shows floating with no hill under it. Two icons get a second, existing
 * icon layered in rather than standing alone, closer to the reference's own
 * composition, without drawing anything bespoke: "Highest Package" pairs
 * `crown` with the shared `sparkle` glyph behind it (the reference's
 * radiating lines), and "Average Package" pairs `coins` with a rotated
 * `arrowRight` above it (the reference's growth arrow). Every layer here is
 * `aria-hidden`/`pointer-events-none`.
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

const NUMBER_SIZE = "text-[1.5rem] min-[640px]:text-[1.875rem] min-[1450px]:text-[2.25rem]";
/** min-h reserves two lines' worth of height at each size, regardless of
    whether a given label actually needs both - "Universities & Colleges
    onboarded" (the longest label) wraps at every width while shorter labels
    like "Hiring Partners" don't, and without this the grid stretched every
    card in the row to match whichever one currently had the tallest label,
    leaving the rest visibly off-centre. Reserving the space up front keeps
    every card the same height without depending on which label happens to
    wrap - and the decorative icon below it, pinned by `mt-auto`, still lands
    on the same baseline across the whole row either way. */
const LABEL_SIZE =
  "text-[0.9375rem] min-h-10 min-[640px]:text-base min-[640px]:min-h-11 min-[1450px]:text-[1.0625rem] min-[1450px]:min-h-12";

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

/** One soft wave, stretched to fill each card's own width regardless of its
    viewBox aspect ratio (`preserveAspectRatio="none"`) - the "low hill" the
    reference sits its illustrations on. `-z-10` (paired with `relative` on
    the card) keeps it behind the number/label/icon: an absolutely
    positioned element still paints above plain in-flow siblings even at
    z-index:auto, so without this it would sit on top of them instead of
    behind. */
function GroundShape({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-14 w-full min-[1450px]:h-16 ${className}`}
    >
      <path
        d="M0 40 C 36 24, 68 48, 108 32 C 148 16, 172 36, 200 26 L200 60 L0 60 Z"
        fill="currentColor"
      />
    </svg>
  );
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
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-card px-4 py-5 shadow-card transition-shadow duration-200 hover:shadow-lift sm:px-5 sm:py-6 ${
                  stat.highlight ? "bg-gradient-stat-highlight" : "border border-line bg-white"
                }`}
              >
                <p
                  className={`${NUMBER_SIZE} leading-none font-extrabold tracking-tight whitespace-nowrap tabular-nums ${
                    stat.highlight ? "text-white" : "text-navy"
                  }`}
                >
                  <AnimatedStatValue value={stat.value} startWhenReady={inView} />
                </p>
                <p
                  className={`${LABEL_SIZE} mt-2 flex items-start leading-snug font-semibold ${
                    stat.highlight ? "text-white/85" : "text-muted"
                  }`}
                >
                  {stat.label}
                </p>
                {stat.icon === "target" ? null : (
                  <GroundShape className={stat.highlight ? "text-white/10" : "text-brand/[0.07]"} />
                )}
                <div className="mt-auto flex justify-end pt-3">
                  {(() => {
                    const tint = stat.highlight ? "text-white/30" : "text-brand/20";
                    const iconSize = "h-10 w-10 min-[1450px]:h-12 min-[1450px]:w-12";
                    if (stat.icon === "crown") {
                      const glowTint = stat.highlight ? "text-white/15" : "text-brand/10";
                      return (
                        <span className="relative grid place-items-center">
                          <Icon
                            name="sparkle"
                            className={`absolute h-16 w-16 min-[1450px]:h-20 min-[1450px]:w-20 ${glowTint}`}
                          />
                          <Icon name="crown" className={`relative ${iconSize} ${tint}`} />
                        </span>
                      );
                    }
                    if (stat.icon === "coins") {
                      return (
                        <span className="relative inline-flex">
                          <Icon
                            name="arrowRight"
                            className={`absolute -top-3 -right-1.5 h-4 w-4 -rotate-45 ${tint}`}
                          />
                          <Icon name="coins" className={`${iconSize} ${tint}`} />
                        </span>
                      );
                    }
                    return <Icon name={stat.icon} className={`${iconSize} ${tint}`} />;
                  })()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
