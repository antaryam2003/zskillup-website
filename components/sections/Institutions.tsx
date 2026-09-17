import { institutions } from "@/content/homepage";
import { institutionStats, publishable } from "@/content/stats";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 04 - INSTITUTIONS
 *
 * Page journey, as the brief specifies:
 *   Proposition -> What we support -> Programs -> How we customise/deliver -> CTA.
 *
 * Per the updated design:
 *   - the credibility trio prints a dash in each slot until the figures are
 *     verified (see content/stats.ts), which is the brief's "do not hard-code
 *     100+, 50K+ or 80%+ until validated" rule taken literally;
 *   - "Support across the student journey" sits in a lavender panel holding four
 *     white cards with circular icon wells;
 *   - the four-step method reads as ONE process: gradient numbered circles joined
 *     by a dashed rule, with short titles (Assess / Build / Train / Track);
 *   - the closing CTA is a full-width gradient banner.
 *
 * Still removed, per the brief: the "Trusted by Leading Institutions" logo strip,
 * and not replaced with another credibility block - institutional credibility is
 * established once, in the dedicated Partners section.
 *
 * "Customised" is used consistently, never "Customized".
 */

const pillarIcons: IconName[] = ["graduation", "file", "bulb", "users"];
const pillarWells = [
  "bg-[#ece5fb] text-inst",
  "bg-[#fde7ea] text-[#c2456b]",
  "bg-[#e8e1fa] text-inst",
  "bg-[#fde7ea] text-[#c2456b]",
];
const programIcons: IconName[] = ["chart", "message", "code", "layers", "database", "users"];
const programWells = [
  "bg-[#ece5fb] text-inst",
  "bg-[#fde7ea] text-[#c2456b]",
  "bg-[#dcf2ec] text-com",
  "bg-[#fde7ea] text-[#c2456b]",
  "bg-[#dbeafe] text-[#2a56b8]",
  "bg-[#ece5fb] text-inst",
];

export function Institutions() {
  const stats = publishable(institutionStats);

  return (
    <Section id="institutions" tone="lavender" labelledBy="institutions-heading">
      <Container>
        {/* --- Proposition --------------------------------------------------- */}
        <p className="eyebrow text-inst">{institutions.eyebrow}</p>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Heading
              id="institutions-heading"
              plain={institutions.headline.plain}
              accent={institutions.headline.gradient}
              accentTone="institutions"
              className="max-w-[14ch]"
            />
            <Lede className="mt-6 max-w-[46ch]">{institutions.supporting}</Lede>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={institutions.primaryCta.href} variant="brand">
                {institutions.primaryCta.label}
              </Button>
              <Button href={institutions.secondaryCta.href} variant="outline" icon={null}>
                {institutions.secondaryCta.label}
              </Button>
            </div>

            {stats.length > 0 ? (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={i > 0 ? "border-l border-line pl-10" : ""}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-[1.5rem] font-extrabold tracking-tight text-navy">
                        {stat.value}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 block max-w-[9rem] text-[0.8125rem] leading-snug text-muted"
                      >
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {/* --- What we support --------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="rounded-card border border-inst-line bg-[#f1edfc] p-6 sm:p-8">
              <div className="grid gap-7 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div>
                  <p className="eyebrow text-[0.625rem] text-inst">
                    {institutions.partnershipEyebrow}
                  </p>
                  <Heading
                    as="h3"
                    plain="Support across"
                    accent="the student journey."
                    accentTone="institutions"
                    size="sm"
                    className="mt-3"
                  />
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-body">
                    {institutions.partnershipBody}
                  </p>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {institutions.pillars.map((pillar, i) => (
                    <li key={pillar.title} className="rounded-tile bg-white p-4">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full ${pillarWells[i]}`}
                      >
                        <Icon name={pillarIcons[i]} className="h-[1.05rem] w-[1.05rem]" />
                      </span>
                      <h4 className="mt-3.5 text-[0.875rem] font-bold text-navy">{pillar.title}</h4>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-body">
                        {pillar.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- Programs: six compact cards, not the table this used to be ----
            Deliberate change from the earlier "stays a table, never cards"
            rule - explicitly requested. Program name + focus are unchanged
            from the table's own <th>/<td> content; only the wrapper markup
            changed, so this is a straight structural swap, not a rewrite. */}
        <div
          id="institution-programs"
          className="mt-20 grid scroll-mt-24 gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12"
        >
          <div className="lg:col-span-4">
            <span aria-hidden="true" className="block h-0.5 w-9 bg-inst" />
            <Heading as="h3" plain={institutions.programsHeadline} size="sm" className="mt-6" />
            <p className="mt-4 max-w-[38ch] leading-relaxed text-body">
              {institutions.programsBody}
            </p>
            <div className="mt-7">
              <Button href={institutions.programsCta.href} variant="outlineTone" tone="institutions">
                {institutions.programsCta.label}
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {institutions.programs.map((program, i) => (
              <li key={program.name}>
                <div className="h-full rounded-tile border border-line bg-white p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${programWells[i]}`}
                    >
                      <Icon name={programIcons[i]} className="h-[0.95rem] w-[0.95rem]" />
                    </span>
                    <h4 className="pt-0.5 text-[0.9375rem] leading-snug font-bold text-navy">
                      {program.name}
                    </h4>
                  </div>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-body">
                    {program.focus}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* --- How we customise: ONE connected process ----------------------- */}
        <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <Heading as="h3" plain={institutions.methodHeadline} size="sm" />
            <p className="mt-4 leading-relaxed text-body">{institutions.methodBody}</p>
          </div>

          <div className="relative lg:col-span-9">
            {/* The dashed connector is what makes four steps read as one process
                rather than four independent feature cards. */}
            <span
              aria-hidden="true"
              className="absolute top-7 left-[12%] hidden w-[76%] border-t-2 border-dashed border-[#e3a9b8] lg:block"
            />
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {institutions.method.map((step) => (
                <li key={step.step} className="relative text-center">
                  <span className="bg-gradient-icon relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full text-[0.9375rem] font-extrabold text-white">
                    {step.step}
                  </span>
                  <h4 className="mt-4 text-[1.0625rem] font-bold text-navy">{step.title}</h4>
                  <p className="mx-auto mt-2 max-w-[24ch] text-[0.875rem] leading-relaxed text-body">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* --- Final CTA: full-width gradient banner ------------------------- */}
        <div className="bg-gradient-brand relative mt-20 overflow-hidden rounded-card px-7 py-10 sm:px-12 sm:py-12 lg:mt-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span aria-hidden="true" className="block h-0.5 w-9 bg-white/70" />
              <h3 className="mt-5 max-w-[22ch] text-[1.75rem] leading-tight font-extrabold text-white sm:text-[2.25rem]">
                {institutions.finalCta.headline}
              </h3>
              <p className="mt-3 max-w-[60ch] leading-relaxed text-white/80">
                {institutions.finalCta.body}
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button
                href={institutions.finalCta.cta.href}
                variant="outline"
                className="shadow-lift"
              >
                {institutions.finalCta.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
