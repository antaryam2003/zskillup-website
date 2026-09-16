import Image from "next/image";
import { asset } from "@/lib/asset";
import { commerce } from "@/content/homepage";
import { media } from "@/content/media";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";

/**
 * 06 - B.COM + ACCA
 *
 * Commerce owns the green family across the whole site, so the highlighted words,
 * icons, blocks and primary CTA all use it here - as accents on a pale mint
 * field, with navy typography throughout.
 *
 * Still removed, per the brief: the "globally relevant path" floating box, the
 * dark "Build skills. Earn globally. Go further." box, "Same Learning. A Brighter
 * Tomorrow.", and the long university/ACCA-status disclaimer (which moves to the
 * dedicated page - only the short note stays here).
 *
 * Kept: the student photograph, exactly one handwritten note, and the career
 * pathways block - which answers "what can I become after doing this?"
 *
 * Source order gives the mobile sequence the brief asks for: headline -> student
 * image -> short proposition -> four-part pathway -> CTAs -> career possibilities.
 */

const pathwayIcons: IconName[] = ["graduation", "file", "trending", "building"];

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
    <Section id="bcom-acca" tone="mint" labelledBy="commerce-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* 1. Headline */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <Eyebrow tone="gold">{commerce.eyebrow}</Eyebrow>
            <h2
              id="commerce-heading"
              className="mt-5 max-w-[16ch] text-[2.1rem] leading-[1.08] font-extrabold sm:text-[2.7rem] lg:text-[3.1rem]"
            >
              {commerce.headline.plain}{" "}
              <span className="text-com">{commerce.headline.highlight}</span>
            </h2>
          </div>

          {/* 2. Student image - clean and natural, no floating elements. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-6 -left-8 hidden h-40 w-40 rounded-full bg-[#dceee9] lg:block"
              />
              <Image
                src={asset(media.commerceStudent.src)}
                alt={media.commerceStudent.alt}
                width={media.commerceStudent.width}
                height={media.commerceStudent.height}
                loading="lazy"
                sizes="(min-width: 1024px) 460px, 100vw"
                className="relative aspect-[4/5] w-full rounded-[2.5rem] rounded-tl-[5rem] object-cover"
              />
              {/* Handwritten accent 2 of 2 on the homepage. */}
              <span className="handwritten absolute top-8 left-6 w-[7.5rem] rotate-[-7deg] text-[1.3rem] text-com sm:text-[1.45rem]">
                {commerce.handwritten}
                <svg
                  viewBox="0 0 120 12"
                  className="mt-1 block h-3 w-full"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 8c26-7 68-8 112-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* 3. Proposition, 4. pathway */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <Lede className="max-w-[52ch]">{commerce.supporting}</Lede>

            {/* Four connected blocks reading as ONE integrated pathway - one
                colour family, joined by "+" rather than four separate products. */}
            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              {commerce.pathway.map((part, i) => (
                <li key={part.title} className="flex flex-1 items-stretch gap-3">
                  <div className="h-full flex-1 rounded-2xl bg-[#e2f1ed] p-5 text-center">
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#d0e8e2] text-com">
                      <Icon name={pathwayIcons[i]} className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] leading-tight font-bold text-navy">
                      {part.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-snug text-body">{part.body}</p>
                  </div>
                  {i < commerce.pathway.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 self-center text-lg font-bold text-com/60 sm:block"
                    >
                      +
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* Kept short and visually light, as asked. */}
            <p className="mt-6 text-[0.8125rem] text-muted">{commerce.shortNote}</p>
          </div>
        </div>

        {/* 5. Career possibilities - directions, never promised outcomes. */}
        <div className="mt-14 rounded-card bg-[#eef3fa] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-4">
              <h3 className="text-[1.375rem] font-extrabold text-navy sm:text-[1.6rem]">
                {commerce.careersHeadline}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                {commerce.careersBody} {commerce.careersCaveat}
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 lg:col-span-8 lg:grid-cols-7 lg:gap-y-0">
              {commerce.careers.map((career, i) => (
                <li
                  key={career}
                  className={`text-center ${i > 0 ? "lg:border-l lg:border-navy/10" : ""}`}
                >
                  <span className="mx-auto grid h-9 w-9 place-items-center text-com">
                    <Icon name={careerIcons[career]} className="h-[1.3rem] w-[1.3rem]" />
                  </span>
                  <p className="mx-auto mt-2.5 max-w-[10ch] text-[0.8125rem] leading-snug font-medium text-navy">
                    {career}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. CTAs - Explore serves visitors who need more information first;
            Talk to a Career Advisor opens the enquiry route for high-intent
            users. Nobody is asked to fill in a form immediately. */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={commerce.primaryCta.href} variant="vertical" tone="commerce" size="lg">
            {commerce.primaryCta.label}
          </Button>
          <Button
            href={commerce.secondaryCta.href}
            variant="outlineTone"
            tone="commerce"
            size="lg"
          >
            {commerce.secondaryCta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
