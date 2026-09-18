"use client";

import { useEffect, useRef, useState } from "react";
import { institutions } from "@/content/homepage";
import { Heading } from "@/components/ui/Section";

/**
 * "Designed around your institution" - the four-step method that reads as
 * ONE connected process.
 *
 * On entering the viewport it plays through 01 -> 02 -> 03 -> 04 once, with
 * the dashed connector's purple fill travelling segment by segment between
 * each pair, holds the completed state briefly, then resets and repeats for
 * as long as the section stays visible. Leaving the viewport cancels the
 * sequence and resets it, so scrolling back always replays from 01 rather
 * than resuming stuck mid-way.
 *
 * `phase` drives the whole sequence:
 *   0        - nothing active (initial / reset state)
 *   1,3,5,7  - step 1..4 has just activated
 *   2,4,6    - the connector between two steps is travelling
 * `prefers-reduced-motion` skips the cycle entirely and holds phase 7 (the
 * completed state), matching how this block looked before this animation -
 * no motion, nothing missing.
 */

const SEQUENCE: { phase: number; delay: number }[] = [
  { phase: 1, delay: 0 },
  { phase: 2, delay: 900 },
  { phase: 3, delay: 1750 },
  { phase: 4, delay: 2600 },
  { phase: 5, delay: 3450 },
  { phase: 6, delay: 4300 },
  { phase: 7, delay: 5150 },
  { phase: 0, delay: 6800 },
];
const CYCLE_MS = 7300;

function activeCount(phase: number) {
  if (phase >= 7) return 4;
  if (phase >= 5) return 3;
  if (phase >= 3) return 2;
  if (phase >= 1) return 1;
  return 0;
}

/** 'idle' | 'filling' | 'filled' for connector gap `i` (0 = 01-02, 1 = 02-03, 2 = 03-04). */
function gapFilled(phase: number, gap: number) {
  const fillingPhase = gap * 2 + 2;
  return phase >= fillingPhase;
}

export function InstitutionsMethod() {
  const ref = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);
  // Starts false to match the SSR output exactly (there's no `window` at
  // build time) - reading matchMedia via a useState lazy initializer instead
  // would disagree with the prerendered HTML, and React's hydration pass
  // doesn't reliably repair a mismatched className on attach. Setting it in
  // an effect makes this a normal post-hydration update instead, which does.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState(0);
  const cycling = inView && !reducedMotion;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value (matchMedia); see the state comment above.
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Only the timer-driven updates (inside the setTimeout callbacks below) set
  // `phase` from here - when the cycle isn't running, `displayPhase` below
  // derives the right static value directly instead of writing state.
  useEffect(() => {
    if (!cycling) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, delay),
      );
    };

    const runCycle = () => {
      SEQUENCE.forEach(({ phase: p, delay }) => schedule(() => setPhase(p), delay));
      schedule(runCycle, CYCLE_MS);
    };
    runCycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycling]);

  // Reduced motion holds the completed state (how this block looked before
  // this animation existed); out of view holds the initial state; otherwise
  // the running cycle's own `phase` state drives it.
  const displayPhase = reducedMotion ? 7 : !inView ? 0 : phase;
  const active = activeCount(displayPhase);

  return (
    <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-3">
        <Heading as="h3" plain={institutions.methodHeadline} size="sm" />
        <p className="mt-4 leading-relaxed text-body">{institutions.methodBody}</p>
      </div>

      <div className="relative lg:col-span-9">
        {/* The dashed connector is what makes four steps read as one process
            rather than four independent feature cards. A purple overlay per
            segment grows left-to-right on top of the original light-pink
            dashes as each step activates - the base line never disappears. */}
        <div aria-hidden="true" className="absolute top-7 left-[12%] hidden w-[76%] lg:flex">
          {[0, 1, 2].map((gap) => (
            <div
              key={gap}
              className="relative h-0 flex-1 border-t-2 border-dashed border-[#e3a9b8]"
            >
              <div
                className={`absolute inset-0 origin-left border-t-2 border-dashed border-inst transition-transform ease-linear ${
                  gapFilled(displayPhase, gap) ? "scale-x-100 duration-[850ms]" : "scale-x-0 duration-300"
                }`}
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
