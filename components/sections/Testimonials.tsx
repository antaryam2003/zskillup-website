import Image from "next/image";
import { asset } from "@/lib/asset";
import { initials, learnerPhoto } from "@/content/media";
import {
  testimonials,
  testimonialsEndCard,
  testimonialsIntro,
} from "@/content/testimonials";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section, verticalStyles } from "@/components/ui/Section";
import { ScrollCarousel } from "@/components/ui/Carousel";

/**
 * 09 - TESTIMONIALS (Design 2 layout and composition)
 *
 * Objective from the brief: "authentic learner voices, not a 'reviews widget.'
 * It should feel editorial and credible rather than promotional."
 *
 * The headline "Real people. Real progress." deliberately echoes the phrase
 * introduced in the Hero.
 *
 * Removed per the brief:
 *   - the top statistics (500+ / 4.8/5 / 90%). We do not need another statistics
 *     block, and a rating may only be shown if it is backed by consolidated data.
 *   - the star ratings. "Stars should only appear if these are actual ratings
 *     given by the learner" - no rating data exists, so no stars are rendered and
 *     the data model has no rating field to tempt anyone.
 *   - the handwritten "Learners today. Global professionals tomorrow."
 *   - any partner logos or extra CTA below the section.
 *
 * Kept: real learner photographs (they make this substantially more credible),
 * the carousel so testimonials can keep being added, very light card tints, and
 * the dark end-card - which gives the carousel an endpoint. That card is now
 * ZSkillup navy rather than the comp's dark green, for brand consistency.
 *
 * Stories deliberately mix all three offerings rather than all belonging to one.
 *
 * NOTE: the quotes themselves are sample content - see content/testimonials.ts.
 */
export function Testimonials() {
  return (
    <Section id="testimonials" tone="white" labelledBy="testimonials-heading">
      <Container>
        <div className="max-w-[46rem]">
          <Eyebrow>{testimonialsIntro.eyebrow}</Eyebrow>
          <Heading
            id="testimonials-heading"
            plain={testimonialsIntro.headline.plain}
            accent={testimonialsIntro.headline.gradient}
            className="mt-5"
          />
          <Lede className="mt-6 max-w-[54ch]">{testimonialsIntro.supporting}</Lede>
        </div>

        <ScrollCarousel
          label="Learner testimonials"
          className="mt-12"
          controlsAlign="split"
          itemClassName="w-[85vw] sm:w-[22rem] lg:w-[23.5rem]"
          gapClassName="gap-5"
        >
          {[
            ...testimonials.map((t) => {
              const style = verticalStyles[t.vertical];
              const photo = learnerPhoto(t.slug, t.name);
              return (
                <figure
                  key={t.slug}
                  className={`flex h-full flex-col rounded-card border border-line ${style.tint} p-7`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      name="message"
                      className={`h-6 w-6 shrink-0 ${style.text} opacity-70`}
                    />
                    {/* Small category label, so a reader can tell which offering
                        each story belongs to. */}
                    <span className="eyebrow text-[0.625rem] text-muted">{t.category}</span>
                  </div>

                  <blockquote className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-navy">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-white/70 pt-5">
                    {photo ? (
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        sizes="48px"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      /* No photograph for this learner yet - a monogram keeps the
                         card composition intact rather than leaving a gap.
                         See content/media.ts. */
                      <span
                        aria-hidden="true"
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[0.9375rem] font-bold ${style.text}`}
                      >
                        {initials(t.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-[0.9375rem] font-bold text-navy">{t.name}</p>
                      <p className="text-[0.8125rem] text-body">{t.role}</p>
                      <p className="text-[0.8125rem] text-muted">{t.institution}</p>
                    </div>
                  </figcaption>
                </figure>
              );
            }),

            /* The dark end-card closes the carousel. Navy, with the gradient used
               only on the small arrow - no large coloured area. */
            <div
              key="end-card"
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-navy p-7 text-white"
            >
              <span
                aria-hidden="true"
                className="absolute -top-16 -right-12 h-48 w-48 rounded-full bg-gradient-brand opacity-20 blur-3xl"
              />
              <div className="relative">
                <span aria-hidden="true" className="block h-0.5 w-9 bg-gradient-brand" />
                <h3 className="mt-6 text-[1.5rem] leading-tight font-extrabold text-white">
                  {testimonialsEndCard.heading}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70">
                  {testimonialsEndCard.body}
                </p>
              </div>
              <a
                href={testimonialsEndCard.cta.href}
                className="group relative mt-8 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand transition-transform group-hover:translate-x-0.5">
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
                {testimonialsEndCard.cta.label}
              </a>
            </div>,
          ]}
        </ScrollCarousel>
      </Container>
    </Section>
  );
}
