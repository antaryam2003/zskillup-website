import Image from "next/image";
import { asset } from "@/lib/asset";
import { hero, heroCards, type Vertical } from "@/content/homepage";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, verticalStyles } from "@/components/ui/Section";
import { VideoDialog } from "@/components/ui/VideoDialog";

/**
 * 01 - HERO
 *
 * Per the updated design: full-bleed campus photograph running behind the
 * navigation, the headline sweeping purple-to-coral on each line, one circled
 * handwritten note, and three pathway cards overlapping the photograph's lower
 * edge.
 *
 * The CTA reads "Explore What We Offer" rather than "Explore Our Programs",
 * because "Programs" is no longer part of the site architecture. It scrolls
 * straight to Choose Your Route.
 *
 * Only one handwritten note appears here, and only one more on the whole page
 * (B.Com + ACCA) - the brief caps them and the updated designs dropped the rest.
 */

const cardIcon: Record<Vertical, IconName> = {
  institutions: "graduation",
  prephasz: "briefcase",
  commerce: "users",
};

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      /* Pulled up under the sticky header so the photograph runs edge to edge
         behind the navigation, as in the design. */
      className="relative isolate -mt-[4.5rem] overflow-hidden"
    >
      {/* The "photo band" - its height comes ONLY from the nav + headline
          content it wraps, never from the cards or footer row below. That
          matters on mobile: the cards stack to three full-width blocks there,
          and if the photo filled that entire stacked height too it would need
          to scale - and therefore crop - far more aggressively just to cover
          it. Bounding the band keeps the crop close to what desktop shows. */}
      <div className="relative pt-[4.5rem]">
        {/* A genuine, unaltered crop of the design's own photograph - see
            content/media.ts and scripts/extract-comp-assets.py for exactly
            what was cropped and why. object-position keeps the tower and the
            student both in frame across viewport widths.

            LCP image: `priority`, never lazy-loaded, dimensions declared. */}
        <Image
          src={asset(media.hero.src)}
          alt={media.hero.alt}
          width={media.hero.width}
          height={media.hero.height}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_22%] sm:object-[50%_26%] lg:object-[42%_30%]"
        />

        {/* A soft, bright wash - not a panel - so the headline stays legible
            over the sky and stonework while the photograph remains plainly
            visible through it.

            Below the two-column breakpoint the headline runs almost the full
            container width (there is no separate 7-of-12-column text zone
            yet), so the wash needs to reach nearly that far too, or the type
            sits unprotected over the student's hair by the time it wraps to
            three lines. From lg upward the text is confined to the left ~58%
            of the band, so the wash can clear much sooner and leave the
            student fully untouched. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.72)_28%,rgba(255,255,255,0.55)_52%,rgba(255,255,255,0.24)_76%,rgba(255,255,255,0)_94%)] lg:bg-[linear-gradient(100deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.66)_20%,rgba(255,255,255,0.42)_40%,rgba(255,255,255,0.08)_58%,rgba(255,255,255,0)_68%)]"
        />

        <Container>
          <div className="grid items-start gap-6 pt-14 sm:pt-16 lg:grid-cols-12 lg:pt-20">
            <div className="lg:col-span-7">
              <p className="eyebrow text-navy/80 drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]">{hero.eyebrow}</p>

              {/* Both halves stay inside one <h1> so the sentence reads as a
                  unit. The gradient half sweeps on every line, not once
                  across the block. */}
              <h1
                id="hero-heading"
                className="mt-6 max-w-[15ch] text-[2.4rem] leading-[1.06] font-extrabold tracking-[-0.03em] drop-shadow-[0_2px_10px_rgba(255,255,255,0.55)] sm:text-[3rem] lg:text-[3.5rem]"
              >
                <span className="block">{hero.headline.plain}</span>
                <span className="text-gradient-lines no-hyphen-break mt-1 block">
                  {hero.headline.gradient}
                </span>
              </h1>

              <p className="mt-6 max-w-[46ch] text-[1.0625rem] font-medium text-navy/85 drop-shadow-[0_1px_4px_rgba(255,255,255,0.75)] sm:text-lg">
                {hero.supporting}
              </p>

              <div className="mt-9">
                <Button href={hero.cta.href} variant="primary" size="lg">
                  {hero.cta.label}
                </Button>
              </div>
            </div>

            {/* The circled handwritten note, in the open sky beside the headline. */}
            <div className="hidden lg:col-span-5 lg:block">
              <CircledNote>{hero.handwritten}</CircledNote>
            </div>
          </div>

          {/* Reserves room below the CTA for the cards to overlap into - this
              gives the band enough height without folding the cards' own
              (much taller, on mobile) height into it. */}
          <div aria-hidden="true" className="h-20 sm:h-24 lg:h-28" />
        </Container>
      </div>

      {/* Three pathway cards, pulled up to overlap the photo band's lower
          edge - never absorbed into its height. They run wider than the
          headline's body container on large screens, which is also what
          keeps all three CTAs on one row. On mobile they stack BELOW the
          headline and primary CTA, on their own plain background.

          This uses its OWN max-width (1600px vs the site's usual 1240px)
          rather than the previous approach of bleeding the row out from
          inside a narrower, already-centred <Container> with a negative
          margin. That bled amount was sized relative to the 1240px cap, so it
          only worked once the viewport was comfortably past that cap - at
          exactly the width where a laptop screen commonly sits (~1280-1350px)
          the maths went negative and pulled the whole row off the left edge
          of the page, which is what let card 3's CTA row spill past its own
          right border. A dedicated max-width, capped and centred the same way
          the rest of the site's Container is, can't do that at any width.

          1680px, wider again than an earlier pass's 1600px, because that
          pass's "~25px clearance at every width" reading turned out to be a
          false negative: it compared the CTA row's own bounding box to the
          card's edge, but `flex-wrap` avoids overflow BY wrapping onto a
          second line, so a row that doesn't fit on one line reads as "safe"
          on that box the same way a row that fits easily does - the box
          itself never overflows either way. Measuring what the row's content
          actually needs (each action's real rendered width, independent of
          whether it's currently wrapped) against what was available showed
          card 3's row was up to 94px short of fitting at common laptop
          widths. Combined with the trimmed Watch Now pill and CTA gap below,
          this keeps growing the row's genuine spare room well past the point
          (see that breakpoint's own comment) where it switches to one line,
          instead of plateauing right at the edge of fitting. */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-[1680px] px-5 sm:-mt-20 sm:px-8 lg:-mt-24">
        <ul className="grid gap-5 lg:grid-cols-3">
          {heroCards.map((card) => (
            <li key={card.eyebrow}>
              <HeroCard card={card} />
            </li>
          ))}
        </ul>
      </div>

      <Container>
        {/* Footer row sits on the page's own white background, below the
            photo band entirely - matching the design, where the photo ends
            at the cards and this strip reads as plain page chrome. */}
        <div className="mt-12 flex items-center justify-between gap-4 pb-6">
          <p className="eyebrow flex items-center gap-4 text-navy/70">
            {hero.footNote}
            <span aria-hidden="true" className="hidden h-px w-16 bg-navy/20 sm:block" />
          </p>
          <a
            href={hero.cta.href}
            className="hidden items-center gap-3 text-xs font-semibold tracking-[0.16em] text-navy/70 uppercase transition-colors hover:text-navy sm:flex"
          >
            Scroll
            <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/25">
              <Icon name="arrowDown" className="h-4 w-4" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}

/** Hand-drawn ellipse with an underline swoosh, as in the design. */
function CircledNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative mt-4 -ml-28 inline-block px-7 py-5 xl:-ml-20">
      <svg
        viewBox="0 0 200 130"
        className="absolute inset-0 h-full w-full text-navy/70"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="100"
          cy="60"
          rx="93"
          ry="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M46 108c30 12 78 11 112-6"
          fill="none"
          stroke="#5B2BCB"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="handwritten relative block w-[8.5rem] text-center text-[1.45rem] text-navy">
        {children}
      </span>
    </span>
  );
}

function HeroCard({ card }: { card: (typeof heroCards)[number] }) {
  const style = verticalStyles[card.vertical];
  const video = videos[card.vertical];

  return (
    <article
      className={`flex h-full flex-col rounded-card border ${style.border} ${style.tint} p-5 shadow-card sm:p-6`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${style.icon}`}>
          <Icon name={cardIcon[card.vertical]} className="h-6 w-6" />
        </span>

        <div className="min-w-0">
          {/* The offering is named inline, in a tinted pill - "For Commerce
              Careers" alone would not tell a new visitor what is on offer. */}
          <h2 className="text-[0.9375rem] leading-snug font-bold text-navy">
            {card.eyebrow}
            {card.brandLabel ? (
              <>
                {" – "}
                <span className={`inline-block rounded-full ${style.band} px-2 py-0.5 ${style.text}`}>
                  {card.brandLabel}
                </span>
              </>
            ) : null}
          </h2>
          {/* Capped width so every description wraps to two lines, the same as
              the longest one. Without this, the shorter two descriptions sat
              on a single line while the grid still stretched every card to
              match the longest card's height - which is what produced the
              large empty gap above the CTA row. */}
          <p className="mt-2 max-w-[15rem] text-[0.9375rem] leading-relaxed text-body">
            {card.description}
          </p>
        </div>
      </div>

      {/* CTA hierarchy: filled button, then text link, then the lightest video
          action. All three journeys stay available without the card feeling
          overloaded.

          `flex-nowrap` only once the row has measurably reached the width
          card 3's three actions actually need on one line - 1560px, checked
          directly against this layout by summing each action's own rendered
          width, not a rect that `flex-wrap` can quietly wrap out of trouble
          and read as "fine" either way. A three-across grid this size simply
          cannot fit that row on one line any earlier without either widening
          the cards far past matching the reference photo, or shrinking the
          actions' own text/padding - so below 1560px the row safely wraps
          onto a second line instead of being forced into overflow. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-2.5 pt-5 min-[1560px]:flex-nowrap">
        <Button href={card.primary.href} variant="primary" size="sm">
          {card.primary.label}
        </Button>
        <Button href={card.secondary.href} variant="link" className="whitespace-nowrap">
          {card.secondary.label}
        </Button>
        <VideoDialog video={video} label={card.video.label} variant="pill" />
      </div>
    </article>
  );
}
