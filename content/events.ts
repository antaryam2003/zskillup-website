/**
 * 10 - ZSKILLUP IN ACTION
 *
 * The brief's framing: Partners gives institutional proof, Testimonials gives
 * learner proof, and this section gives VISUAL proof that ZSkillup is genuinely
 * active on the ground. It also renames the destination away from "Gallery",
 * which "sounds passive" - the concept is "ZSkillup in Action".
 *
 * Built to scale: adding 100+ photographs later must not change the homepage
 * layout. The homepage shows one featured carousel plus eight gallery tiles;
 * everything beyond that lives behind "View More Photos".
 *
 * Photographs are the approved comp's own images, extracted by
 * `scripts/extract-comp-assets.py`. The comp contains ONE featured photograph and
 * eight gallery photographs, so the featured carousel currently draws on the
 * gallery set as well - more dedicated featured shots are needed. See
 * CONTENT-TODO.md.
 */

export const inAction = {
  eyebrow: "Events & moments",
  headline: "ZSkillup in Action.",
  supporting:
    "A glimpse of ZSkillup in action — across campuses, classrooms, industry interactions and community events.",
  viewMore: { label: "View More Photos", href: "#partner-with-us" },
  featuredBadge: "Featured Event",
} as const;

/**
 * Filters, simplified per the brief.
 * "Webinars" was dropped - not worth a homepage filter without substantial
 * visual content behind it.
 */
export const galleryFilters = [
  { id: "all", label: "All" },
  { id: "campus-programs", label: "Campus Programs" },
  { id: "workshops", label: "Workshops" },
  { id: "industry", label: "Industry Interactions" },
  { id: "events", label: "Events" },
  { id: "community", label: "Student Community" },
] as const;

export type GalleryCategory = (typeof galleryFilters)[number]["id"];

export type Photo = {
  src: string;
  alt: string;
  title: string;
  /** One short context line. Keep it short. */
  caption: string;
  category: Exclude<GalleryCategory, "all">;
};

/**
 * Featured carousel. The brief asks for strong, high-quality real photographs
 * showing people and action rather than posed group shots.
 */
export const featuredEvents: readonly Photo[] = [
  {
    src: "/images/events/industry-expert-session.jpg",
    alt: "An industry expert addressing a full room of students at a ZSkillup campus session",
    title: "Industry Expert Session",
    caption: "Insights, guidance and real-world learning",
    category: "industry",
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students gathered at a ZSkillup campus program",
    title: "Student Community",
    caption: "A growing community of learners",
    category: "community",
  },
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting global certification career opportunities to students",
    title: "ACCA Career Workshop",
    caption: "Exploring global commerce opportunities",
    category: "workshops",
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
  },
];

/** Gallery grid - eight visible on the homepage. */
export const galleryPhotos: readonly Photo[] = [
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting career opportunities with global certifications to a seated audience",
    title: "ACCA Career Workshop",
    caption: "Exploring global opportunities",
    category: "workshops",
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students posed together at a ZSkillup campus program",
    title: "Student Community",
    caption: "A growing community of learners",
    category: "community",
  },
  {
    src: "/images/events/hands-on-learning-lab.jpg",
    alt: "A group of students gathered around a laptop during a practical session",
    title: "Hands-on Learning",
    caption: "Practical skills for real-world careers",
    category: "campus-programs",
  },
  {
    src: "/images/events/expert-talk-series.jpg",
    alt: "A speaker presenting 'Adapting to the Future of Work' to an audience",
    title: "Expert Talk Series",
    caption: "Conversations with industry leaders",
    category: "industry",
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
  },
  {
    src: "/images/events/group-activity-workshop.jpg",
    alt: "Students seated around a table collaborating during a group activity",
    title: "Group Activities",
    caption: "Learning together, growing together",
    category: "workshops",
  },
  {
    src: "/images/events/institutional-collaboration.jpg",
    alt: "ZSkillup team members talking with institution representatives beside a ZSkillup banner",
    title: "Institutional Collaboration",
    caption: "Partnering for greater impact",
    category: "campus-programs",
  },
  {
    src: "/images/events/interactive-workshop.jpg",
    alt: "A facilitator writing ideas on a whiteboard during an interactive workshop",
    title: "Interactive Workshop",
    caption: "Turning ideas into action",
    category: "events",
  },
];
