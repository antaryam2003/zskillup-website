import Image from "next/image";
import { asset } from "@/lib/asset";
import { hero, heroCards, type Vertical } from "@/content/homepage";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { PrephaszWordmark } from "@/components/ui/Brand";
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
        {/* The supplied production photograph, used directly - see
            content/media.ts. object-position keeps the "More Than a Degree"
            note, the buildings and the student in frame as the band's own
            aspect ratio changes by viewport: short and wide on desktop (more
            top/bottom gets cropped, so a higher focal point keeps her face
            and the note in view rather than centering on her lower body),
            taller and narrower on mobile (crops from the sides instead,
            centered closer to her so she isn't pushed toward one edge).

            The `lg` X value (8%, not a centered-looking number) only matters
            between 1024px and ~1332px: below 1024 the mobile/tablet values
            apply, and above ~1332 the band becomes wide enough relative to
            this photo's own aspect ratio that `cover` shows its full width
            with zero horizontal crop - at that point X has no effect at all,
            it's simply the whole image, so there's nothing to tune further
            up there. In that 1024-1332px band, though, the crop is still
            live, and a higher X (centering on the student, as the mobile
            values do) pulls the note far enough left to collide with the
            headline - see the wrapper div below for the other half of that
            fix. Lower X shows more open sky instead, pushing the note and
            buildings further right, clear of the text column.

            LCP image: `priority`, never lazy-loaded, dimensions declared. */}
        <Image
          src={asset(media.hero.src)}
          alt={media.hero.alt}
          width={media.hero.width}
          height={media.hero.height}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_30%] sm:object-[80%_24%] lg:object-[8%_20%]"
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

        {/* Deliberately NOT <Container>: that component re-centers within
            max-w-[1240px] once the viewport passes 1240px, so its left edge
            marches rightward as the screen widens - while the "More Than a
            Degree" note baked into the photo (full-bleed, un-centered) only
            drifts rightward at ~0.36px per viewport px. A centered column
            drifting at a faster rate eventually collides with a slower-moving
            fixed point it started clear of, which is what actually caused the
            headline to creep into the note at ordinary and wide desktop
            widths alike. A flat left padding - no centering, no cap - keeps
            the headline's start position stable instead, matching how the
            photo's own content is positioned from the left edge. */}
        <div className="w-full px-5 sm:px-8">
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

            {/* The "More Than a Degree" note is no longer drawn live here -
                the supplied photograph bakes it in directly (see
                content/media.ts), so a second, separately-positioned copy
                would just double up on top of it. */}
          </div>

          {/* Reserves room below the CTA for the cards to overlap into - this
              gives the band enough height without folding the cards' own
              (much taller, on mobile) height into it. */}
          <div aria-hidden="true" className="h-20 sm:h-24 lg:h-28" />
        </div>
      </div>

      {/* Three pathway cards, pulled up to overlap the photo band's lower
          edge - never absorbed into its height. They run wider than the
          headline's body container on large screens. On mobile they stack
          BELOW the headline and primary CTA, on their own plain background.

          This uses its OWN max-width (1480px vs the site's usual 1240px)
          rather than bleeding the row out from inside a narrower,
          already-centred <Container> with a negative margin - that bled
          amount is sized relative to the Container's own cap, so it only
          works once the viewport is comfortably past it, and goes wrong
          exactly where a laptop screen commonly sits. A dedicated max-width,
          capped and centred the same way the rest of the site's Container is,
          can't do that at any width.

          1480px keeps the cards noticeably narrower than the very wide
          1680px this used previously - each card now stays close to the
          proportions in the reference designs instead of stretching to fill
          the full photograph width. That's safe to do now because the CTA
          row below no longer needs to fit three actions on one line: Watch
          Now sits on its own row, so the primary + secondary pair only ever
          has to share a row with each other, which fits with room to spare
          at any card width this produces - see that row's own comment. */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-[1480px] px-5 sm:-mt-20 sm:px-8 lg:-mt-24">
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

function HeroCard({ card }: { card: (typeof heroCards)[number] }) {
  const style = verticalStyles[card.vertical];
  const video = videos[card.vertical];

  return (
    <article
      className={`flex h-full flex-col rounded-card border ${style.border} ${style.tint} p-6 shadow-card`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${style.icon}`}>
          <Icon name={cardIcon[card.vertical]} className="h-7 w-7" />
        </span>

        <div className="min-w-0 pt-0.5">
          {/* The offering is named inline. "For Commerce Careers" alone
              wouldn't tell a new visitor what's on offer, so a tinted pill
              names it directly after an en dash - except prephasz, which
              gets its own wordmark there instead of a pill, matching how the
              brand mark appears everywhere else it's named on the page.

              Capped width, same reasoning as the description below: at this
              card width "For Universities & Institutions" (the one card with
              no badge) fits on a single line while the other two - each
              carrying a badge or wordmark after their own, shorter eyebrow -
              wrap to two, and that mismatch is what left card 1 shorter than
              its siblings. Wrapping all three to two lines here keeps every
              card's title block the same height regardless of vertical. */}
          <h2 className="max-w-[15rem] text-[1.125rem] leading-snug font-bold text-navy">
            {card.eyebrow}
            {card.vertical === "prephasz" ? (
              <>
                {" – "}
                <PrephaszWordmark className="inline-block align-[-0.34em] text-[1.5rem]" accent />
              </>
            ) : card.brandLabel ? (
              <>
                {" – "}
                <span className={`inline-block rounded-full ${style.band} px-2.5 py-1 ${style.text}`}>
                  {card.brandLabel}
                </span>
              </>
            ) : null}
          </h2>
          {/* Capped width so every description wraps to two lines, the same as
              the longest one. Without this, the shorter descriptions sat on a
              single line while the grid still stretched every card to match
              the longest card's height - which produced a large empty gap
              above the CTA row. */}
          <p className="mt-2 max-w-[14rem] text-[0.875rem] leading-relaxed text-body">
            {card.description}
          </p>
        </div>
      </div>

      {/* CTA layout: Watch Now - the lightest of the three actions - sits
          alone on its own row, with the filled primary and outlined
          secondary sharing the row below. Splitting it this way (rather than
          fitting all three actions on one row) is what let the cards get
          narrower without any card's longest pair of actions running out of
          room: two buttons sharing a row need roughly half the width three
          did, so even card 3's "Explore Program" + "Talk to an Advisor" -
          the pairing that used to spill past its card at this width - now
          fits with margin at every width the grid uses.

          Below 1350px, though, that pair is switched to stack (flex-col)
          rather than left to wrap on its own (flex-wrap): each card's two
          labels are a different length, so leaving it to flex-wrap would
          make each card decide independently whether IT personally still
          fits on one line - card 1's short "Explore" pair keeps fitting
          20px+ longer than card 3's does, which would leave card 1 sitting
          one line shorter than its siblings and re-open the empty-gap bug
          this section was already rewritten once to fix (see the title
          above). Forcing all three to stack together below the point where
          even card 3 comfortably fits on one line keeps their heights
          matched regardless of label length. */}
      <div className="mt-auto flex flex-col gap-3 pt-5">
        <VideoDialog video={video} label={card.video.label} variant="pill" />
        <div className="flex flex-col gap-2.5 min-[1350px]:flex-row min-[1350px]:items-center">
          <Button href={card.primary.href} variant="primary" size="sm">
            {card.primary.label}
          </Button>
          <Button href={card.secondary.href} variant="outline" size="sm">
            {card.secondary.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
