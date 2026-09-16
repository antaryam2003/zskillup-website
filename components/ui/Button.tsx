import Link from "next/link";
import { Icon, type IconName } from "./Icon";

/**
 * The site's CTA hierarchy, encoded once.
 *
 * The brief is emphatic that the three actions on a card must NOT all look like
 * buttons: "Explore should be the filled/dark button; the conversion CTA should
 * be a text link; Watch Video should be visually light."
 *
 *   primary    - filled navy. The main action on dark-neutral surfaces.
 *   brand      - filled purple. The master-brand action (Our Story, Discuss Your
 *                Campus Needs).
 *   gradient   - filled with the brand gradient. Reserved for the single
 *                strongest CTA on a dark banner.
 *   gold       - filled bronze. The editorial sections (Partners).
 *   vertical   - filled in a vertical's own colour.
 *   outline    - white with a neutral border.
 *   outlineTone- white with a coloured border, matching the tone.
 *   link       - text + arrow. The conversion action beside a primary.
 *   underline  - text with a coloured underline (Explore Prephasz, View All).
 *   quiet      - outlined pill with a play glyph (Watch Now).
 */
export type ButtonVariant =
  | "primary"
  | "brand"
  | "gradient"
  | "gold"
  | "vertical"
  | "outline"
  | "outlineTone"
  | "link"
  | "underline"
  | "quiet";

export type VerticalTone = "institutions" | "prephasz" | "commerce";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none";

const sized: Record<string, string> = {
  lg: "rounded-full px-7 py-3.5 text-base",
  md: "rounded-full px-6 py-3 text-[0.9375rem]",
  sm: "rounded-full px-3.5 py-2.5 text-[0.8125rem] whitespace-nowrap",
};

/** Filled treatments per vertical. Buttons only - never a background fill. */
const verticalFill: Record<VerticalTone, string> = {
  institutions: "bg-inst text-white hover:bg-inst-ink",
  // Yellow needs dark text to stay legible - never white on yellow.
  prephasz: "bg-prep text-navy hover:bg-[#e6b912]",
  commerce: "bg-com text-white hover:bg-com-ink",
};

const toneText: Record<VerticalTone, string> = {
  institutions: "text-inst hover:text-inst-ink",
  prephasz: "text-prep-ink hover:text-navy",
  commerce: "text-com hover:text-com-ink",
};

const toneBorder: Record<VerticalTone, string> = {
  institutions: "border-inst/40 text-inst hover:bg-inst-soft",
  prephasz: "border-prep-line text-prep-ink hover:bg-prep-soft",
  commerce: "border-com/40 text-com hover:bg-com-soft",
};

const toneUnderline: Record<VerticalTone, string> = {
  institutions: "text-inst decoration-inst/60",
  prephasz: "text-prep-ink decoration-prep",
  commerce: "text-com decoration-com/60",
};

function classesFor(variant: ButtonVariant, tone?: VerticalTone, size: "lg" | "md" | "sm" = "md") {
  switch (variant) {
    case "primary":
      return `${base} ${sized[size]} bg-navy text-white hover:bg-navy-soft`;
    case "brand":
      return `${base} ${sized[size]} bg-brand text-white hover:bg-brand-deep`;
    case "gradient":
      return `${base} ${sized[size]} bg-gradient-brand text-white hover:opacity-92`;
    case "gold":
      return `${base} ${sized[size]} bg-gold text-white hover:bg-gold-deep`;
    case "vertical":
      return `${base} ${sized[size]} ${verticalFill[tone ?? "institutions"]}`;
    case "outline":
      return `${base} ${sized[size]} border border-line bg-white text-navy hover:border-navy/30 hover:bg-cloud`;
    case "outlineTone":
      return `${base} ${sized[size]} border bg-white ${toneBorder[tone ?? "institutions"]}`;
    case "link":
      return `${base} text-[0.8125rem] ${tone ? toneText[tone] : "text-navy hover:text-brand"} underline-offset-4 hover:underline`;
    case "underline":
      return `${base} text-[0.9375rem] underline decoration-2 underline-offset-[6px] ${
        tone ? toneUnderline[tone] : "text-gold decoration-gold/60"
      } hover:opacity-80`;
    case "quiet":
      return `${base} rounded-full border border-line bg-white/80 px-3.5 py-2 text-sm font-medium text-navy hover:border-navy/25 hover:bg-white`;
  }
}

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  tone?: VerticalTone;
  size?: "lg" | "md" | "sm";
  /** Trailing icon. Defaults to a right arrow; pass null to drop it. */
  icon?: IconName | null;
  className?: string;
};

type AnchorProps = CommonProps & { href: string; onClick?: never; type?: never };
type NativeButtonProps = CommonProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button(props: AnchorProps | NativeButtonProps) {
  const { children, variant = "primary", tone, size = "md", icon, className = "" } = props;

  const trailing: IconName | null =
    icon === null ? null : (icon ?? (variant === "quiet" ? null : "arrowRight"));

  const body = (
    <>
      {variant === "quiet" ? (
        <Icon name="play" className="mr-0.5 h-3 w-3 text-navy" />
      ) : null}
      <span>{children}</span>
      {trailing ? (
        <Icon
          name={trailing}
          className="h-[1.05em] w-[1.05em] transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  const cls = `group ${classesFor(variant, tone, size)} ${className}`;

  if (props.href !== undefined) {
    if (/^https?:\/\//.test(props.href)) {
      return (
        <a className={cls} href={props.href} target="_blank" rel="noreferrer noopener">
          {body}
        </a>
      );
    }
    return (
      <Link className={cls} href={props.href}>
        {body}
      </Link>
    );
  }

  return (
    <button className={cls} type={props.type ?? "button"} onClick={props.onClick}>
      {body}
    </button>
  );
}
