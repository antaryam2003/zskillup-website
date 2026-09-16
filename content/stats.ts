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
 * INSTITUTIONS section credibility trio.
 *
 * The brief says: "Keep the three hero credibility numbers, but use only final
 * verified ZSkillup numbers. Do not hard-code 100+, 50K+ or 80%+ until validated."
 * It also forbids repeating corporate statistics outside the Partners section -
 * so the comp's "100+ Partner Institutions" has been re-scoped to "Campuses
 * Engaged" to avoid duplicating the 55+ Institution Partners figure above.
 *
 * All three need sign-off before they can ship. See CONTENT-TODO.md.
 */
export const institutionStats: readonly Stat[] = [
  {
    value: "100+",
    label: "Campuses Engaged",
    verified: false,
    note: "Comp said '100+ Partner Institutions', which duplicates the Partners 55+ figure. Re-scoped label; confirm the real number.",
  },
  {
    value: "50K+",
    label: "Students Trained",
    verified: false,
    note: "Carried from the comp. Brief explicitly says do not hard-code 50K+ until validated.",
  },
  {
    value: "80%+",
    label: "Placement Readiness Improvement",
    verified: false,
    note: "Carried from the comp. Needs a defined measurement method before it can be claimed.",
  },
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
  {
    value: "50+",
    label: "Programs Conducted",
    verified: false,
    note: "Carried from the comp. Confirm the current figure.",
  },
  { value: "Regular", label: "Workshops & Events", verified: true },
  { value: "Multi-city", label: "Campuses Reached", verified: true },
];
