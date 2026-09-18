"use client";

import { useEffect, useRef, useState } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The seven-stage education-to-career path - a scroll-driven vertical
 * timeline. One line threads through the centre of all seven icons; as the
 * page scrolls, the portion of the line above a fixed reading point (40%
 * down the viewport) fills with the brand gradient, and every stage whose
 * icon sits above that point switches to its active (gradient-filled)
 * state. Scrolling back up unfills the line and deactivates stages exactly
 * the same way - there's no "played once" latch, the visual state is a
 * pure function of scroll position, recomputed on every scroll/resize
 * frame (rAF-throttled).
 *
 * Same icons, same seven stages, same order, same content as before - only
 * the presentation changed: no cards, one continuous column, no independent
 * autoplay. `prefers-reduced-motion` doesn't need special-casing here since
 * the motion is entirely scroll-controlled, not decorative - the global
 * reduced-motion rule in globals.css already collapses the smoothing
 * transition to ~0ms, which is exactly the right behaviour (state still
 * follows scroll, it just stops easing between frames).
 */

const stageIcons: IconName[] = ["graduation", "book", "file", "chart", "users", "briefcase", "trending"];

// Where the "reading point" sits in the viewport (fraction of window height)
// that scroll progress is measured against. A point in the upper-middle of
// the screen reads naturally as "the stage you're currently at."
const READING_POINT = 0.4;

export function EducationJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const [markerTops, setMarkerTops] = useState<number[] | null>(null);
  const [centerX, setCenterX] = useState(0);
  const [pointerY, setPointerY] = useState(-Infinity);

  // Measure each marker's centre, relative to the container, whenever the
  // layout changes (content reflow, viewport resize, font load, etc.).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const markers = markerRefs.current;
      if (markers.length === 0 || markers.some((m) => !m)) return;
      const containerRect = container.getBoundingClientRect();
      const tops = markers.map((m) => {
        const r = m!.getBoundingClientRect();
        return r.top - containerRect.top + r.height / 2;
      });
      const first = markers[0]!.getBoundingClientRect();
      setMarkerTops(tops);
      setCenterX(first.left - containerRect.left + first.width / 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Track scroll position as a single px value: how far the "reading point"
  // has travelled past the top of the timeline. Recomputed on scroll and
  // resize, batched to one update per animation frame.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      rafRef.current = null;
      const rect = container.getBoundingClientRect();
      setPointerY(window.innerHeight * READING_POINT - rect.top);
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

  const firstY = markerTops?.[0] ?? 0;
  const lastY = markerTops?.[markerTops.length - 1] ?? 0;
  const lineLength = Math.max(0, lastY - firstY);
  const filledPx = markerTops ? Math.min(lineLength, Math.max(0, pointerY - firstY)) : 0;

  return (
    <div className="mx-auto mt-14 w-full max-w-[640px] sm:max-w-[700px] lg:max-w-[760px]">
      <div ref={containerRef} className="relative">
        {markerTops ? (
          <>
            <span
              aria-hidden="true"
              className="absolute z-0 w-px bg-line"
              style={{ left: centerX, top: firstY, height: lineLength }}
            />
            <span
              aria-hidden="true"
              className="absolute z-0 w-px bg-gradient-icon"
              style={{
                left: centerX,
                top: firstY,
                height: filledPx,
                transition: "height 150ms ease-out",
              }}
            />
          </>
        ) : null}

        <ol className="flex flex-col">
          {journey.stages.map((stage, i) => {
            const isActive = markerTops ? pointerY >= markerTops[i] : false;
            const isLast = i === journey.stages.length - 1;
            return (
              <li
                key={stage.step}
                className={`relative z-10 flex gap-5 sm:gap-6 md:gap-8 ${isLast ? "" : "pb-10 sm:pb-12 md:pb-14"}`}
              >
                <div className="flex w-12 shrink-0 flex-col items-center sm:w-14">
                  <span
                    className={`text-[0.8125rem] font-extrabold transition-colors duration-500 ${
                      isActive ? "text-gradient" : "text-muted/50"
                    }`}
                  >
                    {stage.step}
                  </span>
                  <span
                    ref={(el) => {
                      markerRefs.current[i] = el;
                    }}
                    className={`mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-500 sm:h-12 sm:w-12 ${
                      isActive ? "bg-gradient-icon text-white" : "bg-cloud text-muted"
                    }`}
                  >
                    <Icon name={stageIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <h3
                    className={`text-[1.0625rem] font-bold transition-colors duration-500 sm:text-[1.125rem] ${
                      isActive ? "text-navy" : "text-navy/60"
                    }`}
                  >
                    {stage.title}
                  </h3>
                  <p
                    className={`mt-1.5 max-w-[46ch] text-[0.9375rem] leading-relaxed transition-colors duration-500 ${
                      isActive ? "text-body" : "text-muted/70"
                    }`}
                  >
                    {stage.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
