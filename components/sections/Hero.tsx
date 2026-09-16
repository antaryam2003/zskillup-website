import Image from "next/image";
import { asset } from "@/lib/asset";
import { hero, heroCards, type Vertical } from "@/content/homepage";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Button } from "@/components/ui/Button";
import { PrephaszWordmark } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, verticalStyles } from "@/components/ui/Section";
import { Handwritten } from "@/components/ui/Stats";
import { VideoDialog } from "@/components/ui/VideoDialog";

/**
 * 01 - HERO (Design 13 base)
 *
 * Preserved from the approved comp: campus image, student visual, composition,
 * gradient treatment on the second half of the headline, and the three-card
 * structure. Cleaner and less cluttered, as asked.
 *
 * Removed per the brief:
 *   - "Programs" from the navigation (see SiteHeader).
 *   - Two of the three handwritten notes ("A Ready for Tomorrow You" and
 *     "Same Students. Bigger Tomorrows."). The freed space stays EMPTY - the
 *     brief explicitly says not to fill it.
 *   - Any statistics strip. Corporate numbers live in Partners only.
 *
 * The CTA reads "Explore What We Offer" rather than "Explore Our Programs",
 * because "Programs" is no longer part of the site architecture. It scrolls
 * straight to Choose Your Route.
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
      /* Pulled up under the sticky header so the campus image runs edge to edge
         behind the navigation, exactly as in the comp. */
      className="relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem]"
    >
      {/* The campus photograph, top-anchored.
          It is a wide band (about 3.2:1) because that is the shape of the comp's
          own photo area, so it is given a fixed height and allowed to crop
          horizontally rather than being stretched to fill the taller hero - which
          would zoom straight past the comp's composition.

          LCP image: `priority`, never lazy-loaded, with width/height declared so
          the browser reserves the space before it arrives. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-20 h-[26rem] sm:h-[34rem] lg:h-[40rem]">
        <Image
          src={asset(media.hero.src)}
          alt={media.hero.alt}
          width={media.hero.width}
          height={media.hero.height}
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
        {/* Melts the photo's lower edge into the page so there is no hard cut
            where the three cards begin. */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,#ffffff_0%,rgba(255,255,255,0.86)_35%,rgba(255,255,255,0)_100%)]" />
      </div>

      {/* The file already carries the comp's own white wash on the left. This only
          tops it up for headline legibility - it must not flatten the campus
          photograph on the right. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[linear-gradient(100deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.42)_32%,rgba(255,255,255,0)_58%)] sm:h-[34rem] lg:h-[40rem]"
      />

      <Container>
        <div className="grid items-start gap-6 pt-14 sm:pt-16 lg:grid-cols-12 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="eyebrow text-navy/55">{hero.eyebrow}</p>

            {/* The gradient half sits on its own line, as in the comp. Both
                halves stay inside one <h1> so the sentence reads as a unit. */}
            <h1
              id="hero-heading"
              className="mt-5 max-w-[15ch] text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-balance sm:text-[3.4rem] lg:text-[4rem]"
            >
              <span className="block">{hero.headline.plain}</span>
              <span className="text-gradient no-hyphen-break mt-1 block w-fit">
                {hero.headline.gradient}
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-lg text-body">{hero.supporting}</p>

            <div className="mt-8">
              <Button href={hero.cta.href} variant="primary">
                {hero.cta.label}
              </Button>
            </div>
          </div>

          {/* Handwritten accent 1 of 3 on the whole homepage. Positioned in the
              open sky to the LEFT of the student, as in the comp - not over her.
              Nothing else goes in this column; the photograph is meant to breathe. */}
          <div className="hidden lg:col-span-5 lg:block">
            <Handwritten className="mt-7 -ml-24 w-[9rem] rotate-[-4deg] text-[1.6rem] xl:-ml-16" underline>
              {hero.handwritten}
            </Handwritten>
          </div>
        </div>

        {/* Three pathway cards. On mobile these stack BELOW the headline and
            primary CTA, preserving the brief's content hierarchy. */}
        <ul className="mt-14 grid gap-5 pb-8 sm:mt-20 lg:grid-cols-3">
          {heroCards.map((card) => (
            <li key={card.eyebrow}>
              <HeroCard card={card} />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 pb-12">
          <p className="eyebrow text-navy/45">{hero.footNote}</p>
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

function HeroCard({ card }: { card: (typeof heroCards)[number] }) {
  const style = verticalStyles[card.vertical];
  const video = videos[card.vertical];

  return (
    <article
      className={`flex h-full flex-col rounded-card border ${style.border} ${style.tint} p-6 shadow-card`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white ${style.text} shadow-card`}
        >
          <Icon name={cardIcon[card.vertical]} className="h-[1.35rem] w-[1.35rem]" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[1.0625rem] leading-snug font-bold text-navy">{card.eyebrow}</h2>
          {/* Prephasz keeps its own wordmark, and B.Com + ACCA is named outright -
              "For Commerce Careers" alone would not tell a new visitor what the
              offering actually is. */}
          {card.brand === "Prephasz" ? (
            <PrephaszWordmark className="mt-2 text-xl" />
          ) : card.brand ? (
            <p className={`mt-1.5 text-[0.9375rem] font-bold ${style.text}`}>{card.brand}</p>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-[0.9375rem] leading-relaxed text-body">{card.description}</p>

      {/* CTA hierarchy: filled button, then text link, then the lightest video
          action. All three journeys stay available without the card feeling
          overloaded.

          The rows are fixed rather than wrapped so all three cards break at the
          same place regardless of label length. */}
      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button href={card.primary.href} variant="primary" size="sm">
            {card.primary.label}
          </Button>
          <Button href={card.secondary.href} variant="link">
            {card.secondary.label}
          </Button>
        </div>
        <div className="mt-4">
          <VideoDialog video={video} label={card.video.label} />
        </div>
      </div>
    </article>
  );
}
