import Image from "next/image";
import { asset } from "@/lib/asset";
import { hero, heroCards, type Vertical } from "@/content/homepage";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, verticalStyles } from "@/components/ui/Section";
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
      className="relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem]"
    >
      {/* The photograph is a wide band, so it is given a fixed height and allowed
          to crop horizontally rather than being stretched to fill the taller
          hero - which would zoom straight past the design's composition.

          LCP image: `priority`, never lazy-loaded, dimensions declared. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[24rem] sm:h-[30rem] lg:h-[35rem]"
      >
        <Image
          src={asset(media.hero.src)}
          alt={media.hero.alt}
          width={media.hero.width}
          height={media.hero.height}
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
        {/* Melts the photograph's lower edge into the page so the cards do not
            sit against a hard cut. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,#ffffff_0%,rgba(255,255,255,0.82)_45%,rgba(255,255,255,0)_100%)]" />
      </div>

      {/* The file already carries the design's own white wash on the left; this
          only tops it up for headline legibility. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-[linear-gradient(100deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.38)_30%,rgba(255,255,255,0)_55%)] sm:h-[30rem] lg:h-[35rem]"
      />

      <Container>
        <div className="grid items-start gap-6 pt-12 sm:pt-14 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="eyebrow text-navy/55">{hero.eyebrow}</p>

            {/* Both halves stay inside one <h1> so the sentence reads as a unit.
                The gradient half sweeps on every line, not once across the block. */}
            <h1
              id="hero-heading"
              className="mt-5 max-w-[15ch] text-[2.4rem] leading-[1.06] font-extrabold tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]"
            >
              <span className="block">{hero.headline.plain}</span>
              <span className="text-gradient-lines no-hyphen-break mt-1 block">
                {hero.headline.gradient}
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[1.0625rem] text-body sm:text-lg">
              {hero.supporting}
            </p>

            <div className="mt-8">
              <Button href={hero.cta.href} variant="primary" size="lg">
                {hero.cta.label}
              </Button>
            </div>
          </div>

          {/* The circled handwritten note, in the open sky beside the headline. */}
          <div className="hidden lg:col-span-5 lg:block">
            <CircledNote>{hero.handwritten}</CircledNote>
          </div>
        </div>

        {/* Three pathway cards, overlapping the photograph's lower edge. They run
            wider than the body container, as the design shows, which is also what
            keeps all three CTAs on one row. On mobile they stack BELOW the
            headline and primary CTA. */}
        <ul className="mt-12 grid gap-5 sm:mt-16 lg:mx-[-4rem] lg:grid-cols-3 xl:mx-[-5.5rem]">
          {heroCards.map((card) => (
            <li key={card.eyebrow}>
              <HeroCard card={card} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-between gap-4 pb-4">
          <p className="eyebrow flex items-center gap-4 text-navy/45">
            {hero.footNote}
            <span aria-hidden="true" className="hidden h-px w-16 bg-navy/20 sm:block" />
          </p>
          <a
            href={hero.cta.href}
            className="hidden items-center gap-3 text-xs font-semibold tracking-[0.16em] text-navy/45 uppercase transition-colors hover:text-navy sm:flex"
          >
            Scroll
            <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/15">
              <Icon name="arrowDown" className="h-4 w-4" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}

/** Hand-drawn ellipse with an underline swoosh, as in the design. */
function CircledNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative mt-4 -ml-28 inline-block px-7 py-5 xl:-ml-20">
      <svg
        viewBox="0 0 200 130"
        className="absolute inset-0 h-full w-full text-navy/70"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="100"
          cy="60"
          rx="93"
          ry="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M46 108c30 12 78 11 112-6"
          fill="none"
          stroke="#5B2BCB"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="handwritten relative block w-[8.5rem] text-center text-[1.45rem] text-navy">
        {children}
      </span>
    </span>
  );
}

function HeroCard({ card }: { card: (typeof heroCards)[number] }) {
  const style = verticalStyles[card.vertical];
  const video = videos[card.vertical];

  return (
    <article
      className={`flex h-full flex-col rounded-card border ${style.border} ${style.tint} p-5 shadow-card sm:p-6`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${style.icon}`}>
          <Icon name={cardIcon[card.vertical]} className="h-[1.3rem] w-[1.3rem]" />
        </span>

        <div className="min-w-0">
          {/* The offering is named inline, in a tinted pill - "For Commerce
              Careers" alone would not tell a new visitor what is on offer. */}
          <h2 className="text-[1.0625rem] leading-snug font-bold text-navy">
            {card.eyebrow}
            {card.brandLabel ? (
              <>
                {" – "}
                <span className={`inline-block rounded-md ${style.band} px-1.5 py-0.5 ${style.text}`}>
                  {card.brandLabel}
                </span>
              </>
            ) : null}
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{card.description}</p>
        </div>
      </div>

      {/* CTA hierarchy: filled button, then text link, then the lightest video
          action. All three journeys stay available without the card feeling
          overloaded. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-2.5 pt-6">
        <Button href={card.primary.href} variant="primary" size="sm">
          {card.primary.label}
        </Button>
        <Button href={card.secondary.href} variant="link">
          {card.secondary.label}
        </Button>
        <VideoDialog video={video} label={card.video.label} variant="pill" />
      </div>
    </article>
  );
}
