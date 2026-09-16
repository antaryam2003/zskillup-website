import { publishable, type Stat } from "@/content/stats";

/**
 * Renders a statistics row, filtered through the brief's verification rule.
 *
 * Unverified figures are stripped out in production builds - see content/stats.ts.
 * If nothing survives the filter the component renders nothing at all rather than
 * an empty shell, which is exactly what the brief wants: the freed-up space
 * becomes whitespace.
 */
export function StatList({
  stats,
  tone = "dark",
  /** "row" wraps freely; "columns" keeps them side by side in a narrow column. */
  layout = "row",
  className = "",
}: {
  stats: readonly Stat[];
  tone?: "dark" | "light";
  layout?: "row" | "columns";
  className?: string;
}) {
  const visible = publishable(stats);
  if (visible.length === 0) return null;

  const columns = layout === "columns";
  // Track how many stats actually survived the verification filter, so a hidden
  // unverified figure does not leave an empty column behind.
  const gridCols = visible.length >= 3 ? "grid-cols-3" : visible.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <dl
      className={`${
        columns
          ? `grid ${gridCols} gap-x-4`
          : "flex flex-wrap items-start gap-x-8 gap-y-5 sm:gap-x-10"
      } ${className}`}
    >
      {visible.map((stat, i) => (
        <div
          key={stat.label}
          className={
            i > 0
              ? `border-l ${columns ? "pl-4" : "pl-8 sm:pl-10"} ${
                  tone === "light" ? "border-white/20" : "border-line"
                }`
              : ""
          }
        >
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span
              className={`block font-extrabold tracking-tight ${
                columns ? "text-[1.5rem] sm:text-[1.75rem]" : "text-[1.75rem] sm:text-[2rem]"
              } ${tone === "light" ? "text-white" : "text-gradient"}`}
            >
              {stat.value}
            </span>
            <span
              aria-hidden="true"
              className={`mt-1 block text-[0.8125rem] leading-snug ${
                columns ? "" : "max-w-[10rem] text-sm"
              } ${tone === "light" ? "text-white/70" : "text-muted"}`}
            >
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Handwritten accent.
 *
 * Hard-capped by the brief at 2-3 across the entire homepage:
 *   1. "More Than a Degree"                      - Hero
 *   2. "See how prephasz helps students prepare" - Prephasz demo cue
 *   3. "More opportunities ahead."               - B.Com + ACCA
 *
 * Do not add a fourth. The brief removed seven others precisely to stop this
 * becoming a section-by-section habit.
 */
export function Handwritten({
  children,
  className = "",
  underline = false,
}: {
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
}) {
  return (
    <span className={`handwritten inline-block ${className}`}>
      {children}
      {underline ? (
        <svg
          viewBox="0 0 120 10"
          className="mt-1 block h-2 w-full text-brand"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2 7c22-5 62-6 116-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
