import Image from "next/image";
import { asset } from "@/lib/asset";

/**
 * Brand marks, drawn as SVG/text so they stay crisp, theme-able and - importantly
 * for the brief - REAL TEXT rather than flattened imagery wherever a name shows.
 *
 * If the brand team supplies official SVG artwork, replace the path data in
 * `ZMark` / `PrephaszArrow` and nothing else needs to change.
 *
 * The one exception is the "Powered by ZSkillup" sub-lockup below the
 * Prephasz wordmark: it's the official artwork (public/images/prephasz-
 * powered-by-zskillup.png), cropped from the approved reference logo,
 * because its "Z" is a specific mark rather than a plain capital letter -
 * hand-reproducing it in text/CSS is exactly what drifted out of alignment
 * before. Swap that file for updated official artwork if the mark changes.
 */

export function ZMark({
  className = "h-7 w-7",
  gradient = true,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const id = gradient ? "zmark-gradient" : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      {gradient ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B2BCB" />
            <stop offset="55%" stopColor="#9147C4" />
            <stop offset="100%" stopColor="#E8776A" />
          </linearGradient>
        </defs>
      ) : null}
      {/* Z with an arrowhead rising out of the upper bar. */}
      <path
        fill={gradient ? `url(#${id})` : "currentColor"}
        d="M20 8h60v46.5L64.5 39 45.5 58H80v34H26.5C16.8 92 12 86.5 12 79.6c0-3.6 1.3-6.8 4-9.6L58.5 26H20V8Z"
      />
    </svg>
  );
}

/** Full ZSkillup lockup: mark + wordmark. The wordmark is live text. */
export function ZSkillupLogo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <ZMark className="h-[1.55em] w-[1.55em]" />
      <span
        className={`text-[1.35rem] font-extrabold tracking-[-0.03em] ${
          tone === "light" ? "text-white" : "text-navy"
        }`}
      >
        Skillup
      </span>
    </span>
  );
}

/** The Prephasz "z" terminal: a bold Z whose top bar lifts into an arrowhead. */
function PrephaszArrow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M14 16h72v10L38 74h48v12H12V76L60 28H14V16Z"
        opacity="0"
      />
      {/* Drawn as a Z with a rising arrow, matching the product mark. */}
      <path
        fill="currentColor"
        d="M10 14h62v40L58.5 40 40 58.5h32V86H10V70l40-40H10V14Z"
      />
    </svg>
  );
}

/**
 * Prephasz wordmark.
 *
 * The updated design sets the word in navy with the trailing "z" carried by the
 * yellow/orange arrow glyph, and "by ZSkillup" beneath. Pure yellow letterforms
 * measure about 1.6:1 on white, so the word itself is never set in yellow on a
 * light surface - only the mark is.
 *
 * `accent` is opt-in and only used by the Hero card, which references a design
 * that also picks out the "pre" out in the same gold as the arrow. Every other
 * call site leaves it off and keeps the original all-navy word.
 */
export function PrephaszWordmark({
  className = "text-2xl",
  tone = "dark",
  showParent = false,
  accent = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  showParent?: boolean;
  accent?: boolean;
}) {
  const light = tone === "light";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className={`inline-flex items-start font-extrabold tracking-[-0.035em] ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {accent ? <span className="text-[#F0A020]">pre</span> : "pre"}
        phas
        <PrephaszArrow className="-mt-[0.26em] ml-[0.01em] h-[1.05em] w-[0.82em] text-[#F0A020]" />
      </span>
      {showParent ? (
        <Image
          src={asset("/images/prephasz-powered-by-zskillup.png")}
          alt="Powered by ZSkillup"
          width={280}
          height={44}
          className={`mt-[0.30em] h-[0.36em] w-auto self-center ${light ? "opacity-70 invert brightness-0" : ""}`}
        />
      ) : null}
    </span>
  );
}
