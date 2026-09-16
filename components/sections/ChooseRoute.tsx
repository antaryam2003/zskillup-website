import { chooseRoute } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { PrephaszWordmark } from "@/components/ui/Brand";
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
  return (
    <Section id="choose-your-route" tone="white" labelledBy="choose-route-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left column stays deliberately sparse - whitespace is the point. */}
          <div className="lg:col-span-3">
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

          <ul className="grid gap-5 lg:col-span-9 lg:grid-cols-3">
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
                        <p className="eyebrow text-[0.625rem] text-navy/60">{card.kicker}</p>
                        <span
                          aria-hidden="true"
                          className="mt-1.5 block h-px w-8 bg-navy/20"
                        />
                      </div>
                    </div>

                    <p className={`eyebrow relative mt-7 text-[0.625rem] ${style.text}`}>
                      {card.eyebrow}
                    </p>

                    {card.brand === "Prephasz" ? (
                      <PrephaszWordmark className="relative mt-3 text-[1.55rem]" showParent />
                    ) : card.brand ? (
                      <p
                        className={`relative mt-3 inline-block self-start rounded-md ${style.band} px-2.5 py-1 text-[0.8125rem] font-semibold ${style.text}`}
                      >
                        {card.brand}
                      </p>
                    ) : null}

                    <h3 className="relative mt-3 text-[1.25rem] leading-snug font-extrabold text-navy">
                      {card.title}
                    </h3>

                    <p className="relative mt-3 text-[0.9375rem] leading-relaxed text-body">
                      {card.body}
                    </p>

                    <span
                      aria-hidden="true"
                      className="relative my-6 block h-px w-full bg-navy/10"
                    />

                    <ul className="relative space-y-3">
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
