import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * /insights
 *
 * Insights is the one primary-navigation item with no corresponding homepage
 * section, so this route exists to keep the navigation honest rather than
 * pointing at a 404.
 *
 * It is a scaffold, not the finished hub. The brief's direction for the real
 * thing: "Build Insights as a useful content hub around institutional
 * employability/campus readiness, placement preparation/Prephasz, and
 * commerce/ACCA career pathways."
 *
 * Deliberately `noindex` while empty - an indexed placeholder helps nobody.
 * Remove the robots override once real articles exist.
 */
export const metadata: Metadata = {
  title: "Insights for Education, Employability & Careers",
  description:
    "Perspectives from ZSkillup on campus employability, placement preparation and commerce career pathways.",
  alternates: { canonical: "/insights" },
  robots: { index: false, follow: true },
};

const themes = [
  {
    title: "Institutional employability",
    body: "Campus readiness, curriculum alignment, measuring outcomes across cohorts.",
  },
  {
    title: "Placement preparation",
    body: "How students prepare for the stages recruiters actually use.",
  },
  {
    title: "Commerce & ACCA pathways",
    body: "What a commerce degree plus a professional qualification can lead toward.",
  },
];

export default function InsightsPage() {
  return (
    <Section tone="white" labelledBy="insights-heading">
      <Container>
        <div className="max-w-[46rem]">
          <Eyebrow tone="brand">Insights</Eyebrow>
          <Heading
            as="h1"
            id="insights-heading"
            plain="Insights for Education, Employability &"
            accent="Careers."
            className="mt-5"
          />
          <Lede className="mt-6">
            We&rsquo;re building a content hub around the three questions we get asked most.
            Articles are on the way - in the meantime, tell us what you&rsquo;d find useful.
          </Lede>
          <div className="mt-8">
            <Button href="/#partner-with-us" variant="primary">
              Contact Our Team
            </Button>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-3">
          {themes.map((theme) => (
            <li key={theme.title} className="rounded-card border border-line bg-cloud p-6">
              <h2 className="text-[1.0625rem] font-bold text-navy">{theme.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{theme.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
