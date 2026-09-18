import Link from "next/link";
import { journey } from "@/content/homepage";
import { PrephaszLogo } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { EducationJourney } from "./EducationJourney";

/**
 * 07 - THE EDUCATION-TO-CAREER PATH
 *
 * The section the brief cares most about visually: "It should not look like a
 * standalone colourful infographic inserted into the website."
 *
 * So the earlier comp's seven-colour rainbow stays gone. Per the updated design
 * the whole block is centred, all seven stage cards are identical white cards,
 * and the ONLY colour is the master gradient - on the headline sweep, the stage
 * numbers and the circular icon wells. Navy typography throughout.
 *
 * The third solution block is "B.Com + ACCA", replacing "ZSkillup Career
 * Pathways" outright - the brief does not want another umbrella term.
 *
 * Removed: "Explore Our Programs", "Education Today. Brighter Tomorrows." and
 * "Learn | Practice | Grow | Succeed". The freed space stays as whitespace.
 */

const solutionIcons: Record<string, IconName> = {
  institutions: "chart",
  prephasz: "target",
  commerce: "chart",
};

/** Tints for the three closing blocks, matching the design. */
const solutionTints: Record<string, string> = {
  institutions: "bg-[#e9e7fb]",
  prephasz: "bg-[#fdeadd]",
  commerce: "bg-[#ddf0ec]",
};

export function EducationPath() {
  return (
    <Section id="education-to-career" tone="white" labelledBy="journey-heading">
      <Container>
        <div className="text-center">
          <p className="eyebrow justify-center text-navy/70">{journey.eyebrow}</p>
          {/* One gradient sweep across the whole line, as the design shows. */}
          <h2
            id="journey-heading"
            className="text-gradient mx-auto mt-5 w-fit text-[2rem] leading-[1.1] font-extrabold text-balance sm:text-[2.7rem] lg:text-[3.25rem] lg:text-nowrap"
          >
            {journey.headline.plain} {journey.headline.gradient}
          </h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-body sm:text-lg">
            {journey.supporting}
          </p>
        </div>

        {/* --- Seven stages: ONE connected journey, not seven products -------
            4+3 layout with a viewport-triggered, plays-once progress
            animation - see EducationJourney. */}
        <EducationJourney />

        {/* --- The three offerings this journey resolves into ---------------- */}
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {journey.solutions.map((solution) => (
            <li key={solution.title}>
              {/* The whole block is clickable, per the brief. */}
              <Link
                href={solution.href}
                className={`group flex h-full flex-col rounded-card ${solutionTints[solution.vertical]} p-6 transition-opacity hover:opacity-90`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="bg-gradient-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                    <Icon
                      name={solutionIcons[solution.vertical]}
                      className="h-[1.15rem] w-[1.15rem]"
                    />
                  </span>
                  {solution.vertical === "prephasz" ? (
                    <PrephaszLogo className="h-9" />
                  ) : (
                    <h3 className="text-[1.375rem] font-extrabold text-navy">{solution.title}</h3>
                  )}
                </div>

                <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">{solution.body}</p>

                <div className="mt-5 flex flex-1 flex-wrap items-end gap-2">
                  <ul className="flex flex-1 flex-wrap gap-2">
                    {solution.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-white/70 px-2.5 py-1.5 text-[0.75rem] font-semibold text-navy"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy/20 text-navy transition-transform group-hover:translate-x-0.5"
                  >
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
