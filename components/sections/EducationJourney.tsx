"use client";

import { useEffect, useRef, useState } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The seven-stage education-to-career path.
 *
 * Desktop/tablet (md+): a 4+3 grid on an 8-column track (each card spans 2
 * tracks). Stages 1-4 fill the first row via plain auto-placement; 5-7 get
 * explicit `col-start` values (2, 4, 6) so the group sits centred under the
 * first row, with one empty track on each side, rather than left-aligned.
 * Mobile: a single vertical column, same order.
 *
 * A single SVG/HTML overlay - one continuous path threading through every
 * stage's centre - draws the connective line and carries a travelling arrow
 * marker. Both sit at a lower z-index than the cards (which are `z-10`), so
 * they always render behind them; card backgrounds are opaque, so the path
 * only reads as visible in the gaps between cards and never appears to cut
 * through card content.
 *
 * The path shape is entirely position-driven, not viewport-branched: for
 * each pair of consecutive stages, if they measure out to roughly the same
 * row, a straight line is drawn. If they're on different rows with no
 * horizontal offset (the mobile single-column stack), it's also a straight
 * line - vertical this time. Only a different row WITH a horizontal offset
 * (the desktop 4-to-5 transition) gets the orthogonal treatment: exit the
 * first card's right side, drop into the open band between the rows, travel
 * horizontally across it, drop again, then enter the next card from its
 * left side - four 90-degree bends, no diagonal segment anywhere, and the
 * horizontal run sits entirely in the gap between rows so nothing occludes
 * it. Whichever shape applies, cards remain the layer on top.
 *
 * On entering the viewport the sequence plays ONCE (Institutions-method
 * pattern: a ref-guarded IntersectionObserver, timers scheduled outside
 * React's effect-cleanup cycle so they finish in the background even if the
 * section scrolls out of view mid-sequence) - stage 1 activates, the arrow
 * travels the connector to stage 2, stage 2 activates, and so on through
 * stage 7, then holds. `prefers-reduced-motion` skips straight to that held
 * state.
 */

const stageIcons: IconName[] = ["graduation", "book", "file", "chart", "users", "briefcase", "trending"];

const COUNT = journey.stages.length;

// On an 8-column desktop track with every card spanning 2 columns, stages
// 1-4 auto-place into row one (4 x 2 = 8, filling it exactly). Stages 5-7
// need an explicit start so the group centres under row one (tracks 2-7,
// leaving one empty track on each side) instead of left-aligning under it.
const SECOND_ROW_START: Record<number, string> = {
  4: "md:col-start-2",
  5: "md:col-start-4",
  6: "md:col-start-6",
};

// Timing (ms). The curve (connector index 3, between stage 4 and 5) gets a
// touch more room since it's visually the longest, most eventful segment.
const ACTIVATE_MS = 450;
const PAUSE_MS = 300;
const TRAVEL_MS = 750;
const CURVE_PAUSE_MS = 350;
const CURVE_TRAVEL_MS = 950;
const HOLD_MS = 650;
const CURVE_CONNECTOR_INDEX = 3;

type Sequence = { phase: number; delay: number }[];

function buildSequence(count: number): { sequence: Sequence; totalMs: number } {
  const sequence: Sequence = [];
  let t = 0;
  for (let k = 1; k <= count; k++) {
    sequence.push({ phase: 2 * k - 1, delay: t });
    t += ACTIVATE_MS;
    if (k < count) {
      const isCurve = k - 1 === CURVE_CONNECTOR_INDEX;
      t += isCurve ? CURVE_PAUSE_MS : PAUSE_MS;
      sequence.push({ phase: 2 * k, delay: t });
      t += isCurve ? CURVE_TRAVEL_MS : TRAVEL_MS;
    }
  }
  return { sequence, totalMs: t };
}

const { sequence: SEQUENCE, totalMs: SEQUENCE_END_MS } = buildSequence(COUNT);
const MAX_PHASE = 2 * COUNT - 1;

function activeCount(phase: number) {
  return Math.min(COUNT, Math.max(0, Math.ceil(phase / 2)));
}

/** Number of connectors (0..COUNT-1) fully revealed at this phase. */
function revealedSegments(phase: number) {
  return Math.min(COUNT - 1, Math.floor(phase / 2));
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

type Box = { x: number; y: number; width: number; height: number };
type Segment = { d: string; length: number };

type PathData = {
  d: string;
  totalLength: number;
  cumulative: number[]; // cumulative length after connector k, index 0..COUNT-2
  width: number;
  height: number;
};

// Clearance (px) the orthogonal 4-to-5 path travels past a card's edge
// before turning, so the exit/entry reads as deliberate rather than a bend
// exactly on the card boundary.
const ORTHOGONAL_CLEARANCE = 20;

/** A point counts as "the same row" as the next if their vertical gap is
    small relative to the card height - a plain straight line. Otherwise
    it's a row change: with no horizontal offset (the mobile stack) that's
    also a straight line, just vertical; with a horizontal offset (the
    desktop 4-to-5 transition) it's an orthogonal staircase - exit right,
    drop into the gap band between rows, travel horizontally, drop again,
    enter from the left - four 90-degree bends and no diagonal. */
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
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hasStarted = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [path, setPath] = useState<PathData | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState(0);
  const [arrowVisible, setArrowVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value (matchMedia); starts false to match SSR output, see InstitutionsMethod for the same pattern.
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const cards = cardRefs.current;
      if (cards.some((c) => !c)) return;
      const containerRect = container.getBoundingClientRect();
      const centers = cards.map((c) => {
        const r = c!.getBoundingClientRect();
        return {
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
          width: r.width,
          height: r.height,
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
        width: containerRect.width,
        height: containerRect.height,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        hasStarted.current = true;
        setArrowVisible(true);
        SEQUENCE.forEach(({ phase: p, delay }) => {
          timers.current.push(setTimeout(() => setPhase(p), delay));
        });
        timers.current.push(setTimeout(() => setArrowVisible(false), SEQUENCE_END_MS + HOLD_MS));
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps -- timers.current is deliberately mutated after setup by the callback above, not a stale ref.
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const displayPhase = reducedMotion ? MAX_PHASE : phase;
  const active = activeCount(displayPhase);
  const revealed = revealedSegments(displayPhase);
  const revealedLength = path ? (revealed > 0 ? path.cumulative[revealed - 1] : 0) : 0;
  const revealedFraction = path && path.totalLength > 0 ? revealedLength / path.totalLength : 0;
  const isCurvePhase = displayPhase === 2 * (CURVE_CONNECTOR_INDEX + 1);
  const revealMs = isCurvePhase ? CURVE_TRAVEL_MS : TRAVEL_MS;

  return (
    <div ref={containerRef} className="relative mt-14">
      {path ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          width={path.width}
          height={path.height}
          viewBox={`0 0 ${path.width} ${path.height}`}
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
              strokeDashoffset: path.totalLength * (1 - revealedFraction),
              transition: `stroke-dashoffset ${revealMs}ms linear`,
            }}
          />
        </svg>
      ) : null}

      {path ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-0 grid h-6 w-6 place-items-center rounded-full bg-gradient-icon text-white shadow-lift"
          style={{
            offsetPath: `path("${path.d}")`,
            offsetDistance: `${revealedFraction * 100}%`,
            offsetRotate: "auto",
            opacity: arrowVisible ? 1 : 0,
            transitionProperty: "offset-distance, opacity",
            transitionDuration: `${revealMs}ms, 400ms`,
            transitionTimingFunction: "linear, ease",
          }}
        >
          <Icon name="arrowRight" className="h-3 w-3" />
        </span>
      ) : null}

      <ol className="grid grid-cols-1 gap-y-8 md:grid-cols-8 md:gap-x-6 md:gap-y-14">
        {journey.stages.map((stage, i) => {
          const isActive = i < active;
          return (
            <li
              key={stage.step}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`relative z-10 text-center md:col-span-2 ${SECOND_ROW_START[i] ?? ""}`}
            >
              <div className="h-full rounded-card border border-line bg-white p-5">
                <span
                  className={`block text-[1.75rem] font-extrabold transition-colors duration-500 ${
                    isActive ? "text-gradient" : "text-muted/40"
                  }`}
                >
                  {stage.step}
                </span>
                <span
                  className={`mx-auto mt-3 grid h-12 w-12 place-items-center rounded-full transition-colors duration-500 ${
                    isActive ? "bg-gradient-icon text-white" : "bg-cloud text-muted"
                  }`}
                >
                  <Icon name={stageIcons[i]} className="h-[1.2rem] w-[1.2rem]" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-navy">{stage.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-body">{stage.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
