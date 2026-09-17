import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { contact, site } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { HomepageStats } from "@/components/sections/HomepageStats";
import { About } from "@/components/sections/About";
import { ChooseRoute } from "@/components/sections/ChooseRoute";
import { Institutions } from "@/components/sections/Institutions";
import { Prephasz } from "@/components/sections/Prephasz";
import { BcomAcca } from "@/components/sections/BcomAcca";
import { EducationPath } from "@/components/sections/EducationPath";
import { Partners } from "@/components/sections/Partners";
import { Testimonials } from "@/components/sections/Testimonials";
import { InAction } from "@/components/sections/InAction";
import { Faqs } from "@/components/sections/Faqs";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "ZSkillup | Industry-Ready Careers for Students & Institutions",
  description:
    "Degrees create graduates. ZSkillup helps create industry-ready professionals - through employability programs for institutions, the prephasz placement-preparation platform and the B.Com + ACCA career pathway.",
  alternates: { canonical: "/" },
};

/**
 * Homepage.
 *
 * Section order is locked by the brief's Final Homepage Flow, and the narrative
 * logic behind it is:
 *
 *   Brand -> Choice -> Offerings -> Philosophy -> Proof -> People -> Activity
 *   -> Questions -> Conversion
 *
 * Heading hierarchy: the Hero headline is the page's only H1; every section
 * headline is an H2; cards and sub-sections use H3.
 *
 * HomepageStats sits between Hero and About as a later, explicit addition -
 * a compact credibility strip, not part of the original locked flow above.
 * It carries no heading of its own, so it doesn't participate in the H1/H2
 * hierarchy.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HomepageStats />
      <About />
      <ChooseRoute />
      <Institutions />
      <Prephasz />
      <BcomAcca />
      <EducationPath />
      <Partners />
      <Testimonials />
      <InAction />
      <Faqs />
      <FinalCta />

      <StructuredData />
    </>
  );
}

/**
 * Structured data.
 *
 * The brief: "Use structured data only where it accurately represents visible
 * page content and is appropriate for the page type."
 *
 * So there are exactly two blocks, and nothing speculative:
 *   - Organization, describing ZSkillup itself.
 *   - FAQPage, covering ONLY the general question set - the questions actually
 *     visible when the page loads. Category-filtered questions are deliberately
 *     excluded rather than stuffed in.
 *
 * No aggregateRating, no review markup, no course/offer markup: none of those
 * could be stated accurately from verified data today.
 */
function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLines[0],
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560071",
      addressCountry: "IN",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => f.category === "general")
      .map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
