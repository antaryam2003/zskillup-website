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
 * INTERACTION: this is a scroll-locked sequence, not a free-scrolling
 * reveal. When normal downward page scroll brings the section's top edge
 * to the top of the viewport, page scrolling is intercepted (wheel/touch
 * events are preventDefault'd, so the page never actually moves - no
 * body-overflow or position:fixed tricks, so there's nothing to cause a
 * layout jump or scrollbar flicker) and that input instead drives
 * `timelineProgress` from 0 to 1. Points activate in order as progress
 * passes each one's position on the path (by arc length, so the fill
 * travels smoothly through the turn rather than jumping). Once progress
 * reaches 1 and the user scrolls down again, the lock releases and that
 * scroll passes through untouched, continuing to the next section -
 * symmetrically, entering from below and scrolling up drives progress
 * from 1 back to 0, releasing upward once it hits 0. The state itself
 * (`timelineProgress`) persists between lock engagements, so re-entering
 * from either direction always resumes exactly where the last pass left
 * off, which is what makes both directions naturally symmetric without
 * any special-cased reset.
 *
 * Same icons, same seven stages, same order, same content, same visual
 * design as before - only the interaction driving `timelineProgress`
 * changed, from continuous scroll position to this locked/captured input.
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

// Clearance (px) the orthogonal 04-to-05 path travels past a point's own
// footprint before turning, so the exit/entry reads as deliberate rather
// than a bend exactly on the content's edge.
const ORTHOGONAL_CLEARANCE = 20;

// Wheel/touch pixels needed to sweep timelineProgress from 0 to 1. Touch
// drags cover far fewer pixels per gesture than a wheel/trackpad session,
// so it gets its own (shorter) distance rather than feeling like it takes
// forever to complete on a phone.
const WHEEL_SCROLL_DISTANCE_PX = 2200;
const TOUCH_SCROLL_DISTANCE_PX = 1400;

// Clamp any single wheel/touch event's contribution so one very large
// delta (a hard trackpad flick, a fast mouse-wheel notch) can't skip
// straight from 0 to 1 in one step - progress still has to sweep through
// every intermediate frame, just potentially in fewer, larger steps.
const MAX_DELTA_PX = 120;

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Box = { x: number; y: number; width: number; height: number };
type Segment = { d: string; length: number };

type PathData = {
  d: string;
  totalLength: number;
  cumulative: number[]; // cumulative length after connector k, index 0..COUNT-2
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

function normalizeWheelDeltaY(e: WheelEvent) {
  // deltaMode 0 = pixels (trackpads, most modern mice) - used as-is.
  // 1 = lines (some traditional wheel mice) - approximate a line as 16px.
  // 2 = pages - approximate a page as the viewport height.
  if (e.deltaMode === 1) return e.deltaY * 16;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

export function EducationJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [path, setPath] = useState<PathData | null>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  // Refs mirror the two pieces of state that event handlers need to read
  // synchronously (handlers are attached once, on mount - they can't close
  // over fresh state each render without resubscribing, which risks
  // duplicate listeners and stale-closure bugs).
  const progressRef = useRef(0);
  const lockedRef = useRef(false);

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

      setPath({ d, totalLength: total, cumulative });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Trigger detection: a passive scroll listener that only watches for the
  // section's top/bottom edge CROSSING the viewport's top/bottom between
  // two consecutive scroll samples (rather than checking "are we currently
  // near zero"), so a single large scroll jump (fast trackpad flick, a
  // momentum-scroll on mobile) still reliably engages the lock instead of
  // skipping past a narrow trigger window. Entering from above (scrolling
  // down, section top crosses the viewport top) engages with whatever
  // progress was last left at; entering from below (scrolling up, section
  // bottom crosses the viewport bottom) does the same - progress isn't
  // reset on engagement, so a fresh page load naturally starts at 0 (point
  // 01 active) and a re-entry from below after a completed pass naturally
  // starts at 1 (point 07 active), exactly matching each direction's
  // expected starting state without any special-cased assignment.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let prevTop: number | null = null;
    let prevBottom: number | null = null;
    let lastScrollY = window.scrollY;

    const evaluate = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const currentY = window.scrollY;
      const goingDown = currentY >= lastScrollY;
      lastScrollY = currentY;

      if (!lockedRef.current) {
        if (
          goingDown &&
          prevTop != null &&
          prevTop > 0 &&
          rect.top <= 0 &&
          progressRef.current < 1
        ) {
          lockedRef.current = true;
          setIsScrollLocked(true);
        } else if (
          !goingDown &&
          prevBottom != null &&
          prevBottom < vh &&
          rect.bottom >= vh &&
          progressRef.current > 0
        ) {
          lockedRef.current = true;
          setIsScrollLocked(true);
        }
      }

      prevTop = rect.top;
      prevBottom = rect.bottom;
    };

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, []);

  // The actual scroll-capture: while locked, wheel/touch input drives
  // timelineProgress instead of the page. `processDelta` returns whether
  // the input was consumed (progress updated, page scroll must be
  // prevented) or released (progress was already at the edge the user is
  // pushing past, so the lock drops and this same input must be allowed
  // to reach the page normally - releasing on the very event that pushed
  // past the edge, rather than one tick later, is what keeps this from
  // ever feeling like it "eats" one extra scroll before letting go).
  useEffect(() => {
    function processDelta(deltaPx: number, distance: number): boolean {
      if (!lockedRef.current) return false;

      const atEnd = progressRef.current >= 1;
      const atStart = progressRef.current <= 0;
      if ((atEnd && deltaPx > 0) || (atStart && deltaPx < 0)) {
        lockedRef.current = false;
        setIsScrollLocked(false);
        return false;
      }

      const clamped = clamp(deltaPx, -MAX_DELTA_PX, MAX_DELTA_PX);
      const next = clamp(progressRef.current + clamped / distance, 0, 1);
      progressRef.current = next;
      setTimelineProgress(next);
      return true;
    }

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      const consumed = processDelta(normalizeWheelDeltaY(e), WHEEL_SCROLL_DISTANCE_PX);
      if (consumed) e.preventDefault();
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current || touchY == null) return;
      const currentY = e.touches[0]?.clientY;
      if (currentY == null) return;
      // Finger moving up the screen (currentY < touchY) reads as
      // "scrolling down" intent, matching wheel's sign convention.
      const deltaPx = touchY - currentY;
      touchY = currentY;
      const consumed = processDelta(deltaPx, TOUCH_SCROLL_DISTANCE_PX);
      if (consumed) e.preventDefault();
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  const revealedLength = path ? timelineProgress * path.totalLength : 0;

  return (
    <div ref={containerRef} className="relative mt-14" data-scroll-locked={isScrollLocked}>
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
          // Point 01 is the sequence's starting point - active from the
          // moment the section is reached, at 0% progress, not only once
          // scrolled past. Every later point activates once progress has
          // swept far enough along the path's arc length to reach it.
          const isActive = path ? (i === 0 ? true : revealedLength >= path.cumulative[i - 1]) : i === 0;
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
