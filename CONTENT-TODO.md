# Content to supply before this site goes live

Everything below is a deliberate gap, not an oversight. The brief is explicit that
unverified numbers, unverified claims and placeholder imagery must not ship, so
each gap is isolated behind a single file or a single flag rather than scattered
through the markup.

Items are ordered by how much they block a launch.

Photography and partner logos are now the approved comps' own artwork rather than
placeholders — see §3 and §4 for what still needs replacing.

---

## 1. Statistics awaiting verification — BLOCKING

The brief: *"Use only verified, defensible numbers. Do not hard-code placeholder
claims."* and *"All claims, ratings, partner counts, learner counts and outcome
numbers must be verified before publishing."*

Every number on the site lives in **`content/stats.ts`** with a `verified` flag.
Unverified figures **do render**, because the comps show these stat rows and the
brief asks for them to be kept. Confirm the real figure, update `value`, then set
`verified: true`.

| Where | Figure | Label | Status |
|---|---|---|---|
| Partners | `55+` | Institution Partners | ✅ Supplied in the brief |
| Partners | `100+` | Industry & Hiring Partners | ✅ Supplied in the brief |
| Partners | `10K+` | Learners Impacted | ✅ Supplied in the brief |
| Institutions | `100+` | Campuses Engaged | ⛔ Needs sign-off |
| Institutions | `50K+` | Students Trained | ⛔ Needs sign-off |
| Institutions | `80%+` | Placement Readiness Improvement | ⛔ Needs sign-off + a defined measurement method |
| ZSkillup in Action | `50+` | Programs Conducted | ⛔ Needs sign-off |
| ZSkillup in Action | `Regular` | Workshops & Events | ✅ Makes no measurable claim |
| ZSkillup in Action | `Multi-city` | Campuses Reached | ✅ Makes no measurable claim |

**One decision needed.** The Institutions comp said *"100+ Partner Institutions"*,
which both contradicts the Partners figure of `55+` and breaks the checklist rule
*"No repeated corporate statistics outside the Partners section."* The label has
been re-scoped to **"Campuses Engaged"**. Confirm that framing, or supply a
different metric for that slot.

To suppress every unverified figure in one move — for a public launch before the
numbers are signed off — set `NEXT_PUBLIC_SHOW_UNVERIFIED_STATS=false`. The
layouts close up cleanly without them, which the brief also asks for ("use the
space saved ... to give the page more whitespace").

---

## 2. Testimonials — BLOCKING

**`content/testimonials.ts` contains sample content only. None of it is real.**

The first three entries are carried verbatim from the approved comp, where they
were already placeholder copy. The other three were written in the same voice to
satisfy the brief's requirement to mix Institutional / Prephasz / Commerce stories
across the carousel.

Replace all six with authentic, consented learner testimonials — real name,
programme/role, institution, 35–50 words each.

Two rules already encoded, please keep them:

- **No star ratings.** The brief allows stars only if they are actual learner
  ratings. There is no rating data, so the type has no `rating` field at all.
- **Keep the commerce → institutions → prephasz rotation** when adding entries, so
  the three cards visible at any moment span all three offerings.

---

## 3. Photography — comp-resolution, needs originals

Every photograph on the site is now the **approved design comps' own artwork**,
extracted from the .docx by `scripts/extract-comp-assets.py`. So the site shows
the intended imagery, not stand-ins.

The catch: the comps are flat PNG renders, so these are crops out of a screenshot.
They read correctly at the sizes used, but they are not production masters.
**Supply the original full-resolution files at the same paths** and nothing else
needs to change — `content/media.ts` holds every path, dimension and alt text.

| Slot | Path | Current | Note |
|---|---|---|---|
| Hero (LCP) | `campus-student-hero.png` | 1670×942 | **Closed** — the real photograph, supplied directly |
| Leadership ×3 | `team/*.jpg` | 512×512 | Cropped from the About comp |
| B.Com + ACCA | `commerce-student.jpg` | 322×610 | Small; an original would help most here |
| Learner photos ×3 | `learners/*.jpg` | 256×256 | Only Ritika, Aman and Sneha exist |
| Featured event | `events/industry-expert-session.jpg` | 739×362 | Only **one** featured shot exists |
| Gallery ×8 | `events/*.jpg` | ~422×189 | Cropped above each baked caption |

**The hero is done.** It now uses the real, full-composition photograph
supplied for this slot — open sky on the left, the campus buildings and the
"More Than a Degree" note in the middle, the student on the right, nothing
reconstructed or painted over. `scripts/extract-comp-assets.py` still has the
old comp-crop logic that used to fill this slot, but it's disabled (see the
comment there) so it can't overwrite this file if the script is re-run.

**Two gaps worth closing:**

- **Only one featured event photograph exists.** The featured carousel currently
  reuses three gallery shots to fill it. More dedicated featured photographs are
  needed — the brief asks for "strong, high-quality real photographs, preferably
  showing people/action rather than posed group shots."
- **Three testimonials have no photograph.** The comp supplies three learner
  photos, all Commerce. The brief also requires the visible cards to span
  Institutional / Prephasz / Commerce, so the three added testimonials fall back to
  a monogram avatar. Add photos at `/images/learners/<slug>.jpg` and list the slug
  in `LEARNERS_WITH_PHOTOS` in `content/media.ts`.

Also per the brief: compress and deliver in modern formats. `next/image` handles
WebP/AVIF automatically once real files are in place.

---

## 4. Partner logos — artwork in, permission still needed

The ten **institutional** logos are the marks from the Partners comp, wired up in
`content/partners.ts`. They are comp-resolution raster crops — replace with vector
originals at the same paths for production.

The ten **Industry & Hiring Network** entries have no artwork in any comp, so they
render as accessible wordmark tiles. Drop a file in `public/images/partners/` and
set `logo:` on the entry to use real artwork.

**Before publishing, confirm permission to display each third-party logo and
name.** This matters most on the Industry & Hiring Network tab — the tab is named
that way rather than "Hiring Partners" precisely because not every company shown
is a formal hiring partner, but naming a company still implies a relationship.

---

## 5. Video walkthroughs — not blocking

`content/videos.ts` has three entries, all `url: null`:

- `institutions` — how ZSkillup works with institutions
- `prephasz` — the product walkthrough behind the dashboard play button
- `commerce` — inside the B.Com + ACCA pathway

While an entry is `null` the player opens and says the walkthrough is coming
soon. It does not fake an embed. Set `url` to a YouTube/Vimeo embed URL or a
direct `.mp4` and it starts working — nothing else changes. Video loads only on
open, never on page load.

---

## 6. Contact details — verify

`content/site.ts` carries details taken from the live zskillup.com build:

- Phone `+91 80500 70534` — verify
- Email `hello@zskillup.com` — **placeholder.** The live site lists
  `Lokesh@zskillup.com` and `Sneha.jadhav@zskillup.com`; a general enquiries
  address is needed
- Address: WeWork Princeville, Golf Link Software Park, Challaghatta Village,
  Domlur, Bengaluru 560071 — verify
- Social URLs in `social` are **guessed handles** — replace with the real profiles
- Leadership LinkedIn URLs: only Lokesh Mathur's is a real profile link; the other
  two currently point at the company page

---

## 7. Enquiry delivery — configure before launch

Forms post to `/api/enquiry`. With no environment variable set the enquiry is
logged server-side and a warning is printed — it is **not delivered anywhere**.

Set one of the following (see `.env.example`):

- `ENQUIRY_WEBHOOK_URL` — POST as JSON to Slack / Zapier / a CRM, or
- `RESEND_API_KEY` + `ENQUIRY_EMAIL_TO` + `ENQUIRY_EMAIL_FROM` — deliver by email

---

## 8. Still to build — the dedicated pages

This pass covers the homepage in full. The brief also requires dedicated,
crawlable URLs, which do not exist yet:

`/institutions` · `/prephasz` · `/bcom-acca` · `/why-zskillup` · `/about`

Navigation is already wired for the cut-over: each item in `content/site.ts` `nav`
carries both the current homepage anchor (`href`) and its future page (`page`).
Switch `href` to `page` in `SiteHeader` when the pages ship, and add them to
`app/sitemap.ts`.

`/insights` exists as a minimal scaffold so the navigation has no dead link. It is
deliberately `noindex` while empty — remove that override once real articles land.

Two pieces of content were explicitly moved off the homepage and need a home:

- The full B.Com + ACCA disclaimer (*"The exact university, degree structure, ACCA
  status, exemptions, programme duration and delivery responsibilities..."*)
  belongs on `/bcom-acca` or its FAQ. The homepage carries only the short note.
- Detailed per-page FAQs. `content/faqs.ts` already holds question sets for
  Institutions, Prephasz and B.Com + ACCA that can seed them.

---

## 9. Before go-live

- Set `NEXT_PUBLIC_SITE_URL` to the production origin — it drives canonicals,
  Open Graph URLs and the sitemap.
- Add a real favicon and an Open Graph share image.
- Connect the production site to Google Search Console and submit
  `/sitemap.xml`.
- Re-check that `NEXT_PUBLIC_SHOW_UNVERIFIED_STATS` is **not** set.
