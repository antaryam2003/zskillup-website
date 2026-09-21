import Image from "next/image";
import { asset } from "@/lib/asset";
import { commerce } from "@/content/homepage";
import { media } from "@/content/media";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Lede, Section } from "@/components/ui/Section";

/**
 * 06 - A ZSKILLUP CAREER PATHWAY (B.Com + Global Finance & AI)
 *
 * Commerce owns the green family across the whole site, so the highlighted words,
 * icons, blocks and primary CTA all use it here - as accents on a pale mint
 * field, with navy typography throughout.
 *
 * Kept: the student photograph, exactly one handwritten note, and the career
 * pathways block - which answers "what can I become after doing this?"
 *
 * The book spines are live text laid over the photograph, not part of it. The
 * photo has its old labels erased (scripts/clean-commerce-student.mjs); the
 * labels are positioned in the image's own coordinate space and sized in
 * container-query units, so they stay locked to the books at every width.
 *
 * Source order gives the mobile sequence: headline -> student image -> short
 * proposition -> three-part pathway -> industry note -> career possibilities ->
 * CTAs.
 */

const pathwayIcons: IconName[] = ["graduation", "sparkle", "briefcase"];

/**
 * Where each spine label sits on the source photo (609 x 750), as percentages:
 * the left edge of the lettering and the vertical centre of the capitals. The
 * books step slightly left as the stack goes down, so the labels do too.
 */
const spinePositions = [
  { left: 59.0, top: 74.6 },
  { left: 57.8, top: 79.5 },
  { left: 56.9, top: 84.3 },
] as const;

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
        <div className="grid gap-10 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-8 lg:gap-x-10 lg:gap-y-10">
          {/* 1. Headline */}
          <div className="[container-type:inline-size] md:col-span-12 md:row-start-1 lg:col-span-7 lg:col-start-1">
            <Eyebrow tone="gold">{commerce.eyebrow}</Eyebrow>
            {/* Two deliberate lines. On desktop the size is tied to the column
                width (cqw) so the longer second line always fits on one line. */}
            <h2
              id="commerce-heading"
              className="mt-5 text-[2rem] leading-[1.1] font-extrabold sm:text-[2.6rem] lg:text-[5.6cqw]"
            >
              <span className="block">{commerce.headline.line1}</span>
              <span className="block">
                {commerce.headline.line2Plain}{" "}
                <span className="text-com">{commerce.headline.line2Accent}</span>
              </span>
            </h2>
          </div>

          {/* 2. Student image - clean and natural, no floating elements. */}
          <div className="md:col-span-5 md:col-start-8 md:row-start-2 lg:row-span-2 lg:row-start-1">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-6 -left-8 hidden h-40 w-40 rounded-full bg-[#dceee9] lg:block"
              />
              {/* The wrapper takes the photo's exact aspect ratio, so the spine
                  labels below map onto it without any cropping drift. */}
              <div className="relative aspect-[609/750] w-full [container-type:inline-size]">
                <Image
                  src={asset(media.commerceStudent.src)}
                  alt={media.commerceStudent.alt}
                  width={media.commerceStudent.width}
                  height={media.commerceStudent.height}
                  loading="lazy"
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="absolute inset-0 h-full w-full rounded-[2.5rem] rounded-tl-[5rem] object-cover"
                />
                {/* Stacked-book spines, top to bottom. */}
                <ul className="m-0 list-none p-0">
                  {commerce.bookSpines.map((label, i) => (
                    <li
                      key={label}
                      className="absolute -translate-y-1/2 text-[3.8cqw] leading-none font-medium tracking-[-0.01em] whitespace-nowrap text-[#1a1f2b]"
                      style={{ left: `${spinePositions[i].left}%`, top: `${spinePositions[i].top}%` }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
                {/* Handwritten accent 2 of 2 on the homepage. Sized and placed in the
                    photo's own units so it scales down with the image instead of
                    running into her face on narrower layouts. */}
                <span className="handwritten absolute top-[7.5cqw] left-[5.6cqw] w-min rotate-[-7deg] text-[max(1rem,5.4cqw)] text-com">
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
          </div>

          {/* 3. Proposition, 4. pathway */}
          <div className="md:col-span-7 md:col-start-1 md:row-start-2">
            <Lede className="max-w-[60ch]">{commerce.supporting}</Lede>

            {/* Three connected blocks reading as ONE integrated pathway - one
                colour family, joined by "+" rather than separate products. */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-8 md:grid-cols-1 md:gap-3 lg:grid-cols-3 lg:gap-8">
              {commerce.pathway.map((part, i) => (
                <li key={part.title} className="relative">
                  {/* Tablet only: the column is too narrow for three cards side by
                      side, so each becomes a compact icon-left row. */}
                  <div className="h-full rounded-2xl bg-[#e2f1ed] p-5 text-center sm:p-6 md:flex md:items-center md:gap-4 md:p-4 md:text-left lg:block lg:p-6 lg:text-center">
                    <span className="mx-auto grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#d0e8e2] text-com md:mx-0 lg:mx-auto">
                      <Icon name={pathwayIcons[i]} className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <div className="mt-4 md:mt-0 lg:mt-4">
                      <h3 className="text-[0.9375rem] leading-tight font-bold text-navy">
                        {part.title}
                      </h3>
                      <p className="mt-2 text-[0.8125rem] leading-snug text-body md:mt-1 lg:mt-2">
                        {part.body}
                      </p>
                    </div>
                  </div>
                  {i < commerce.pathway.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-full hidden w-8 -translate-y-1/2 text-center text-lg font-bold text-com/60 sm:block md:hidden lg:block"
                    >
                      +
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* Industry Exposure: a secondary note, deliberately smaller than the
                three blocks above it. */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-com/15 bg-white/60 px-4 py-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#d0e8e2] text-com">
                <Icon name="building" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-[0.8125rem] leading-tight font-bold text-navy">
                  {commerce.industryExposure.title}
                </h3>
                <p className="mt-0.5 text-[0.75rem] leading-snug text-body">
                  {commerce.industryExposure.body}
                </p>
              </div>
            </div>

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
