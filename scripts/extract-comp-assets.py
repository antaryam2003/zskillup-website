"""
Extracts the photography and partner logos from the APPROVED UPDATED DESIGNS
(the eleven per-section renders supplied after the original brief).

These renders are flat images, so every crop below is positioned to avoid the
text, badges, captions and UI chrome painted over the artwork. Boxes are given as
fractions of each source image so they stay correct regardless of its pixel size.

Output is comp-resolution: good enough that the site shows the intended artwork,
but not production masters. Replace each file with the original full-resolution
asset at the same path when available - see CONTENT-TODO.md.

Usage:
    python scripts/extract-comp-assets.py [--designs <dir>]
"""

import os
import sys

from PIL import Image, ImageFilter

DESIGNS = "C:/Users/monda/Downloads"
if "--designs" in sys.argv:
    DESIGNS = sys.argv[sys.argv.index("--designs") + 1]

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")

SRC = {
    "hero": "zskillup_hero_clean-1-overall-keep-design-13-as-the-base-preserve-the.jpg",
    "about": "zskillup_about_section_redesign-1-use-design-4-for-layout-and-information-architec.jpg",
    "partners": "image_a46704--lock-design-2s-overall-structure-left-side-messag.jpg",
    "commerce": "commerce_pathway_redesign-1-use-design-1-as-the-base-layout-do-not-redesign.jpg",
    "testi": "real_people_testimonials_editorial-1-keep-the-overall-layout-and-composition-of-desig.jpg",
    "events": "image_75ce01-1-use-design-1-as-the-base-2-keep-eyebrow-events-m.jpg",
}

_cache = {}


def load(key):
    if key not in _cache:
        _cache[key] = Image.open(os.path.join(DESIGNS, SRC[key])).convert("RGB")
    return _cache[key]


def crop(key, box):
    im = load(key)
    w, h = im.size
    return im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))


def save(img, path, quality=90, max_w=None):
    if max_w and img.size[0] > max_w:
        img = img.resize((max_w, int(img.size[1] * max_w / img.size[0])), Image.LANCZOS)
    full = os.path.normpath(os.path.join(OUT, path))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    img.save(full, "JPEG", quality=quality, optimize=True, progressive=True)
    print("  {:44s} {}x{}  {}KB".format(path, img.size[0], img.size[1],
                                        os.path.getsize(full) // 1024))


def square(img, bias=0.3):
    w, h = img.size
    n = min(w, h)
    left = (w - n) // 2
    top = max(0, int((h - n) * bias))
    return img.crop((left, top, left + n, top + n))


print("Extracting artwork from the updated design renders...")

# ---------------------------------------------------------------------------
# 01 HERO - full-frame campus photograph, no white wash.
#
# The render bakes the navigation, the headline and the circled handwritten note
# into the picture, and fades its left third almost to white so that headline
# stays legible. The site draws all of that itself and runs the photograph at full
# strength behind the text, so none of it can be kept.
#
# There is no un-faded pixel data for that left third - it does not exist in a
# flat render - so it is rebuilt from the photograph rather than refilled with
# white: the clean right-hand half is enlarged and defocused to form a continuous
# soft-focus background, then the sharp half is laid back over it and feathered
# in. The result is campus all the way across, with a naturally quieter area
# behind the headline.
#
# Replacing this file with the original photograph removes the need for any of it.
# ---------------------------------------------------------------------------
hero_im = load("hero")
HW, HH = hero_im.size
plate = hero_im.crop((0, int(0.105 * HH), HW, int(0.652 * HH)))
PW, PH = plate.size

# Everything from here rightwards is untouched photograph: clear of the headline
# (which ends at ~0.32) and of the circled note (which ends at ~0.49).
CLEAN_FROM = int(0.50 * PW)
clean = plate.crop((CLEAN_FROM, 0, PW, PH))
CW = clean.size[0]

# The hero runs this as a full-bleed background, so the plate is composed at the
# hero's own proportion (about 16:9). Cropped as a narrow band it would have to be
# scaled ~1.9x to cover, which blows straight past the design's composition.
OUT_W, OUT_H = PW, int(PW * 9 / 16)

# Soft-focus field. Built from the upper RIGHT corner of the clean half - sky,
# stonework and treetops only - because that region contains no people, so
# enlarging it cannot leave a recognisable blurred figure behind the headline.
sky = clean.crop((int(CW * 0.32), 0, int(CW * 0.74), int(PH * 0.78)))
base = sky.resize((OUT_W, OUT_H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(22))

# Lay the sharp half back over it, scaled a little and positioned so the student
# lands at roughly 62% across - where the design places her.
SHARP_W = int(CW * 1.45)
sharp = clean.resize((SHARP_W, int(PH * 1.45)), Image.LANCZOS)
sharp_x = int(0.62 * OUT_W - 0.24 * SHARP_W)   # she sits ~24% into the clean half
base.paste(sharp, (sharp_x, 0))

# Feather the left and bottom edges of the sharp region into the soft field.
px = base.load()
blur_ref = sky.resize((OUT_W, OUT_H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(22))
bp = blur_ref.load()

FEATHER_X = int(0.11 * OUT_W)
for x in range(sharp_x, min(OUT_W, sharp_x + FEATHER_X)):
    t = (x - sharp_x) / FEATHER_X
    for y in range(min(OUT_H, sharp.size[1])):
        a, b = bp[x, y], px[x, y]
        px[x, y] = tuple(int(a[c] + (b[c] - a[c]) * t) for c in range(3))

sharp_bottom = min(OUT_H, sharp.size[1])
FEATHER_Y = int(0.10 * OUT_H)
for y in range(max(0, sharp_bottom - FEATHER_Y), sharp_bottom):
    t = (sharp_bottom - y) / FEATHER_Y
    for x in range(max(0, sharp_x), OUT_W):
        a, b = bp[x, y], px[x, y]
        px[x, y] = tuple(int(a[c] + (b[c] - a[c]) * t) for c in range(3))

save(base, "campus-student-hero.jpg", quality=88)

# ---------------------------------------------------------------------------
# 02 ABOUT - leadership portraits. The updated design shows these large and
# portrait-shaped at the top of each card.
# ---------------------------------------------------------------------------
PORTRAITS = {
    "lokesh-mathur": (0.3050, 0.5360, 0.4215, 0.7280),
    "gaurav-singh": (0.5220, 0.5360, 0.6385, 0.7280),
    "manish-temani": (0.7035, 0.5360, 0.8200, 0.7280),
}
for slug, box in PORTRAITS.items():
    save(crop("about", box), "team/{}.jpg".format(slug), quality=92)

# ---------------------------------------------------------------------------
# 06 B.COM + ACCA - the student at her desk, cropped clear of the handwritten
# note, which the site renders as live text.
# ---------------------------------------------------------------------------
save(crop("commerce", (0.6650, 0.0250, 0.9960, 0.6850)), "commerce-student.jpg", quality=91)

# ---------------------------------------------------------------------------
# 09 TESTIMONIALS - learner photographs.
# ---------------------------------------------------------------------------
AVATARS = {
    "ritika-singh": (0.0505, 0.6270, 0.1055, 0.7280),
    "aman-raj": (0.3015, 0.6270, 0.3565, 0.7280),
    "sneha-patel": (0.5625, 0.6270, 0.6175, 0.7280),
}
for slug, box in AVATARS.items():
    save(square(crop("testi", box), bias=0.15).resize((256, 256), Image.LANCZOS),
         "learners/{}.jpg".format(slug), quality=92)

# ---------------------------------------------------------------------------
# 10 ZSKILLUP IN ACTION - featured photograph plus eight gallery photographs.
# Each crop stops above the caption band the design paints over the image.
# ---------------------------------------------------------------------------
save(crop("events", (0.5880, 0.0250, 0.9620, 0.3050)),
     "events/industry-expert-session.jpg", quality=89)

GALLERY = {
    "acca-career-workshop-session": (0.0377, 0.4650, 0.2586, 0.6050),
    "student-community-cohort": (0.2667, 0.4650, 0.4876, 0.6050),
    "hands-on-learning-lab": (0.5146, 0.4650, 0.7354, 0.6050),
    "expert-talk-series": (0.7409, 0.4650, 0.9644, 0.6050),
    "certificate-distribution": (0.0377, 0.6810, 0.2586, 0.8000),
    "group-activity-workshop": (0.2667, 0.6810, 0.4838, 0.8000),
    "institutional-collaboration": (0.4914, 0.6810, 0.7004, 0.8000),
    "interactive-workshop": (0.7085, 0.6810, 0.8846, 0.8000),
}
for slug, box in GALLERY.items():
    save(crop("events", box), "events/{}.jpg".format(slug), quality=89)

# ---------------------------------------------------------------------------
# 08 PARTNERS - institution logo marks only; names are live text on the site.
# ---------------------------------------------------------------------------
ROW1 = (0.2480, 0.3990)
ROW2 = (0.5250, 0.6760)
HALF = 0.0380
ROW1_LOGOS = {
    "swami-vivekanand": 0.4265,
    "viva-college": 0.5385,
    "wctm": 0.6535,
    "sharda-university": 0.7745,
    "cet-varur": 0.8975,
}
ROW2_LOGOS = {
    "ap-shah": 0.4265,
    "ajeenkya-dy-patil": 0.5385,
    "atharva-college": 0.6535,
    "sanjivani-college": 0.7745,
    "mgm-college": 0.8975,
}
for slug, cx in ROW1_LOGOS.items():
    save(crop("partners", (cx - HALF, ROW1[0], cx + HALF, ROW1[1])),
         "partners/{}.jpg".format(slug), quality=92)
for slug, cx in ROW2_LOGOS.items():
    save(crop("partners", (cx - HALF, ROW2[0], cx + HALF, ROW2[1])),
         "partners/{}.jpg".format(slug), quality=92)

print("Done. Comp-resolution artwork - see CONTENT-TODO.md for the originals.")
