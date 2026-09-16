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
 * Section shell.
 *
 * The updated designs alternate quiet background bands between sections rather
 * than running everything on flat white - lavender for Institutions and Events,
 * cream for Prephasz and Testimonials, mint for Commerce. They stay very pale, so
 * the page still reads as predominantly white.
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
  tone?: "white" | "cloud" | "warm" | "lavender" | "cream" | "mint" | "navy";
  labelledBy?: string;
}) {
  const tones = {
    white: "bg-white",
    cloud: "bg-cloud",
    warm: "bg-warm",
    lavender: "bg-[#f7f5fd]",
    cream: "bg-[#fdfaf4]",
    mint: "bg-[#f2f9f7]",
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

/**
 * Eyebrow label.
 *
 * `rule` places the short accent line the designs put before or after the label;
 * "none" is used where the design shows the label on its own.
 */
export function Eyebrow({
  children,
  tone = "muted",
  rule = "before",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "brand" | "gold" | Vertical | "light";
  rule?: "before" | "after" | "above" | "none";
  className?: string;
}) {
  const tones = {
    muted: "text-muted",
    brand: "text-brand",
    gold: "text-gold",
    institutions: "text-inst",
    prephasz: "text-prep-ink",
    commerce: "text-com",
    light: "text-white/60",
  } as const;

  const line = <span aria-hidden="true" className="h-px w-7 shrink-0 bg-current opacity-60" />;

  if (rule === "above") {
    return (
      <div className={className}>
        <span aria-hidden="true" className={`block h-0.5 w-9 ${tone === "gold" ? "bg-gold" : "bg-current"}`} />
        <p className={`eyebrow mt-4 ${tones[tone]}`}>{children}</p>
      </div>
    );
  }

  return (
    <p className={`eyebrow flex items-center gap-3 ${tones[tone]} ${className}`}>
      {rule === "before" ? line : null}
      {children}
      {rule === "after" ? line : null}
    </p>
  );
}

/**
 * Section heading.
 *
 * One H1 per page (the Hero headline), H2 per section, H3 for sub-sections and
 * cards - `as` makes that explicit at every call site.
 *
 * `accentTone` covers the two treatments the designs use: a solid accent colour
 * (most sections) or the full brand gradient (the Education-to-Career headline).
 */
export function Heading({
  as: Tag = "h2",
  id,
  plain,
  accent,
  accentTone = "brand",
  size = "md",
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  plain?: string;
  accent?: string;
  accentTone?: "gradient" | "brand" | "gold" | Vertical | "navy";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-[1.5rem] leading-[1.18] sm:text-[1.875rem]",
    md: "text-[2rem] leading-[1.12] sm:text-[2.5rem] lg:text-[3rem]",
    lg: "text-[2.4rem] leading-[1.06] sm:text-[3.2rem] lg:text-[3.9rem]",
  } as const;

  const accentClass = {
    gradient: "text-gradient",
    brand: "text-brand",
    gold: "text-gold",
    navy: "text-navy",
    institutions: "text-inst",
    prephasz: "text-prep-ink",
    commerce: "text-com",
  } as const;

  return (
    <Tag id={id} className={`font-extrabold ${sizes[size]} ${className}`}>
      {plain}
      {accent ? (
        <>
          {plain ? " " : null}
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
  { tint: string; band: string; border: string; text: string; icon: string; dot: string }
> = {
  institutions: {
    tint: "bg-[#f6f4fc]",
    band: "bg-[#efeafa]",
    border: "border-[#e4defa]",
    text: "text-inst",
    icon: "bg-[#e8e1fa] text-inst",
    dot: "bg-inst",
  },
  prephasz: {
    tint: "bg-[#fdf9f0]",
    band: "bg-[#fbf2dd]",
    border: "border-[#f5e7c4]",
    text: "text-prep-ink",
    icon: "bg-[#fbeec4] text-prep-ink",
    dot: "bg-prep",
  },
  commerce: {
    tint: "bg-[#eef8f7]",
    band: "bg-[#e0f1ee]",
    border: "border-[#cfe8e4]",
    text: "text-com",
    icon: "bg-[#d6ecea] text-com",
    dot: "bg-com",
  },
};
