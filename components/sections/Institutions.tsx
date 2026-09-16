import { institutions } from "@/content/homepage";
import { institutionStats } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";
import { StatList } from "@/components/ui/Stats";

/**
 * 04 - INSTITUTIONS (Design 3 base - structure unchanged)
 *
 * Page journey, as the brief specifies:
 *   Proposition -> What we support -> Programs -> How we customise/deliver -> CTA.
 *
 * Changes made per the brief:
 *   - eyebrow is "For Institutions", not "For Colleges & Universities".
 *   - "Customised" spelling used consistently (never "Customized").
 *   - the "Trusted by Leading Institutions" logo strip is REMOVED, and not
 *     replaced with another credibility block. Institutional credibility is
 *     established once, in the dedicated Partners section. The space it freed is
 *     whitespace between the methodology and the final CTA.
 *   - the final CTA block avoids a large solid-purple area: navy with restrained
 *     gradient accents instead.
 *   - no handwritten elements, no slogans. This is a B2B decision-making section,
 *     so it stays clean and credible.
 *   - green is never the dominant colour here; this belongs to the same site as
 *     Hero Design 13.
 *
 * The three credibility numbers render only when verified - see content/stats.ts.
 */

const pillarIcons: IconName[] = ["graduation", "file", "bulb", "users"];
const programIcons: IconName[] = ["chart", "message", "code", "layers", "database", "users"];
const methodIcons: IconName[] = ["search", "file", "users", "chart"];

export function Institutions() {
  return (
    <Section id="institutions" tone="white" labelledBy="institutions-heading">
      <Container>
        {/* --- Proposition --------------------------------------------------- */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow tone="institutions">{institutions.eyebrow}</Eyebrow>
            <Heading
              id="institutions-heading"
              plain={institutions.headline.plain}
              accent={institutions.headline.gradient}
              accentTone="institutions"
              className="mt-5"
            />
            <Lede className="mt-6 max-w-[46ch]">{institutions.supporting}</Lede>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={institutions.primaryCta.href} variant="vertical" tone="institutions">
                {institutions.primaryCta.label}
              </Button>
              <Button href={institutions.secondaryCta.href} variant="outline" icon="arrowDown">
                {institutions.secondaryCta.label}
              </Button>
            </div>

            <StatList stats={institutionStats} className="mt-10" />
          </div>

          {/* --- What we support --------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="rounded-card border border-inst-line bg-inst-soft/60 p-7 sm:p-9">
              <Eyebrow tone="institutions">{institutions.partnershipEyebrow}</Eyebrow>
              <Heading
                as="h3"
                plain={institutions.partnershipHeadline.plain}
                accent={institutions.partnershipHeadline.gradient}
                accentTone="institutions"
                className="mt-4"
              />
              <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-body">
                {institutions.partnershipBody}
              </p>

              {/* Lightweight by design: icon + heading + 2-3 lines. Not big cards. */}
              <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {institutions.pillars.map((pillar, i) => (
                  <li key={pillar.title}>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-inst shadow-card">
                      <Icon name={pillarIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
                    </span>
                    <h4 className="mt-4 text-[0.9375rem] font-bold text-navy">{pillar.title}</h4>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-body">
                      {pillar.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Programs: stays a TABLE, never cards -------------------------- */}
        <div id="institution-programs" className="mt-20 grid gap-10 scroll-mt-24 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span aria-hidden="true" className="block h-0.5 w-9 bg-gradient-brand" />
            <Heading as="h3" plain={institutions.programsHeadline} className="mt-6" />
            <p className="mt-4 max-w-[38ch] leading-relaxed text-body">
              {institutions.programsBody}
            </p>
            <div className="mt-7">
              <Button href={institutions.programsCta.href} variant="outline">
                {institutions.programsCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-x-auto rounded-card border border-line">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">
                  ZSkillup programs available to partner institutions, and the focus of each
                </caption>
                <thead>
                  <tr className="bg-cloud">
                    <th
                      scope="col"
                      className="px-5 py-4 text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase"
                    >
                      Program
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase"
                    >
                      Focus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.programs.map((program, i) => (
                    <tr key={program.name} className="border-t border-line-soft align-top">
                      <th scope="row" className="px-5 py-4 font-semibold text-navy">
                        <span className="flex items-start gap-3">
                          <Icon
                            name={programIcons[i]}
                            className="mt-0.5 h-[1.05rem] w-[1.05rem] shrink-0 text-inst"
                          />
                          {program.name}
                        </span>
                      </th>
                      <td className="px-5 py-4 text-[0.9375rem] leading-relaxed text-body">
                        {program.focus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- How we customise: ONE connected process, not four cards ------- */}
        <div className="mt-20 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <Heading as="h3" plain={institutions.methodHeadline} />
              <p className="mt-4 leading-relaxed text-body">{institutions.methodBody}</p>
            </div>

            <div className="relative lg:col-span-9">
              {/* The connector is what makes four steps read as one process
                  rather than four independent feature cards. */}
              <span
                aria-hidden="true"
                className="absolute top-5 left-5 hidden h-px w-[calc(100%-2.5rem)] bg-line lg:block"
              />
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {institutions.method.map((step, i) => (
                  <li key={step.step} className="relative">
                    <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-inst-line bg-white text-[0.8125rem] font-extrabold text-inst">
                      {step.step}
                    </span>
                    <Icon name={methodIcons[i]} className="mt-5 h-5 w-5 text-inst" />
                    <h4 className="mt-3 text-[0.9375rem] font-bold text-navy">{step.title}</h4>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-body">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Whitespace where the logo strip used to be - intentionally empty. */}

        {/* --- Final CTA: navy with restrained gradient accents -------------- */}
        <div className="relative mt-24 overflow-hidden rounded-card bg-navy px-7 py-12 sm:px-12 sm:py-14 lg:mt-28">
          <span
            aria-hidden="true"
            className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-gradient-brand opacity-[0.16] blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span aria-hidden="true" className="block h-0.5 w-9 bg-gradient-brand" />
              <h3 className="mt-6 max-w-[20ch] text-[1.75rem] leading-tight font-extrabold text-white sm:text-[2.25rem]">
                {institutions.finalCta.headline}
              </h3>
              <p className="mt-4 max-w-[54ch] leading-relaxed text-white/70">
                {institutions.finalCta.body}
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button href={institutions.finalCta.cta.href} variant="brand">
                {institutions.finalCta.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
