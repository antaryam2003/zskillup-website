import { prephasz } from "@/content/homepage";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";
import { VideoDialog } from "@/components/ui/VideoDialog";
import { PrephaszDashboard } from "./PrephaszDashboard";

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
 * product visual/video -> CTAs -> four-step journey.
 */

const proofIcons: IconName[] = ["target", "users", "chart"];
const journeyIcons: IconName[] = ["chart", "file", "building", "trending"];

/** Very light individual tints, as the design shows - not a full rainbow. */
const journeyTints = [
  { card: "bg-[#fdf8ec] border-[#f5e7c4]", well: "bg-[#fbeec4] text-prep-ink" },
  { card: "bg-[#eef3fd] border-[#dbe6fa]", well: "bg-[#dbe6fa] text-[#2a56b8]" },
  { card: "bg-[#fdeff1] border-[#f9dfe3]", well: "bg-[#f9dfe3] text-[#c2456b]" },
  { card: "bg-[#ecf7f1] border-[#d5ecdf]", well: "bg-[#d5ecdf] text-com" },
];

export function Prephasz() {
  return (
    <Section id="prephasz" tone="white" labelledBy="prephasz-heading" className="pt-0 pb-0 sm:pb-0 lg:pb-0">
      {/* The opening block sits on a warm cream field, as in the design. */}
      <div className="bg-[#fdf8ec] py-16 sm:py-20">
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

            {/* --- Product visual ------------------------------------------- */}
            <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -left-4 hidden h-full w-full rounded-2xl bg-[#fbeec4] lg:block"
                />
                <div className="relative aspect-[16/10] w-full rounded-2xl bg-white shadow-lift">
                  <PrephaszDashboard
                    media={
                      <VideoDialog
                        video={videos.prephasz}
                        label={prephasz.videoLabel}
                        variant="overlay"
                      />
                    }
                  />
                </div>
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

      {/* --- A simple journey ---------------------------------------------- */}
      {/* Same cream field as the opening block above, reusing that field's own
          token (--color-prep-soft, i.e. bg-prep-soft) rather than a new value.
          This div also carries the top/bottom spacing that used to live as
          margin/padding further in - moved here, at the same amounts, so the
          cream fills the section's full height with no white strip above the
          heading or below the proof points.

          The top spacing specifically has to be padding (pt-16 sm:pt-20) on
          THIS div, not the margin (mt-16 sm:mt-20) it replaced on the div
          below: a margin-top on a container's first child with nothing else
          above it inside that container collapses straight through and
          becomes space ABOVE this div instead of inside it - which is
          exactly what left a white gap here before this was padding. */}
      <div className="bg-prep-soft pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pb-28">
        <Container>
          <div id="prephasz-journey" className="scroll-mt-24">
            <Eyebrow tone="prephasz">{prephasz.journeyEyebrow}</Eyebrow>
            <h3 className="mt-4 text-[1.75rem] font-extrabold sm:text-[2.25rem]">
              {prephasz.journeyHeadline}
            </h3>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {prephasz.journey.map((stage, i) => (
                <li key={stage.step} className="relative">
                  <div
                    className={`h-full rounded-card border ${journeyTints[i].card} p-6`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-full ${journeyTints[i].well}`}
                      >
                        <Icon name={journeyIcons[i]} className="h-[1.2rem] w-[1.2rem]" />
                      </span>
                      <span className="text-[0.875rem] font-semibold text-muted">{stage.step}</span>
                    </div>
                    <h4 className="mt-6 text-[1.0625rem] font-bold text-navy">{stage.title}</h4>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{stage.body}</p>
                  </div>

                  {/* Dotted connector with a yellow node, joining the four stages. */}
                  {i < prephasz.journey.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 -right-4 hidden w-4 items-center lg:flex"
                    >
                      <span className="h-px w-full border-t-2 border-dotted border-prep-line" />
                      <span className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-prep" />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            {/* --- Three proof points ---------------------------------------- */}
            <ul className="mt-14 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {prephasz.proofs.map((proof, i) => (
                <li key={proof.title} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cloud text-navy">
                    <Icon name={proofIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  <div>
                    <h4 className="text-[0.9375rem] font-bold text-navy">{proof.title}</h4>
                    <p className="mt-1 text-[0.875rem] text-body">{proof.body}</p>
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
