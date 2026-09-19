import { prephasz } from "@/content/homepage";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";
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

/** Per-pillar icon-well tint, matching the reference comp (a-simple-journey.png)
 *  as closely as practical - each stage gets its own soft pastel circle with a
 *  matching icon colour, sampled directly from the reference image. "Prepare"
 *  reuses the site's own prep tokens (this section's own brand colour); "Get
 *  Hired" and "Track Outcomes" reuse the institutions/commerce vertical
 *  tokens, whose existing hues already match the reference closely. Assess/
 *  Analyse/Learn have no matching token in the site's palette, so those three
 *  use one-off arbitrary values scoped to this component only - no new
 *  global CSS custom properties are added. */
const pillarTints: { bg: string; icon: string }[] = [
  { bg: "bg-prep-soft", icon: "text-prep-ink" },
  { bg: "bg-[#e3edfe]", icon: "text-[#1a68f0]" },
  { bg: "bg-[#fde2e3]", icon: "text-[#961c40]" },
  { bg: "bg-[#d8f6e3]", icon: "text-[#0a7a44]" },
  { bg: "bg-inst-soft", icon: "text-inst" },
  { bg: "bg-com-soft", icon: "text-com" },
];

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
      <div className="bg-prep-soft pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pb-16">
        <Container>
          {/* Redesigned to match the reference comp (a-simple-journey.png) as
              closely as practical: a neutral (not prep-gold) eyebrow, a much
              larger dominant heading via the site's own Heading component
              (matching the scale used by every other section), and a lighter
              Lede for the supporting line - replacing the previous bespoke,
              bolder treatment. */}
          <div id="prephasz-journey" className="scroll-mt-24">
            <Eyebrow tone="muted">{prephasz.journeyEyebrow}</Eyebrow>
            <Heading as="h3" plain={prephasz.journeyHeadline} size="md" className="mt-4" />
            <Lede className="mt-3 max-w-[52ch]">{prephasz.journeyStatement}</Lede>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prephasz.pillars.map((pillar, i) => {
                const tint = pillarTints[i];
                return (
                  <li key={pillar.title} className="h-full">
                    {/* Hover: the same translate-y-1 + shadow-lift lift used
                        elsewhere on the site - elevation and shadow only, no
                        scale, no dimension change, siblings never shift.
                        Tailwind's hover:-translate-y-* compiles to the
                        native CSS `translate` property, not `transform`
                        (which stays `none`) - the transition list has to
                        name `translate` explicitly or the lift applies
                        instantly with no animation. */}
                    <div className="group flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card transition-[translate,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-lift">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${tint.bg}`}
                        >
                          <Icon name={pillarIcons[i]} className={`h-7 w-7 ${tint.icon}`} />
                        </span>
                        <span className="text-[1.0625rem] font-semibold text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h4 className="mt-5 text-[1.25rem] font-extrabold text-navy">{pillar.title}</h4>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                        {pillar.tagline}
                      </p>

                      {/* flex-1 lets this row absorb the card's leftover height
                          so the pills + arrow stay pinned to the bottom edge
                          regardless of how many pill rows a given card wraps
                          to - the same pattern already used by the "three
                          offerings" cards further down this file.

                          Pill text/padding/gap sized specifically so "Mock
                          Interviews" + "Placement Opportunities" (card 5's
                          longest pair, and the tightest fit of any card at
                          this grid's ~376px desktop card width) still wrap
                          2-per-row like every other card, matching the
                          reference - at the previous larger size that pair
                          alone forced a 3rd pill row, which then stretched
                          every other card in that row with unwanted empty
                          space above their own (shorter) pill rows. */}
                      <div className="mt-5 flex flex-1 flex-wrap items-end gap-1.5">
                        <ul className="flex flex-1 flex-wrap gap-1.5">
                          {pillar.features.map((feature) => (
                            <li
                              key={feature}
                              className="rounded-full bg-line-soft px-2 py-1.5 text-[0.75rem] font-medium text-body"
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <span
                          aria-hidden="true"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-line-soft text-navy transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          <Icon name="arrowRight" className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </div>
    </Section>
  );
}
