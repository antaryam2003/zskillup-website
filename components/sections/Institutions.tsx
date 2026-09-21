import Link from "next/link";
import { institutions } from "@/content/homepage";
import { institutionStats, publishable } from "@/content/stats";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { InstitutionsMethod } from "./InstitutionsMethod";
import { InstitutionsStats } from "./InstitutionsStats";
import { InstitutionsTabs } from "./InstitutionsTabs";

/**
 * 04 - INSTITUTIONS
 *
 * Two bands, one page grid (a single <Container> in each, same width and
 * gutters, so every left/right edge lines up):
 *
 *   A. Hero band (white)
 *      eyebrow / headline / supporting copy / two CTAs  |  vertical stat trio
 *      then the tabbed panel: "Programs for Your Campus" + "Partnership Support"
 *      (see InstitutionsTabs - the four former "One partnership" cards live in
 *      the second tab and nowhere else).
 *
 *   B. "A Proven Journey" band (white)
 *      the four-step method (InstitutionsMethod)  |  purple CTA card.
 *
 * Both bands sit on plain white. The space above the section (to Choose Your
 * Route) and between the two bands is deliberately compact; it comes only from
 * the paddings on the two bands below.
 *
 * The credibility trio (see content/stats.ts) is confirmed and count-up
 * animates once, in black, when it scrolls into view - see InstitutionsStats.
 *
 * Still removed, per the brief: the "Trusted by Leading Institutions" logo strip,
 * and not replaced with another credibility block - institutional credibility is
 * established once, in the dedicated Partners section.
 *
 * "Customised" is used consistently, never "Customized".
 *
 * All styling is local to this section (inline utilities, no global CSS).
 */

const primaryCta =
  "group inline-flex h-[3.25rem] items-center justify-center gap-3 rounded-[1.15rem] bg-[linear-gradient(135deg,#6a3ee8_0%,#5326d0_100%)] px-7 text-[1rem] font-medium text-white shadow-[0_14px_28px_-14px_rgba(91,43,203,0.75)] transition-[filter,transform] duration-200 hover:brightness-110 sm:h-14 sm:px-9 sm:text-[1.0625rem]";

export function Institutions() {
  const stats = publishable(institutionStats);

  // The band's bottom padding matches what this section had before (only the
  // bottom is trimmed) so the gap to the prephasz section below is unchanged.
  return (
    <section id="institutions" aria-labelledby="institutions-heading" className="scroll-mt-24">
      {/* === A. Hero band + tabbed panel ================================= */}
      <div className="bg-white pt-6 pb-8 sm:pb-10">
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-0">
            <div className="lg:pr-12">
              <p className="eyebrow text-[#59608c]!">{institutions.eyebrow}</p>

              <h2
                id="institutions-heading"
                className="mt-6 text-[2.25rem] leading-[1.08] font-extrabold text-navy sm:text-[3rem] lg:mt-8 lg:text-[clamp(2rem,calc((100vw_-_384px)/16.6),3.25rem)] lg:whitespace-nowrap"
              >
                {institutions.headline.plain}{" "}
                <span className="bg-[linear-gradient(90deg,#5b3cf0_0%,#9a4fd6_100%)] bg-clip-text pb-[0.08em] text-transparent">
                  {institutions.headline.gradient}
                </span>
              </h2>

              <p className="mt-6 max-w-[40rem] text-[1rem] leading-[1.6] text-muted sm:text-[1.0625rem] lg:text-[1.125rem]">
                {institutions.supporting}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 lg:mt-9">
                <Link href={institutions.primaryCta.href} className={primaryCta}>
                  <span>{institutions.primaryCta.label}</span>
                  <Icon
                    name="arrowRight"
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {stats.length > 0 ? (
              <div className="border-t border-[#e6e2f3] pt-8 lg:w-[17rem] lg:border-t-0 lg:border-l lg:pt-1 lg:pl-12">
                <InstitutionsStats stats={stats} />
              </div>
            ) : null}
          </div>

          <div className="mt-12 lg:mt-14">
            <InstitutionsTabs />
          </div>
        </Container>
      </div>

      {/* === B. A Proven Journey ========================================== */}
      <div className="bg-white pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pb-20">
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <InstitutionsMethod />

            {/* Purple CTA card. Button is the existing "Request a Customised
                Program" action (institutions.programsCta), same link as before. */}
            <aside
              aria-label="Request a customised program"
              className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-[linear-gradient(140deg,#3f3ad2_0%,#6a3fd8_50%,#a85ac4_100%)] p-7 text-white shadow-[0_28px_60px_-28px_rgba(74,47,190,0.65)] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)]"
              />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-inst shadow-[0_10px_24px_-10px_rgba(20,10,80,0.5)]">
                <Icon name="graduation" className="h-7 w-7" />
              </span>
              <h3 className="relative mt-7 text-[1.75rem] leading-[1.15] font-bold text-white sm:text-[2rem]">
                {institutions.finalCta.headline}
              </h3>
              <p className="relative mt-5 mb-9 max-w-[16ch] text-[1.125rem] leading-snug text-white/90 sm:text-[1.25rem]">
                {institutions.finalCta.body}
              </p>
              <Link
                href={institutions.programsCta.href}
                className="group relative mt-auto inline-flex min-h-14 items-center justify-center gap-2.5 self-start rounded-full bg-white px-6 py-3 text-center text-[0.9375rem] leading-snug font-semibold text-navy shadow-[0_14px_28px_-14px_rgba(20,10,80,0.55)] transition-colors duration-200 hover:bg-[#f6f2ff]"
              >
                <span>{institutions.programsCta.label}</span>
                <Icon
                  name="arrowRight"
                  className="h-[1.1rem] w-[1.1rem] text-inst transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </aside>
          </div>
        </Container>
      </div>
    </section>
  );
}
