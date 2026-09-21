/**
 * Site-wide identity, navigation and contact details.
 *
 * Contact details below were taken from the live zskillup.com build.
 * Verify them before publishing.
 */

export const site = {
  name: "ZSkillup",
  legalName: "ZSkillup Education Pvt. Ltd.",
  /**
   * Drives canonicals + sitemap. `||` (not `??`) so an env var that is set but
   * blank - e.g. cleared in the Vercel dashboard - still falls back to a valid
   * origin instead of crashing `new URL()` at build time.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.zskillup.com",
  tagline: "Higher education. Brighter careers.",
  description:
    "ZSkillup works with universities, colleges and students to turn degrees into industry-ready careers - through institutional employability programs, the prephasz placement-preparation platform and the Global Finance Program commerce pathway.",
} as const;

export const contact = {
  phone: "+91 80500 70534",
  phoneHref: "tel:+918050070534",
  email: "hello@zskillup.com", // VERIFY: live site lists Lokesh@zskillup.com / Sneha.jadhav@zskillup.com
  addressLines: [
    "WeWork Princeville, Golf Link Software Park",
    "Challaghatta Village, Domlur",
    "Bengaluru, Karnataka 560071",
  ],
} as const;

export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/zskillup" },
  { label: "Instagram", href: "https://www.instagram.com/zskillup" },
  { label: "YouTube", href: "https://www.youtube.com/@zskillup" },
] as const;

/**
 * Primary navigation, exactly as specified in the brief:
 *   Institutions | Prephasz | B.Com + ACCA | Why ZSkillup | Insights | About
 * ("Programs" was deliberately removed as a top-level architecture term.)
 *
 * `href`  - where the link points TODAY (homepage-only build).
 * `page`  - the dedicated crawlable URL this becomes once that page ships.
 *           Swap `href: item.page` in one place to cut over.
 */
export const nav = [
  { label: "Institutions", href: "/#institutions", page: "/institutions" },
  { label: "prephasz", href: "/#prephasz", page: "/prephasz" },
  { label: "Global Finance Program", href: "/#bcom-acca", page: "/bcom-acca" },
  { label: "Why ZSkillup", href: "/#education-to-career", page: "/why-zskillup" },
  { label: "Insights", href: "/insights", page: "/insights" },
  { label: "About", href: "/#about", page: "/about" },
] as const;

/** The single prominent top-right conversion action. */
export const headerCta = {
  label: "Partner With Us",
  href: "/#partner-with-us",
} as const;

export const footerColumns = [
  {
    title: "What we do",
    links: [
      { label: "ZSkillup for Institutions", href: "/#institutions" },
      { label: "prephasz", href: "/#prephasz" },
      { label: "Global Finance Program", href: "/#bcom-acca" },
      { label: "The Education-to-Career Path", href: "/#education-to-career" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About ZSkillup", href: "/#about" },
      { label: "Our Partners", href: "/#partners" },
      { label: "ZSkillup in Action", href: "/#in-action" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Partner With Us", href: "/#partner-with-us" },
      { label: "Talk to a Career Advisor", href: "/#partner-with-us" },
      { label: "Request a Customised Program", href: "/#partner-with-us" },
      { label: "FAQs", href: "/#faqs" },
    ],
  },
] as const;
