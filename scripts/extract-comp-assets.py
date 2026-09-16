"""
Extracts the real photography and partner logos from the approved design comps
in ZSkillup_Parent_Website_Final_Feedback.docx.

The comps are flat PNG renders, so every crop below is chosen to avoid the text,
badges, captions and UI chrome baked over the artwork. Crop boxes are expressed in
each comp's 1400px-wide preview space and scaled to the source resolution.

These are the client's own approved images, so the site now shows the intended
photography rather than stand-ins. They are still comp-resolution: for final
production quality, replace them with the original full-resolution assets (same
paths, see CONTENT-TODO.md).

Usage:
    python scripts/extract-comp-assets.py <path-to-extracted-docx-media-dir>
"""

import os
import sys

from PIL import Image, ImageFilter

MEDIA = sys.argv[1] if len(sys.argv) > 1 else "docx/word/media"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# Which comp render holds which section.
COMP = {
    "hero": "image10.png",
    "about": "image5.png",
    "bcom": "image4.png",
    "testimonials": "image2.png",
    "events": "image11.png",
    "partners": "image7.png",
}

VIEW_W = 1400  # the preview width all crop boxes below were measured against


def load(key):
    im = Image.open(os.path.join(MEDIA, COMP[key])).convert("RGB")
    return im, im.size[0] / VIEW_W


def crop(key, box, scale_to=None, resample=Image.LANCZOS):
    im, s = load(key)
    c = im.crop(tuple(int(round(v * s)) for v in box))
    if scale_to:
        c = c.resize(scale_to, resample)
    return c


def save(img, path, quality=90):
    full = os.path.normpath(os.path.join(OUT, path))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    img.save(full, "JPEG", quality=quality, optimize=True, progressive=True)
    print("  {:46s} {}x{}  {}KB".format(path, img.size[0], img.size[1],
                                        os.path.getsize(full) // 1024))


def square(img):
    """Centre-crop to a square, biased slightly up so faces sit well."""
    w, h = img.size
    n = min(w, h)
    left = (w - n) // 2
    top = max(0, int((h - n) * 0.32))
    return img.crop((left, top, left + n, top + n))


print("Extracting artwork from the design comps...")

# ---------------------------------------------------------------------------
# 01 HERO - campus + student, full width.
#
# The comp is a flat render, so the headline, the handwritten notes and the
# "SAME STUDENTS. BIGGER TOMORROWS." wall lettering are baked into the photograph.
# Cropping around them would have discarded most of the frame and zoomed the
# student far past the comp's composition, so the full width is kept and the text
# is removed instead:
#
#   * Left third - the comp already renders this as a heavy white wash with the
#     photograph barely showing through, which is what makes the headline legible.
#     It is rebuilt as exactly that: a per-row wash sampled from the photograph's
#     own colour at the wash boundary, so vertical variation is preserved, then
#     ramped back into the untouched photograph before it reaches the student.
#   * The wall lettering sits on flat stone, so it is interpolated across.
#
# The crop starts below the comp's navigation bar, which is also baked in.
# ---------------------------------------------------------------------------
hero_im, hs = load("hero")

CROP_TOP, CROP_BOTTOM = 85, 528          # below the comp nav, above the cards
plate = hero_im.crop((0, int(CROP_TOP * hs), hero_im.size[0], int(CROP_BOTTOM * hs)))
PW, PH = plate.size

# --- rebuild the left wash --------------------------------------------------
FLAT_TO = int(690 * hs)      # everything left of this is pure wash in the comp
RAMP_TO = int(792 * hs)      # ...ramping back to the photograph before the student
SAMPLE_X = int(838 * hs)     # a clean column of photograph to take each row's hue from
WASH = 0.88                  # how far toward white the comp pushes that column

px = plate.load()

# Smooth the sampled column down its length first. Sampling row by row straight
# from foliage leaves faint horizontal banding across the wash; averaging over a
# window removes it while keeping the top-to-bottom shift in tone.
column = [px[SAMPLE_X, y] for y in range(PH)]
WINDOW = 45
smoothed = []
for y in range(PH):
    lo, hi = max(0, y - WINDOW), min(PH, y + WINDOW + 1)
    n = hi - lo
    smoothed.append(tuple(sum(column[i][c] for i in range(lo, hi)) / n for c in range(3)))

for y in range(PH):
    r, g, b = smoothed[y]
    tone = (
        int(r + (255 - r) * WASH),
        int(g + (255 - g) * WASH),
        int(b + (255 - b) * WASH),
    )
    for x in range(0, FLAT_TO):
        px[x, y] = tone
    for x in range(FLAT_TO, RAMP_TO):
        t = (x - FLAT_TO) / (RAMP_TO - FLAT_TO)
        o = px[x, y]
        px[x, y] = tuple(int(tone[c] + (o[c] - tone[c]) * t) for c in range(3))

# --- remove the wall lettering ----------------------------------------------
wx0, wy0 = int(1204 * hs), int((262 - CROP_TOP) * hs)
wx1, wy1 = int(1356 * hs), int((402 - CROP_TOP) * hs)
for y in range(wy0, wy1):
    left = px[wx0 - 2, y]
    right = px[min(PW - 1, wx1 + 1), y]
    span = max(1, wx1 - wx0)
    for x in range(wx0, wx1):
        t = (x - wx0) / span
        px[x, y] = tuple(int(left[c] + (right[c] - left[c]) * t) for c in range(3))

save(plate, "campus-student-hero.jpg", quality=90)
print("      (clean plate {}x{})".format(PW, PH))

# ---------------------------------------------------------------------------
# 02 ABOUT - leadership portraits
# ---------------------------------------------------------------------------
PORTRAITS = {
    "lokesh-mathur": (387, 406, 512, 549),
    "gaurav-singh": (736, 406, 862, 549),
    "manish-temani": (1071, 406, 1197, 549),
}
for slug, box in PORTRAITS.items():
    p = square(crop("about", box))
    save(p.resize((512, 512), Image.LANCZOS), "team/{}.jpg".format(slug), quality=92)

# ---------------------------------------------------------------------------
# 06 B.COM + ACCA - student at her desk.
# Cropped clear of the handwritten note, the floating white box, the book-spine
# labels and the dark "Build skills" panel, all of which are comp overlays.
# ---------------------------------------------------------------------------
save(crop("bcom", (930, 88, 1150, 505)), "commerce-student.jpg", quality=91)

# ---------------------------------------------------------------------------
# 09 TESTIMONIALS - learner photographs
# ---------------------------------------------------------------------------
AVATARS = {
    "ritika-singh": (72, 494, 140, 562),
    "aman-raj": (436, 494, 502, 562),
    "sneha-patel": (806, 494, 872, 562),
}
for slug, box in AVATARS.items():
    save(square(crop("testimonials", box)).resize((256, 256), Image.LANCZOS),
         "learners/{}.jpg".format(slug), quality=92)

# ---------------------------------------------------------------------------
# 10 ZSKILLUP IN ACTION - featured photograph + eight gallery photographs.
# Each crop stops above the caption band the comp paints over the image, because
# the site renders those captions as real HTML text.
# ---------------------------------------------------------------------------
# Cropped from x=815 so the comp's own "Featured Event" badge (which the site
# renders itself, as real text) is left out rather than showing through.
save(crop("events", (815, 22, 1355, 286)), "events/industry-expert-session.jpg", quality=89)

GALLERY = {
    "acca-career-workshop-session": (54, 424, 362, 562),
    "student-community-cohort": (371, 424, 679, 562),
    "hands-on-learning-lab": (719, 424, 1029, 562),
    "expert-talk-series": (1041, 424, 1351, 562),
    "certificate-distribution": (54, 617, 362, 737),
    "group-activity-workshop": (371, 617, 679, 737),
    "institutional-collaboration": (689, 617, 983, 737),
    "interactive-workshop": (991, 617, 1243, 737),
}
for slug, box in GALLERY.items():
    save(crop("events", box), "events/{}.jpg".format(slug), quality=89)

# ---------------------------------------------------------------------------
# 08 PARTNERS - institution logo marks (the comp renders each name as text below
# the mark, and the site does the same, so only the mark is cropped).
# ---------------------------------------------------------------------------
LOGOS = {
    "swami-vivekanand": (548, 110, 658, 200),
    "viva-college": (706, 110, 816, 200),
    "wctm": (864, 110, 974, 200),
    "sharda-university": (1030, 110, 1146, 200),
    "cet-varur": (1204, 110, 1314, 200),
    "ap-shah": (548, 248, 658, 338),
    "ajeenkya-dy-patil": (706, 248, 816, 338),
    "atharva-college": (864, 248, 974, 338),
    "sanjivani-college": (1030, 248, 1140, 338),
    "mgm-college": (1204, 248, 1314, 338),
}
for slug, box in LOGOS.items():
    save(crop("partners", box), "partners/{}.jpg".format(slug), quality=92)

print("Done. Comp-resolution artwork - see CONTENT-TODO.md for the originals.")
