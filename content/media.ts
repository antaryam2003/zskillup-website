/**
 * EVERY photographic asset on the homepage, in one place.
 *
 * ---------------------------------------------------------------------------
 *  These are the approved design comps' own photographs, extracted from
 *  ZSkillup_Parent_Website_Final_Feedback.docx by `scripts/extract-comp-assets.py`.
 *  So the site shows the intended artwork, not stand-ins.
 *
 *  They are COMP-RESOLUTION - cropped out of flat PNG renders of the designs.
 *  For production, replace each file with the original full-resolution asset at
 *  the same path and confirm the `alt` text still describes it. Nothing else in
 *  the codebase needs to change.
 *
 *  `width`/`height` are declared on every slot so swapping images causes zero
 *  layout shift (CLS).
 *
 *  See CONTENT-TODO.md.
 * ---------------------------------------------------------------------------
 */

export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const media = {
  /**
   * Hero / LCP image. Deliberately NOT lazy-loaded (see Hero.tsx `priority`).
   *
   * The supplied production photograph - full composition, used as-is (not a
   * crop out of a flat comp render like the rest of this file). It already
   * frames everything the Hero needs: open sky on the left for the headline,
   * the campus buildings and the "More Than a Degree" note in the middle, and
   * the student on the right. See Hero.tsx for how `object-position` keeps
   * all of that in frame as the band's own aspect ratio changes by viewport.
   */
  hero: {
    src: "/images/campus-student-hero.png",
    alt: "A student with a backpack walking across a university campus, smiling up at the historic stone buildings, with other students walking ahead of her and a handwritten \"More Than a Degree\" note beside the architecture",
    width: 1669,
    height: 942,
  },

  /**
   * Career-pathway section. Aspirational, natural, no floating elements around it.
   * Cleaned copy of commerce-student.jpg with the baked-in spine labels erased -
   * they are live text in BcomAcca.tsx (see scripts/clean-commerce-student.mjs).
   */
  commerceStudent: {
    src: "/images/commerce-student-pathway.jpg",
    alt: "A commerce student at her desk with a laptop and an open notebook, looking up thoughtfully",
    width: 609,
    height: 750,
  },

  /**
   * Leadership portraits - keep natural and prominent. These are the square
   * crops made by scripts/crop-leadership-portraits.py (the original <slug>.jpg
   * files carry a baked-in white margin from the old comp).
   */
  team: {
    "lokesh-mathur": {
      src: "/images/team/lokesh-mathur-portrait.jpg",
      alt: "Portrait of Lokesh Mathur, Founder and Director of ZSkillup",
      width: 208,
      height: 208,
    },
    "gaurav-singh": {
      src: "/images/team/gaurav-singh-portrait.jpg",
      alt: "Portrait of Gaurav Singh, Founder and Director of ZSkillup",
      width: 208,
      height: 208,
    },
    "manish-temani": {
      src: "/images/team/manish-temani-portrait.jpg",
      alt: "Portrait of Manish Temani, Director of ZSkillup",
      width: 208,
      height: 208,
    },
  },
} satisfies Record<string, MediaAsset | Record<string, MediaAsset>>;

/**
 * Learner photographs for the testimonials carousel.
 *
 * The approved comp carries three learner photographs. The other testimonials -
 * added so the visible cards span Institutional / Prephasz / Commerce, as the
 * brief requires - have no photograph yet, so `LEARNERS_WITH_PHOTOS` gates the
 * lookup and the card falls back to a monogram avatar.
 *
 * When a real photograph arrives: drop it at /images/learners/<slug>.jpg and add
 * the slug here.
 */
const LEARNERS_WITH_PHOTOS = new Set(["ritika-singh", "aman-raj", "sneha-patel"]);

export const learnerPhoto = (slug: string, name: string): MediaAsset | null =>
  LEARNERS_WITH_PHOTOS.has(slug)
    ? {
        src: `/images/learners/${slug}.jpg`,
        alt: `Portrait of ${name}`,
        width: 256,
        height: 256,
      }
    : null;

/** Initials for the monogram avatar used when no photograph exists yet. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
