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
# 01 HERO - the real, sharp photograph, used untouched.
#
# Important finding: the design render does NOT have photograph behind its
# headline. Boost that area's contrast 6x and it is pure white - the render paints
# a solid field there to carry the type. There is no image to recover, so any
# attempt to rebuild it can only invent something, which is what made earlier
# passes look washed or blurred.
#
# So the hero uses the part of the frame that IS photograph: everything right of
# the headline is untouched, sharp campus. That region is cropped and mirrored so
# the student sits on the RIGHT (where the design places her) and the plain, pale
# stone wall falls on the left, under the headline, where it gives the type the
# most contrast the frame has to offer. Nothing is blurred, softened, enlarged or
# painted - beyond removing the one circled note that intrudes into the crop.
#
# Supplying the original photograph would remove the need for the mirror.
# ---------------------------------------------------------------------------
hero_im = load("hero")
HW, HH = hero_im.size

TOP, BOTTOM = 0.095, 0.652           # below the nav bar, above the cards
LEFT = 0.500                         # clear of the headline block and the circled note
plate = hero_im.crop((0, int(TOP * HH), HW, int(BOTTOM * HH)))
PW, PH = plate.size
px = plate.load()


def to_plate_y(src_y):
    return int((src_y - TOP) / (BOTTOM - TOP) * PH)


# The circled "More Than a Degree" note reaches into the crop. It sits on open
# sky, so it is interpolated across from the pixels either side, row by row.
ox0, ox1 = int(0.358 * PW), int(0.492 * PW)
for y in range(max(0, to_plate_y(0.150)), min(PH, to_plate_y(0.330))):
    left, right = px[max(0, ox0 - 2), y], px[min(PW - 1, ox1 + 2), y]
    span = max(1, ox1 - ox0)
    for x in range(ox0, ox1):
        t = (x - ox0) / span
        px[x, y] = tuple(int(left[c] + (right[c] - left[c]) * t) for c in range(3))

hero_plate = plate.crop((int(LEFT * PW), 0, PW, PH)).transpose(Image.FLIP_LEFT_RIGHT)
save(hero_plate, "campus-student-hero.jpg", quality=92)

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
