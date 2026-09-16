import type { Metadata, Viewport } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/content/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

/**
 * Plus Jakarta Sans is the ZSkillup typeface - it is already what prephasz.com
 * ships, so the parent site and the product read as one brand.
 *
 * Caveat carries the handwritten accents. The brief caps those at 2-3 across the
 * entire homepage, which is why this loads only two weights.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a1733",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ZSkillup | Industry-Ready Careers for Students & Institutions",
    template: "%s | ZSkillup",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: "ZSkillup | Industry-Ready Careers for Students & Institutions",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ZSkillup | Industry-Ready Careers for Students & Institutions",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${caveat.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white antialiased">
        <a
          href="#main"
          className="sr-only-focusable absolute top-3 left-3 z-[60] rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
