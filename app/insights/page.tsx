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

/* Pre-computed star positions [cx%, cy%, r, opacity] — fixed to avoid hydration mismatch */
const STARS: [number, number, number, number][] = [
  [5,4,1,0.8],[12,9,0.7,0.6],[18,2,1.2,0.9],[25,7,0.8,0.7],[33,3,1,0.85],
  [41,8,0.6,0.5],[50,2,1.3,0.9],[58,6,0.7,0.65],[66,1,1,0.75],[74,5,0.8,0.8],
  [82,3,1.1,0.9],[90,8,0.6,0.6],[96,4,0.9,0.7],[8,18,0.7,0.55],[15,22,1,0.8],
  [22,14,0.8,0.65],[30,19,1.2,0.85],[38,16,0.6,0.6],[47,21,0.9,0.7],[55,13,1,0.8],
  [63,18,0.7,0.6],[71,15,1.1,0.75],[79,20,0.8,0.7],[87,12,1,0.85],[93,17,0.6,0.5],
  [3,32,1.1,0.7],[10,28,0.7,0.6],[19,35,0.9,0.8],[27,30,1.2,0.9],[35,26,0.6,0.55],
  [43,33,0.8,0.65],[52,29,1,0.75],[60,36,0.7,0.6],[68,31,1.1,0.85],[76,27,0.8,0.7],
  [84,34,0.9,0.8],[91,29,0.6,0.55],[97,33,1,0.7],[7,45,0.8,0.65],[14,41,1.1,0.8],
  [23,48,0.7,0.6],[31,43,0.9,0.75],[40,46,1,0.85],[48,40,0.6,0.55],[57,47,1.2,0.9],
  [65,42,0.8,0.7],[73,45,0.7,0.6],[81,41,1,0.75],[89,48,0.9,0.8],[95,43,0.6,0.5],
  [2,58,1,0.7],[9,55,0.7,0.6],[17,61,0.9,0.8],[26,57,1.1,0.85],[34,62,0.6,0.5],
  [42,55,0.8,0.65],[51,60,1.2,0.9],[59,56,0.7,0.6],[67,63,0.9,0.75],[75,58,1,0.8],
  [83,61,0.8,0.7],[92,55,0.6,0.55],[98,60,1,0.7],[6,72,0.9,0.75],[13,68,0.7,0.6],
  [21,75,1,0.8],[29,70,0.8,0.65],[37,73,1.1,0.85],[45,69,0.6,0.5],[53,76,0.9,0.7],
  [61,71,1.2,0.9],[69,74,0.7,0.6],[77,68,0.8,0.65],[85,75,1,0.8],[94,72,0.6,0.55],
  [4,85,0.8,0.6],[11,82,1,0.75],[19,88,0.7,0.55],[28,83,0.9,0.7],[36,87,1.1,0.85],
  [44,81,0.6,0.5],[52,86,0.8,0.65],[60,82,1,0.8],[68,89,0.7,0.6],[76,85,0.9,0.75],
];

function InsightsHero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#06081a 0%,#0d1035 35%,#160b3a 65%,#080d20 100%)" }}
    >
      {/* Star field */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map(([cx, cy, r, opacity], i) => (
          <circle key={i} cx={cx} cy={cy} r={r * 0.35} fill="white" opacity={opacity} />
        ))}
      </svg>

      {/* Purple nebula glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 30%, rgba(91,43,203,0.28) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 55% 80%, rgba(44,20,120,0.18) 0%, transparent 40%)," +
            "radial-gradient(ellipse at 30% 50%, rgba(20,10,80,0.15) 0%, transparent 45%)",
        }}
      />

      {/* Person silhouette — right side */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] select-none lg:block">
        {/* Subtle purple glow behind the figure */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 85%, rgba(91,43,203,0.35) 0%, transparent 55%)",
          }}
        />
        <svg
          viewBox="0 0 340 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 right-8 h-[90%] w-auto"
          aria-hidden="true"
        >
          {/* Neck */}
          <ellipse cx="170" cy="110" rx="22" ry="28" fill="#1a1a2e" />
          {/* Head — slightly tilted back (looking up) */}
          <ellipse cx="168" cy="76" rx="38" ry="44" fill="#c8956c" />
          {/* Hair — dark, swept back */}
          <path
            d="M132 62 C128 40 138 20 168 18 C198 16 212 38 210 62 C200 45 185 35 168 36 C151 37 140 48 132 62Z"
            fill="#1a1008"
          />
          {/* Face highlight */}
          <ellipse cx="162" cy="72" rx="14" ry="18" fill="#d9a87c" opacity="0.5" />
          {/* Jawline tilt — chin lifted */}
          <path d="M140 95 Q168 118 196 95" stroke="#b8845a" strokeWidth="1.5" fill="none" />
          {/* Eye (side view, looking up) */}
          <ellipse cx="178" cy="70" rx="5" ry="3.5" fill="#2a1a0a" />
          <ellipse cx="179" cy="69" rx="1.5" ry="1.5" fill="white" opacity="0.6" />
          {/* Eyebrow — raised (looking up expression) */}
          <path d="M172 63 Q178 60 185 62" stroke="#2a1a0a" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M174 76 Q177 82 174 85" stroke="#b8845a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Shoulder & jacket */}
          <path
            d="M100 320 L108 185 Q120 150 148 138 L168 134 L190 138 Q220 150 232 185 L240 320Z"
            fill="#0f1a2e"
          />
          {/* Collar */}
          <path
            d="M148 138 L168 158 L190 138"
            stroke="#1a2a40"
            strokeWidth="2"
            fill="none"
          />
          {/* Jacket lapels */}
          <path d="M148 138 L135 175 L160 165 L168 158" fill="#0a1525" />
          <path d="M190 138 L205 175 L178 165 L168 158" fill="#0a1525" />
          {/* Shirt */}
          <path d="M160 165 L168 158 L178 165 L175 200 L163 200Z" fill="#1e2d45" />
          {/* Left fade overlay — blends into bg */}
          <defs>
            <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06081a" stopOpacity="1" />
              <stop offset="30%" stopColor="#06081a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="340" height="320" fill="url(#fadeLeft)" />
        </svg>
      </div>

      <Container className="relative z-10 py-14 sm:py-16">
        <div className="flex items-center justify-between">
          {/* Left: text */}
          <div className="max-w-[520px]">
            <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-widest text-white/50">
              Blog &amp; Insights
            </p>
            <h1 className="text-[2.2rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.75rem]">
              Bigger Perspectives
              <br />
              <span className="text-[#8c8eff]">Brighter Careers</span>
            </h1>
            <p className="mt-4 max-w-[400px] text-[1rem] leading-relaxed text-white/65">
              Latest stories, industry trends and expert perspectives to help students, colleges
              and educators shape what&rsquo;s next.
            </p>
          </div>

          {/* Right: handwritten accent */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-right backdrop-blur-sm">
              <p className="font-hand text-[1.4rem] leading-snug text-white/80">
                Curiosity
                <br />
                today.
              </p>
              <p className="mt-1 font-hand text-[1.1rem] text-[#b8b4ff]">Be tomorrows.</p>
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
