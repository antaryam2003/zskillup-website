import Image from "next/image";
import { asset } from "@/lib/asset";
import { leadership } from "@/content/homepage";
import { media } from "@/content/media";
import { Icon } from "@/components/ui/Icon";

/**
 * 02 - OUR LEADERSHIP
 *
 * One two-area composition: a brand/purpose panel on the left (about a third of
 * the row), and on the right the "Our leadership" label with the three cards.
 * This replaces the old "About ZSkillup" section, whose mission line now lives in
 * the purpose panel.
 *
 * Breakpoints:
 *   xl (1280+)  panel left, label + three cards right
 *   md-xl       panel on top (headline | mission side by side), three cards below;
 *               capped at 54rem so the ~208px portraits are not stretched past ~1.2x
 *   sm          panel stacked, cards one per row with the portrait alongside
 *   < sm        everything stacked, cards one per row with the portrait on top
 *
 * The two-area layout waits for xl on purpose: at 1024px the right area is only
 * ~600px, which leaves ~150px of text per card - far too tight for the bios.
 *
 * `id="about"` is kept on the section so the existing "About" nav, footer and
 * search links (all "/#about") still land somewhere sensible.
 *
 * Portraits are the square crops from scripts/crop-leadership-portraits.py, shown
 * at roughly their native 208px so they stay crisp.
 */

const cardShadow =
  "shadow-[0_1px_2px_rgb(30_20_80/0.04),0_14px_34px_-20px_rgb(60_40_140/0.22)]";
const cardShadowHover =
  "hover:shadow-[0_2px_6px_rgb(30_20_80/0.05),0_24px_46px_-20px_rgb(91_43_203/0.32)]";

/** Filled LinkedIn mark - the design uses the solid glyph, not the outlined one in Icon. */
function LinkedInMark({ className = "h-[1.05rem] w-[1.05rem]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Leadership() {
  const { headline, mission } = leadership;

  return (
    <section
      id="about"
      aria-labelledby="leadership-heading"
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(to_bottom,#ffffff_0%,#f7f5fd_20%,#f7f5fd_80%,#ffffff_100%)] pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      {/* Decorative organic shapes - purely tonal, no new colours. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[24%] top-[4%] h-[92%] w-[62%] rounded-[46%] bg-white/70 blur-[1px]" />
        <div className="absolute -left-[6%] top-[-14%] hidden h-[74%] w-[56%] rounded-full border border-[#ebe7f8]/80 xl:block" />
        <div className="absolute -right-[12%] bottom-[6%] h-[70%] w-[44%] rounded-full bg-[radial-gradient(closest-side,rgb(91_43_203/0.055),transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="mx-auto grid gap-12 md:max-w-[54rem] xl:max-w-none xl:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] xl:gap-x-14">
          {/* --- Left: brand / purpose panel ---------------------------------- */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:items-start md:gap-x-10 xl:flex xl:flex-col">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.22em] text-muted sm:text-[0.8125rem] md:col-span-2 xl:col-auto">
              {leadership.eyebrow.map((word, i) => (
                <span key={word}>
                  {i > 0 ? (
                    <span aria-hidden="true" className="mx-2.5 text-[1.05em] text-faint sm:mx-3.5">
                      ×
                    </span>
                  ) : null}
                  {word}
                </span>
              ))}
            </p>

            <h2
              id="leadership-heading"
              className="mt-7 text-[clamp(2.125rem,9.4vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-navy md:mt-9 md:text-[clamp(2.25rem,4.6vw,3.25rem)] xl:mt-10 xl:text-[clamp(2.25rem,3.9vw-0.25rem,3.3rem)]"
            >
              <span className="block">{headline.lead}</span>
              <span className="text-gradient-lines block whitespace-nowrap">{headline.accent}</span>
              <span className="block">{headline.tail}</span>
            </h2>

            <div className="mt-10 flex flex-col md:mt-9 xl:mt-11 xl:flex-1">
              <div className="flex items-center gap-5 sm:gap-6">
                <span className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-full bg-[#ece7fb] text-brand shadow-[inset_0_0_0_1px_rgb(91_43_203/0.08),0_10px_24px_-14px_rgb(91_43_203/0.35)] sm:h-24 sm:w-24">
                  <Icon name="graduation" className="h-8 w-8 sm:h-10 sm:w-10" />
                </span>
                <div>
                  <h3 className="text-[1.375rem] font-bold leading-tight tracking-[-0.02em] text-navy sm:text-[1.5rem]">
                    {mission.title}
                  </h3>
                  <p className="mt-1.5 text-[1.0625rem] font-medium leading-[1.5] text-muted sm:text-[1.1875rem]">
                    {mission.lines.map((line, i) => (
                      <span key={line}>
                        {line}{" "}
                        {i < mission.lines.length - 1 ? <br className="hidden sm:inline md:hidden lg:inline" /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <span aria-hidden="true" className="mt-9 block h-px w-24 bg-[#c7cbdd] xl:mt-10" />

              <p className="handwritten mt-7 -rotate-[3deg] origin-left text-[2rem] leading-[1.2] text-muted sm:text-[2.25rem] xl:mt-auto xl:pt-8">
                {leadership.tagline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* --- Right: label + three leadership cards ------------------------- */}
          <div className="min-w-0">
            <div className="flex items-center gap-3.5 xl:pt-0.5">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-[#b7bcd1]" />
              <p
                id="leadership-label"
                className="text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-muted"
              >
                {leadership.label}
              </p>
            </div>

            <ul
              aria-labelledby="leadership-label"
              className="mt-6 grid gap-4 md:grid-cols-3 xl:mt-8"
            >
              {leadership.people.map((person) => {
                const photo = media.team[person.slug as keyof typeof media.team];
                return (
                  <li
                    key={person.slug}
                    className={`group flex flex-col rounded-card border border-[#ebe8f7] bg-white p-4 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#ded7f6] focus-within:-translate-y-1 focus-within:border-[#ded7f6] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 sm:p-[1.125rem] sm:max-md:grid sm:max-md:grid-cols-[13rem_minmax(0,1fr)] sm:max-md:gap-x-6 ${cardShadow} ${cardShadowHover}`}
                  >
                    <div className="aspect-square overflow-hidden rounded-[0.875rem] bg-[#eeebfa] sm:max-md:self-start">
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, (min-width: 640px) 208px, 90vw"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>

                    <div className="flex flex-1 flex-col pt-5 sm:max-md:pt-1">
                      <h3 className="text-[1.125rem] font-bold leading-tight tracking-[-0.015em] text-navy">
                        {person.name}
                      </h3>
                      <p className="mt-1 text-[0.9375rem] font-semibold text-brand">{person.role}</p>
                      <p className="mt-3.5 text-[0.875rem] leading-[1.65] text-body">{person.bio}</p>
                      <div className="mt-auto pt-5">
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${person.name} on LinkedIn`}
                          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy transition-colors duration-200 hover:border-brand/40 hover:text-brand"
                        >
                          <LinkedInMark />
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
