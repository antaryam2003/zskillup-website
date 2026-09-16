import Image from "next/image";
import { asset } from "@/lib/asset";
import { about } from "@/content/homepage";
import { media } from "@/content/media";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 02 - ABOUT ZSKILLUP
 *
 * Per the updated design: Mission / Vision / Values sit inside ONE white card
 * divided by hairlines, each with a circular lavender icon well - not three
 * separate tinted cards. Values reads as an inline, bullet-separated list.
 *
 * Leadership portraits are large and portrait-shaped at the top of each card,
 * with the name, role, bio and social links beneath.
 *
 * The comp's Impact strip (10K+ / 50+ / 500+ / 90%+) stays REMOVED - corporate
 * credibility statistics belong only in the Partners section.
 */

const pillarIcons: IconName[] = ["graduation", "target", "users"];

export function About() {
  return (
    <Section id="about" tone="white" labelledBy="about-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow tone="brand" rule="after">
              {about.eyebrow}
            </Eyebrow>
            <Heading
              id="about-heading"
              plain={about.headline.plain}
              accent={about.headline.gradient}
              accentTone="gradient"
              className="mt-5"
            />
            <Lede className="mt-6 max-w-[52ch]">{about.body}</Lede>
            <div className="mt-8">
              <Button href={about.cta.href} variant="brand" size="lg">
                {about.cta.label}
              </Button>
            </div>
          </div>

          {/* One card, three columns divided by hairlines. */}
          <div className="lg:col-span-7">
            <div className="rounded-card border border-line bg-white p-7 shadow-card sm:p-9">
              <Eyebrow tone="brand">{about.drivesEyebrow}</Eyebrow>
              <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-0">
                {about.pillars.map((pillar, i) => (
                  <li
                    key={pillar.title}
                    className={i > 0 ? "sm:border-l sm:border-line sm:pl-7" : "sm:pr-7"}
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
                      <Icon name={pillarIcons[i]} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-[1.0625rem] font-bold text-navy">{pillar.title}</h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-body">
                      {pillar.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Leadership ---------------------------------------------------- */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Eyebrow tone="brand">{about.leadershipEyebrow}</Eyebrow>
            <Heading
              plain={about.leadershipHeadline.plain}
              accent={about.leadershipHeadline.gradient}
              accentTone="brand"
              className="mt-5"
            />
            <p className="mt-5 max-w-[40ch] leading-relaxed text-body">{about.leadershipBody}</p>

            <div className="mt-9 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon name="chevronLeft" className="h-4 w-4" />
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon name="chevronRight" className="h-4 w-4" />
              </span>
            </div>
          </div>

          <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {about.leadership.map((person) => {
              const photo = media.team[person.slug as keyof typeof media.team];
              return (
                <li
                  key={person.slug}
                  className="flex flex-col rounded-card border border-line bg-white p-5 shadow-card"
                >
                  {/* Founder photographs stay natural and prominent. */}
                  <Image
                    src={asset(photo.src)}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(min-width: 1024px) 260px, 45vw"
                    className="aspect-[4/5] w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-5 text-[1.125rem] font-extrabold text-navy">{person.name}</h3>
                  <p className="mt-0.5 text-[0.9375rem] font-semibold text-brand">{person.role}</p>
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-body">
                    {person.bio}
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${person.name} on LinkedIn`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-navy transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      <Icon name="linkedin" className="h-4 w-4" />
                    </a>
                    <span
                      aria-hidden="true"
                      title="X profile to be added"
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-navy/35"
                    >
                      <Icon name="xTwitter" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
