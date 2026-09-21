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
    "A glimpse of ZSkillup in action — across campuses, classrooms, industry interactions and community events. Real people. Real learning. A brighter tomorrow.",
  viewMore: { label: "View All Moments", href: "/events" },
  featuredBadge: "Featured Event",
} as const;

/**
 * Filters, simplified per the brief.
 * "Webinars" was dropped - not worth a homepage filter without substantial
 * visual content behind it.
 */
export const badgeColors: Record<string, string> = {
  "campus-programs": "bg-[#ede9fe] text-[#6d28d9]",
  "community":       "bg-[#dcfce7] text-[#16a34a]",
  "industry":        "bg-[#fff3e0] text-[#ea6c00]",
  "workshops":       "bg-[#ede9fe] text-[#6d28d9]",
  "events":          "bg-[#fce7f3] text-[#be185d]",
  "expert-talks":    "bg-[#fff3e0] text-[#ea6c00]",
};

export const badgeLabels: Record<string, string> = {
  "campus-programs": "Campus Program",
  "community":       "Community",
  "industry":        "Industry",
  "workshops":       "Workshop",
  "events":          "Event",
  "expert-talks":    "Expert Talk",
};

export const galleryFilters = [
  { id: "all", label: "All" },
  { id: "campus-programs", label: "Campus Programs" },
  { id: "workshops", label: "Workshops" },
  { id: "industry", label: "Industry Interactions" },
  { id: "events", label: "Events" },
  { id: "community", label: "Student Community" },
  { id: "expert-talks", label: "Expert Talks" },
] as const;

export type GalleryCategory = (typeof galleryFilters)[number]["id"];

export type Article = {
  heading: string;
  body: string;
  /** Optional image path shown beside this article block */
  image?: string;
  imageAlt?: string;
};

export type Photo = {
  src: string;
  alt: string;
  title: string;
  /** One short context line. Keep it short. */
  caption: string;
  category: Exclude<GalleryCategory, "all">;
  /** URL-safe slug for the event detail page */
  slug: string;
  /** Display date string, e.g. "Mar 15, 2024" */
  date?: string;
  /** City / venue shown alongside the date */
  location?: string;
  /** Long-form article blocks shown on the event detail page */
  articles?: Article[];
  /** Additional photo paths shown in the gallery on the detail page */
  photos?: string[];
};

/**
 * Featured carousel. The brief asks for strong, high-quality real photographs
 * showing people and action rather than posed group shots.
 */
export const featuredEvents: readonly Photo[] = [
  {
    src: "/images/events/industry-expert-session.jpg",
    alt: "Speaker presenting to a packed audience at ZSkillup Tech Career Summit 2024",
    title: "ZSkillup Tech Career Summit 2024",
    caption: "Inspiring conversations, real opportunities and a stronger tomorrow — together.",
    category: "industry",
    slug: "tech-career-summit-2024",
    date: "Nov 16, 2024",
    location: "Bengaluru, India",
    articles: [
      {
        heading: "Where ambition met opportunity",
        body: "The ZSkillup Tech Career Summit 2024 brought together over 500 students, industry leaders, and career coaches under one roof in Bengaluru. The energy was electric — every session sparked new ideas about what a career in tech could look like, and every hallway conversation turned into a potential connection.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Industry expert speaking to an engaged audience",
      },
      {
        heading: "Keynotes, panels, and real talk",
        body: "From hands-on workshops on AI and data science to candid panel discussions on breaking into product management, attendees left with clarity, contacts, and a renewed sense of direction. Speakers from leading companies shared hiring insights, day-in-the-life stories, and actionable advice — no fluff, just real guidance.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students engaging in a hands-on workshop session",
      },
    ],
    photos: [
      "/images/events/hands-on-learning-lab.jpg",
      "/images/events/expert-talk-series.jpg",
      "/images/events/group-activity-workshop.jpg",
    ],
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students gathered at a ZSkillup campus program",
    title: "Student Community",
    caption: "A growing community of learners",
    category: "community",
    slug: "student-community",
    date: "Feb 10, 2024",
    location: "Pune",
  },
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting global certification career opportunities to students",
    title: "ACCA Career Workshop",
    caption: "Exploring global commerce opportunities",
    category: "workshops",
    slug: "acca-career-workshop",
    date: "Jan 20, 2024",
    location: "Delhi",
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
    slug: "certificate-distribution-2024",
    date: "Mar 28, 2024",
    location: "Bangalore",
  },
];

/** Gallery grid - eight visible on the homepage. */
export const galleryPhotos: readonly Photo[] = [
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting at a campus program session",
    title: "Future Ready Workshop",
    caption: "Building skills for what's next",
    category: "campus-programs",
    slug: "future-ready-workshop",
    date: "Jan 20, 2024",
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students posed together at a ZSkillup campus program",
    title: "Student Community Meet",
    caption: "A growing community of learners",
    category: "community",
    slug: "student-community-meet",
    date: "Feb 10, 2024",
    articles: [
      {
        heading: "Building connections that last",
        body: "The Student Community Meet brought together learners from across programs to share experiences, swap notes, and build friendships that go beyond the classroom. It was a reminder that learning is as much about the people you meet as the skills you acquire.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students collaborating during a group activity session",
      },
      {
        heading: "Peer learning in action",
        body: "Structured peer-led sessions gave students the floor to share what they had learned — in their own words, at their own pace. The result was a room full of genuine curiosity, laughter, and the kind of insight that only comes from lived experience.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "ZSkillup team with institution representatives",
      },
    ],
    photos: [
      "/images/events/group-activity-workshop.jpg",
      "/images/events/institutional-collaboration.jpg",
      "/images/events/certificate-distribution.jpg",
    ],
  },
  {
    src: "/images/events/hands-on-learning-lab.jpg",
    alt: "A group of students gathered around a laptop during a practical session",
    title: "Hands-on Learning",
    caption: "Practical skills for real-world careers",
    category: "industry",
    slug: "hands-on-learning",
    date: "Mar 5, 2024",
  },
  {
    src: "/images/events/expert-talk-series.jpg",
    alt: "A speaker presenting 'Adapting to the Future of Work' to an audience",
    title: "Adapting to the Future of Work",
    caption: "Conversations with industry leaders",
    category: "expert-talks",
    slug: "adapting-to-future-of-work",
    date: "Mar 28, 2024",
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
    slug: "certificate-distribution",
    date: "Mar 28, 2024",
  },
  {
    src: "/images/events/group-activity-workshop.jpg",
    alt: "Students seated around a table collaborating during a group activity",
    title: "Group Activities",
    caption: "Learning together, growing together",
    category: "workshops",
    slug: "group-activities-workshop",
    date: "Jan 15, 2024",
  },
  {
    src: "/images/events/institutional-collaboration.jpg",
    alt: "ZSkillup team members talking with institution representatives beside a ZSkillup banner",
    title: "Institutional Collaboration",
    caption: "Partnering for greater impact",
    category: "campus-programs",
    slug: "institutional-collaboration",
    date: "Dec 10, 2023",
  },
  {
    src: "/images/events/interactive-workshop.jpg",
    alt: "A facilitator writing ideas on a whiteboard during an interactive workshop",
    title: "Interactive Workshop",
    caption: "Turning ideas into action",
    category: "events",
    slug: "interactive-workshop",
    date: "Nov 18, 2023",
  },
];
