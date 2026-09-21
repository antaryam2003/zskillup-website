import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogPosts, categoryColors } from "@/content/blog";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const pillStyle = categoryColors[post.category] ?? "bg-brand-soft text-brand";

  /* Related posts — same category, exclude current */
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Section tone="white" className="!py-0 !scroll-mt-0">
        <div className="p-4 sm:p-5">
          <div
            className="relative overflow-hidden rounded-2xl bg-navy"
            style={{ minHeight: "calc(100dvh - 240px)" }}
          >
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />

            {/* Back link */}
            <div className="absolute left-0 top-0 p-6">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[0.875rem] font-semibold text-white backdrop-blur-sm ring-1 ring-white/25 transition-colors hover:bg-white/25"
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
                All Insights
              </Link>
            </div>

            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:px-12">
              <span className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${pillStyle}`}>
                {post.categoryLabel}
              </span>
              <h1 className="mt-3 max-w-3xl text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2.5rem]">
                {post.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.9375rem] text-white/75">
                <span className="flex items-center gap-2">
                  <Icon name="users" className="h-4 w-4 shrink-0" />
                  {post.author.name}
                </span>
                <span>{formatDate(post.date)}</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Article body */}
      <Section tone="white">
        <Container>
          {/* Intro excerpt */}
          <p className="mx-auto max-w-2xl text-center text-[1.0625rem] leading-relaxed text-body">
            {post.excerpt}
          </p>

          {/* Content sections — alternating layout like events page */}
          {post.sections && post.sections.length > 0 && (
            <div className="mt-14 space-y-16">
              {post.sections.map((section, i) => (
                <div
                  key={section.heading}
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14 ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text */}
                  <div className="flex-1">
                    <h2 className="text-[1.375rem] font-extrabold leading-snug text-navy sm:text-[1.625rem]">
                      {section.heading}
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-body">{section.body}</p>
                  </div>
                  {/* Image */}
                  {section.image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:w-[45%] lg:flex-none">
                      <Image
                        src={section.image}
                        alt={section.imageAlt ?? ""}
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

          {/* Back CTA */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3 text-[0.9375rem] font-semibold text-navy transition-colors hover:border-navy/40"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              Back to All Insights
            </Link>
          </div>
        </Container>
      </Section>

      {/* Related posts */}
      {related.length > 0 && (
        <Section tone="cloud">
          <Container>
            <h2 className="text-[1.125rem] font-extrabold text-navy">More in {post.categoryLabel}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/insights/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-[#eef0fc]">
                    {p.coverImage && (
                      <Image
                        src={p.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="text-[1rem] font-bold leading-[1.3] text-navy transition-colors group-hover:text-brand">
                      {p.title}
                    </h3>
                    <p className="text-[0.8125rem] leading-relaxed text-body line-clamp-2">{p.excerpt}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[0.75rem] text-muted">
                        {formatDate(p.date)} · {p.readTime} min read
                      </p>
                      <span className="text-[0.8125rem] font-semibold text-brand transition-colors group-hover:text-brand-deep">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
