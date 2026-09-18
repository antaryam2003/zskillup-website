"use client";

import { useEffect, useRef, useState } from "react";
import { institutions } from "@/content/homepage";
import { Heading } from "@/components/ui/Section";

/**
 * "Designed around your institution" - the four-step method that reads as
 * ONE connected process.
 *
 * On entering the viewport it plays through 01 -> 02 -> 03 -> 04 exactly
 * ONCE, with the dashed connector's purple fill travelling segment by
 * segment between each pair, then holds the completed state permanently -
 * no reset, no repeat, even if the user scrolls away and back. A ref (not
 * state) guards the start so re-entering the viewport later never
 * re-triggers it, and the IntersectionObserver callback schedules the
 * timers directly (outside React's effect-cleanup cycle) so the sequence
 * keeps running to completion in the background even if the section
 * scrolls out of view again before it finishes.
 *
 * `phase` drives the sequence: 0 = nothing active yet; 1,3,5,7 = step
 * 1..4 has just activated; 2,4,6 = the connector to the next step is
 * travelling. It only ever counts up, once, from 0 to 7.
 *
 * Each connector segment is two stacked, identically-sized dashed lines -
 * a light base and a purple overlay revealed left-to-right via
 * `clip-path` - rather than a `scale-x` grow, because scaling redraws the
 * dash pattern at a stretched size and leaves the base dashes visible
 * through the gaps. Clipping never resizes either line, so the purple
 * dashes land exactly on top of the base ones as they're revealed.
 *
 * `prefers-reduced-motion` skips the sequence entirely and holds phase 7
 * (the completed state), matching how this block looked before this
 * animation existed - no motion, nothing missing.
 */

const SEQUENCE: { phase: number; delay: number }[] = [
  { phase: 1, delay: 0 },
  { phase: 2, delay: 900 },
  { phase: 3, delay: 1750 },
  { phase: 4, delay: 2600 },
  { phase: 5, delay: 3450 },
  { phase: 6, delay: 4300 },
  { phase: 7, delay: 5150 },
];

function activeCount(phase: number) {
  if (phase >= 7) return 4;
  if (phase >= 5) return 3;
  if (phase >= 3) return 2;
  if (phase >= 1) return 1;
  return 0;
}

/** Has connector gap `i` (0 = 01-02, 1 = 02-03, 2 = 03-04) finished revealing? */
function gapRevealed(phase: number, gap: number) {
  const revealPhase = gap * 2 + 2;
  return phase >= revealPhase;
}

export function InstitutionsMethod() {
  const ref = useRef<HTMLOListElement>(null);
  const hasStarted = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Starts false to match the SSR output exactly (there's no `window` at
  // build time) - reading matchMedia via a useState lazy initializer instead
  // would disagree with the prerendered HTML, and React's hydration pass
  // doesn't reliably repair a mismatched className on attach. Setting it in
  // an effect makes this a normal post-hydration update instead, which does.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value (matchMedia); see the state comment above.
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        // A fresh check here (rather than the `reducedMotion` state) avoids
        // a stale closure - this callback is created once, on mount.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        hasStarted.current = true;
        SEQUENCE.forEach(({ phase: p, delay }) => {
          timers.current.push(setTimeout(() => setPhase(p), delay));
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      // `timers.current` is deliberately mutated after setup, by the
      // callback above as each phase fires - not a stale ref, the array
      // it points to (never reassigned) simply grows over time.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const displayPhase = reducedMotion ? 7 : phase;
  const active = activeCount(displayPhase);

  return (
    <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-3">
        <Heading as="h3" plain={institutions.methodHeadline} size="sm" />
        <p className="mt-4 leading-relaxed text-body">{institutions.methodBody}</p>
      </div>

      <div className="relative lg:col-span-9">
        {/* The dashed connector is what makes four steps read as one process
            rather than four independent feature cards. Each segment is a
            light base line plus a purple line revealed on top of it via
            clip-path, so the base never shows through the revealed portion. */}
        <div aria-hidden="true" className="absolute top-7 left-[12%] hidden w-[76%] lg:flex">
          {[0, 1, 2].map((gap) => (
            <div key={gap} className="relative h-0 flex-1">
              <div className="absolute inset-0 border-t-2 border-dashed border-[#e3a9b8]" />
              <div
                className="absolute inset-0 border-t-2 border-dashed border-inst transition-[clip-path] ease-linear"
                style={{
                  clipPath: gapRevealed(displayPhase, gap) ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transitionDuration: "850ms",
                }}
              />
            </div>
          ))}
        </div>

        <ol ref={ref} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {institutions.method.map((step, i) => {
            const isActive = i < active;
            return (
              <li key={step.step} className="relative text-center">
                <span
                  className={`relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-inst text-[0.9375rem] font-extrabold transition-colors duration-500 ${
                    isActive ? "bg-inst text-white" : "bg-white text-inst"
                  }`}
                >
                  {step.step}
                </span>
                <h4 className="mt-4 text-[1.0625rem] font-bold text-navy">{step.title}</h4>
                <p className="mx-auto mt-2 max-w-[24ch] text-[0.875rem] leading-relaxed text-body">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
