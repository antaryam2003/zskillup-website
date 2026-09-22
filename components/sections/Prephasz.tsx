import { prephasz } from "@/content/homepage";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";
import { PrephaszVideo } from "./PrephaszVideo";
import { PrephaszJourney } from "./PrephaszJourney";

/**
 * 05 - PREPHASZ
 *
 * Colour rule for this section: White + Navy typography + Prephasz Yellow, with
 * very restrained use of the broader palette. The updated design sets
 * "what comes next." in solid yellow rather than behind a highlighter band, and
 * gives the opening block a warm cream field with the product visual on it.
 *
 * The handwritten demo cue from the earlier comp is dropped - the updated design
 * removed it, leaving two handwritten treatments on the whole homepage.
 *
 * Mobile order is enforced by grid placement: headline -> short description ->
 * product visual/video -> CTAs -> "A Simple Journey on prephasz" carousel.
 */

/** Eyebrow for the journey header below. Not the shared <Eyebrow>: that one's
 *  `.eyebrow` class is unlayered CSS, which outranks utilities, so its colour
 *  and rule can't be tuned per use. Size (12px) and tracking (0.16em) are kept
 *  identical to `.eyebrow` so it matches "prephasz by ZSkillup" above. */
function JourneyEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3.5 text-[0.75rem] font-bold tracking-[0.16em] text-[#5b6a95] uppercase">
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 bg-current opacity-70" />
      {children}
    </p>
  );
}

export function Prephasz() {
  // pt-0/pb-0 need a matching override at every breakpoint tier (not just
  // the base one) to actually beat the Section default's own responsive
  // py-20/sm:py-24/lg:py-28 - a base-only pt-0 with no sm:/lg: pairing was
  // silently losing to sm:py-24/lg:py-28's own padding-top at those
  // widths, which was most of this section's "excessive gap" bug.
  return (
    <Section
      id="prephasz"
      tone="white"
      labelledBy="prephasz-heading"
      className="pt-0 sm:pt-0 lg:pt-0 pb-0 sm:pb-0 lg:pb-0"
    >
      {/* The opening block sits on a warm cream field, as in the design.
          Top padding is trimmed (pt, split out from the original py) to close
          up the gap from the Institutions section above. Its bottom padding,
          together with the journey block's top padding below, IS the gap
          between "prephasz by ZSkillup" and "A Simple Journey" (both sit on
          the same cream, so it reads as one whitespace band): 40+24 on mobile,
          48+32 from sm up. */}
      <div className="bg-[#fdf8ec] pt-10 pb-10 sm:pt-12 sm:pb-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
              <Eyebrow tone="prephasz">{prephasz.eyebrow}</Eyebrow>

              <h2
                id="prephasz-heading"
                className="mt-5 max-w-[19ch] text-[2rem] leading-[1.12] font-extrabold sm:text-[2.5rem] lg:text-[2.9rem]"
              >
                {prephasz.headline.plain}{" "}
                {/* Solid yellow, which is what gives Prephasz its own identity
                    inside the master brand. Display size, so it clears the
                    large-text contrast threshold. */}
                <span className="text-[#eab308]">{prephasz.headline.highlight}</span>
              </h2>

              <Lede className="mt-6 max-w-[54ch]">{prephasz.supporting}</Lede>
            </div>

            {/* --- Product visual: a real inline video, not a dashboard mock -- */}
            <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -left-4 hidden h-full w-full rounded-2xl bg-[#fbeec4] lg:block"
                />
                <PrephaszVideo video={videos.prephasz} label={prephasz.videoLabel} />
              </div>
            </div>

            {/* CTAs follow the product visual on mobile, and sit under the
                headline column on desktop. */}
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                <Button href={prephasz.primaryCta.href} variant="vertical" tone="prephasz" size="lg">
                  {prephasz.primaryCta.label}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* --- A Simple Journey on prephasz: six-pillar carousel ---------------
          Same cream field as the opening block above (--color-prep-soft is the
          same #fdf8ec), with this div carrying the section's own top/bottom
          spacing so the cream fills its full height with no white strip.

          The top spacing has to be padding (pt-6 sm:pt-8) on THIS div, not a
          margin on the div below: a margin-top on a container's first child
          with nothing else above it inside that container collapses straight
          through and becomes space ABOVE this div instead of inside it. */}
      <div className="bg-prep-soft pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pb-16">
        <Container>
          <div id="prephasz-journey" className="scroll-mt-24">
            <JourneyEyebrow>{prephasz.journeyEyebrow}</JourneyEyebrow>
            <h3 className="mt-4 text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-[2.5rem] lg:text-[2.75rem]">
              {prephasz.journeyHeadline}
            </h3>
            <p className="mt-2 max-w-[60ch] text-[0.84rem] leading-snug font-normal text-gray-700 sm:text-[1rem] lg:text-[1.15rem]">
              {prephasz.journeyStatement}
            </p>

            <PrephaszJourney />
          </div>
        </Container>
      </div>
    </Section>
  );
}
