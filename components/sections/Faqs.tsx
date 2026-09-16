"use client";

import { useState } from "react";
import { faqCategories, faqIntro, faqs, type FaqCategory } from "@/content/faqs";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 11 - FAQs
 *
 * Two-column structure: context and navigation on the left, accordion on the
 * right, inside one bordered container.
 *
 * Categories align with the actual site architecture - For Institutions,
 * Prephasz, B.Com + ACCA. "Programmes" was removed as a category because
 * "Programs" is no longer a top-level architecture term, and "Admissions &
 * Career" was folded into the two pathways it belonged to. Selecting a category
 * filters the questions; deselecting returns to the general set.
 *
 * The default first question is "What does ZSkillup do?" rather than the comp's
 * B.Com + ACCA question - this is the parent homepage, so the general question
 * belongs first. Only one answer is open at a time.
 *
 * Every question ships in the HTML (inactive sets carry `hidden`), so the content
 * is crawlable without requiring a click.
 *
 * "Contact Our Team" is navy rather than the comp's red - this is a master-brand
 * utility section and must not introduce another colour identity.
 *
 * On mobile the descriptive left column falls away and the categories become a
 * horizontal chip row above the questions.
 */

const categoryIcons: Record<FaqCategory, IconName> = {
  general: "message",
  institutions: "users",
  prephasz: "target",
  commerce: "file",
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
    <Section id="faqs" tone="white" labelledBy="faqs-heading">
      <Container>
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="eyebrow flex items-center justify-center gap-3 text-navy/70">
            <span aria-hidden="true" className="h-px w-7 bg-current opacity-60" />
            {faqIntro.eyebrow}
          </p>
          <Heading
            id="faqs-heading"
            plain={faqIntro.headline.plain}
            accent={faqIntro.headline.gradient}
            accentTone="brand"
            className="mt-4"
          />
          <Lede className="mt-4">{faqIntro.supporting}</Lede>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:pt-6">
            <p className="eyebrow hidden text-muted lg:block">Still have questions?</p>
            <h3 className="mt-3 hidden text-[1.6rem] font-extrabold text-navy lg:block">
              {faqIntro.leftHeading}
            </h3>
            <span aria-hidden="true" className="mt-5 hidden h-0.5 w-14 bg-navy/70 lg:block" />
            <p className="mt-5 hidden max-w-[36ch] leading-relaxed text-body lg:block">
              {faqIntro.leftBody}
            </p>

            <ul className="no-scrollbar flex gap-3 overflow-x-auto pb-1 lg:mt-9 lg:flex-col lg:overflow-visible">
              {selectable.map((cat) => {
                const selected = category === cat.id;
                return (
                  <li key={cat.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(cat.id)}
                      className={`flex w-full items-center gap-4 rounded-full px-4 py-3 text-left transition-colors lg:rounded-2xl lg:px-5 lg:py-4 ${
                        selected
                          ? "bg-[#ece3fd]"
                          : "border border-line bg-white hover:border-navy/15"
                      }`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e5dafb] text-brand">
                        <Icon name={categoryIcons[cat.id]} className="h-[1.1rem] w-[1.1rem]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[1rem] font-bold whitespace-nowrap text-navy lg:whitespace-normal">
                          {cat.label}
                        </span>
                        <span className="hidden text-[0.875rem] leading-snug text-body lg:block">
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
            <div className="rounded-card border border-line bg-white p-4 sm:p-6">
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
                          className={`overflow-hidden rounded-2xl transition-colors ${
                            isOpen ? "bg-[#f3edfe]" : "border border-line bg-white"
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
                              <span className="text-[1rem] font-bold text-navy">
                                <span className="mr-2 tabular-nums text-navy/60">{i + 1}.</span>
                                {faq.q}
                              </span>
                              <span
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                                  isOpen ? "bg-[#e0d1fb] text-brand" : "bg-cloud text-muted"
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
                            className="mx-3 mb-3 rounded-xl bg-[#ece3fd] px-5 py-4"
                          >
                            <p className="max-w-[64ch] text-[0.9375rem] leading-relaxed text-body">
                              {faq.a}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              })}

              <div className="mt-8 flex flex-col items-center gap-5 pb-2">
                <p className="flex w-full items-center gap-4 text-[0.9375rem] text-muted">
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  {faqIntro.contactPrompt}
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </p>
                <Button href={faqIntro.contactCta.href} variant="primary" size="lg">
                  {faqIntro.contactCta.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
