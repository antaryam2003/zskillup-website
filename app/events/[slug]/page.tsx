import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { featuredEvents, galleryPhotos, badgeColors, badgeLabels } from "@/content/events";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";

const allEvents = [...featuredEvents, ...galleryPhotos];

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allEvents.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = allEvents.find((e) => e.slug === slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.caption,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = allEvents.find((e) => e.slug === slug);
  if (!event) notFound();

  const badgeColor = badgeColors[event.category] ?? "bg-brand-soft text-brand";
  const badgeLabel = badgeLabels[event.category] ?? event.category;

  return (
    <>
      {/* Hero image */}
      <Section tone="white" className="!py-0 !scroll-mt-0">
        <div className="p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-2xl" style={{minHeight: "calc(100dvh - 240px)"}}>
          <Image
            src={asset(event.src)}
            alt={event.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
          {/* Back link */}
          <div className="absolute left-0 top-0 p-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[0.875rem] font-semibold text-white backdrop-blur-sm ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              All Events
            </Link>
          </div>
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:px-12">
            <span className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${badgeColor}`}>
              {badgeLabel}
            </span>
            <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2.5rem]">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.9375rem] text-white/80">
              {event.date && (
                <span className="flex items-center gap-2">
                  <Icon name="calendar" className="h-4 w-4 shrink-0" />
                  {event.date}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-2">
                  <Icon name="pin" className="h-4 w-4 shrink-0" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
        </div>
      </Section>

      {/* Articles + images */}
      <Section tone="white">
        <Container>
          {/* Intro caption */}
          <p className="mx-auto max-w-2xl text-center text-[1.0625rem] leading-relaxed text-body">
            {event.caption}
          </p>

          {/* Article blocks — alternating image side */}
          {event.articles && event.articles.length > 0 && (
            <div className="mt-14 space-y-16">
              {event.articles.map((article, i) => (
                <div
                  key={article.heading}
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14 ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text */}
                  <div className="flex-1">
                    <h2 className="text-[1.375rem] font-extrabold leading-snug text-navy sm:text-[1.625rem]">
                      {article.heading}
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-body">{article.body}</p>
                  </div>
                  {/* Image */}
                  {article.image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:w-[45%] lg:flex-none">
                      <Image
                        src={asset(article.image)}
                        alt={article.imageAlt ?? ""}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photo gallery */}
          {event.photos && event.photos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-[1.125rem] font-extrabold text-navy">More from this event</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {event.photos.map((src, i) => (
                  <div
                    key={src + i}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={asset(src)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
                >
                  Load More Images
                  <Icon name="arrowDown" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
