import type { NextConfig } from "next";

/**
 * Static export, for GitHub Pages.
 *
 * GitHub Pages serves files, not a Node server, so the site is pre-rendered to
 * plain HTML. Two consequences to be aware of when moving to a real host later
 * (Vercel, or any Node host) - both are reversed by deleting this block:
 *
 *   1. Route handlers do not run. `/api/enquiry` is therefore not part of this
 *      build, and the enquiry form falls back to opening a pre-filled email
 *      instead of POSTing. See components/sections/EnquiryForm.tsx.
 *   2. next/image optimisation is off, so images are served at their natural
 *      size rather than as generated WebP/AVIF. Sizes/alt/dimensions are all
 *      still declared, so nothing shifts - it is purely a bytes-on-the-wire cost.
 *
 * `basePath` must match the repository name, because the site is served from
 * https://<user>.github.io/<repo>/ rather than from a domain root. Point
 * NEXT_PUBLIC_BASE_PATH at "" if you later attach a custom domain.
 */

// Vercel builds read the committed .env.production, which holds the GitHub Pages
// values (a /zskillup-website basePath and the github.io origin). Neither is right
// on Vercel, which serves from a domain root, so override them here - regardless of
// whatever the dashboard does or doesn't define. VERCEL is set by Vercel itself.
// Assigning to process.env in this file also reaches the client bundle, because
// NEXT_PUBLIC_* values are inlined after the config is loaded.
if (process.env.VERCEL) {
  process.env.NEXT_PUBLIC_BASE_PATH = "";
  // No API route in this export build, so the enquiry form must use its mailto path.
  process.env.NEXT_PUBLIC_STATIC_EXPORT = "true";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl || siteUrl.includes("github.io")) {
    const host =
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
    process.env.NEXT_PUBLIC_SITE_URL = host
      ? `https://${host}`
      : "https://www.zskillup.com";
  }
}

// Empty in development so `npm run dev` serves from http://localhost:3000/.
// .env.production supplies "/zskillup-website" for the Pages build.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Trailing slashes make GitHub Pages resolve /insights -> /insights/index.html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
