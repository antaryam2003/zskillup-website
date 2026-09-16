"use client";

import { useState } from "react";
import { faqCategories, faqIntro, faqs, type FaqCategory } from "@/content/faqs";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 11 - FAQs (Design 2 base, layout kept)
 *
 * Two-column structure retained: context and navigation on the left, accordion on
 * the right. The left heading is now "What would you like to know?".
 *
 * Categories align with the actual site architecture - For Institutions,
 * Prephasz, B.Com + ACCA. "Programmes" was removed as a category because
 * "Programs" is no longer a top-level architecture term, and "Admissions &
 * Career" was folded into the two pathways it belonged to. Selecting a category
 * filters the questions on the right; deselecting returns to the general set.
 *
 * The default first question is "What does ZSkillup do?" rather than the comp's
 * B.Com + ACCA question - this is the parent ZSkillup homepage, so the general
 * question belongs first.
 *
 * Only one answer is open at a time, as in the comp.
 *
 * Every question is rendered into the HTML (inactive sets carry `hidden`), so the
 * content is crawlable without requiring a click.
 *
 * "Contact Our Team" is navy/purple rather than the comp's red/orange - this is a
 * master-brand utility section, not a product section, so it must not introduce
 * another colour identity.
 *
 * The comp's decorative question marks are dropped; whitespace is preferable.
 *
 * On mobile the descriptive left column falls away and the categories become a
 * horizontal chip row above the questions, per the brief.
 */

const categoryIcons: Record<FaqCategory, IconName> = {
  general: "message",
  institutions: "building",
  prephasz: "target",
  commerce: "book",
};

export function Faqs() {
  // `null` means the general set - the default state for the parent homepage.
  const [category, setCategory] = useState<FaqCategory | null>(null);
  const [open, setOpen] = useState(0);

  const active: FaqCategory = category ?? "general";
  const selectable = faqCategories.filter((c) => c.id !== "general");

  const choose = (id: FaqCategory) => {
    setCategory((current) => (current === id ? null : id));
    setOpen(0);
  };

  return (
    <Section id="faqs" tone="cloud" labelledBy="faqs-heading">
      <Container>
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="brand" className="justify-center">
            {faqIntro.eyebrow}
          </Eyebrow>
          <Heading
            id="faqs-heading"
            plain={faqIntro.headline.plain}
            accent={faqIntro.headline.gradient}
            className="mt-5"
          />
          <Lede className="mt-5">{faqIntro.supporting}</Lede>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h3 className="hidden text-[1.5rem] font-extrabold text-navy lg:block">
              {faqIntro.leftHeading}
            </h3>
            <p className="mt-4 hidden max-w-[34ch] leading-relaxed text-body lg:block">
              {faqIntro.leftBody}
            </p>

            <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:gap-3 lg:overflow-visible">
              {selectable.map((cat) => {
                const selected = category === cat.id;
                return (
                  <li key={cat.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(cat.id)}
                      className={`flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors lg:rounded-tile lg:px-4 lg:py-3.5 ${
                        selected
                          ? "border-brand/35 bg-brand-soft"
                          : "border-line bg-white hover:border-navy/20"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                          selected ? "bg-white text-brand" : "bg-cloud text-muted"
                        }`}
                      >
                        <Icon name={categoryIcons[cat.id]} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] font-bold whitespace-nowrap text-navy lg:whitespace-normal">
                          {cat.label}
                        </span>
                        <span className="hidden text-[0.8125rem] text-muted lg:block">
                          {cat.blurb}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-8">
            {category ? (
              <button
                type="button"
                onClick={() => {
                  setCategory(null);
                  setOpen(0);
                }}
                className="mb-4 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-brand hover:underline"
              >
                <Icon name="chevronLeft" className="h-3.5 w-3.5" />
                All general questions
              </button>
            ) : null}

            {/* Every category's questions ship in the HTML; only the active set
                is shown. */}
            {faqCategories.map((cat) => {
              const items = faqs.filter((f) => f.category === cat.id);
              return (
                <ul
                  key={cat.id}
                  hidden={cat.id !== active}
                  className="space-y-3"
                  aria-label={`${cat.label} questions`}
                >
                  {items.map((faq, i) => {
                    const isOpen = cat.id === active && open === i;
                    const panelId = `faq-panel-${cat.id}-${i}`;
                    const buttonId = `faq-button-${cat.id}-${i}`;
                    return (
                      <li
                        key={faq.q}
                        className={`overflow-hidden rounded-tile border transition-colors ${
                          isOpen ? "border-brand/30 bg-brand-soft/50" : "border-line bg-white"
                        }`}
                      >
                        <h3>
                          <button
                            type="button"
                            id={buttonId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? -1 : i)}
                            className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left"
                          >
                            <span className="text-[0.9375rem] font-bold text-navy sm:text-base">
                              <span className="mr-2 text-muted tabular-nums">{i + 1}.</span>
                              {faq.q}
                            </span>
                            <span
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                                isOpen ? "bg-white text-brand" : "bg-cloud text-muted"
                              }`}
                            >
                              <Icon name={isOpen ? "minus" : "plus"} className="h-4 w-4" />
                            </span>
                          </button>
                        </h3>
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          hidden={!isOpen}
                          className="px-5 pb-5"
                        >
                          <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-body">
                            {faq.a}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })}

            <div className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-8 sm:flex-row sm:justify-center">
              <p className="text-[0.9375rem] text-muted">{faqIntro.contactPrompt}</p>
              <Button href={faqIntro.contactCta.href} variant="primary" size="sm">
                {faqIntro.contactCta.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
