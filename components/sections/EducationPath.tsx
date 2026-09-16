import Link from "next/link";
import { journey } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section, verticalStyles } from "@/components/ui/Section";

/**
 * 07 - THE EDUCATION-TO-CAREER PATH (Design 6 base - layout unchanged)
 *
 * This is the section the brief cares most about visually: "Most importantly,
 * visually match this section with Hero Design 13. It should not look like a
 * standalone colourful infographic inserted into the website."
 *
 * So the comp's seven-colour rainbow is GONE. All seven stages are white/very
 * light neutral with identical treatment, navy typography throughout, and the
 * purple-to-coral gradient appears only on the stage numbers, the icon wells and
 * the connecting arrows - never as a card background.
 *
 * The OUR GOAL box keeps its position but loses the green-heavy treatment: light
 * neutral with one small ZSkillup accent.
 *
 * The third solution block is "B.Com + ACCA", replacing "ZSkillup Career
 * Pathways" outright - the brief does not want another umbrella term for the
 * commerce offering.
 *
 * Removed: "Explore Our Programs", "Education Today. Brighter Tomorrows." and
 * "Learn | Practice | Grow | Succeed". The freed space stays as whitespace.
 *
 * The story a visitor should read at a glance: career readiness is a journey ->
 * ZSkillup supports different stages of it -> through three distinct offerings.
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
  institutions: "building",
  prephasz: "target",
  commerce: "chart",
};

export function EducationPath() {
  return (
    <Section id="education-to-career" tone="white" labelledBy="journey-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-8">
            <Eyebrow tone="brand">{journey.eyebrow}</Eyebrow>
            <Heading
              id="journey-heading"
              plain={journey.headline.plain}
              accent={journey.headline.gradient}
              className="mt-5 max-w-[18ch]"
            />
            <Lede className="mt-6 max-w-[62ch]">{journey.supporting}</Lede>
          </div>

          {/* OUR GOAL - light and neutral, one small accent. */}
          <aside className="rounded-card border border-line bg-cloud p-6 lg:col-span-4">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-card">
                <Icon name="target" className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <div>
                <p className="eyebrow text-[0.6875rem]">{journey.goal.eyebrow}</p>
                <h3 className="mt-2 text-[1.0625rem] leading-snug font-bold text-navy">
                  {journey.goal.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-body">
                  {journey.goal.body}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* --- Seven stages: ONE connected journey, not seven products ------- */}
        <ol className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-4 xl:grid-cols-7">
          {journey.stages.map((stage, i) => (
            <li
              key={stage.step}
              className="relative w-[15rem] shrink-0 snap-start sm:w-auto"
            >
              <div className="h-full rounded-card border border-line bg-cloud/70 p-5">
                <span className="text-[0.8125rem] font-extrabold text-gradient">
                  {stage.step}
                </span>
                <span className="mt-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon name={stageIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-bold text-navy">{stage.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-body">{stage.body}</p>
              </div>

              {/* Subtle but clearly visible - the journey should read naturally
                  from Education through to Career. */}
              {i < journey.stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-3 hidden -translate-y-1/2 text-brand/45 xl:block"
                >
                  <Icon name="chevronRight" className="h-4 w-4" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        {/* --- The three offerings this journey resolves into ----------------- */}
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {journey.solutions.map((solution) => {
            const style = verticalStyles[solution.vertical];
            return (
              <li key={solution.title}>
                {/* The whole block is clickable, per the brief. */}
                <Link
                  href={solution.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-6 transition-colors hover:border-navy/20 hover:bg-cloud"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${style.tint} ${style.text}`}
                    >
                      <Icon
                        name={solutionIcons[solution.vertical]}
                        className="h-[1.15rem] w-[1.15rem]"
                      />
                    </span>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border border-line ${style.text} transition-transform group-hover:translate-x-0.5`}
                      aria-hidden="true"
                    >
                      <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <h3 className="mt-5 text-[1.0625rem] font-bold text-navy">{solution.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-body">{solution.body}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {solution.tags.map((tag) => (
                      <li
                        key={tag}
                        className={`rounded-full ${style.tint} px-3 py-1.5 text-[0.75rem] font-medium text-navy`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
