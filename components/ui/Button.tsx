import Link from "next/link";
import { Icon, type IconName } from "./Icon";

/**
 * The site's CTA hierarchy, encoded once.
 *
 * The brief is emphatic that the three actions on a card must NOT all look like
 * buttons: "Explore should be the filled/dark button; the conversion CTA should
 * be a text link; Watch Video should be visually light, preferably play icon +
 * text. This retains all three user journeys without making the cards feel
 * overloaded."
 *
 *   primary   - filled navy. The main "understand this" action.
 *   brand     - filled brand gradient. Reserved for the page's single strongest CTA.
 *   vertical  - filled in a vertical's own colour (Institutions / Prephasz / Commerce).
 *   outline   - bordered. The secondary action beside a primary.
 *   link      - plain text + arrow. The conversion action on cards.
 *   video     - lightest of all: play glyph + text.
 */
export type ButtonVariant = "primary" | "brand" | "vertical" | "outline" | "link" | "video";

export type VerticalTone = "institutions" | "prephasz" | "commerce";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none";

const sized: Record<string, string> = {
  md: "rounded-full px-6 py-3 text-[0.9375rem]",
  sm: "rounded-full px-4 py-2 text-sm",
};

/** Filled treatments per vertical. Used only for buttons - never as a background fill. */
const verticalFill: Record<VerticalTone, string> = {
  institutions: "bg-inst text-white hover:bg-inst-ink",
  // Prephasz yellow needs dark text to stay legible - never white on yellow.
  prephasz: "bg-prep text-navy hover:bg-[#f0bd00]",
  commerce: "bg-com text-white hover:bg-com-ink",
};

const verticalText: Record<VerticalTone, string> = {
  institutions: "text-inst hover:text-inst-ink",
  prephasz: "text-prep-ink hover:text-navy",
  commerce: "text-com hover:text-com-ink",
};

function classesFor(variant: ButtonVariant, tone?: VerticalTone, size: "md" | "sm" = "md") {
  switch (variant) {
    case "primary":
      return `${base} ${sized[size]} bg-navy text-white hover:bg-navy-soft`;
    case "brand":
      return `${base} ${sized[size]} bg-gradient-brand text-white hover:opacity-92 shadow-[0_10px_30px_-12px_rgba(91,63,232,0.65)]`;
    case "vertical":
      return `${base} ${sized[size]} ${verticalFill[tone ?? "institutions"]}`;
    case "outline":
      return `${base} ${sized[size]} border border-line bg-white text-navy hover:border-navy/30 hover:bg-cloud`;
    case "link":
      return `${base} text-sm ${tone ? verticalText[tone] : "text-navy hover:text-brand"} underline-offset-4 hover:underline`;
    case "video":
      return `${base} text-[0.9375rem] font-medium text-muted hover:text-navy`;
  }
}

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  tone?: VerticalTone;
  size?: "md" | "sm";
  /** Trailing icon. Defaults to a right arrow for link/primary-style actions. */
  icon?: IconName | null;
  className?: string;
};

type AnchorProps = CommonProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type NativeButtonProps = CommonProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button(props: AnchorProps | NativeButtonProps) {
  const {
    children,
    variant = "primary",
    tone,
    size = "md",
    icon,
    className = "",
  } = props;

  const trailing: IconName | null =
    icon === null ? null : (icon ?? (variant === "video" ? null : "arrowRight"));

  const body = (
    <>
      {variant === "video" ? (
        <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-navy transition-colors group-hover:border-navy/25">
          <Icon name="play" className="ml-0.5 h-3 w-3" />
        </span>
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
    const external = /^https?:\/\//.test(props.href);
    if (external) {
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
