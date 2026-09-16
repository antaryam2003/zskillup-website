import Link from "next/link";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";

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

const stageIcons: IconName[] = [
  "graduation",
  "book",
  "file",
  "chart",
  "users",
  "briefcase",
  "trending",
];

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
        <div className="relative">
          {/* OUR GOAL - light mint, one small accent, per the updated design. */}
          <aside className="mb-10 rounded-card bg-[#e7f5ef] p-5 lg:ml-auto lg:w-[23rem]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#cfeae0] text-com">
                <Icon name="target" className="h-4 w-4" />
              </span>
              <p className="eyebrow text-[0.6875rem] text-navy">{journey.goal.eyebrow}</p>
            </div>
            <h3 className="mt-3 text-[1.0625rem] leading-snug font-bold text-navy">
              {journey.goal.title}
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-body">{journey.goal.body}</p>
          </aside>

          <div className="text-center lg:-mt-16">
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
        </div>

        {/* --- Seven stages: ONE connected journey, not seven products ------- */}
        <ol className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-4 xl:grid-cols-7">
          {journey.stages.map((stage, i) => (
            <li key={stage.step} className="relative w-[14.5rem] shrink-0 snap-start sm:w-auto">
              <div className="h-full rounded-card border border-line bg-white p-5 text-center">
                <span className="text-gradient block text-[1.75rem] font-extrabold">
                  {stage.step}
                </span>
                <span className="bg-gradient-icon mx-auto mt-3 grid h-12 w-12 place-items-center rounded-full text-white">
                  <Icon name={stageIcons[i]} className="h-[1.2rem] w-[1.2rem]" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-navy">{stage.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-body">{stage.body}</p>
              </div>

              {/* Subtle but clearly visible - the journey should read naturally
                  from Education through to Career. */}
              {i < journey.stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-2.5 hidden -translate-y-1/2 text-muted xl:block"
                >
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

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
                  <h3 className="text-[1.375rem] font-extrabold text-navy">{solution.title}</h3>
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
