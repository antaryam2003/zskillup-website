"use client";

import { useEffect, useRef, useState } from "react";
import { institutions } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * "A Proven Journey / Designed around your institution" - the four-step method
 * that reads as ONE connected process. Renders the eyebrow, heading, intro and
 * the steps; the purple CTA card beside it is composed in Institutions.tsx.
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
 * 03; 1 -> 04, line fully filled. Each connector is a solid light bar with a
 * purple overlay revealed left-to-right (top-to-bottom on mobile), never a
 * dashed or doubled line - only ever the inactive colour being progressively
 * replaced by the active one.
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

/** One icon per step, in order: Assess, Build, Train, Track. */
const stepIcons: IconName[] = ["users", "book", "graduation", "chart"];

/** How much of the connector AFTER step `index` is filled (0-1). */
function connectorFill(progress: number, index: number) {
  return Math.min(1, Math.max(0, progress * 3 - index));
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
  const lastIndex = institutions.method.length - 1;

  return (
    <div>
      <p className="eyebrow text-[#59608c]!">{institutions.methodEyebrow}</p>
      <h3 className="mt-4 text-[2rem] leading-[1.1] font-extrabold text-navy sm:text-[2.5rem]">
        {institutions.methodHeadline}
      </h3>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
        {institutions.methodBody}
      </p>

      <div ref={containerRef} className="mt-10">
        <ol className="grid gap-8 md:grid-cols-4 md:gap-x-0">
          {institutions.method.map((step, i) => {
            const isActive = i < active;
            return (
              <li key={step.step} className="relative flex gap-4 md:block">
                <div className="md:flex md:items-center">
                  <span
                    className={`relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-inst transition-colors duration-500 ${
                      isActive
                        ? "bg-gradient-to-br from-[#6d3fe0] to-[#8a4fd8] text-white shadow-[0_10px_24px_-10px_rgba(91,43,203,0.7)]"
                        : "bg-white text-inst"
                    }`}
                  >
                    <Icon name={stepIcons[i]} className="h-7 w-7" />
                  </span>

                  {/* Connector to the next step: vertical between stacked
                      steps on mobile, horizontal from md up. */}
                  {i < lastIndex ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-16 -bottom-8 left-8 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-[#d9cff6] md:static md:mx-3 md:h-0.5 md:w-auto md:flex-1 md:translate-x-0"
                    >
                      <span
                        className="block h-full w-full origin-top rounded-full bg-inst transition-transform ease-out [transform:scaleY(var(--fill))] md:origin-left md:[transform:scaleX(var(--fill))]"
                        style={
                          {
                            "--fill": connectorFill(progress, i),
                            transitionDuration: "150ms",
                          } as React.CSSProperties
                        }
                      />
                    </span>
                  ) : null}
                </div>

                <div className="pt-1 md:mt-5 md:max-w-[15rem] md:pt-0 md:pr-4">
                  <h4 className="text-[1.125rem] font-bold text-navy">{step.title}</h4>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
