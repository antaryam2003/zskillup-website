import Image from "next/image";
import { asset } from "@/lib/asset";
import { commerce } from "@/content/homepage";
import { media } from "@/content/media";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";
import { Handwritten } from "@/components/ui/Stats";

/**
 * 06 - B.COM + ACCA (Design 1 base - structure unchanged)
 *
 * Colour correction from the brief: the comp's blue is NOT the final Commerce
 * identity. Commerce owns the teal/green family across the whole site, so the
 * highlighted words, icons, rules and primary CTA all use it here - as accents on
 * a predominantly white section, with navy typography throughout.
 *
 * Removed per the brief:
 *   - the floating "A globally relevant path for the next generation of commerce
 *     professionals." box;
 *   - the dark blue "Build skills. Earn globally. Go further." box - too many
 *     messages were competing with the headline;
 *   - "Same Learning. A Brighter Tomorrow.";
 *   - the long university/ACCA-status disclaimer, which was too prominent for a
 *     homepage. It moves to the dedicated B.Com + ACCA page; only the short note
 *     stays here.
 *
 * Kept: the student photograph (it gives the section its aspirational B2C
 * character), exactly one handwritten note, and the career-pathways block - which
 * answers the student's natural question, "what can I become after doing this?"
 *
 * CTA logic: Explore serves visitors who need more information first; Talk to a
 * Career Advisor opens the enquiry route for high-intent users. Nobody is asked
 * to fill in a form immediately.
 *
 * Source order gives the mobile sequence the brief asks for: headline -> student
 * image -> short proposition -> four-part pathway -> CTAs -> career possibilities.
 */

const pathwayIcons: IconName[] = ["graduation", "globe", "bulb", "building"];

const careerIcons: Record<string, IconName> = {
  Accounting: "calculator",
  Audit: "clipboard",
  "Business Finance": "chart",
  Risk: "shield",
  Tax: "receipt",
  Consulting: "users",
  "Financial Services": "landmark",
};

export function BcomAcca() {
  return (
    <Section id="bcom-acca" tone="cloud" labelledBy="commerce-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* 1. Headline */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <Eyebrow tone="commerce">{commerce.eyebrow}</Eyebrow>
            <h2
              id="commerce-heading"
              className="mt-5 max-w-[17ch] text-[2rem] leading-[1.1] font-extrabold sm:text-[2.6rem] lg:text-[3.1rem]"
            >
              {commerce.headline.plain}{" "}
              <span className="text-com">{commerce.headline.highlight}</span>
            </h2>
          </div>

          {/* 2. Student image - clean and natural, no floating elements. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <div className="relative">
              <Image
                src={asset(media.commerceStudent.src)}
                alt={media.commerceStudent.alt}
                width={media.commerceStudent.width}
                height={media.commerceStudent.height}
                loading="lazy"
                sizes="(min-width: 1024px) 420px, 100vw"
                className="aspect-[11/13] w-full rounded-card object-cover"
              />
              {/* Handwritten accent 3 of 3 - the last one allowed on this page. */}
              <Handwritten className="absolute top-5 left-5 w-[7.5rem] rotate-[-6deg] text-[1.3rem] sm:text-[1.45rem]">
                {commerce.handwritten}
              </Handwritten>
            </div>
          </div>

          {/* 3. Proposition, 4. pathway, 5. CTAs */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <Lede className="max-w-[52ch]">{commerce.supporting}</Lede>

            {/* Four connected blocks reading as ONE integrated pathway - one
                colour family, joined by "+" rather than four separate products. */}
            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              {commerce.pathway.map((part, i) => (
                <li key={part.title} className="flex flex-1 items-stretch gap-3">
                  <div className="h-full flex-1 rounded-tile border border-com-line bg-com-soft/60 p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-com">
                      <Icon name={pathwayIcons[i]} className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3.5 text-[0.9375rem] leading-tight font-bold text-navy">
                      {part.title}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-snug text-body">{part.body}</p>
                  </div>
                  {i < commerce.pathway.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 self-center text-lg font-bold text-com/50 sm:block"
                    >
                      +
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* Kept short and visually light, as asked. */}
            <p className="mt-5 text-[0.8125rem] text-muted">{commerce.shortNote}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href={commerce.primaryCta.href} variant="vertical" tone="commerce">
                {commerce.primaryCta.label}
              </Button>
              <Button href={commerce.secondaryCta.href} variant="link" tone="commerce">
                {commerce.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* 6. Career possibilities - directions, never promised outcomes. */}
        <div className="mt-16 rounded-card border border-line bg-white p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <h3 className="text-[1.375rem] font-extrabold text-navy sm:text-[1.6rem]">
                {commerce.careersHeadline}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                {commerce.careersBody}
              </p>
              <p className="mt-3 text-[0.8125rem] text-muted">{commerce.careersCaveat}</p>
            </div>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:col-span-8 lg:grid-cols-7">
              {commerce.careers.map((career) => (
                <li key={career} className="text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-com-soft text-com">
                    <Icon name={careerIcons[career]} className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  <p className="mt-3 text-[0.8125rem] leading-snug font-medium text-navy">
                    {career}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
