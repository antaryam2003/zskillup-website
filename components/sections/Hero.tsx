import Image from "next/image";
import { asset } from "@/lib/asset";
import { hero, heroCards, type Vertical } from "@/content/homepage";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { PrephaszLogo } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { verticalStyles } from "@/components/ui/Section";
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
      {/* The "photo band" - a shared positioning/clipping context for the
          background photo AND the cards row below it, so the photo's own
          box (auto-height, driven by its normal-flow content) naturally
          extends past the text content to the cards' actual rendered
          bottom edge, not just the nav+headline zone above them.

          This is deliberately ONE wrapper around BOTH pieces, not two
          separate ones: the cards row still overlaps upward into the text
          zone via its own negative margin-top exactly as before (untouched
          - see that wrapper's own comment), but a negative margin only
          affects the cards' own rendered position, not how much flow
          height they still contribute to what comes after them - so this
          wrapper's own auto height (nav+headline content, MINUS the cards'
          own overlap, PLUS the cards' own full height) already lands
          exactly on the cards' bottom edge with no measuring or magic
          numbers needed, and stays correct automatically if card content
          or breakpoint ever changes their rendered height. The footer row
          below stays a sibling OUTSIDE this wrapper, on the page's own
          white background, unaffected. */}
      <div className="relative overflow-hidden">
        {/* The supplied production photograph, used directly - see
            content/media.ts. object-position keeps the "More Than a Degree"
            note and the student in frame as the band's own aspect ratio
            changes by viewport. Below 1024px the crop is narrow enough
            (both on phone-width mobile and on tablet) that 80%/24% is the
            one X/Y pair that keeps both her and the note in frame at once -
            higher X pushes the note out of frame toward the left edge,
            lower X pushes her toward/past the right edge.

            The `lg` X value (8%, not a centered-looking number) only matters
            between 1024px and ~1332px: below 1024 the shared mobile/tablet
            value applies, and above ~1332 the band becomes wide enough
            relative to this photo's own aspect ratio that `cover` shows its
            full width with zero horizontal crop - at that point X has no
            effect at all, it's simply the whole image, so there's nothing to
            tune further up there. In that 1024-1332px band, though, the crop
            is still live, and a higher X (centering on the student, as the
            values below 1024px do) pulls the note far enough left to
            collide with the headline - see the wrapper div below for the
            other half of that fix. Lower X shows more open sky instead,
            pushing the note and buildings further right, clear of the text
            column.

            object-cover (unchanged) is what lets this box grow taller
            without distorting or stretching the photo - a taller box just
            reveals more of the same image, cropped the same way `cover`
            already crops it horizontally.

            LCP image: `priority`, never lazy-loaded, dimensions declared. */}
        <Image
          src={asset(media.hero.src)}
          alt={media.hero.alt}
          width={media.hero.width}
          height={media.hero.height}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[80%_24%] lg:object-[8%_20%]"
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

        {/* Fades the photograph out before the cards' own lower half, so
            that half sits on the section's plain white background instead
            of the image - anchored to the wrapper's bottom edge (which this
            file's own opening comment establishes always lands exactly on
            the cards' bottom edge), a fixed height here is therefore always
            "the last N px of the cards", not a guess at where the cards
            start. N is ~half a card's own rendered height at each
            breakpoint tier, checked in-browser against the actual card
            heights (they don't vary within a tier): ~198px tall at base,
            ~213px at sm-lg, ~206px at xl - halved and rounded. Sits above
            the photo/wash (both -z, this is the default z-0) but below the
            cards (z-10), and fades in rather than cutting in, so the join
            reads as intentional rather than a hard edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.82)_60%,rgba(255,255,255,1)_100%)] sm:h-[107px] xl:h-[103px]"
        />

        <div className="relative pt-[4.5rem]">
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
              {/* translate-x-5 is capped at 1332px - it exists only to clear the
                  photo's baked-in note in the 1024-1332px band (see the photo's
                  own comment above). Past 1332px the note-collision risk is gone,
                  so the offset drops out and this column's left edge lands back
                  on the same grid line as the navbar logo and the cards row
                  below (both flat px-5/px-8, no extra shift) - the alignment the
                  brief requires across logo / hero text / first card. */}
              <div className="lg:col-span-7 max-[1332px]:lg:translate-x-5 lg:-translate-y-5">
                <p className="eyebrow text-navy/80 drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]">{hero.eyebrow}</p>

                {/* Both halves stay inside one <h1> so the sentence reads as a
                    unit. The gradient half sweeps on every line, not once
                    across the block. */}
                <h1
                  id="hero-heading"
                  className="mt-6 max-w-[27ch] text-[2.4rem] leading-[1.06] font-extrabold tracking-[-0.03em] drop-shadow-[0_2px_10px_rgba(255,255,255,0.55)] sm:text-[3rem] lg:text-[3.15rem]"
                >
                  <span className="block">{hero.headline.plain}</span>
                  <span className="text-gradient-lines no-hyphen-break mt-1 block whitespace-pre-line">
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
            edge - never absorbed into its height. On mobile they stack
            BELOW the headline and primary CTA, on their own plain
            background.

            This wrapper is now flat px-5 sm:px-8 with no max-width and no
            mx-auto - the EXACT same alignment system the hero text wrapper
            above uses (see its own comment), not a separate one - so card
            1's left edge and card 3's right edge always land exactly on
            the same grid line the headline starts from and the text
            column's own right-hand boundary respects, at every viewport,
            with no drift and no guessed offset. A dedicated capped/centred
            max-width (the previous approach) was rejected here for the
            same reason it's rejected on the headline above: centring
            within a cap makes the left edge march rightward past that
            cap's width, which is exactly the misalignment this pass fixes.

            gap-10 (was gap-8) is the lever for "narrower, more separated
            cards" now that the row has no independent max-width of its own
            to shrink: a bigger gap directly hands less of the row's total
            width to each card, at every viewport, without touching card
            content, padding or the button-fit tuning below. */}
        <div className="relative z-10 -mt-16 w-full px-5 sm:-mt-20 sm:px-8 lg:-mt-[7.25rem]">
          <ul className="grid gap-5 xl:grid-cols-3 xl:gap-10">
            {heroCards.map((card) => (
              <li key={card.eyebrow}>
                <HeroCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HeroCard({ card }: { card: (typeof heroCards)[number] }) {
  const style = verticalStyles[card.vertical];
  const video = videos[card.vertical];

  return (
    // Hover: a subtle lift (translate-y-1 = 4px) plus a slight scale
    // (1.02 - "coming forward", not a size change) plus the site's existing
    // "elevated" shadow token (shadow-lift, already used for the video
    // dialog trigger and a couple of decorative cards elsewhere) swapped in
    // for the default shadow-card - reuses an established shadow rather
    // than inventing a new one. Tailwind's hover:scale/translate utilities
    // compile to the native CSS `scale`/`translate` properties here (not
    // `transform`, which stays `none` throughout) - the transition list
    // below has to name `scale` and `translate` explicitly, or the browser
    // applies both instantly with no animation at all. None of this affects
    // layout: no width/height/position change, siblings never shift.
    // `relative` + `hover:z-10` lifts the hovered card's stacking order
    // above its neighbours, so the ~1-2% growth never renders behind (and
    // so never looks clipped by) the next card in DOM order.
    //
    // The permanent `lg:scale-90` that used to sit here is gone: it shrank
    // every card 10% smaller than its actual grid box on all four sides,
    // which was the dominant source of the visual gap between cards (far
    // more than the grid's own `gap` value) - so widening the grid track
    // and shrinking `gap` had almost no visible effect while it was still
    // scaling the result back down. Removing it is what actually makes the
    // wider/closer-together change in the row below visible on screen.
    <article
      className={`relative flex h-full flex-col rounded-card border ${style.border} ${style.tint} p-3 shadow-card transition-[scale,translate,box-shadow] duration-[250ms] ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lift sm:p-4`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${style.icon}`}>
          <Icon name={cardIcon[card.vertical]} className="h-7 w-7" />
        </span>

        <div className="min-w-0 pt-0.5">
          {/* The offering is named outright, in a tinted pill of its own
              line directly below the eyebrow - no dash, no inline wrapping -
              for institutions and commerce alike; prephasz gets its own
              brand mark as that same small block instead of a pill (the
              official artwork includes "Powered by ZSkillup" as an
              inseparable second line, so it no longer fits inline the way a
              single-line wordmark did). Both pills share this exact
              template - font size, weight (normal - deliberately NOT
              inheriting the h2's font-bold, since a bold pill read as a
              different kind of label than institutions' non-bold one),
              padding and radius - so "Global Finance & AI" and "Tech and
              Management" read as the same type of label; only each
              vertical's own tint (`style.band`/`style.text`) still differs,
              matching every other per-vertical accent on this card.

              The eyebrow itself must stay on one line, but only from `sm`
              up - the brief's own "one line" requirement is scoped to
              desktop. Below `sm`, the single-column card is its full
              (generous) width already comfortably wraps the eyebrow with no
              cap needed, but at base-tier phone widths specifically
              (~320-415px, checked in-browser, not guessed - covers most
              real phones) the card itself is narrower than the unwrapped
              text, so forcing nowrap there pushed the card past its own
              grid track and got silently clipped by this section's own
              overflow-hidden - a real horizontal-overflow bug the brief
              explicitly rules out. */}
          <h2
            className={`text-[1.125rem] leading-snug font-bold text-navy ${
              card.vertical === "institutions" ? "sm:whitespace-nowrap" : "max-w-[15rem]"
            }`}
          >
            {card.eyebrow}
          </h2>
          {card.vertical === "prephasz" ? <PrephaszLogo className="mt-1.5 h-8" /> : null}
          {card.vertical !== "prephasz" && card.brandLabel ? (
            <span
              className={`mt-1.5 inline-block rounded-full font-normal ${style.band} px-2.5 py-1 ${style.text}`}
            >
              {card.brandLabel}
            </span>
          ) : null}
          {/* One line at sm and up (all three descriptions checked in-browser
              against each card's own actual width at every tier from 640px
              up - none needs more room than the card already has) - the
              previous 14rem cap forced a wrap purely for height parity
              across the row, which one-lining all three now achieves on its
              own without it. Below sm, the single-column card is wide
              enough for two of the three on one line already; the longest
              ("Future-Ready. AI-Enabled. Globally Employable.") still wraps
              there rather than overflowing - the brief's own fallback for a
              sentence that "genuinely cannot fit" at the narrowest phone
              widths. */}
          <p className="mt-2 max-w-[16rem] text-[0.875rem] leading-relaxed whitespace-normal text-body sm:max-w-none sm:whitespace-nowrap">
            {card.description}
          </p>
        </div>
      </div>

      {/* CTA layout: all three actions - primary, secondary, then Watch Now
          - share one row at every width that can genuinely hold them;
          Watch Now never drops to a second line anywhere that fits.

          Card width isn't the only lever available to make that hold at
          every width (cards are narrower now besides - see the grid above)
          - it's balanced against three responsive tiers of button sizing,
          sized to each layout mode's actual available width:
            - base (<sm, phones - single stacked column, but a narrow one)
              and xl+ (1280px+ - three real columns again) share the same
              compact sizing: a third of the xl row's own width is tighter
              than a phone screen minus its padding, so both tiers need it.
            - sm-lg (640-1279px - still a single stacked column, but a wide
              one - the full card width, not a third of it): sized much more
              generously, since there is real room to spare there.
          Every tier's numbers (padding, gap, text size, and the pill's
          matching height) were checked in-browser against each card's own
          actual button labels at that tier's narrowest width - specifically
          card 3's own longest combination ("Explore" + "Talk to an Advisor"
          + "Watch Now"), the tightest of the three cards at every tier -
          measured against the row's TRUE budget (the grid track's own
          width, minus the card's own padding), not against the row's own
          rendered width (which, unconstrained, just grows to fit its
          content and so trivially always "fits itself" - a mistake this
          pass caught and corrected by re-measuring properly). Positive
          margin (never negative, i.e. never overflowing) holds at 1280px
          (xl's narrowest) and 640px (sm-lg's narrowest) at this size, but
          NOT all the way down to base's own narrowest real phones - it
          breaks even somewhere around 400-410px wide, checked in-browser.
          Below that (~320-409px, a real, non-trivial band - covers e.g. the
          390-393px iPhone 12-14/Pixel width class), one row of buttons this
          size genuinely cannot fit without either shrinking the type
          unreadably or overflowing the card - flex-wrap is the fallback the
          brief itself allows for exactly this case ("extremely narrow
          mobile screens where a single-line sentence genuinely cannot fit
          ... use the smallest responsible responsive adjustment"); it only
          ever engages when a line would otherwise overflow, never for cards
          1-2 which stay one row regardless. `!` (important) is required
          here: these override Button's own shared `sm` size and
          VideoDialog's own shared `pill` padding, neither of which this
          pass may edit directly (both are used elsewhere on the site,
          unchanged). */}
      <div className="mt-auto flex flex-wrap items-center gap-[5px] pt-5 min-[410px]:flex-nowrap sm:gap-2 xl:gap-[5px]">
        <Button
          href={card.primary.href}
          variant="primary"
          size="sm"
          className="!gap-[5px] !px-2 !py-2 !text-[0.75rem] sm:!gap-2 sm:!px-4 sm:!py-[11px] sm:!text-[0.9375rem] xl:!gap-[5px] xl:!px-2 xl:!py-2 xl:!text-[0.75rem]"
        >
          {card.primary.label}
        </Button>
        <Button
          href={card.secondary.href}
          variant="outline"
          size="sm"
          className="!gap-[5px] !px-2 !py-2 !text-[0.75rem] sm:!gap-2 sm:!px-4 sm:!py-[11px] sm:!text-[0.9375rem] xl:!gap-[5px] xl:!px-2 xl:!py-2 xl:!text-[0.75rem]"
        >
          {card.secondary.label}
        </Button>
        {/* Watch Now's own icon well (VideoDialog's `pill` variant) is a
            fixed h-7 (28px) circle, unaffected by any of these breakpoint
            paddings - left to its own content-driven height, that circle
            would make the pill a different height than the other two
            buttons at every tier here. `!h-*` pins the pill to the
            primary/secondary buttons' own measured height at each tier
            (checked in-browser, not guessed) so all three land on the same
            top/bottom edge via the row's existing `items-center` - the
            circle (still 28px, untouched) simply centers within the
            now-matched box instead of dictating it. */}
        <VideoDialog
          video={video}
          label={card.video.label}
          variant="pill"
          className="!h-9 !gap-[5px] !py-2 !pl-[3px] !pr-2 !text-[0.75rem] sm:!h-[47px] sm:!gap-2 sm:!py-[11px] sm:!pl-[6px] sm:!pr-[18px] sm:!text-[0.9375rem] xl:!h-9 xl:!gap-[5px] xl:!py-2 xl:!pl-[3px] xl:!pr-2 xl:!text-[0.75rem]"
        />
      </div>
    </article>
  );
}
