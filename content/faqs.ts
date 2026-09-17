/**
 * 11 - FAQs
 *
 * Deliberately NOT a FAQ repository. The brief: the homepage answers only the
 * 6-8 questions that help someone understand ZSkillup as a whole; each dedicated
 * page carries its own detailed FAQ (Institutions -> partnership model,
 * customisation, delivery, reporting; Prephasz -> platform, subscription,
 * assessments, access, pricing; B.Com + ACCA -> eligibility, university, ACCA
 * exemptions, duration, fees, admissions).
 *
 * Categories mirror the site architecture exactly. "Programmes" was removed as a
 * category because "Programs" is no longer a top-level architecture term, and
 * "Admissions & Career" was folded into B.Com + ACCA and Prephasz.
 *
 * Answer discipline, straight from the brief:
 *   "Don't use the FAQ section to make claims about placements, ACCA exemptions,
 *    eligibility, guaranteed outcomes etc. unless those answers can be stated
 *    accurately across all applicable programs."
 *
 * The answers below are deliberately descriptive rather than promissory. Keep
 * them that way. Answers render as a FAQPage structured-data block, so they must
 * stay factually accurate and must match the visible text.
 */

export const faqIntro = {
  eyebrow: "FAQs",
  headline: { plain: "Questions?", gradient: "We've got answers." },
  supporting:
    "Find quick answers about ZSkillup, our offerings, institutional partnerships and career pathways.",
  leftHeading: "What would you like to know?",
  leftBody:
    "Explore the most common questions about our offerings, partnerships and how ZSkillup supports students, institutions and careers.",
  contactPrompt: "Can't find what you're looking for?",
  contactCta: { label: "Contact Our Team", href: "#partner-with-us" },
} as const;

export const faqCategories = [
  { id: "general", label: "General", blurb: "What ZSkillup is and how it works." },
  {
    id: "institutions",
    label: "For Institutions",
    blurb: "Partnerships, delivery and campus programs.",
  },
  { id: "prephasz", label: "prephasz", blurb: "Placement preparation and platform." },
  {
    id: "commerce",
    label: "B.Com + ACCA",
    blurb: "The commerce degree and career pathway.",
  },
] as const;

export type FaqCategory = (typeof faqCategories)[number]["id"];

export type Faq = {
  q: string;
  a: string;
  category: FaqCategory;
};

export const faqs: readonly Faq[] = [
  /* --- General (the default set, shown first) ----------------------------- */
  {
    category: "general",
    q: "What does ZSkillup do?",
    a: "ZSkillup supports career readiness across campuses through institutional programs, the prephasz placement-preparation platform, and the B.Com + ACCA career pathway — combining skills, practice and industry exposure.",
  },
  {
    category: "general",
    q: "How does ZSkillup work with institutions?",
    a: "We design programs around an institution's cohorts, academic calendar and placement objectives — covering training, career preparation tools, practical exposure and placement support. Programs are customised rather than sold off the shelf.",
  },
  {
    category: "general",
    q: "What is prephasz?",
    a: "prephasz is ZSkillup's placement-preparation platform. It is built around the actual recruitment journey, helping students identify gaps, practise the right areas, prepare for target companies and track their progress.",
  },
  {
    category: "general",
    q: "What is the B.Com + ACCA pathway?",
    a: "It is a commerce pathway that brings together a university degree, ACCA preparation, employability development and industry exposure. Program structure and ACCA exemptions vary by university.",
  },
  {
    category: "general",
    q: "Who can use ZSkillup's programs and platforms?",
    a: "Institutions partner with us to deliver programs to their students. Individual students can prepare for placements on prephasz, and commerce students can explore the B.Com + ACCA pathway.",
  },
  {
    category: "general",
    q: "What kind of career preparation does ZSkillup provide?",
    a: "Preparation spans aptitude and placement readiness, communication and professional skills, technical tracks such as DSA, full stack and data science, plus resume support, mock interviews and campus-to-corporate readiness.",
  },
  {
    category: "general",
    q: "How can an institution partner with ZSkillup?",
    a: "Share your institution's cohorts, skill gaps and placement objectives with our team and we will propose a program built around your campus. Start with Partner With Us or Discuss Your Campus Needs.",
  },
  {
    category: "general",
    q: "How can I speak with the ZSkillup team?",
    a: "Use Contact Our Team below, or reach us directly by phone or email. Tell us whether you are enquiring as an institution, a student or an industry partner and we will route it to the right person.",
  },

  /* --- For Institutions ---------------------------------------------------- */
  {
    category: "institutions",
    q: "How is a campus program customised to our institution?",
    a: "We start by assessing your student cohorts, skill gaps and placement objectives, then select relevant tracks and align delivery with your academic calendar before training begins.",
  },
  {
    category: "institutions",
    q: "Which programs can we offer our students?",
    a: "Aptitude & Placement Readiness, Communication & Professional Skills, Data Structures & Algorithms, Full Stack Development + GenAI, Data Science & AI, and Campus-to-Corporate Readiness. Tracks can be combined into a broader employability initiative.",
  },
  {
    category: "institutions",
    q: "How do we track student progress?",
    a: "Readiness is assessed through structured assessments and practice, so institutions can see where cohorts stand and direct focused support as students approach recruitment.",
  },
  {
    category: "institutions",
    q: "What placement support is included?",
    a: "Support covers hiring connections, placement drives and interview preparation. The specific scope is agreed with each institution as part of the partnership.",
  },

  /* --- Prephasz ------------------------------------------------------------ */
  {
    category: "prephasz",
    q: "How is prephasz different from a general learning platform?",
    a: "prephasz is organised around the recruitment sequence rather than around courses. Students check where they stand, practise the areas holding them back, prepare for target companies and track progress.",
  },
  {
    category: "prephasz",
    q: "What can students practise on prephasz?",
    a: "Focused assessments, personalised practice based on performance and target roles, company-specific practice and patterns, and interview preparation resources.",
  },
  {
    category: "prephasz",
    q: "Can students use prephasz on their own?",
    a: "Yes. Students can start on prephasz directly, and institutions can also make it part of a wider campus program.",
  },
  {
    category: "prephasz",
    q: "How does prephasz help students know what to work on next?",
    a: "Assessments highlight current strengths and gaps, and feedback turns weak areas into specific next actions rather than a generic study list.",
  },

  /* --- B.Com + ACCA -------------------------------------------------------- */
  {
    category: "commerce",
    q: "What does the B.Com + ACCA pathway include?",
    a: "Four connected parts: a B.Com degree as the academic foundation, ACCA preparation, employability development for workplace skills, and industry exposure.",
  },
  {
    category: "commerce",
    q: "Do ACCA exemptions apply to every university?",
    a: "No. Program structure and ACCA exemptions vary by university. Confirm the specifics for your chosen university with our team before you enrol.",
  },
  {
    category: "commerce",
    q: "What careers can this pathway lead toward?",
    a: "Possible directions include accounting, audit, business finance, risk, tax, consulting and financial services. These are possible career directions, not guaranteed outcomes.",
  },
  {
    category: "commerce",
    q: "How do I find out whether this pathway suits me?",
    a: "Talk to a Career Advisor. You can explore the pathway first and speak to someone when you want specifics on universities, structure or next steps.",
  },
];
