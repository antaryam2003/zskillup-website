import type { MetadataRoute } from "next";

/** Required by `output: "export"` so this is emitted as a static sitemap.xml. */
export const dynamic = "force-static";
import { site } from "@/content/site";

/**
 * XML sitemap.
 *
 * Only routes that actually exist are listed. As the dedicated pages ship
 * (/institutions, /prephasz, /bcom-acca, /why-zskillup, /about), add them here -
 * the brief requires each to be a real crawlable URL rather than a homepage
 * anchor.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/insights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
