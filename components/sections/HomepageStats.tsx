"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { heroCredibilityStats } from "@/content/stats";

/**
 * CREDIBILITY STRIP - sits directly between Hero and About.
 *
 * A compact row of six figures, each its own white card - no heading, no
 * icons, per the reference this was built from. Kept as its own lightweight
 * section (not the shared <Section> shell) because that component's standard
 * py-20/24/28 vertical padding is built for a full section with a heading;
 * this strip is deliberately much shorter.
 *
 * The outer field is `bg-cloud` - a very light, near-white neutral (not the
 * page's plain white) so the white stat cards still read as distinct cards
 * against it, the same purpose the previous warm-pink field served, just
 * without introducing a saturated colour. Figures are `text-navy`, the same
 * "black" the rest of the site's dark text uses, rather than a literal
 * `text-black` this design system doesn't otherwise use anywhere.
 *
 * Deliberately NOT the shared <Container> (max-w-[1240px]): six cards in one
 * row leaves each just ~179px wide inside that width - checked directly
 * against this layout, that's too narrow for "₹5.6 LPA" (the longest
 * figure) to stay on one line at a legible size, and that width never grows
 * past this regardless of viewport, since Container plateaus at 1240px. A
 * dedicated, wider max-width - the same fix the Hero cards row uses for the
 * same reason - gives every card real room to spare once six-across is safe.
 *
 * Six-across only switches on at 1450px (a checked, not guessed, threshold -
 * see below), not at the `lg` grid's usual 1024px: below 1450px, six cards
 * genuinely can't fit "₹5.6 LPA" at a legible size no matter how the width
 * is redistributed, so per the brief's own fallback ("if necessary, use a
 * 3×2 layout rather than forcing six cramped cards into one row") the strip
 * stays 3×2 for every width from tablet up through smaller desktop screens,
 * and only becomes a single row once there's genuinely enough room for it.
 *
 * The 3-up and 6-up breakpoints below both use `min-[Npx]:` rather than the
 * named `sm:` - mixing a named breakpoint with an arbitrary one on the same
 * property (e.g. `sm:text-[...] min-[1450px]:text-[...]`) compiles fine but
 * loses the cascade at wide viewports: both conditions end up true at once,
 * and the named variant's rule sorts after the arbitrary one regardless of
 * which is visually wider, so `sm:` silently wins and 1450px+ never applies.
 * Sticking to `min-[]:` throughout keeps every tier sorted by its actual
 * pixel value, so the widest matching breakpoint reliably wins.
 *
 * COUNT-UP ANIMATION: each figure parses into a numeric target plus the
 * exact prefix/suffix text around it ("₹" / " LPA", "+", "%+" and so on) and
 * how many decimal places it originally had (one for "₹5.6 LPA", zero for
 * every other figure) - so intermediate frames re-attach the same prefix/
 * suffix and decimal precision the final value has, and the animation can
 * never land on anything but the exact original string. Triggered once, by
 * a single IntersectionObserver on the whole strip (not one per card, so
 * all six start together) - it disconnects itself the moment it fires, which
 * is what guarantees "play once" and rules out a restart from scrolling
 * away and back. `prefers-reduced-motion` skips the animation and renders
 * the final values immediately, consistent with how decorative (not user-
 * driven) motion is handled elsewhere on this site. */

const NUMBER_SIZE = "text-[1.5rem] min-[640px]:text-[1.875rem] min-[1450px]:text-[2.25rem]";
/** min-h reserves two lines' worth of height at each size, regardless of
    whether a given label actually needs both - "College Partnerships" (the
    longest label) wraps at several widths while the five shorter labels
    don't, and without this the grid stretched every card in the row to
    match whichever one currently had the tallest label, leaving the rest
    visibly off-centre. Reserving the space up front keeps every card the
    same height without depending on which label happens to wrap. */
const LABEL_SIZE =
  "text-base min-h-11 min-[640px]:text-[1.0625rem] min-[640px]:min-h-12 min-[1450px]:text-[1.125rem] min-[1450px]:min-h-[3.25rem]";

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
    <section ref={sectionRef} aria-label="ZSkillup at a glance" className="bg-cloud py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1450px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-2 min-[640px]:grid-cols-3 min-[640px]:gap-4 min-[1450px]:grid-cols-6 min-[1450px]:gap-5">
          {heroCredibilityStats.map((stat) => (
            <li key={stat.label}>
              <div className="flex h-full flex-col items-center justify-center rounded-tile bg-white px-3 py-5 text-center shadow-card sm:px-4 sm:py-6">
                <p
                  className={`${NUMBER_SIZE} leading-none font-extrabold tracking-tight whitespace-nowrap text-navy tabular-nums`}
                >
                  <AnimatedStatValue value={stat.value} startWhenReady={inView} />
                </p>
                <p
                  className={`${LABEL_SIZE} mt-2.5 flex items-center justify-center leading-snug font-semibold text-navy`}
                >
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
