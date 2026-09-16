import Image from "next/image";
import { asset } from "@/lib/asset";
import { about } from "@/content/homepage";
import { media } from "@/content/media";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";

/**
 * 02 - ABOUT ZSKILLUP (Design 4 layout, Design 1 palette)
 *
 * The brief's correction to the comp: keep Design 4's information architecture
 * but shift the background to clean white / very light neutral, and use the
 * purple-to-coral gradient only as an accent - headings, icons, small lines,
 * highlighted words. No large lavender blocks, and leadership cards must be
 * white/neutral rather than purple-tinted.
 *
 * Mission/Vision/Values sit in "extremely subtle tinted cards rather than one
 * large purple box".
 *
 * The comp's Impact strip (10K+ / 50+ / 500+ / 90%+) is REMOVED. Corporate
 * credibility statistics belong only in the Partners section.
 */

const pillarIcons: IconName[] = ["graduation", "target", "users"];

export function About() {
  return (
    <Section id="about" tone="white" labelledBy="about-heading">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow tone="brand">{about.eyebrow}</Eyebrow>
            <Heading
              id="about-heading"
              plain={about.headline.plain}
              accent={about.headline.gradient}
              className="mt-5"
            />
            <Lede className="mt-6 max-w-[48ch]">{about.body}</Lede>
            <div className="mt-8">
              <Button href={about.cta.href} variant="outline">
                {about.cta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>{about.drivesEyebrow}</Eyebrow>
            <ul className="mt-7 grid gap-4 sm:grid-cols-3">
              {about.pillars.map((pillar, i) => (
                <li
                  key={pillar.title}
                  className="rounded-card border border-line bg-cloud p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand shadow-card">
                    <Icon name={pillarIcons[i]} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-navy">{pillar.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                    {pillar.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Leadership ---------------------------------------------------- */}
        <div className="mt-20 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow tone="brand">{about.leadershipEyebrow}</Eyebrow>
            <Heading
              plain={about.leadershipHeadline.plain}
              accent={about.leadershipHeadline.gradient}
              className="mt-5 text-[1.75rem] sm:text-[2.25rem] lg:text-[2.5rem]"
            />
            <p className="mt-5 max-w-[42ch] leading-relaxed text-body">
              {about.leadershipBody}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {about.leadership.map((person) => {
              const photo = media.team[person.slug as keyof typeof media.team];
              return (
                <li
                  key={person.slug}
                  className="flex flex-col rounded-card border border-line bg-white p-6 shadow-card"
                >
                  {/* Founder photographs stay natural and prominent. */}
                  <Image
                    src={asset(photo.src)}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(min-width: 1024px) 120px, 30vw"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <h3 className="mt-5 text-base font-bold text-navy">{person.name}</h3>
                  <p className="text-sm font-semibold text-brand">{person.role}</p>
                  <span aria-hidden="true" className="mt-4 block h-px w-10 bg-line" />
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-body">
                    {person.bio}
                  </p>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${person.name} on LinkedIn`}
                    className="mt-5 grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Icon name="linkedin" className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
