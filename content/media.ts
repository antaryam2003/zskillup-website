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
   * Composed to cover the WHOLE hero with no white wash: the sharp half of the
   * design's photograph over a soft-focus field built from the same frame, so the
   * headline sits on campus rather than on a white panel. See
   * scripts/extract-comp-assets.py.
   */
  hero: {
    src: "/images/campus-student-hero.jpg",
    alt: "A student looking up at a university campus building, with other students walking behind her",
    width: 2016,
    height: 1134,
  },

  /** B.Com + ACCA section. Aspirational, natural, no floating elements around it. */
  commerceStudent: {
    src: "/images/commerce-student.jpg",
    alt: "A commerce student at her desk with a laptop and an open notebook, looking up thoughtfully",
    width: 609,
    height: 750,
  },

  /** Leadership portraits - keep natural and prominent. */
  team: {
    "lokesh-mathur": {
      src: "/images/team/lokesh-mathur.jpg",
      alt: "Portrait of Lokesh Mathur, Founder and Director of ZSkillup",
      width: 231,
      height: 245,
    },
    "gaurav-singh": {
      src: "/images/team/gaurav-singh.jpg",
      alt: "Portrait of Gaurav Singh, Founder and Director of ZSkillup",
      width: 231,
      height: 245,
    },
    "manish-temani": {
      src: "/images/team/manish-temani.jpg",
      alt: "Portrait of Manish Temani, Director of ZSkillup",
      width: 231,
      height: 245,
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
