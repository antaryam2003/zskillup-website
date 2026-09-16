import type { Vertical } from "@/content/homepage";

/** Consistent page gutter and max width across every section. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

/**
 * Section shell. Vertical rhythm is deliberately generous - the brief treats
 * whitespace as part of the premium visual language, and repeatedly asks for
 * freed-up space to stay empty rather than be filled with decoration.
 */
export function Section({
  id,
  children,
  className = "",
  tone = "white",
  labelledBy,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** ~80% of the site is white / warm off-white. Keep it that way. */
  tone?: "white" | "cloud" | "warm" | "navy";
  labelledBy?: string;
}) {
  const tones = {
    white: "bg-white",
    cloud: "bg-cloud",
    warm: "bg-warm",
    navy: "bg-navy text-white",
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-24 py-20 sm:py-24 lg:py-28 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "muted",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "brand" | Vertical | "light";
  className?: string;
}) {
  const tones = {
    muted: "text-muted",
    brand: "text-brand",
    institutions: "text-inst",
    prephasz: "text-prep-ink",
    commerce: "text-com",
    light: "text-white/60",
  } as const;

  return (
    <p className={`eyebrow flex items-center gap-3 ${tones[tone]} ${className}`}>
      <span aria-hidden="true" className="h-px w-7 bg-current opacity-50" />
      {children}
    </p>
  );
}

/**
 * Section heading.
 *
 * SEO rule from the brief: one H1 per page (the Hero headline), H2 for major
 * section headlines, H3 for sub-sections and cards. `as` makes that explicit at
 * every call site rather than leaving it to chance.
 */
export function Heading({
  as: Tag = "h2",
  id,
  plain,
  accent,
  accentTone = "gradient",
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  plain: string;
  /** The highlighted fragment. Rendered inline so the sentence stays one string for screen readers. */
  accent?: string;
  accentTone?: "gradient" | Vertical;
  className?: string;
}) {
  const sizes = {
    h1: "text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.1rem]",
    h2: "text-[2rem] leading-[1.12] sm:text-[2.6rem] lg:text-[3.1rem]",
    h3: "text-[1.4rem] leading-[1.2] sm:text-[1.7rem]",
  } as const;

  const accentClass = {
    gradient: "text-gradient",
    institutions: "text-inst",
    prephasz: "text-prep-ink",
    commerce: "text-com",
  } as const;

  return (
    <Tag id={id} className={`font-extrabold ${sizes[Tag]} ${className}`}>
      {plain}
      {accent ? (
        <>
          {" "}
          <span className={accentClass[accentTone]}>{accent}</span>
        </>
      ) : null}
    </Tag>
  );
}

export function Lede({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[1.0625rem] leading-relaxed text-body sm:text-lg ${className}`}>
      {children}
    </p>
  );
}

/** Soft tint + accent colour per vertical. Tints only - never a saturated fill. */
export const verticalStyles: Record<
  Vertical,
  { tint: string; border: string; text: string; ring: string; dot: string }
> = {
  institutions: {
    tint: "bg-inst-soft",
    border: "border-inst-line",
    text: "text-inst",
    ring: "ring-inst/15",
    dot: "bg-inst",
  },
  prephasz: {
    tint: "bg-prep-soft",
    border: "border-prep-line",
    text: "text-prep-ink",
    ring: "ring-prep/25",
    dot: "bg-prep",
  },
  commerce: {
    tint: "bg-com-soft",
    border: "border-com-line",
    text: "text-com",
    ring: "ring-com/15",
    dot: "bg-com",
  },
};
