# ZSkillup — parent website

The ZSkillup marketing site, built from `ZSkillup_Parent_Website_Final_Feedback.docx`
(eleven design comps plus section-by-section feedback).

**Read [`CONTENT-TODO.md`](./CONTENT-TODO.md) before publishing.** Statistics,
testimonials and photography are deliberately unfinished and are held behind
flags so they cannot ship by accident.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
```

Copy `.env.example` to `.env.local` and fill in what you need. Nothing is required
to run locally.

---

## What's here

This pass is **the homepage, in full** — all twelve sections from the brief's
locked flow — plus a minimal `/insights` scaffold so the navigation has no dead
link. The five other dedicated pages are still to build; see CONTENT-TODO §8.

```
app/
  layout.tsx            fonts, metadata, header/footer shell, skip link
  page.tsx              the homepage + Organization & FAQPage structured data
  globals.css           design tokens and the few global utilities
  insights/page.tsx     scaffold (noindex while empty)
  api/enquiry/route.ts  form endpoint
  sitemap.ts robots.ts

content/                ALL copy, numbers, imagery paths and FAQs
components/
  ui/                   Button, Icon, Brand, Section, Carousel, Stats, VideoDialog
  layout/               SiteHeader, SiteFooter
  sections/             the twelve homepage sections, one file each

scripts/
  extract-comp-assets.py  pulls photography + logos out of the design comps
  shoot.mjs             dev-only screenshot helper
```

### Homepage flow

Locked by the brief. Narrative logic: **Brand → Choice → Offerings → Philosophy →
Proof → People → Activity → Questions → Conversion.**

| # | Section | Base comp |
|---|---|---|
| 01 | Hero | Design 13 |
| 02 | About ZSkillup | Design 4 layout, Design 1 palette |
| 03 | Choose Your Route | Design 6 |
| 04 | Institutions | Design 3 |
| 05 | Prephasz | Design 2 |
| 06 | B.Com + ACCA | Design 1 |
| 07 | The Education-to-Career Path | Design 6 |
| 08 | Partners | Design 2 |
| 09 | Testimonials | Design 2 |
| 10 | ZSkillup in Action | Design 1 |
| 11 | FAQs | Design 2 |
| 12 | Final CTA / Footer | — |

---

## Editing content

**No copy is hard-coded in a component.** Everything routes through `content/`:

| File | Holds |
|---|---|
| `site.ts` | Brand, navigation, contact details, footer |
| `homepage.ts` | Section copy for 01–07 and 12 |
| `stats.ts` | Every number, each with a `verified` flag |
| `media.ts` | Every image path, dimension and alt text |
| `partners.ts` | Institutional and industry partner lists |
| `testimonials.ts` | Learner stories (**sample content — see CONTENT-TODO**) |
| `events.ts` | Featured events, gallery, filters |
| `faqs.ts` | FAQs by category |
| `videos.ts` | Video URLs (all `null` today) |

---

## The design system

From the brief's Final Global Website Direction:

| Role | Colour | Token |
|---|---|---|
| Master brand | Navy | `--color-navy` `#0a1733` |
| Master signature | Purple → Coral gradient | `--brand-gradient` |
| Institutions | Purple / Blue | `--color-inst` |
| Prephasz | Yellow / Orange | `--color-prep` |
| B.Com + ACCA | Teal / Green | `--color-com` |

Rules the codebase enforces:

- **Vertical colours are identifiers and accents, never large background fills.**
  Roughly 80% of the experience is white or warm off-white.
- **The gradient is a signature, used selectively** — headline fragments, icons,
  small rules. Never a big coloured area.
- **Handwritten type is capped at three instances** across the whole homepage:
  "More Than a Degree" (Hero), the Prephasz demo cue, and "More opportunities
  ahead." (B.Com + ACCA). The brief removed seven others; don't add a fourth.
- **Whitespace is intentional.** Where the brief deleted an element it also said
  not to backfill the space.
- **One icon family** — one grid, one stroke weight, `currentColor` throughout.

Typography is **Plus Jakarta Sans** (already what prephasz.com ships, so the
parent site and the product read as one brand) with **Caveat** for the
handwritten accents.

---

## SEO & accessibility

Built against the brief's requirements:

- One `<h1>` per page (the Hero headline); `<h2>` per section; `<h3>` for cards.
- All copy, statistics, captions and CTA labels are **real HTML text**, never
  flattened into images — including the Prephasz product mock, which is markup.
- **Carousel, tab and accordion content is fully server-rendered.** Partner logos
  on both tabs, all six featured events, every testimonial and every FAQ category
  are in the initial HTML — nothing requires a click before it exists.
- Hero image is `priority` (not lazy-loaded); everything below the fold is lazy.
  Every image declares width/height, so there is no layout shift on swap.
- Descriptive link text throughout — "Explore Institutional Solutions", "Explore
  Prephasz", "Explore B.Com + ACCA" rather than "Learn More".
- Structured data limited to what is accurate and visible: `Organization` and a
  `FAQPage` covering only the default-visible question set. No rating or course
  markup, since neither could be stated from verified data.
- Per-page metadata, canonicals, `sitemap.xml`, `robots.txt`.
- Keyboard-navigable with a visible focus ring everywhere, a skip link, labelled
  form fields with `role="alert"` errors, accessible accordion
  (`aria-expanded`/`aria-controls`) and carousel controls, and
  `prefers-reduced-motion` honoured.
- Text colours are checked against WCAG AA — `--color-muted` and `--color-com`
  were both darkened from their sampled values to clear 4.5:1.
- Mobile preserves the brief's content order per section, not just the desktop
  visual order.

---

## Imagery

All photography and the institutional partner logos are the **approved design
comps' own artwork**, lifted out of the .docx:

```bash
python scripts/extract-comp-assets.py <path-to-extracted-docx-media-dir>
```

The comps are flat PNG renders, so the script also repairs what was baked over the
artwork — most notably the hero, where the headline, the handwritten notes and the
wall lettering all sit on the photograph. See CONTENT-TODO §3.

These are comp-resolution. Drop the original full-resolution files at the same
paths when they are available; `content/media.ts` holds every path, dimension and
alt string, so nothing else changes.
