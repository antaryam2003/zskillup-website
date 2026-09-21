"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Section";
import {
  blogPosts,
  trendingTopics,
  categoryColors,
  type BlogCategory,
  type BlogPost,
} from "@/content/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CategoryPill({ category, label }: { category: BlogCategory; label: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide ${categoryColors[category]}`}
    >
      {label}
    </span>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group relative col-span-2 flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-navy"
    >
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt=""
          fill
          className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
      <div className="relative z-10 p-7 sm:p-8">
        <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest text-white">
          Featured
        </span>
        <div>
          <CategoryPill category={post.category} label={post.categoryLabel} />
        </div>
        <h3 className="mt-3 text-[1.5rem] font-extrabold leading-[1.2] text-white sm:text-[1.75rem]">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-[0.8125rem] text-white/50">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eef0fc]">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <CategoryPill category={post.category} label={post.categoryLabel} />
          <h3 className="text-[0.9375rem] font-bold leading-[1.3] text-navy transition-colors group-hover:text-brand">
            {post.title}
          </h3>
        </div>
      </div>
      <p className="text-[0.8125rem] leading-relaxed text-body line-clamp-2">{post.excerpt}</p>
      <p className="text-[0.75rem] text-muted">
        {formatDate(post.date)} · {post.readTime} min read
      </p>
    </Link>
  );
}

function LatestCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#eef0fc]">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <CategoryPill category={post.category} label={post.categoryLabel} />
        <h3 className="text-[1rem] font-bold leading-[1.3] text-navy transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="text-[0.8125rem] leading-relaxed text-body line-clamp-2">{post.excerpt}</p>
        <p className="mt-1 text-[0.75rem] text-muted">
          {formatDate(post.date)} · {post.readTime} min read
        </p>
      </div>
    </Link>
  );
}

function InsightsHero() {
  return (
    <div className="relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 50%, #1d2942 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, #5b2bcb22 0%, transparent 50%)",
        }}
      />
      <Container className="relative z-10 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-[540px]">
            <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-widest text-white/50">
              Blog &amp; Insights
            </p>
            <h1 className="text-[2.2rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.75rem]">
              Bigger Perspectives,{" "}
              <span className="text-[#8c8eff]">Brighter Careers</span>
            </h1>
            <p className="mt-4 text-[1rem] leading-relaxed text-white/65">
              Latest stories, industry trends and expert perspectives to help students, colleges
              and educators shape what&rsquo;s next.
            </p>
          </div>
          <div className="hidden items-start justify-end lg:flex">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-right backdrop-blur-sm">
              <p className="font-hand text-[1.4rem] leading-snug text-white/80">
                Curiosity
                <br />
                today.
              </p>
              <p className="mt-1 font-hand text-[1.1rem] text-[#b8b4ff]">Be tomorrow.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState<BlogCategory | "all">("all");

  const featuredPost = blogPosts.find((p) => p.featured);
  const sidePosts = blogPosts.filter((p) => !p.featured).slice(0, 2);
  const latestPosts =
    activeFilter === "all"
      ? blogPosts.filter((p) => !p.featured)
      : blogPosts.filter((p) => !p.featured && p.category === activeFilter);

  return (
    <>
      <InsightsHero />

      <div className="bg-white py-14 sm:py-16">
        <Container>
          {/* Featured + side cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPost && <FeaturedCard post={featuredPost} />}
            <div className="flex flex-col gap-5">
              {sidePosts.map((p) => (
                <SmallCard key={p.slug} post={p} />
              ))}
            </div>
          </div>

          {/* Trending topics */}
          <div className="mt-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-muted">
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <polyline points="2,12 6,7 9,9 14,3" />
                  <polyline points="11,3 14,3 14,6" />
                </svg>
                Trending Topics
              </span>

              <button
                onClick={() => setActiveFilter("all")}
                className={`rounded-full border px-4 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                  activeFilter === "all"
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-body hover:border-brand/40 hover:text-navy"
                }`}
              >
                All
              </button>

              {trendingTopics.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setActiveFilter(t.value)}
                  className={`rounded-full border px-4 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                    activeFilter === t.value
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white text-body hover:border-brand/40 hover:text-navy"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Latest posts */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[1.25rem] font-extrabold text-navy">Latest Posts</h2>
              <Link
                href="/insights/all"
                className="text-[0.8125rem] font-semibold text-brand underline underline-offset-4 hover:text-brand-deep"
              >
                View All →
              </Link>
            </div>

            {latestPosts.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((p) => (
                  <LatestCard key={p.slug} post={p} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-line bg-cloud py-14 text-center">
                <p className="text-[0.9375rem] text-muted">
                  No posts yet in this topic. Check back soon.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
