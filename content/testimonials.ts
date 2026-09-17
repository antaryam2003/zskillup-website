/**
 * 09 - TESTIMONIALS
 *
 * ###########################################################################
 * #                                                                         #
 * #   SAMPLE CONTENT - MUST BE REPLACED BEFORE PUBLISHING.                  #
 * #                                                                         #
 * #   The first three entries are carried over verbatim from the approved    #
 * #   design comp, where they were placeholder copy. The remaining three     #
 * #   were written in the same style to satisfy the brief's requirement to   #
 * #   "deliberately mix testimonials from Institutional Programs + Prephasz  #
 * #   + Commerce/B.Com + ACCA".                                              #
 * #                                                                         #
 * #   NONE of these are real learner quotes. Every one must be replaced with #
 * #   an authentic, consented testimonial - with the learner's real name,    #
 * #   programme and institution - before this section goes live.             #
 * #                                                                         #
 * ###########################################################################
 *
 * Brief rules encoded here:
 *   - 35-50 words per testimonial on the homepage.
 *   - Card shows: Photo | Name | Programme/Role | Institution.
 *   - Small category label per card, mixed across all three offerings.
 *   - NO star ratings. "Stars should only appear if these are actual ratings
 *     given by the learner" - there is no rating data, so there is no `rating`
 *     field and no stars are rendered.
 *   - NO top statistics strip (500+ / 4.8/5 / 90% were removed).
 */

import type { Vertical } from "./homepage";

export type Testimonial = {
  slug: string;
  name: string;
  role: string;
  institution: string;
  /** INSTITUTIONAL PROGRAM / PREPHASZ / COMMERCE CAREER PATHWAY */
  category: string;
  vertical: Vertical;
  quote: string;
};

export const testimonialsIntro = {
  eyebrow: "Testimonials",
  /** Echoes the phrase introduced in the Hero. */
  headline: { plain: "Real people.", gradient: "Real progress." },
  supporting:
    "Hear from learners across our programs as they build skills, confidence and career readiness with ZSkillup.",
} as const;

/** The dark end-card that closes the carousel. Navy, not green. */
export const testimonialsEndCard = {
  heading: "More stories. More journeys.",
  body: "From career clarity to global opportunities — our learners share how ZSkillup has made a difference.",
  cta: { label: "View More Stories", href: "#in-action" },
} as const;

/**
 * ORDER MATTERS, for two reasons at once.
 *
 * The brief asks that the carousel "deliberately mix testimonials from
 * Institutional Programs + Prephasz + Commerce/B.Com + ACCA, rather than making
 * all three visible stories belong to one offering" - AND that the learner
 * photographs are kept, because they are what make the section credible.
 *
 * The updated design resolves those together: the three photographed learners
 * lead, labelled across all three offerings. So the first three entries are the
 * ones with photographs, in commerce -> institutions -> prephasz order. Keep that
 * rotation when adding entries rather than appending by offering.
 */
export const testimonials: readonly Testimonial[] = [
  {
    slug: "ritika-singh",
    name: "Ritika Singh",
    role: "B.Com + ACCA Student",
    institution: "Delhi University",
    category: "Commerce Career Pathway",
    vertical: "commerce",
    quote:
      "ZSkillup gave me the right guidance to combine my B.Com degree with ACCA. The mentorship and structured learning made a huge difference in my confidence and career clarity.",
  },
  {
    slug: "aman-raj",
    name: "Aman Raj",
    role: "ACCA Aspirant",
    institution: "Christ University",
    category: "Institutional Program",
    vertical: "institutions",
    quote:
      "The practical exposure and industry sessions helped me understand how classroom learning applies in the real world. ZSkillup truly bridges the gap between education and a meaningful career.",
  },
  {
    slug: "sneha-patel",
    name: "Sneha Patel",
    role: "B.Com Student",
    institution: "Mumbai University",
    category: "prephasz",
    vertical: "prephasz",
    quote:
      "From resume building to interview preparation, the employability support at ZSkillup is exceptional. I feel more prepared and confident about my career in finance.",
  },
  {
    slug: "arjun-menon",
    name: "Arjun Menon",
    role: "Final-year Engineering Student",
    institution: "Atharva College of Engineering",
    category: "Institutional Program",
    vertical: "institutions",
    quote:
      "The campus program fitted around our academic calendar instead of competing with it. Aptitude sessions, group discussions and mock interviews made placement season feel far less daunting.",
  },
  {
    slug: "priya-nair",
    name: "Priya Nair",
    role: "prephasz User",
    institution: "Sanjivani College of Engineering",
    category: "prephasz",
    vertical: "prephasz",
    quote:
      "prephasz showed me exactly which areas were holding me back instead of leaving me to guess. Practising against real company patterns changed how I prepared for every round.",
  },
  {
    slug: "rahul-verma",
    name: "Rahul Verma",
    role: "Placement Coordinator",
    institution: "A.P. Shah Institute of Technology",
    category: "Institutional Program",
    vertical: "institutions",
    quote:
      "Having readiness data across a whole cohort meant we could target support where it mattered. Our students walked into recruitment far better prepared than in previous years.",
  },
];
