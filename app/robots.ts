import type { MetadataRoute } from "next";

/** Required by `output: "export"` so this is emitted as a static robots.txt. */
export const dynamic = "force-static";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
