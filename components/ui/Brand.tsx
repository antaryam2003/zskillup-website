/**
 * Brand marks, drawn as SVG so they stay crisp, theme-able and - importantly for
 * the brief - REAL TEXT rather than flattened imagery wherever a name is shown.
 *
 * The Z-arrow glyph is redrawn from the live ZSkillup mark (brand purple #60174F
 * on the favicon). Here it renders in the master gradient or in currentColor so it
 * sits correctly on both light and dark surfaces.
 *
 * If the brand team supplies official SVG artwork, replace the <path> data in
 * `ZMark` and nothing else needs to change.
 */

export function ZMark({ className = "h-7 w-7", gradient = true }: { className?: string; gradient?: boolean }) {
  const id = gradient ? "zmark-gradient" : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      {gradient ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F39F6" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FF6B6B" />
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

/**
 * Prephasz wordmark. Kept clearly visible wherever Prephasz appears, so users
 * read it as a distinct ZSkillup product rather than another programme.
 *
 * The live mark sets "pre" in Prephasz yellow against a dark ground. Pure
 * #FFCA09 on white measures about 1.6:1, so on light surfaces the wordmark
 * follows the treatment used in the approved comps instead: navy letterforms
 * with the yellow carried by the trailing arrow glyph. Same identity, legible on
 * both grounds.
 */
export function PrephaszWordmark({
  className = "text-2xl",
  tone = "dark",
  showParent = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  showParent?: boolean;
}) {
  const light = tone === "light";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-extrabold tracking-[-0.035em] ${light ? "text-white" : "text-navy"}`}>
        {light ? <span className="text-prep">pre</span> : "pre"}
        phas
        {/* The Z-arrow terminal carries the Prephasz yellow on light grounds. */}
        <span className="text-prep-ink">z</span>
        <svg
          viewBox="0 0 24 24"
          className="ml-0.5 inline-block h-[0.52em] w-[0.52em] align-baseline text-prep"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M6 18 18 6M9 6h9v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showParent ? (
        <span
          className={`mt-1.5 text-[0.46em] font-semibold tracking-[0.04em] ${
            light ? "text-white/70" : "text-muted"
          }`}
        >
          by ZSkillup
        </span>
      ) : null}
    </span>
  );
}
