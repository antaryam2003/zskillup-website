"use client";

import { useEffect, useRef, useState } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The seven-stage education-to-career path - a scroll-driven serpentine
 * timeline. At md+ widths the seven points sit in a 4+3 grid (01-04 across
 * the top row, 05-07 centred beneath it, 05 landing left-of-centre under
 * 02) connected by one continuous line: straight across each row, and an
 * orthogonal (90-degree only, no diagonal) staircase from 04 down and left
 * into 05. Below md there's no room for four across, so the same seven
 * points stack in a single column - the connector logic doesn't special
 * case this, it just measures where the icons actually landed and draws
 * straight segments between vertically-stacked centres with no horizontal
 * offset, which is what a single column naturally produces.
 *
 * As the section scrolls, the portion of that path above a fixed reading
 * point (40% down the viewport) fills with the brand gradient - by arc
 * length, so the fill travels smoothly through the turns rather than
 * jumping - and every stage whose position on the path sits before that
 * point switches to its active (gradient-filled) state. Scrolling back up
 * reverses both exactly; there's no "played once" latch, the visual state
 * is a pure function of scroll position, recomputed on every scroll/resize
 * frame (rAF-throttled). Ordinary page scrolling is never intercepted or
 * paused - the section reads its own position on every scroll tick and
 * updates accordingly, nothing more.
 *
 * Same icons, same seven stages, same order, same content as before - only
 * the arrangement, connector geometry and (necessarily, to fit a narrow
 * grid column) the per-point layout changed from "marker left, text right"
 * to a centred stack of number/icon/title/body. No card backgrounds,
 * borders or shadows, matching the current design language.
 * `prefers-reduced-motion` doesn't need special-casing since the motion is
 * entirely scroll-controlled, not decorative - the global reduced-motion
 * rule in globals.css already collapses the smoothing transition to
 * ~0ms, which is exactly the right behaviour (state still follows scroll,
 * it just stops easing between frames).
 */

const stageIcons: IconName[] = ["graduation", "book", "file", "chart", "users", "briefcase", "trending"];

// On an 8-column md+ track with every point spanning 2 columns, points
// 01-04 auto-place into row one (4 x 2 = 8, filling it exactly). Points
// 05-07 need an explicit start so the trio centres under row one (tracks
// 2-7, one empty track on each side) instead of left-aligning under it -
// point 05 (index 4) lands under track 2-4, i.e. left-of-centre under 02.
const SECOND_ROW_START: Record<number, string> = {
  4: "md:col-start-2",
  5: "md:col-start-4",
  6: "md:col-start-6",
};

// Where the "reading point" sits in the viewport (fraction of window height)
// that scroll progress is measured against. A point in the upper-middle of
// the screen reads naturally as "the stage you're currently at."
const READING_POINT = 0.4;

// Clearance (px) the orthogonal 04-to-05 path travels past a point's own
// footprint before turning, so the exit/entry reads as deliberate rather
// than a bend exactly on the content's edge.
const ORTHOGONAL_CLEARANCE = 20;

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

type Box = { x: number; y: number; width: number; height: number };
type Segment = { d: string; length: number };

type PathData = {
  d: string;
  totalLength: number;
  cumulative: number[]; // cumulative length after connector k, index 0..COUNT-2
  centerX: number;
  firstY: number;
  lastY: number;
};

/** A point counts as "the same row" as the next if their vertical gap is
    small relative to the row height - a plain straight line. Otherwise
    it's a row change: with no horizontal offset (a single-column stack)
    that's also a straight line, just vertical; with a horizontal offset
    (the md+ 04-to-05 transition) it's an orthogonal staircase - exit
    right, drop into the gap band between rows, travel horizontally,
    drop again, enter from the left - four 90-degree bends and no
    diagonal. */
function buildSegment(p1: Box, p2: Box, rowThreshold: number): Segment {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;

  if (Math.abs(dy) < rowThreshold || Math.abs(dx) < 4) {
    return { d: `L ${p2.x} ${p2.y}`, length: dist(p1, p2) };
  }

  const exitX = p1.x + p1.width / 2 + ORTHOGONAL_CLEARANCE;
  const entryX = p2.x - p2.width / 2 - ORTHOGONAL_CLEARANCE;
  const gapBandY = (p1.y + p1.height / 2 + (p2.y - p2.height / 2)) / 2;

  const points = [
    { x: exitX, y: p1.y },
    { x: exitX, y: gapBandY },
    { x: entryX, y: gapBandY },
    { x: entryX, y: p2.y },
    { x: p2.x, y: p2.y },
  ];

  let length = dist(p1, points[0]);
  for (let i = 1; i < points.length; i++) length += dist(points[i - 1], points[i]);

  return { d: points.map((pt) => `L ${pt.x} ${pt.y}`).join(" "), length };
}

export function EducationJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const [path, setPath] = useState<PathData | null>(null);
  const [pointerY, setPointerY] = useState(-Infinity);

  // Measure the path from actual DOM positions - the icon centre anchors
  // each point (so the line threads exactly through it), the surrounding
  // list item's own box gives the clearance the orthogonal turn needs to
  // clear that point's full content, not just its icon.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const markers = markerRefs.current;
      const items = itemRefs.current;
      if (markers.length === 0 || markers.some((m) => !m) || items.some((it) => !it)) return;
      const containerRect = container.getBoundingClientRect();
      const centers: Box[] = markers.map((m, i) => {
        const mr = m!.getBoundingClientRect();
        const ir = items[i]!.getBoundingClientRect();
        return {
          x: mr.left - containerRect.left + mr.width / 2,
          y: mr.top - containerRect.top + mr.height / 2,
          width: ir.width,
          height: ir.height,
        };
      });

      let d = `M ${centers[0].x} ${centers[0].y}`;
      const cumulative: number[] = [];
      let total = 0;
      for (let i = 1; i < centers.length; i++) {
        const rowThreshold = Math.max(centers[i - 1].height, centers[i].height) * 0.3;
        const seg = buildSegment(centers[i - 1], centers[i], rowThreshold);
        d += ` ${seg.d}`;
        total += seg.length;
        cumulative.push(total);
      }

      setPath({
        d,
        totalLength: total,
        cumulative,
        centerX: centers[0].x,
        firstY: centers[0].y,
        lastY: centers[centers.length - 1].y,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Track scroll position as a single px value: how far the "reading point"
  // has travelled past the top of the timeline. Recomputed on scroll and
  // resize, batched to one update per animation frame. This never
  // intercepts or prevents the browser's own scrolling - it only reads
  // the current position.
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

  // Scroll progress is measured vertically (how far through the section's
  // own height the reading point has travelled) then applied as a fraction
  // of the path's actual arc length, so the fill travels smoothly through
  // the turns instead of jumping, and stays tied 1:1 to scroll position.
  const verticalSpan = path ? Math.max(1, path.lastY - path.firstY) : 1;
  const scrollFraction = path ? Math.min(1, Math.max(0, (pointerY - path.firstY) / verticalSpan)) : 0;
  const revealedLength = path ? scrollFraction * path.totalLength : 0;

  return (
    <div ref={containerRef} className="relative mt-14">
      {path ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="journey-progress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6b3fd6" />
              <stop offset="55%" stopColor="#a24fb8" />
              <stop offset="100%" stopColor="#e8776a" />
            </linearGradient>
          </defs>
          <path d={path.d} fill="none" stroke="#e7e9f0" strokeWidth={2} strokeLinecap="round" />
          <path
            d={path.d}
            fill="none"
            stroke="url(#journey-progress)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              strokeDasharray: path.totalLength,
              strokeDashoffset: path.totalLength - revealedLength,
              transition: "stroke-dashoffset 150ms ease-out",
            }}
          />
        </svg>
      ) : null}

      <ol className="grid grid-cols-1 gap-y-10 md:grid-cols-8 md:gap-x-4 md:gap-y-16 lg:gap-x-6">
        {journey.stages.map((stage, i) => {
          const isActive = path
            ? i === 0
              ? pointerY >= path.firstY
              : revealedLength >= path.cumulative[i - 1]
            : false;
          return (
            <li
              key={stage.step}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`relative z-10 flex flex-col items-center px-2 text-center md:col-span-2 ${SECOND_ROW_START[i] ?? ""}`}
            >
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
                className={`mt-2 grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                  isActive ? "bg-gradient-icon text-white" : "bg-cloud text-muted"
                }`}
              >
                <Icon name={stageIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
              </span>

              <h3
                className={`mt-3 text-[0.9375rem] leading-snug font-bold transition-colors duration-500 ${
                  isActive ? "text-navy" : "text-navy/60"
                }`}
              >
                {stage.title}
              </h3>
              <p
                className={`mt-1.5 max-w-[15rem] text-[0.8125rem] leading-relaxed transition-colors duration-500 ${
                  isActive ? "text-body" : "text-muted/70"
                }`}
              >
                {stage.body}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
