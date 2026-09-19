import { prephasz } from "@/content/homepage";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";
import { PrephaszVideo } from "./PrephaszVideo";

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
 * product visual/video -> CTAs -> six feature pillars.
 */

/** One icon per pillar, in the pillars' own order (Prepare -> Track Outcomes). */
const pillarIcons: IconName[] = ["book", "clipboard", "chart", "graduation", "briefcase", "trending"];

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
          Top padding only is trimmed (pt, split out from the original py)
          to close up the gap from the Institutions section above; bottom
          stays exactly as it was, since that's internal spacing to the
          product-visual/CTA row below, not the gap between sections. */}
      <div className="bg-[#fdf8ec] pt-10 pb-16 sm:pt-12 sm:pb-20">
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
                <Button href={prephasz.secondaryCta.href} variant="underline" tone="prephasz">
                  {prephasz.secondaryCta.label}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* --- A simple journey: six prephasz feature pillars ------------------
          Same cream field as the opening block above, reusing that field's own
          token (--color-prep-soft, i.e. bg-prep-soft) rather than a new value.
          This div also carries the top/bottom spacing that used to live as
          margin/padding further in - moved here so the cream fills the
          section's full height with no white strip above the heading or
          below the cards.

          The top spacing specifically has to be padding (pt-12 sm:pt-14) on
          THIS div, not a margin on the div below: a margin-top on a
          container's first child with nothing else above it inside that
          container collapses straight through and becomes space ABOVE this
          div instead of inside it.

          Replaces the old four-card step-by-step journey (with its dotted
          connector and separate three-point proof strip below a divider)
          with six premium feature-pillar cards in one 3x2 grid - the
          complete prephasz ecosystem read at a glance, not a timeline, and
          with no second block duplicating the same ground underneath. */}
      <div className="bg-prep-soft pt-12 pb-14 sm:pt-14 sm:pb-16 lg:pb-20">
        <Container>
          <div id="prephasz-journey" className="scroll-mt-24">
            <Eyebrow tone="prephasz">{prephasz.journeyEyebrow}</Eyebrow>
            <h3 className="mt-3 text-[1.75rem] font-extrabold sm:text-[2.25rem]">
              {prephasz.journeyHeadline}
            </h3>
            <p className="mt-3 max-w-[52ch] text-[1.0625rem] font-semibold text-navy/85 sm:text-[1.1875rem]">
              {prephasz.journeyStatement}
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3">
              {prephasz.pillars.map((pillar, i) => (
                <li key={pillar.title}>
                  {/* Hover: the same translate-y-1 + shadow-lift lift used
                      elsewhere on the site, plus a border tint toward
                      prep-line (an existing token, already used for this
                      section's dashed connector before it was replaced) as
                      a restrained "glow" cue - no new colour, no scale, no
                      layout change, siblings never shift. */}
                  <div className="group flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-prep-line hover:shadow-lift">
                    <Eyebrow tone="prephasz" rule="none">
                      Step {String(i + 1).padStart(2, "0")}
                    </Eyebrow>

                    <span className="mt-4 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-prep-soft text-prep-ink ring-8 ring-prep-soft/40 transition-[box-shadow] duration-300 group-hover:ring-prep-soft/70">
                      <Icon name={pillarIcons[i]} className="h-[1.4rem] w-[1.4rem]" />
                    </span>

                    <h4 className="mt-4 text-[1.125rem] font-extrabold text-navy">{pillar.title}</h4>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-body">
                      {pillar.tagline}
                    </p>

                    {/* A short branded accent line, not a full-width neutral
                        rule - the same "short colour bar as a group divider"
                        language the rest of the site already uses. */}
                    <span aria-hidden="true" className="mt-5 mb-4 block h-0.5 w-8 rounded-full bg-prep" />

                    <ul className="space-y-2">
                      {pillar.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-[0.8125rem] leading-snug text-body"
                        >
                          {/* One consistent check-glyph well for every
                              feature point, on every card - not a different
                              icon per feature, which would fight the "one
                              icon system" requirement. */}
                          <span
                            aria-hidden="true"
                            className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-prep-soft text-prep-ink"
                          >
                            <Icon name="check" className="h-2.5 w-2.5" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </Section>
  );
}
