"use client";

import { useEffect, useRef, useState } from "react";
import { institutions } from "@/content/homepage";
import { Heading } from "@/components/ui/Section";

/**
 * "Designed around your institution" - the four-step method that reads as
 * ONE connected process.
 *
 * Scroll-driven, continuously, the same way EducationJourney animates the
 * seven-stage path: a single progress value (0-1) derived purely from this
 * block's own position in the viewport drives both the connector fill and
 * which steps read as active. There is no autoplay, no timers and no
 * "played once" latch - scrolling back up unwinds the fill and deactivates
 * steps exactly as scrolling down revealed them, and ordinary page
 * scrolling is never intercepted or paused, only read on every
 * scroll/resize frame (rAF-throttled).
 *
 * Progress 0 -> step 01 has just activated (the line hasn't started toward
 * 02 yet); progress 1/3 -> the line has reached 02 and it activates; 2/3 ->
 * 03; 1 -> 04, line fully filled. The connector is ONE solid bar (a light
 * base plus a purple overlay revealed by width, not three separate dashed
 * segments) so there is never a doubled or dotted line - only ever the
 * inactive colour being progressively replaced by the active one.
 *
 * `prefers-reduced-motion` needs no special-casing here, for the same
 * reason EducationJourney doesn't: the motion is entirely scroll-position
 * driven, not decorative, and the global reduced-motion rule in globals.css
 * already collapses the connector/colour transitions to ~0ms - state still
 * follows scroll, it just stops easing between frames.
 */

/** Where in the viewport (fraction of window height) this row's progress
    starts (0) and finishes (1) as its top edge passes through. A ~half a
    viewport scroll distance, matching the settled feel of the reading point
    EducationJourney uses further down the page. */
const START_VH = 0.85;
const END_VH = 0.35;

function activeCount(progress: number) {
  if (progress >= 1) return 4;
  if (progress >= 2 / 3) return 3;
  if (progress >= 1 / 3) return 2;
  if (progress > 0) return 1;
  return 0;
}

export function InstitutionsMethod() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      rafRef.current = null;
      const rect = container.getBoundingClientRect();
      const startY = window.innerHeight * START_VH;
      const endY = window.innerHeight * END_VH;
      const raw = (startY - rect.top) / (startY - endY);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const active = activeCount(progress);

  return (
    <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-3">
        <Heading as="h3" plain={institutions.methodHeadline} size="sm" />
        <p className="mt-4 leading-relaxed text-body">{institutions.methodBody}</p>
      </div>

      <div ref={containerRef} className="relative lg:col-span-9">
        {/* One continuous solid connector: a light base bar plus a purple
            fill overlay revealed by width, never a dashed or doubled line. */}
        <div aria-hidden="true" className="absolute top-7 left-[12%] hidden h-0.5 w-[76%] lg:block">
          <div className="absolute inset-0 rounded-full bg-[#e3a9b8]" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-inst transition-[width] ease-out"
            style={{ width: `${progress * 100}%`, transitionDuration: "150ms" }}
          />
        </div>

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
