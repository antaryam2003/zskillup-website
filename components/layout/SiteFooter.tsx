import Link from "next/link";
import { contact, footerColumns, site, social } from "@/content/site";
import { ZSkillupLogo } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

/**
 * 12 - Footer.
 *
 * Navy closes the page, matching the master brand. The purple-to-coral gradient
 * appears only as a single hairline rule at the top - the brief's "selective
 * master-brand signature", not a fill.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div aria-hidden="true" className="h-1 bg-gradient-brand" />
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Link href="/" aria-label="ZSkillup home">
              <ZSkillupLogo tone="light" />
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
              {site.description}
            </p>

            <address className="mt-7 space-y-3 text-[0.9375rem] not-italic text-white/65">
              <a
                href={contact.phoneHref}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Icon name="phone" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-white/40" />
                {contact.email}
              </a>
              <p className="flex gap-3">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="text-sm font-bold tracking-[0.12em] text-white uppercase">
                  {col.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/50">
            {/* legalName already ends in "Ltd." - don't add a second full stop. */}
            &copy; {year} {site.legalName} All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
