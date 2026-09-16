import { finalCta } from "@/content/homepage";
import { contact } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Heading, Lede, Section } from "@/components/ui/Section";
import { EnquiryForm } from "./EnquiryForm";

/**
 * 12 - FINAL CTA
 *
 * The conversion step that closes the page's narrative:
 * Brand -> Choice -> Offerings -> Philosophy -> Proof -> People -> Activity ->
 * Questions -> CONVERSION.
 *
 * Every conversion CTA on the homepage points here, and the "I am enquiring as"
 * control routes the enquiry - so a B2B institution lead and a B2C student share
 * one destination without sharing one generic form.
 */
export function FinalCta() {
  return (
    <Section id="partner-with-us" tone="white" labelledBy="final-cta-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow tone="brand">{finalCta.eyebrow}</Eyebrow>
            <Heading
              id="final-cta-heading"
              plain={finalCta.headline.plain}
              accent={finalCta.headline.gradient}
              className="mt-5"
            />
            <Lede className="mt-6 max-w-[44ch]">{finalCta.body}</Lede>

            <ul className="mt-9 space-y-4">
              <li>
                <a
                  href={contact.phoneHref}
                  className="group flex items-center gap-4 text-[0.9375rem] text-body transition-colors hover:text-navy"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cloud text-brand">
                    <Icon name="phone" className="h-[1.05rem] w-[1.05rem]" />
                  </span>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 text-[0.9375rem] text-body transition-colors hover:text-navy"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cloud text-brand">
                    <Icon name="mail" className="h-[1.05rem] w-[1.05rem]" />
                  </span>
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-4 text-[0.9375rem] text-body">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cloud text-brand">
                  <Icon name="pin" className="h-[1.05rem] w-[1.05rem]" />
                </span>
                <span className="pt-2.5">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
