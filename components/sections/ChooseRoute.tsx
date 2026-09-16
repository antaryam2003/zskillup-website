import { chooseRoute } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { PrephaszWordmark } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section, verticalStyles } from "@/components/ui/Section";

/**
 * 03 - CHOOSE YOUR ROUTE (Design 6 locked as the base - no redesign)
 *
 * Kept: clean white background, three vertical cards, minimal treatment, the
 * three feature points per card, and "Outcome: Employability" at the bottom of
 * all three - which is what ties the three routes back to one proposition.
 *
 * Changed per the brief:
 *   - headline is now "Find the path that fits you."
 *   - supporting line is "Different journeys. One outcome - career readiness."
 *   - the left-hand statistics (10K+ / 50+ / 500+) are REMOVED; this section is
 *     purely about helping a visitor identify their pathway.
 *   - "Skills Today. Opportunities Tomorrow." is removed and the space left empty.
 *   - "Go to Prephasz" became "Explore Prephasz"; the third card names
 *     B.Com + ACCA explicitly.
 *   - card three moves from the comp's blue to the Commerce teal/green family.
 *
 * No extra CTA is added on the left. The three card CTAs are enough.
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

export function ChooseRoute() {
  return (
    <Section id="choose-your-route" tone="cloud" labelledBy="choose-route-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column stays deliberately sparse - whitespace is the point. */}
          <div className="lg:col-span-3">
            <Eyebrow>{chooseRoute.eyebrow}</Eyebrow>
            <Heading
              id="choose-route-heading"
              plain={chooseRoute.headline}
              className="mt-5"
            />
            <Lede className="mt-6 max-w-[30ch]">{chooseRoute.supporting}</Lede>
          </div>

          <ul className="grid gap-5 lg:col-span-9 lg:grid-cols-3">
            {chooseRoute.cards.map((card) => {
              const style = verticalStyles[card.vertical];
              return (
                <li key={card.eyebrow} className="flex">
                  <article className="flex w-full flex-col rounded-card border border-line bg-white p-6 shadow-card sm:p-7">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-xl ${style.tint} ${style.text}`}
                      >
                        <Icon name={kickerIcons[card.vertical]} className="h-[1.15rem] w-[1.15rem]" />
                      </span>
                      <p className="eyebrow text-[0.6875rem] text-muted">{card.kicker}</p>
                    </div>

                    <p className="eyebrow mt-7 text-[0.6875rem]">{card.eyebrow}</p>

                    {card.brand === "Prephasz" ? (
                      <PrephaszWordmark className="mt-3 text-[1.6rem]" showParent />
                    ) : null}

                    <h3 className="mt-3 text-[1.25rem] leading-snug font-extrabold text-navy">
                      {card.brand && card.brand !== "Prephasz" ? (
                        <>
                          <span className={`block text-[0.9375rem] font-bold ${style.text}`}>
                            {card.brand}
                          </span>
                          <span className="mt-1 block">{card.title}</span>
                        </>
                      ) : (
                        card.title
                      )}
                    </h3>

                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{card.body}</p>

                    <span aria-hidden="true" className="my-6 block h-px w-full bg-line-soft" />

                    <ul className="space-y-3">
                      {card.features.map((feature, i) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Icon
                            name={featureIcons[card.vertical][i]}
                            className={`h-[1.05rem] w-[1.05rem] shrink-0 ${style.text}`}
                          />
                          <span className="text-[0.9375rem] text-body">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex-1" />

                    <Button
                      href={card.cta.href}
                      variant="vertical"
                      tone={card.vertical}
                      size="sm"
                      className="w-full justify-between text-left"
                    >
                      {card.cta.label}
                    </Button>

                    {/* Ties all three routes back to one ZSkillup outcome. */}
                    <p
                      className={`mt-5 -mx-6 -mb-6 flex items-center gap-2 rounded-b-card ${style.tint} px-6 py-4 text-[0.875rem] text-body sm:-mx-7 sm:-mb-7 sm:px-7`}
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
