"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Stat } from "@/content/stats";

/**
 * The "For Institutions" credibility trio (Partner Institutions / Students
 * Trained / Placement Readiness Verified), count-up animated from 0 once the
 * block scrolls into view.
 *
 * Same parse-prefix/target/decimals/suffix-and-snap-to-the-exact-source-
 * string approach as the homepage credibility strip (see HomepageStats),
 * kept as its own local copy rather than a shared import so this section's
 * animation stays fully self-contained. One addition: "1 lakh+" has a
 * target of just 1, which would otherwise sit at "0 lakh+" for nearly the
 * whole animation and then snap straight to "1 lakh+" - visibly less smooth
 * than the other two figures. For any target under 10 the *in-flight*
 * frames render one decimal place (e.g. "0.4 lakh+") purely for a smoother
 * ramp; the very last frame always renders the exact original string, so
 * the animation can never land on anything but "1 lakh+" (never "1.0 lakh+"
 * or a raw "100000").
 */

const COUNT_DURATION_MS = 1600;

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
  // In-flight frames use extra decimal precision for small targets (like the
  // "1" in "1 lakh+") purely so the ramp reads as motion; the final frame
  // always snaps to the exact source string regardless of this value.
  const animDecimals = parsed ? (parsed.decimals === 0 && parsed.target < 10 ? 1 : parsed.decimals) : 0;
  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}${(0).toFixed(animDecimals)}${parsed.suffix}` : value,
  );
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
      // Clamped at 0: the rAF timestamp can precede the performance.now() taken
      // above, which would otherwise render a negative first frame ("-1+").
      const progress = Math.min(1, Math.max(0, (now - start) / COUNT_DURATION_MS));
      const eased = easeOutCubic(progress);
      const current = parsed.target * eased;
      setDisplay(`${parsed.prefix}${current.toFixed(animDecimals)}${parsed.suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startWhenReady, parsed, value, animDecimals]);

  return <>{display}</>;
}

export function InstitutionsStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  // Below lg the trio sits in one 3-column row (a fixed grid can't wrap to a
  // second line the way flex-wrap did; each label wraps inside its own column
  // instead). From lg up it becomes the reference's vertical stack: big
  // number, label, then a short hairline before the next figure. The outer
  // vertical divider lives on the wrapper in Institutions.tsx.
  return (
    <dl
      ref={ref}
      className="grid grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-1 lg:gap-x-0 lg:gap-y-7"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={
            i > 0
              ? "border-l border-[#e6e2f3] pl-3 sm:pl-4 lg:border-l-0 lg:pl-0 lg:before:mb-7 lg:before:block lg:before:h-px lg:before:w-24 lg:before:bg-[#e6e2f3] lg:before:content-['']"
              : ""
          }
        >
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block text-[1.5rem] font-extrabold tracking-tight text-black sm:text-[1.75rem] lg:text-[2.25rem] lg:leading-none">
              <AnimatedStatValue value={stat.value} startWhenReady={inView} />
            </span>
            <span
              aria-hidden="true"
              className="mt-1 block text-[0.8125rem] leading-snug text-muted lg:mt-2 lg:text-[1.0625rem]"
            >
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
