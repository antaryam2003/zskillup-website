"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Horizontal scroll carousel.
 *
 * Built to satisfy the brief's SEO constraint directly:
 *   "Carousel content for Partners, Testimonials and Events must remain present
 *    in crawlable/rendered HTML and should not depend exclusively on a click/swipe
 *    before the content exists."
 *
 * So every item is rendered into the DOM on the server. The controls only change
 * scroll position - they never gate whether content exists. With JavaScript off
 * the list is still complete and still scrollable by touch/trackpad.
 *
 * Accessibility:
 *   - the scroller is a labelled group and is keyboard-focusable, so arrow keys
 *     scroll it natively;
 *   - prev/next are real buttons with labels and correct disabled states;
 *   - `aria-hidden` is never applied to off-screen items.
 */
export function ScrollCarousel({
  label,
  children,
  itemClassName = "",
  className = "",
  controlsAlign = "right",
  gapClassName = "gap-4",
}: {
  label: string;
  children: React.ReactNode[];
  itemClassName?: string;
  className?: string;
  controlsAlign?: "right" | "split";
  gapClassName?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const page = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.86), behavior: "smooth" });
  };

  const controls = (
    <div className="flex items-center gap-2">
      <CarouselButton
        label={`Previous ${label.toLowerCase()}`}
        disabled={atStart}
        onClick={() => page(-1)}
        icon="chevronLeft"
      />
      <CarouselButton
        label={`Next ${label.toLowerCase()}`}
        disabled={atEnd}
        onClick={() => page(1)}
        icon="chevronRight"
      />
    </div>
  );

  return (
    <div className={className}>
      {controlsAlign === "right" ? (
        <div className="mb-5 flex justify-end">{controls}</div>
      ) : null}

      <ul
        ref={ref}
        onScroll={sync}
        tabIndex={0}
        role="group"
        aria-label={label}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 ${gapClassName}`}
      >
        {children.map((child, i) => (
          <li key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>

      {controlsAlign === "split" ? (
        <div className="mt-8 flex justify-center">{controls}</div>
      ) : null}
    </div>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: "chevronLeft" | "chevronRight";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

/**
 * One-at-a-time carousel with an "01 / 06" counter, used for the featured event.
 * Every slide is rendered; only opacity/position changes, so the markup stays
 * complete and crawlable.
 */
export function FeaturedCarousel({
  label,
  count,
  children,
  renderControls,
}: {
  label: string;
  count: number;
  children: (index: number) => React.ReactNode;
  renderControls?: (node: React.ReactNode) => React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + count) % count);

  const controls = (
    <div className="flex items-center gap-4">
      <p className="text-sm font-semibold tabular-nums text-white/80">
        <span className="sr-only">Showing item </span>
        {String(index + 1).padStart(2, "0")}
        <span className="text-white/40"> / {String(count).padStart(2, "0")}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={`Previous ${label.toLowerCase()}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={`Next ${label.toLowerCase()}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white transition-opacity hover:opacity-90"
        >
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div aria-live="polite" aria-atomic="true">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            hidden={i !== index}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {children(i)}
          </div>
        ))}
      </div>
      {renderControls ? renderControls(controls) : controls}
    </div>
  );
}
