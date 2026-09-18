"use client";

import { useEffect, useRef, useState } from "react";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The seven-stage education-to-career path.
 *
 * Desktop/tablet (md+): a 4+3 grid - stages 1-4 on the first row, 5-7 on the
 * second, which (via plain row-major grid auto-placement, no manual column
 * overrides) lands 5/6/7 directly under 1/2/3 for free. Mobile: a single
 * vertical column, same order.
 *
 * A single SVG/HTML overlay - one continuous path threading through every
 * stage's centre - draws the connective line and carries a travelling arrow
 * marker. Card backgrounds are opaque, so the path only reads as visible in
 * the gaps between cards; nothing needs separate "edge" anchor math.
 *
 * The path shape is entirely position-driven, not viewport-branched: for
 * each pair of consecutive stages, if they measure out to roughly the same
 * row a straight line is drawn; otherwise a smooth S-curve. On mobile every
 * pair is "different row" so every segment curves - and because both ends
 * share the same x there, the curve's control points collapse onto a
 * straight vertical line automatically. The 4-to-5 swoop on desktop and the
 * mobile connectors are thus the same formula, not two implementations.
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

function cubicPoint(p0: number, c1: number, c2: number, p1: number, t: number) {
  const mt = 1 - t;
  return mt ** 3 * p0 + 3 * mt ** 2 * t * c1 + 3 * mt * t ** 2 * c2 + t ** 3 * p1;
}

function bezierLength(
  p0: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  p1: { x: number; y: number },
  samples = 20,
) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const cur = { x: cubicPoint(p0.x, c1.x, c2.x, p1.x, t), y: cubicPoint(p0.y, c1.y, c2.y, p1.y, t) };
    len += dist(prev, cur);
    prev = cur;
  }
  return len;
}

type Segment = { d: string; length: number };

type PathData = {
  d: string;
  totalLength: number;
  cumulative: number[]; // cumulative length after connector k, index 0..COUNT-2
  width: number;
  height: number;
};

/** A point counts as "the same row" as the next if their vertical gap is
    small relative to the card height - otherwise it's a row change and gets
    the curved treatment (which degenerates to a straight vertical line when
    both x-coordinates already match, as they do in the single-column layout). */
function buildSegment(p1: { x: number; y: number }, p2: { x: number; y: number }, rowThreshold: number): Segment {
  const sameRow = Math.abs(p2.y - p1.y) < rowThreshold;
  if (sameRow) {
    return { d: `L ${p2.x} ${p2.y}`, length: dist(p1, p2) };
  }
  const midY = p1.y + (p2.y - p1.y) * 0.5;
  const c1 = { x: p1.x, y: midY };
  const c2 = { x: p2.x, y: midY };
  return {
    d: `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`,
    length: bezierLength(p1, c1, c2, p2),
  };
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
          className="pointer-events-none absolute inset-0"
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
          className="pointer-events-none absolute top-0 left-0 z-20 grid h-6 w-6 place-items-center rounded-full bg-gradient-icon text-white shadow-lift"
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

      <ol className="grid grid-cols-1 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
        {journey.stages.map((stage, i) => {
          const isActive = i < active;
          return (
            <li
              key={stage.step}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="relative z-10 text-center"
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
