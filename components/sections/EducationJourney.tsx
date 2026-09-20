"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The seven-stage education-to-career path - a scroll-driven serpentine
 * timeline. At md+ widths the seven points sit in a 4+3 grid (01-04 across
 * the top row, 05-07 centred beneath it, 05 landing left-of-centre under
 * 02) connected by one continuous line: straight across each row, and an
 * orthogonal (axis-aligned only, no diagonal) staircase from 04 down and
 * left into 05, its bends rounded rather than sharp (see roundedPolyline).
 * Below md there's no room for four across, so the same seven
 * points stack in a single column - the connector logic doesn't special
 * case this, it just measures where the icons actually landed and draws
 * straight segments between vertically-stacked centres with no horizontal
 * offset, which is what a single column naturally produces.
 *
 * Progress through the seven stages is a single 0-1 fraction, `scrollFraction`,
 * applied to the path's arc length so the fill travels smoothly through the
 * turns rather than jumping. It comes from one of two sources:
 *
 *  - Normally (`!locked`): a pure function of ordinary page scroll position
 *    - how far a fixed "reading point" (40% down the viewport) has travelled
 *    past the timeline's first marker. Scrolling back up reverses it exactly;
 *    there's no "played once" latch. Page scroll is never intercepted here.
 *
 *  - While `locked`: the timeline has temporarily taken over scroll input
 *    (see "Scroll lock" below) and `scrollFraction` instead tracks
 *    accumulated wheel/touch/keyboard input directly, independent of the
 *    (frozen) page scroll position.
 *
 * Same icons, same seven stages, same order, same content, same layout,
 * connector geometry and styling as before - only the icon size (see the
 * marker span below) and the scroll-lock interaction are new.
 * `prefers-reduced-motion` doesn't need special-casing since the motion is
 * entirely scroll/input-controlled, not decorative - the global reduced-
 * motion rule in globals.css already collapses the smoothing transition to
 * ~0ms, which is exactly the right behaviour (state still follows input, it
 * just stops easing between frames).
 *
 * --- Scroll lock ---------------------------------------------------------
 *
 * When the timeline's full rendered height fits within the viewport (with a
 * little headroom) AND the user scrolls down to its top edge, ordinary page
 * scroll is suspended and further wheel/trackpad/touch/keyboard input drives
 * `lockProgress` (0-1) directly instead. Reaching 1 finishes the connector's
 * own transition, then releases the lock and hands scroll back at the exact
 * position it was suspended at, so the user's still-in-flight downward input
 * carries on naturally into whatever follows. Scrolling back up while locked
 * reverses `lockProgress`; reaching 0 releases the lock symmetrically,
 * letting the page continue scrolling up into whatever precedes it. Only a
 * SINGLE set of listeners is attached once, at mount - they no-op instantly
 * whenever `!locked`, so ordinary scrolling is completely unaffected until
 * the timeline actually engages, and nothing double-fires or accumulates.
 *
 * The "fits in the viewport" gate is deliberate: this interaction only
 * makes sense when all seven points are simultaneously visible while
 * they're activating one by one. On any viewport where the rendered
 * timeline is taller than that (most phones in portrait, stacked to a
 * single column), the lock never engages at all and the section behaves
 * exactly as it always did - a plain, always-reversible, scroll-position-
 * driven reveal that can never trap anyone, satisfying "do not leave
 * mobile users trapped" by construction rather than by an extra escape
 * hatch bolted onto a broken interaction.
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
// that natural (unlocked) scroll progress is measured against. A point in
// the upper-middle of the screen reads naturally as "the stage you're
// currently at."
const READING_POINT = 0.4;

// Clearance (px) the orthogonal 04-to-05 path travels past a point's own
// footprint before turning, so the exit/entry reads as deliberate rather
// than a bend exactly on the content's edge.
const ORTHOGONAL_CLEARANCE = 20;

// How much of each straight run is cut back and replaced with a curve at
// every bend in the 04-to-05 staircase, so it reads as one flowing turn
// rather than a rectangular path with hard corners.
const CORNER_RADIUS = 16;

// Accumulated px of wheel/touch/keyboard input it takes to go from 0% to
// 100% once locked - large enough to read as deliberate (not a hair-
// trigger), small enough it never feels like dragging through mud.
const LOCK_TRAVEL_PX = 1400;

// A single wheel/touch/key tick's contribution while locked is capped at
// this many px-equivalent, so one big trackpad flick or "page" wheel notch
// still has to cross the intermediate points rather than jumping straight
// from 01 to 07.
const LOCK_MAX_STEP_PX = 120;

// Fixed step used for the keyboard fallback (Arrow/Page/Space) - a
// deliberately smaller, steady nudge per key press.
const LOCK_KEY_STEP_PX = 90;

// The timeline only takes over scroll when its own rendered height leaves
// this much viewport height to spare - a small margin so the lock never
// engages in a razor-thin, cramped fit.
const FIT_VIEWPORT_RATIO = 0.92;

// Matches SiteHeader's own h-[4.5rem] (72px) - the sticky nav sits above
// everything (z-50) for the entire page, including while this section is
// pinned, so both the "does it fit" check and the pin point itself have to
// treat the space below the nav as the actual usable viewport. Pinning to
// raw rect.top<=0 (ignoring the nav) would tuck row one of the timeline
// under the sticky header instead of leaving it in view.
const STICKY_HEADER_PX = 72;

// How long (ms) to let the final stroke-dashoffset transition (150ms, see
// the SVG below) actually finish playing before handing scroll back, so
// reaching point 07 visibly completes rather than cutting off mid-animation.
const RELEASE_DELAY_MS = 220;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

type Box = { x: number; y: number; width: number; height: number; top: number; bottom: number };
type Segment = { d: string; length: number };

/** Turns a polyline (the cursor already sits at `start`) into path commands
    with every INTERIOR vertex rounded - a quadratic curve whose control
    point is the original sharp corner, tangent to both the incoming and
    outgoing straight runs, which is the standard way to round an axis-
    aligned corner without any diagonal shortcut. The final point is left
    as a plain line: that one has to land exactly on the next stage's
    marker centre, not be rounded away from it. Each corner's radius is
    clamped to at most half of either adjoining run, so short runs (e.g. on
    a cramped viewport) shrink the curve instead of overlapping it. */
function roundedPolyline(
  start: { x: number; y: number },
  points: { x: number; y: number }[],
  radius: number,
): Segment {
  let d = "";
  let length = 0;
  let prev = start;

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[i + 1];

    if (!next) {
      d += ` L ${curr.x} ${curr.y}`;
      length += dist(prev, curr);
      break;
    }

    const distIn = dist(prev, curr);
    const distOut = dist(curr, next);
    const r = Math.min(radius, distIn / 2, distOut / 2);

    if (r <= 0) {
      d += ` L ${curr.x} ${curr.y}`;
      length += distIn;
    } else {
      const preX = curr.x - ((curr.x - prev.x) / distIn) * r;
      const preY = curr.y - ((curr.y - prev.y) / distIn) * r;
      const postX = curr.x + ((next.x - curr.x) / distOut) * r;
      const postY = curr.y + ((next.y - curr.y) / distOut) * r;
      d += ` L ${preX} ${preY} Q ${curr.x} ${curr.y} ${postX} ${postY}`;
      // Every corner here is a 90-degree turn (all runs are axis-aligned),
      // so its curve is a touch shorter than the straight run it replaces -
      // approximated as a quarter circle rather than measured exactly, which
      // is plenty accurate for a continuously-recomputed scroll progress
      // value that's already just tracking pixel position, not physics.
      length += (distIn - r) + r * (Math.PI / 2);
    }
    prev = curr;
  }

  return { d, length };
}

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
    right, drop into the gap band between rows, travel horizontally, drop
    again, enter from the left - with every bend rounded, not sharp. */
function buildSegment(p1: Box, p2: Box, rowThreshold: number): Segment {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;

  if (Math.abs(dy) < rowThreshold || Math.abs(dx) < 4) {
    return { d: `L ${p2.x} ${p2.y}`, length: dist(p1, p2) };
  }

  const exitX = p1.x + p1.width / 2 + ORTHOGONAL_CLEARANCE;
  const entryX = p2.x - p2.width / 2 - ORTHOGONAL_CLEARANCE;
  // The middle of the actual whitespace between the two rows' content
  // blocks - p1's true bottom edge to p2's true top edge - not the marker
  // centres' own midpoint. The marker sits near the TOP of each block (icon,
  // then title, then body underneath), so averaging the two markers' y
  // positions ± half of each block's full height systematically undershoots
  // p1's real bottom and overshoots p2's real top, pulling the whole band
  // up toward row 1's text instead of centring it - which is exactly the
  // "too close to the first row, too far from the second" bug this fixes.
  const gapBandY = (p1.bottom + p2.top) / 2;

  const points = [
    { x: exitX, y: p1.y },
    { x: exitX, y: gapBandY },
    { x: entryX, y: gapBandY },
    { x: entryX, y: p2.y },
    { x: p2.x, y: p2.y },
  ];

  return roundedPolyline(p1, points, CORNER_RADIUS);
}

type SavedBodyStyle = {
  htmlOverflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  paddingRight: string;
};

export function EducationJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const [path, setPath] = useState<PathData | null>(null);
  const [pointerY, setPointerY] = useState(-Infinity);

  // --- Scroll-lock state --------------------------------------------------
  const [locked, setLocked] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);
  const lockedRef = useRef(false);
  const lockProgressRef = useRef(0);
  const lockProgressRafRef = useRef<number | null>(null);
  const savedScrollYRef = useRef(0);
  const savedBodyStyleRef = useRef<SavedBodyStyle | null>(null);
  const touchYRef = useRef<number | null>(null);

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
          top: ir.top - containerRect.top,
          bottom: ir.bottom - containerRect.top,
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

  // Suspends ordinary page scroll and hands control to the timeline. Saves
  // exactly the inline style values this touches (html overflow; body
  // position/top/left/right/width/padding-right) so they can be restored
  // verbatim rather than guessed - "" restores to whatever the stylesheet
  // already says, correct whether or not anything was inline before.
  // position:fixed (not just overflow:hidden) is what makes this reliable
  // on iOS Safari, which is well known to ignore overflow:hidden on body
  // for touch scrolling; padding-right compensates for the scrollbar that
  // disappears with html{overflow:hidden}, so page content never shifts
  // horizontally. window.scrollY is untouched by any of this - it's simply
  // preserved in savedScrollYRef and restored on release.
  const engageLock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);

    const scrollY = window.scrollY;
    savedScrollYRef.current = scrollY;

    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    savedBodyStyleRef.current = {
      htmlOverflow: html.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }, []);

  const releaseLock = useCallback(() => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    setLocked(false);

    const saved = savedBodyStyleRef.current;
    if (saved) {
      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = saved.htmlOverflow;
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.left = saved.left;
      body.style.right = saved.right;
      body.style.width = saved.width;
      body.style.paddingRight = saved.paddingRight;
    }
    savedBodyStyleRef.current = null;

    // position:fixed took the body out of flow, so the browser's own
    // scroll position is untouched underneath it the whole time - this
    // simply un-suspends it at exactly the value it was suspended at.
    // behavior: "instant" is required, not cosmetic - globals.css sets
    // html { scroll-behavior: smooth } site-wide, which would otherwise
    // make this two-argument-equivalent call animate back over ~1s,
    // visibly scrolling through a screen's worth of content and directly
    // violating "the current scroll position must remain unchanged" /
    // "do not cause sudden repositioning."
    window.scrollTo({ top: savedScrollYRef.current, left: 0, behavior: "instant" });
  }, []);

  // Natural (unlocked) scroll tracking, plus the lock's own trigger check.
  // Recomputed on scroll/resize, batched to one update per animation frame.
  // This never intercepts or prevents the browser's own scrolling by
  // itself - it only reads the current position, and calls engageLock()
  // only once the trigger condition is actually met.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = window.scrollY;

    const update = () => {
      rafRef.current = null;
      const rect = container.getBoundingClientRect();
      setPointerY(window.innerHeight * READING_POINT - rect.top);

      if (!lockedRef.current) {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY === lastScrollY ? null : currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;

        const usableViewport = window.innerHeight - STICKY_HEADER_PX;
        const fits = rect.height <= usableViewport * FIT_VIEWPORT_RATIO;
        if (fits) {
          // Scrolling down INTO the timeline's top edge, not yet complete -
          // grab scroll and start advancing from wherever lockProgress
          // already is (0 on a first visit). The pin point is the sticky
          // nav's own bottom edge, not the raw viewport top, so row one
          // lands just below the nav instead of underneath it.
          if (direction === "down" && lockProgressRef.current < 1 && rect.top <= STICKY_HEADER_PX) {
            engageLock();
            // Scrolling up from BELOW back into the timeline's bottom edge,
            // not yet back to empty - grab scroll and start retreating.
            // Gated on lockProgress > 0 so this can never re-fire the
            // instant a forward completion releases scroll and the page
            // continues down past this same boundary.
          } else if (direction === "up" && lockProgressRef.current > 0 && rect.bottom <= window.innerHeight) {
            engageLock();
          }
        }
      }
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
  }, [engageLock]);

  // Wheel/touch/keyboard input while locked. ONE set of listeners, attached
  // once at mount - every handler's first line is a no-op guard when
  // !lockedRef.current, so this has zero effect on ordinary scrolling and
  // never accumulates duplicate listeners across renders.
  useEffect(() => {
    const applyDelta = (deltaPx: number) => {
      const next = clamp01(lockProgressRef.current + deltaPx / LOCK_TRAVEL_PX);
      lockProgressRef.current = next;
      if (lockProgressRafRef.current == null) {
        lockProgressRafRef.current = requestAnimationFrame(() => {
          lockProgressRafRef.current = null;
          setLockProgress(lockProgressRef.current);
        });
      }

      // Reaching either end releases the lock - but only when input is
      // still pushing further past that end (deltaPx's own sign), not
      // merely sitting at 0 or 1, so a small overshoot-then-correct
      // gesture right at a boundary doesn't release prematurely.
      if (next >= 1 && deltaPx > 0) {
        window.setTimeout(releaseLock, RELEASE_DELAY_MS);
      } else if (next <= 0 && deltaPx < 0) {
        window.setTimeout(releaseLock, RELEASE_DELAY_MS);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      let dy = e.deltaY;
      // WheelEvent.deltaMode: 0 = pixels (trackpads, most mice), 1 = lines
      // (some mice), 2 = pages (rare) - normalised to a consistent px scale
      // before clamping, so a "line" or "page" notch doesn't register as a
      // single-pixel no-op.
      if (e.deltaMode === 1) dy *= 18;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      applyDelta(Math.max(-LOCK_MAX_STEP_PX, Math.min(LOCK_MAX_STEP_PX, dy)));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current || touchYRef.current == null) return;
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      e.preventDefault();
      const dy = touchYRef.current - y; // swipe up (content follows finger) advances, matching native scroll direction
      touchYRef.current = y;
      applyDelta(Math.max(-LOCK_MAX_STEP_PX, Math.min(LOCK_MAX_STEP_PX, dy)));
    };
    const onTouchEnd = () => {
      touchYRef.current = null;
    };

    // Keyboard fallback: while locked, body scroll is genuinely suspended,
    // so a keyboard-only user (no wheel/touch) needs an equivalent way to
    // advance/retreat and, eventually, escape - without this, reaching
    // point 07 (or scrolling back to 01) could otherwise never happen for
    // that input mode, which is exactly the "permanently stuck" outcome
    // this section must never produce.
    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        applyDelta(LOCK_KEY_STEP_PX);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        applyDelta(-LOCK_KEY_STEP_PX);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      if (lockProgressRafRef.current != null) cancelAnimationFrame(lockProgressRafRef.current);
      // Never leave the page locked behind if this component unmounts
      // mid-interaction (client-side navigation away, etc.) - releaseLock()
      // itself no-ops if it isn't currently locked.
      releaseLock();
    };
  }, [releaseLock]);

  // Scroll progress is measured vertically (how far through the section's
  // own height the reading point has travelled) then applied as a fraction
  // of the path's actual arc length, so the fill travels smoothly through
  // the turns instead of jumping. While locked, the same fraction comes
  // from accumulated input instead (see lockProgress above) - everything
  // downstream (fill length, each point's active state) is identical
  // either way, it only differs in what's driving the single number.
  const verticalSpan = path ? Math.max(1, path.lastY - path.firstY) : 1;
  const naturalFraction = path ? clamp01((pointerY - path.firstY) / verticalSpan) : 0;
  const scrollFraction = locked ? lockProgress : naturalFraction;
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
              ? scrollFraction > 0
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
                {/* 1.15rem -> 1.35rem (+17.4%, within the requested 15-20%
                    range). The h-12 w-12 (48px) well is untouched - place-
                    items-center keeps the larger icon centred automatically,
                    and 48px still leaves 13px of clearance on every side
                    (was 15px), comfortably clear of the circle's edge. */}
                <Icon name={stageIcons[i]} className="h-[1.35rem] w-[1.35rem]" />
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
