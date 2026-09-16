import { prephasz } from "@/content/homepage";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { PrephaszWordmark } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";
import { Handwritten } from "@/components/ui/Stats";
import { VideoDialog } from "@/components/ui/VideoDialog";
import { PrephaszDashboard } from "./PrephaszDashboard";

/**
 * 05 - PREPHASZ (Design 2 base - structure unchanged)
 *
 * Colour rule for this section, verbatim from the brief: "White + Navy
 * typography + Prephasz Yellow, with very restrained use of the broader ZSkillup
 * purple/coral palette." Yellow is an accent, never the background.
 *
 * The yellow highlight sits on "what comes next." ONLY - that is what gives
 * Prephasz its own product identity inside the ZSkillup master brand.
 *
 * Changes per the brief:
 *   - the introductory paragraph is shortened; detailed features belong on the
 *     dedicated Prephasz page, not here.
 *   - secondary CTA reads "Explore Prephasz", not "More about prephasz".
 *   - the four journey cards lose most of the pastel rainbow - very light tints
 *     only, with Prephasz yellow as the connecting colour.
 *   - "Same Preparation. More Opportunities." is removed.
 *   - no statistics, no company logos, no extra bottom CTA.
 *
 * Mobile order is enforced by source order: headline -> short description ->
 * product visual/video -> CTAs -> four-step journey.
 */

const proofIcons: IconName[] = ["target", "users", "chart"];
const journeyIcons: IconName[] = ["chart", "file", "building", "trending"];

export function Prephasz() {
  return (
    <Section id="prephasz" tone="white" labelledBy="prephasz-heading">
      <Container>
        {/* Explicit grid placement rather than source-order stacking, so the
            mobile sequence is exactly the one the brief specifies:
            headline -> short description -> product visual/video -> CTAs. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
            <Eyebrow tone="prephasz">{prephasz.eyebrow}</Eyebrow>

            <h2
              id="prephasz-heading"
              className="mt-5 max-w-[18ch] text-[2rem] leading-[1.12] font-extrabold sm:text-[2.6rem] lg:text-[3rem]"
            >
              {prephasz.headline.plain}{" "}
              {/* Highlight, not a fill - and only on these three words, which is
                  what gives Prephasz its own identity inside the master brand. */}
              <span className="highlight-prephasz">{prephasz.headline.highlight}</span>
            </h2>

            <Lede className="mt-6 max-w-[50ch]">{prephasz.supporting}</Lede>
          </div>

          {/* --- Product visual ---------------------------------------------- */}
          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-5 -right-4 h-32 w-32 rounded-3xl bg-prep/20 blur-2xl"
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

              {/* Handwritten accent 2 of 3. This one earns its place: it points
                  at the demo. */}
              <div className="mt-5 flex items-start gap-3 pl-6 sm:pl-12">
                <Icon name="arrowRight" className="mt-1 h-5 w-5 shrink-0 rotate-[-130deg] text-prep" />
                <Handwritten className="max-w-[22ch] text-[1.15rem]">
                  {prephasz.handwritten}
                </Handwritten>
              </div>
            </div>
          </div>

          {/* CTAs come after the product visual on mobile, and sit under the
              headline column on desktop. */}
          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href={prephasz.primaryCta.href} variant="vertical" tone="prephasz">
                {prephasz.primaryCta.label}
              </Button>
              <Button href={prephasz.secondaryCta.href} variant="link" tone="prephasz">
                {prephasz.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* --- A simple journey ---------------------------------------------- */}
        <div id="prephasz-journey" className="mt-20 scroll-mt-24 lg:mt-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow tone="prephasz">{prephasz.journeyEyebrow}</Eyebrow>
              <h3 className="mt-4 text-[1.75rem] font-extrabold sm:text-[2.25rem]">
                {prephasz.journeyHeadline}
              </h3>
            </div>
            <p className="max-w-[44ch] leading-relaxed text-body lg:text-right">
              {prephasz.journeySupporting}
            </p>
          </div>

          <div className="relative mt-10">
            {/* Yellow connector - what makes four steps read as one journey. */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-0 hidden h-px w-full bg-prep/45 lg:block"
            />
            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {prephasz.journey.map((stage, i) => (
                <li
                  key={stage.step}
                  /* Opaque, or the connector rule behind shows through the card. */
                  className="rounded-card border border-line bg-prep-soft p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-prep-ink shadow-card">
                      <Icon name={journeyIcons[i]} className="h-[1.15rem] w-[1.15rem]" />
                    </span>
                    <span className="text-[0.8125rem] font-bold text-muted">{stage.step}</span>
                  </div>
                  <h4 className="mt-5 text-[0.9375rem] font-bold text-navy">{stage.title}</h4>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-body">{stage.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* --- Three proof points ----------------------------------------- */}
          <ul className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
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

        {/* Prephasz wordmark closes the section so the product identity lands. */}
        <p className="mt-14 flex items-center justify-center gap-2 text-sm text-muted">
          <PrephaszWordmark className="text-base" />
          <span>is a ZSkillup product.</span>
        </p>
      </Container>
    </Section>
  );
}
