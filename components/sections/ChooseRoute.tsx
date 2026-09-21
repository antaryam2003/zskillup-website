import { chooseRoute } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { PrephaszLogo } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section, verticalStyles } from "@/components/ui/Section";

/**
 * 03 - CHOOSE YOUR ROUTE
 *
 * Per the updated design, the whole card carries its vertical's tint (rather
 * than sitting white on a tinted page), with a soft decorative circle in the
 * corner, a circular icon well, and a full-width CTA in the vertical's colour.
 * "Outcome: Employability" closes every card in a slightly deeper band - which is
 * what ties the three routes back to one ZSkillup proposition.
 *
 * The headline accent is the editorial gold used across Choose Your Route,
 * Partners and Testimonials.
 *
 * Still removed, per the brief: the left-hand statistics, "Skills Today.
 * Opportunities Tomorrow.", and any extra left-column CTA. The three card CTAs
 * are enough.
 */

const featureIcons: Record<string, IconName[]> = {
  institutions: ["users", "chart", "graduation"],
  prephasz: ["file", "chart", "target"],
  commerce: ["book", "globe", "briefcase"],
};

const kickerIcons: Record<string, IconName> = {
  institutions: "building",
  prephasz: "users",
  commerce: "book",
};

const ctaVariant = {
  institutions: "primary",
  prephasz: "vertical",
  commerce: "vertical",
} as const;

export function ChooseRoute() {
  // Top padding only is trimmed from the Section default (py-20 sm:py-24
  // lg:py-28) - bottom is untouched, so this only closes up the gap from
  // About/Our Leadership above, not the space below this section. Both
  // sections share the same white background, so there's no colour seam to
  // lean on here - the reduced gap alone is what has to read as "connected."
  return (
    <Section
      id="choose-your-route"
      tone="white"
      labelledBy="choose-route-heading"
      className="pt-10 sm:pt-12 lg:pt-14"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left column stays deliberately sparse - whitespace is the point.
              col-span-2 (was 3): the cards need more of the 12-unit budget
              than a gap reduction alone can supply - see the cards row's own
              comment - and this column's own content (an 11ch-capped
              heading, a 30ch-capped lede) has enough headroom in its max-
              width caps to still read fine at the narrower width; verified
              via screenshot. */}
          <div className="lg:col-span-2">
            <Eyebrow tone="gold" rule="above">
              {chooseRoute.eyebrow}
            </Eyebrow>
            <Heading
              id="choose-route-heading"
              plain="Find the path that"
              accent="fits you."
              accentTone="gold"
              size="lg"
              className="mt-6 max-w-[11ch]"
            />
            <Lede className="mt-6 max-w-[30ch]">{chooseRoute.supporting}</Lede>
          </div>

          {/* gap-3 (was gap-5) plus the left column's own col-span-2 (was 3,
              see above) together hand each card real, verified-safe extra
              width from the same 12-unit budget: at gap-5/col-span-3, "For
              Placement Preparation" needed 233px of nowrap width against
              only ~200px available in the card - a hard, unfixable
              overflow at every desktop width, container cap included, no
              matter how the gap was tuned. This combination gives it
              healthy clearance instead of a 1px margin. */}
          <ul className="grid gap-3 lg:col-span-10 lg:grid-cols-3">
            {chooseRoute.cards.map((card) => {
              const style = verticalStyles[card.vertical];
              return (
                <li key={card.eyebrow} className="flex">
                  <article
                    className={`relative flex w-full flex-col overflow-hidden rounded-card border ${style.border} ${style.tint} p-6 shadow-card`}
                  >
                    {/* Soft decorative circle in the corner, as in the design. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${style.band} opacity-70`}
                    />

                    <div className="relative flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${style.icon}`}
                      >
                        <Icon name={kickerIcons[card.vertical]} className="h-[1.15rem] w-[1.15rem]" />
                      </span>
                      <div>
                        {/* "Stronger institutions" only gets real room to
                            spare once the card hits its plateau width
                            (~1240px+ viewport, where the Container's own cap
                            takes over) - forcing nowrap any earlier (e.g. at
                            the lg: breakpoint, 1024px, where this row is
                            narrowest) clips the uppercase, letter-spaced text
                            past the card's edge instead of wrapping it. xl:
                            is the safe threshold; below it, it wraps onto two
                            lines exactly as it did before. */}
                        <p
                          className={`eyebrow text-[0.625rem] text-navy/60 ${
                            card.vertical === "institutions" ? "xl:whitespace-nowrap" : ""
                          }`}
                        >
                          {card.kicker}
                        </p>
                        <span
                          aria-hidden="true"
                          className="mt-1.5 block h-px w-8 bg-navy/20"
                        />
                      </div>
                    </div>

                    {/* Same reasoning as the kicker above: "For Placement
                        Preparation" only has enough nowrap room once the
                        card reaches its plateau width (~1200px+ viewport);
                        xl: (1280px) is the nearest safe default breakpoint,
                        confirmed via scrollWidth-vs-offsetWidth overflow
                        checks at every width from 1024 to 1920. Below it,
                        this wraps onto two lines exactly as it did before. */}
                    <p
                      className={`eyebrow relative mt-7 text-[0.625rem] ${style.text} ${
                        card.vertical === "prephasz" ? "xl:whitespace-nowrap" : ""
                      }`}
                    >
                      {card.eyebrow}
                    </p>

                    {card.brand === "prephasz" ? (
                      // h-8 (was h-9, an ~11% reduction) plus mt-2 (was
                      // mt-3) together close the exact 8px this logo sat
                      // taller than the other two cards' brand pill (36px
                      // vs 28px) - confirmed via measured layout that this
                      // lands the title/description at the identical pixel
                      // offset as cards 1 and 3, not just "closer."
                      <PrephaszLogo className="relative mt-2 h-8 self-start" />
                    ) : card.brand ? (
                      <p
                        className={`relative mt-3 inline-block self-start rounded-md ${style.band} px-2.5 py-1 text-[0.8125rem] font-semibold ${style.text}`}
                      >
                        {card.brand}
                      </p>
                    ) : null}

                    <h3 className="relative mt-3 text-[1.25rem] leading-snug font-extrabold whitespace-pre-line text-navy">
                      {card.title}
                    </h3>

                    {/* Short bridging line some cards use between the title
                        and the fuller body copy below - styled identically to
                        the title above it so the two read as one two-line
                        heading. That has to include tracking-[-0.022em] and
                        text-balance explicitly: h1-h4 get both from a global
                        base rule keyed to the tag name (see globals.css),
                        which a <p> doesn't pick up just by matching the
                        title's own Tailwind classes. */}
                    {card.subtitle ? (
                      <p className="relative mt-1 text-[1.25rem] leading-snug font-extrabold tracking-[-0.022em] text-navy text-balance">
                        {card.subtitle}
                      </p>
                    ) : null}

                    {/* card.dense: a longer body (e.g. 5 lines against 3)
                        would otherwise push this card's divider and features
                        lower than its siblings and stretch the whole row, so
                        the body leading, divider margins and feature spacing
                        tighten together - same left edge, same type sizes.
                        lg: and up only, because that is the three-across
                        layout where the row height is equalised; stacked cards
                        stand alone and keep the standard spacing. */}
                    <p
                      className={`relative text-[0.9375rem] leading-relaxed text-body ${
                        card.dense ? "lg:leading-normal" : ""
                      } ${card.subtitle ? "mt-2" : "mt-3"}`}
                    >
                      {card.body}
                    </p>

                    <span
                      aria-hidden="true"
                      className={`relative my-6 block h-px w-full bg-navy/10 ${
                        card.dense ? "lg:my-4" : ""
                      }`}
                    />

                    <ul className={`relative space-y-3 ${card.dense ? "lg:space-y-2" : ""}`}>
                      {card.features.map((feature, i) => (
                        <li key={feature} className="flex items-center gap-3">
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.band} ${style.text}`}
                          >
                            <Icon
                              name={featureIcons[card.vertical][i]}
                              className="h-[0.95rem] w-[0.95rem]"
                            />
                          </span>
                          <span className="text-[0.9375rem] text-navy">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative mt-7 flex-1" />

                    <Button
                      href={card.cta.href}
                      variant={ctaVariant[card.vertical]}
                      tone={card.vertical}
                      size="sm"
                      className="relative w-full"
                    >
                      {card.cta.label}
                    </Button>

                    {/* Ties all three routes back to one ZSkillup outcome. */}
                    <p
                      className={`relative -mx-6 -mb-6 mt-6 flex items-center gap-2 ${style.band} px-6 py-4 text-[0.875rem] text-body`}
                    >
                      <Icon name="target" className={`h-4 w-4 ${style.text}`} />
                      {chooseRoute.outcomeLabel}{" "}
                      <strong className="font-bold text-navy">{chooseRoute.outcomeValue}</strong>
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
