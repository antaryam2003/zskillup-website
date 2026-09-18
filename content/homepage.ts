/**
 * Homepage copy, section by section, in the order the brief locks:
 *
 *   01 Hero -> 02 About -> 03 Choose Your Route -> 04 Institutions -> 05 Prephasz
 *   -> 06 B.Com + ACCA -> 07 Education-to-Career Path -> 08 Partners
 *   -> 09 Testimonials -> 10 ZSkillup in Action -> 11 FAQs -> 12 Final CTA / Footer
 *
 * Narrative logic: Brand -> Choice -> Offerings -> Philosophy -> Proof -> People
 *                  -> Activity -> Questions -> Conversion.
 *
 * Copy here is verbatim from the brief wherever the brief specifies it.
 * Spelling note: the brief asks for "Customised" (not "Customized") throughout.
 */

/** The three verticals. Colours are identifiers and accents only - never fills. */
export type Vertical = "institutions" | "prephasz" | "commerce";

/* ========================================================================== */
/* 01 - HERO                                                                  */
/* ========================================================================== */

export const hero = {
  eyebrow: "Higher education. Brighter careers.",
  /** The page's single H1. */
  headline: {
    plain: "Degrees create graduates.",
    gradient: "We help create industry\nready professionals.",
  },
  supporting: "Real skills. Practical exposure. Global opportunities.",
  /** Scrolls straight to Choose Your Route. "Programs" is no longer an architecture term. */
  cta: { label: "Explore What We Offer", href: "#choose-your-route" },
  /** Handwritten accent 1 of 2 on the homepage. */
  handwritten: "More Than a Degree",
  /** Reappears as the Testimonials headline - deliberate echo. */
  footNote: "Real people. Real progress.",
} as const;

/**
 * The three pathway cards.
 *
 * CTA hierarchy is deliberate, and the brief is emphatic that all three actions
 * stay: visitors (B2C especially) need a chance to understand the product before
 * being asked for their details.
 *
 *   primary   -> filled dark button  (Explore / Learn More)
 *   secondary -> plain text link     (the conversion action)
 *   video     -> play icon + text    (visually lightest)
 */
export type PathwayCta = { label: string; href: string };

export type HeroCard = {
  vertical: Vertical;
  eyebrow: string;
  /**
   * Prephasz / B.Com + ACCA name the offering outright, set inline in a tinted
   * pill after an en dash. Institutions has no second half.
   */
  brandLabel?: string;
  description: string;
  primary: PathwayCta;
  secondary: PathwayCta;
  video: PathwayCta;
};

export const heroCards: readonly HeroCard[] = [
  {
    vertical: "institutions",
    eyebrow: "For Universities & Institutions",
    description: "Build employability into the student journey.",
    primary: { label: "Explore", href: "#institutions" },
    secondary: { label: "Partner With Us", href: "#partner-with-us" },
    video: { label: "Watch Now", href: "#institutions" },
  },
  {
    vertical: "prephasz",
    eyebrow: "For Placement Preparation",
    brandLabel: "prephasz",
    description: "Stop guessing what to prepare next.",
    primary: { label: "Explore prephasz", href: "#prephasz" },
    secondary: { label: "Get Started", href: "#partner-with-us" },
    video: { label: "Watch Now", href: "#prephasz" },
  },
  {
    vertical: "commerce",
    eyebrow: "For Commerce Careers",
    /** "For Commerce Careers" alone does not tell a new visitor what the offering is. */
    brandLabel: "B.Com + ACCA",
    description: "Start with a degree. Build toward a profession.",
    primary: { label: "Explore Program", href: "#bcom-acca" },
    secondary: { label: "Talk to an Advisor", href: "#partner-with-us" },
    video: { label: "Watch Now", href: "#bcom-acca" },
  },
];

/* ========================================================================== */
/* 02 - ABOUT ZSKILLUP                                                        */
/* ========================================================================== */

export const about = {
  eyebrow: "About ZSkillup",
  headline: { plain: "Education beyond classrooms,", gradient: "towards real careers." },
  body: "ZSkillup Education Pvt. Ltd. is on a mission to bridge the gap between education and real-world opportunities. We work with students, institutions and industry to create practical, career-focused learning pathways that lead to meaningful outcomes.",
  cta: { label: "Read Our Story", href: "#testimonials" },
  drivesEyebrow: "What drives us",
  pillars: [
    {
      title: "Our Mission",
      body: "To make high-quality, career-focused education accessible to every learner.",
    },
    {
      title: "Our Vision",
      body: "A future where every learner has the skills, confidence, and opportunities to thrive.",
    },
    {
      title: "Our Values",
      body: "Learner-first. Collaboration. Integrity. Continuous growth.",
    },
  ],
  leadershipEyebrow: "Our leadership",
  leadershipHeadline: { plain: "People who turn vision into", gradient: "opportunity." },
  leadershipBody:
    "Our leadership team brings together deep industry experience, academic insight and a shared commitment to making education more accessible, practical and outcome-driven.",
  leadership: [
    {
      slug: "lokesh-mathur",
      name: "Lokesh Mathur",
      role: "Founder & Director",
      bio: "Brings over 19 years of experience in technology, education and career services. An engineering graduate with an Executive MBA from IIM Calcutta, he previously led Career Services at upGrad and drives ZSkillup's strategy and partnerships.",
      linkedin: "https://www.linkedin.com/in/mlokeshmathur",
    },
    {
      slug: "gaurav-singh",
      name: "Gaurav Singh",
      role: "Founder & Director",
      bio: "Brings over 15 years of experience in operations, consulting and strategy. A graduate of IIT Kanpur and IIM Udaipur, he has worked with Jio, EY, KPMG and upGrad, and leads operations and strategy.",
      linkedin: "https://www.linkedin.com/company/zskillup",
    },
    {
      slug: "manish-temani",
      name: "Manish Temani",
      role: "Director",
      bio: "Brings over 20 years of experience across audit, financial reporting and investment banking. A Chartered Accountant, Company Secretary and US CPA, he guides curriculum development and finance programmes.",
      linkedin: "https://www.linkedin.com/company/zskillup",
    },
  ],
} as const;

/* ========================================================================== */
/* 03 - CHOOSE YOUR ROUTE                                                     */
/* ========================================================================== */

export type RouteCard = {
  vertical: Vertical;
  kicker: string;
  eyebrow: string;
  brand?: string;
  title: string;
  /** Optional short line between the title and body - not every card needs one. */
  subtitle?: string;
  body: string;
  features: readonly string[];
  cta: PathwayCta;
};

export const chooseRoute: {
  eyebrow: string;
  headline: string;
  supporting: string;
  outcomeLabel: string;
  outcomeValue: string;
  cards: readonly RouteCard[];
} = {
  eyebrow: "Choose your route",
  headline: "Find the path that fits you.",
  supporting: "Different journeys. One outcome — career readiness.",
  cards: [
    {
      vertical: "institutions",
      kicker: "Stronger institutions",
      eyebrow: "For Institutions",
      brand: "Tech & Management",
      title: "Build Employability\ninto the\nstudent journey",
      body: "Plan, deliver and measure career readiness across cohorts with an approach designed around your institution.",
      features: ["Customised programmes", "Track outcomes", "Stronger student success"],
      cta: { label: "Explore Institutional Solutions", href: "#institutions" },
    },
    {
      vertical: "prephasz",
      kicker: "Confident learners",
      eyebrow: "For Placement Preparation",
      brand: "prephasz",
      title: "Stop guessing what to prepare next.",
      body: "Practise for the stages recruiters use, find the areas holding you back and prepare with a clearer plan.",
      features: ["Mock tests & practice", "Personalised insights", "Get job ready"],
      cta: { label: "Explore prephasz", href: "#prephasz" },
    },
    {
      vertical: "commerce",
      kicker: "Real opportunities",
      eyebrow: "For Commerce Careers",
      brand: "B.Com + ACCA",
      title: "Start with a degree. Build toward a profession.",
      body: "Explore a B.Com + ACCA pathway designed to connect university study, professional preparation and employability.",
      features: ["B.Com + ACCA pathway", "Global recognition", "Career opportunities"],
      cta: { label: "Explore B.Com + ACCA", href: "#bcom-acca" },
    },
  ],
  /** Ties all three routes back to one ZSkillup proposition. */
  outcomeLabel: "Outcome:",
  outcomeValue: "Employability",
};

/* ========================================================================== */
/* 04 - INSTITUTIONS                                                          */
/* ========================================================================== */

export const institutions = {
  eyebrow: "For Institutions",
  headline: { plain: "Build a placement-ready", gradient: "campus." },
  supporting:
    "Prepare your students for the workplace with industry-aligned training, practical exposure, career preparation and placement support — customised to your institution.",
  primaryCta: { label: "Discuss Your Campus Needs", href: "#partner-with-us" },
  secondaryCta: { label: "Explore Solutions", href: "#institution-programs" },

  partnershipEyebrow: "One partnership",
  partnershipHeadline: { plain: "One partnership. Support across the", gradient: "student journey." },
  partnershipBody:
    "Bring skill development and career preparation into your academic calendar. ZSkillup helps your institution identify learning gaps, deliver focused training and track students' progress toward placement readiness.",
  pillars: [
    {
      title: "Customised Training",
      body: "Programs aligned with readiness levels and career goals.",
    },
    {
      title: "Career Preparation Tools",
      body: "Aptitude practice, resume support and mock interviews.",
    },
    {
      title: "Practical Experience",
      body: "Projects and internship opportunities that help students apply their learning.",
    },
    {
      title: "Placement Support",
      body: "Hiring connections, placement drives and interview preparation.",
    },
  ],

  programsHeadline: "Programs for your campus",
  programsBody:
    "Choose a focused program or combine tracks into a broader employability initiative.",
  /** Stays a table - the brief is explicit that this must not become cards. */
  programs: [
    {
      name: "Aptitude & Placement Readiness",
      focus: "Quantitative aptitude, logical reasoning, verbal ability and recruitment test preparation.",
    },
    {
      name: "Communication & Professional Skills",
      focus: "Workplace communication, presentations, group discussions and interview confidence.",
    },
    {
      name: "Data Structures & Algorithms",
      focus: "Coding fundamentals, problem-solving, DSA and technical interview preparation.",
    },
    {
      name: "Full Stack Development + GenAI",
      focus: "Application development, practical projects and effective use of GenAI tools.",
    },
    {
      name: "Data Science & AI",
      focus: "Python, data analysis, machine learning foundations and applied projects.",
    },
    {
      name: "Campus-to-Corporate Readiness",
      focus: "Resume building, mock interviews, professional etiquette and workplace preparation.",
    },
  ],
  programsCta: { label: "Request a Customised Program", href: "#partner-with-us" },

  methodHeadline: "Designed around your institution.",
  methodBody: "A structured approach to drive measurable outcomes for your students.",
  /** Reads as ONE connected process, not four independent feature cards. */
  method: [
    {
      step: "01",
      title: "Assess",
      body: "Understand your student cohorts, skill gaps and placement objectives.",
    },
    {
      step: "02",
      title: "Build",
      body: "Select relevant tracks and align delivery with your academic calendar.",
    },
    {
      step: "03",
      title: "Train",
      body: "Combine guided learning with workshops, projects and interview preparation.",
    },
    {
      step: "04",
      title: "Track",
      body: "Monitor readiness and provide focused support as students approach recruitment.",
    },
  ],

  finalCta: {
    headline: "Help your students take their next step.",
    body: "Tell us about your institution and the outcomes you want to achieve. Let's build a program around your campus.",
    cta: { label: "Discuss a Campus Partnership", href: "#partner-with-us" },
  },
} as const;

/* ========================================================================== */
/* 05 - PREPHASZ                                                              */
/* ========================================================================== */

export const prephasz = {
  eyebrow: "prephasz by ZSkillup",
  headline: { plain: "Preparation works better when you know", highlight: "what comes next." },
  supporting:
    "prephasz is built around the actual recruitment journey — helping students identify gaps, practise the right areas, prepare for target companies and track their progress.",
  primaryCta: { label: "Start on prephasz", href: "https://prephasz.com" },
  secondaryCta: { label: "Explore prephasz", href: "#prephasz-journey" },
  videoLabel: "Watch prephasz in action",
  videoDuration: "2 min",

  journeyEyebrow: "A simple journey",
  journeyHeadline: "From practice to opportunity.",
  /** The line the feedback doc asks for verbatim - do not rewrite it. */
  journeyStatement:
    "Prepare. Practice. Assess. Improve. Get Placement Ready — all in one platform.",
  /** Six feature pillars replacing the old four-step journey cards - the
   *  complete prephasz ecosystem, not just a practice tool. Feature names
   *  are fixed by the brief and must not be reworded. */
  pillars: [
    {
      title: "Prepare",
      tagline: "Company hubs, study plans and topic-wise practice, built around your goals.",
      features: ["Company Hubs", "Study Plans", "Practice Questions", "Topic & Section Preparation"],
    },
    {
      title: "Assess",
      tagline: "Full-length mocks and company-specific tests that measure real placement readiness.",
      features: ["Mock Assessments", "Company-Specific Tests", "Placement Readiness Tests"],
    },
    {
      title: "Analyse",
      tagline: "Track accuracy, speed and rankings with a clear, section-wise performance dashboard.",
      features: ["Performance Dashboard", "Section-Wise Analysis", "Accuracy", "Speed", "Rankings"],
    },
    {
      title: "Learn",
      tagline: "Live masterclasses and SME sessions, plus recorded resources and clear explanations.",
      features: ["Live Masterclasses", "SME Sessions", "Recorded Resources", "Explanations"],
    },
    {
      title: "Get Hired",
      tagline: "Job board, resume builder and mock interviews that turn preparation into offers.",
      features: ["Job Board", "Resume Builder", "Mock Interviews", "Placement Opportunities"],
    },
    {
      title: "Track Outcomes",
      tagline: "Certificates, leaderboards and reports that keep students and institutions aligned.",
      features: [
        "Certificates",
        "Leaderboards",
        "Student Reports",
        "TPO Dashboard",
        "Institutional Analytics",
      ],
    },
  ],
} as const;

/* ========================================================================== */
/* 06 - B.COM + ACCA                                                          */
/* ========================================================================== */

export const commerce = {
  eyebrow: "A ZSkillup career pathway",
  headline: { plain: "B.Com + ACCA, planned around the", highlight: "career beyond the degree." },
  supporting:
    "A career-focused commerce pathway combining a university degree, ACCA preparation, employability development and industry exposure.",
  /** Handwritten accent 2 of 2 on the homepage. */
  handwritten: "More opportunities ahead",
  /** Four connected blocks reading as ONE integrated pathway, one colour family. */
  pathway: [
    { title: "B.Com", body: "Strong academic foundation." },
    { title: "ACCA Pathway", body: "Globally recognised professional qualification pathway." },
    { title: "Employability Development", body: "Skills for the workplace." },
    { title: "Industry Exposure", body: "Real-world exposure." },
  ],
  /** The long university/exemption disclaimer belongs on the dedicated page, not here. */
  shortNote: "Program structure and ACCA exemptions may vary by university.",
  careersHeadline: "Explore career pathways",
  careersBody:
    "Explore pathways across accounting, audit, business finance, risk, tax, consulting and financial services.",
  careersCaveat: "These are possible career directions, not guaranteed outcomes.",
  careers: [
    "Accounting",
    "Audit",
    "Business Finance",
    "Risk",
    "Tax",
    "Consulting",
    "Financial Services",
  ],
  primaryCta: { label: "Explore B.Com + ACCA", href: "#partner-with-us" },
  secondaryCta: { label: "Talk to a Career Advisor", href: "#partner-with-us" },
} as const;

/* ========================================================================== */
/* 07 - THE EDUCATION-TO-CAREER PATH                                          */
/* ========================================================================== */

export const journey = {
  eyebrow: "The education-to-career path",
  headline: { plain: "Readiness is built", gradient: "one stage at a time." },
  supporting:
    "No single course, platform or qualification creates career readiness. It is built progressively, at every stage of the journey.",
  goal: {
    eyebrow: "Our goal",
    title: "Turn learning into real opportunities.",
    body: "A structured path from classroom to career.",
  },
  /** Seven stages read as ONE connected ZSkillup journey - no rainbow treatment. */
  stages: [
    { step: "01", title: "Education", body: "Build a strong academic foundation and choose the right path." },
    { step: "02", title: "Skills", body: "Learn in-demand skills through structured programs." },
    { step: "03", title: "Practice", body: "Apply knowledge through real-world projects and practice." },
    { step: "04", title: "Assessment", body: "Track progress, identify gaps and get personalised feedback." },
    { step: "05", title: "Interview", body: "Build interview readiness with mock interviews and expert guidance." },
    { step: "06", title: "Employment", body: "Gain job opportunities through our hiring partners and placement support." },
    { step: "07", title: "Career", body: "Grow with new opportunities, upskill and advance in your career." },
  ],
  solutions: [
    {
      vertical: "institutions",
      title: "ZSkillup for Institutions",
      body: "Across education, skills, practice, assessment and placement readiness.",
      tags: ["Curriculum Support", "Skill Programs", "Placement Readiness"],
      href: "#institutions",
    },
    {
      vertical: "prephasz",
      title: "prephasz",
      body: "Across practice, assessment, interview and recruitment preparation.",
      tags: ["Practice", "Assessments", "Interview Prep", "Recruitment Readiness"],
      href: "#prephasz",
    },
    {
      vertical: "commerce",
      title: "B.Com + ACCA",
      body: "From academic choice through professional and career preparation.",
      tags: ["Degree", "ACCA", "Professional Skills", "Career Outcomes"],
      href: "#bcom-acca",
    },
  ],
} as const satisfies {
  eyebrow: string;
  headline: { plain: string; gradient: string };
  supporting: string;
  goal: { eyebrow: string; title: string; body: string };
  stages: readonly { step: string; title: string; body: string }[];
  solutions: readonly {
    vertical: Vertical;
    title: string;
    body: string;
    tags: readonly string[];
    href: string;
  }[];
};

/* ========================================================================== */
/* 12 - FINAL CTA                                                             */
/* ========================================================================== */

export const finalCta = {
  eyebrow: "Partner with us",
  headline: { plain: "Let's build what comes", gradient: "after the degree." },
  body: "Whether you are an institution planning employability outcomes, a student preparing for placements, or exploring the B.Com + ACCA pathway — tell us where you are and we'll take it from there.",
} as const;
