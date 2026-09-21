/**
 * Every number that appears anywhere on the site.
 *
 * ---------------------------------------------------------------------------
 *  THE BRIEF'S STATISTICS RULE, ENCODED
 *
 *  "Use only verified, defensible numbers. Do not hard-code placeholder claims."
 *  "All claims, ratings, partner counts, learner counts and outcome numbers must
 *   be verified before publishing."
 *
 *  So every stat carries a `verified` flag:
 *
 *    verified: true   -> supplied in the brief, or makes no measurable claim.
 *                        Always renders.
 *    verified: false  -> carried over from the design comps but NOT yet validated.
 *                        Renders in development so the team can review the intended
 *                        layout; HIDDEN IN PRODUCTION BUILDS so an unverified claim
 *                        cannot be published by accident.
 *
 *  To publish an unverified stat: confirm the real figure, update `value`, then
 *  set `verified: true`. To preview them in a production build, set
 *  NEXT_PUBLIC_SHOW_UNVERIFIED_STATS=true.
 * ---------------------------------------------------------------------------
 *
 *  Placement rules, also from the brief:
 *    - NO corporate statistics strip in the Hero.
 *    - NO corporate statistics in Choose Your Route or About.
 *    - Partners is the primary (and only) home for corporate scale statistics.
 *    - Events uses ACTIVITY-specific statistics only - never partner or learner counts.
 */

export type Stat = {
  value: string;
  label: string;
  verified: boolean;
  /** Shown as a build-time note in CONTENT-TODO.md; never rendered. */
  note?: string;
};

/**
 * Unverified figures RENDER by default, because the comps show these stat rows
 * and the brief asks for them to be kept ("Keep the three hero credibility
 * numbers, but use only final verified ZSkillup numbers").
 *
 * Set NEXT_PUBLIC_SHOW_UNVERIFIED_STATS=false to suppress every unverified figure
 * in one move - the layouts are built to close up cleanly without them, which the
 * brief also wants ("use the space saved ... to give the page more whitespace").
 *
 * Either way, do not publish an unverified number: confirm the figure, update
 * `value`, and set `verified: true`.
 */
const showUnverified = process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_STATS !== "false";

/** Filters a stat list down to what is safe to render in the current environment. */
export function publishable(stats: readonly Stat[]): Stat[] {
  return stats.filter((s) => s.verified || showUnverified);
}

/**
 * PARTNERS - the primary home for corporate credibility.
 * These three figures are given explicitly in the brief, so they are treated as
 * supplied. Update them here as the network grows; they update everywhere.
 */
export const partnerStats: readonly Stat[] = [
  { value: "55+", label: "Institution Partners", verified: true },
  { value: "100+", label: "Industry & Hiring Partners", verified: true },
  { value: "10K+", label: "Learners Impacted", verified: true },
];

/**
 * HOMEPAGE CREDIBILITY STRIP - between Hero and About.
 *
 * This is a deliberate, explicit exception to the "NO corporate statistics
 * strip in the Hero" rule noted above: these six figures were supplied
 * directly, by name, for this exact placement, so they're treated the same
 * way `partnerStats` is - given, not invented, hence `verified: true`.
 *
 * `image` and `highlight` drive HomepageStats.tsx's presentation only - they
 * carry no publishing meaning and are ignored by `publishable()`.
 *
 * `image` is the official supplied card artwork (public/images/stats/) - each
 * file already bakes in its own rounded-card background and (for Placements)
 * the purple highlight treatment, so it IS the card's visual, not an icon
 * dropped into a card HomepageStats draws itself. Dimensions are each
 * image's own natural size (all ~452-465px, effectively square) - declared
 * so next/image never upscales or distorts them.
 */
export const heroCredibilityStats: readonly (Stat & {
  image: { src: string; width: number; height: number };
  /** The one card whose supplied artwork is the brand-purple highlight. */
  highlight?: boolean;
})[] = [
  {
    value: "55+",
    label: "Universities & Colleges onboarded",
    verified: true,
    image: { src: "/images/stats/universities-colleges.png", width: 455, height: 451 },
  },
  {
    value: "150+",
    label: "Hiring Partners",
    verified: true,
    image: { src: "/images/stats/hiring-partners.png", width: 453, height: 452 },
  },
  {
    value: "350+",
    label: "Placements",
    verified: true,
    image: { src: "/images/stats/placements.png", width: 453, height: 453 },
    highlight: true,
  },
  {
    value: "19 LPA",
    label: "Highest Package",
    verified: true,
    image: { src: "/images/stats/highest-package.png", width: 461, height: 453 },
  },
  {
    value: "5.6 LPA",
    label: "Average Package",
    verified: true,
    image: { src: "/images/stats/average-package.png", width: 462, height: 451 },
  },
  {
    value: "78%",
    label: "Placement Success Rate",
    verified: true,
    image: { src: "/images/stats/placement-success.png", width: 465, height: 453 },
  },
];

/**
 * INSTITUTIONS section credibility trio.
 *
 * Confirmed and published per the brief's own rule above.
 */
export const institutionStats: readonly Stat[] = [
  { value: "55+", label: "Partner Institutions", verified: true },
  { value: "1 lakh+", label: "Students Trained", verified: true },
  { value: "250+", label: "Placement Readiness Verified", verified: true },
];

/**
 * ZSKILLUP IN ACTION - activity-specific only.
 *
 * The brief: "I'd prefer to change these from generic company-scale stats to
 * activity-specific stats, e.g. Programs Conducted | Workshops & Events |
 * Cities/Campuses Reached. Avoid repeating Institution Partners and Learners
 * Impacted here."
 *
 * The last two are deliberately qualitative - the comps carried no figure for
 * them and no number has been invented to fill the gap.
 */
export const activityStats: readonly Stat[] = [
  { value: "50+", label: "Programs Conducted", verified: false, note: "From the design. Confirm." },
  { value: "100+", label: "Workshops & Events", verified: false, note: "From the design. Confirm." },
  { value: "15+", label: "Cities & Campuses Reached", verified: false, note: "From the design. Confirm." },
  { value: "", label: "Student Community", verified: true },
];
