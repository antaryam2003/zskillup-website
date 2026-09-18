/**
 * 08 - PARTNERS
 *
 * The brief's overriding objective for this section: it must SCALE.
 * "We should be able to go from 20 to 100+ institutions/companies later without
 *  requiring any redesign of the homepage."
 *
 * So: add entries to the arrays below and the carousel absorbs them. Nothing else
 * changes. The homepage deliberately shows a window onto the network, not a
 * directory - "View All Partners" leads to the complete list.
 *
 * ---------------------------------------------------------------------------
 *  LOGOS
 *  Institutional logos below are the marks shown in the approved Partners comp,
 *  extracted by `scripts/extract-comp-assets.py`. They are comp-resolution -
 *  replace with vector originals at the same paths for production.
 *
 *  `logo` is optional. When it is absent the tile falls back to an accessible
 *  wordmark built from the partner's name, so the section stays complete and
 *  crawlable for entries with no artwork yet.
 *
 *  Third-party logos need permission before publishing - see CONTENT-TODO.md.
 * ---------------------------------------------------------------------------
 */

export type Partner = {
  name: string;
  /** Optional path to real logo artwork. Falls back to a text wordmark tile. */
  logo?: string;
};

export const partners = {
  eyebrow: "Our partners",
  headline: "Built through strong partnerships.",
  supporting:
    "We collaborate with leading institutions and companies to create industry-ready talent and meaningful career opportunities.",
  viewAll: { label: "View All Partners", href: "#partner-with-us" },
  explore: { label: "Explore Our Partners", href: "#partner-with-us" },
} as const;

/**
 * Tab 1 - Institutional Partners. Colleges and universities ONLY.
 * Names taken from the approved Partners comp.
 */
export const institutionPartners: readonly Partner[] = [
  { name: "Swami Vivekanand Group of Institutes", logo: "/images/partners/swami-vivekanand.jpg" },
  { name: "VIVA College", logo: "/images/partners/viva-college.jpg" },
  { name: "Sharda University", logo: "/images/partners/sharda-university.jpg" },
  { name: "Ajeenkya D Y Patil University", logo: "/images/partners/ajeenkya-dy-patil.jpg" },
  { name: "A.P. Shah Institute of Technology", logo: "/images/partners/ap-shah.jpg" },
  { name: "Atharva College of Engineering", logo: "/images/partners/atharva-college.jpg" },
  { name: "Sanjivani College of Engineering", logo: "/images/partners/sanjivani-college.jpg" },
  { name: "MGM College of Engineering & Technology", logo: "/images/partners/mgm-college.jpg" },
  { name: "College of Engineering & Technology, Varur", logo: "/images/partners/cet-varur.jpg" },
  { name: "WCTM", logo: "/images/partners/wctm.jpg" },
];

/**
 * Tab 2 - Industry & Hiring Network. Companies and employers ONLY.
 *
 * The brief prefers "Industry & Hiring Network" over "Hiring Partners" precisely
 * because not every company shown is formally a hiring partner. Keep that label.
 *
 * Names below are the recruiters ZSkillup/Prephasz already reference publicly.
 * Logo files are official artwork, trimmed to their content bounding box and
 * downscaled (source files ranged from 185px to 4464px wide) - never
 * recoloured or redrawn. Confirm naming permission before publishing - see
 * CONTENT-TODO.md.
 *
 * Deloitte has no `logo` yet - the supplied source file has a third-party
 * "cleanpng.com" watermark baked into opaque pixels (not a transparent
 * preview artifact - sampled pixels confirmed a literal checkerboard +
 * watermark-text pattern), so it isn't genuine artwork suitable for a
 * production site. Falls back to the wordmark tile, same as before, until a
 * clean file is supplied.
 */
export const industryPartners: readonly Partner[] = [
  { name: "TCS", logo: "/images/partners/tcs.png" },
  { name: "Infosys", logo: "/images/partners/infosys.png" },
  { name: "Wipro", logo: "/images/partners/wipro.png" },
  { name: "Accenture", logo: "/images/partners/accenture.png" },
  { name: "Cognizant", logo: "/images/partners/cognizant.png" },
  { name: "Capgemini", logo: "/images/partners/capgemini.png" },
  { name: "Tech Mahindra", logo: "/images/partners/tech-mahindra.png" },
  { name: "LTIMindtree", logo: "/images/partners/ltimindtree.png" },
  { name: "IBM", logo: "/images/partners/ibm.png" },
  { name: "Deloitte" },
];

export const partnerTabs = [
  { id: "institutional", label: "Institutional Partners", partners: institutionPartners },
  { id: "industry", label: "Industry & Hiring Network", partners: industryPartners },
] as const;
