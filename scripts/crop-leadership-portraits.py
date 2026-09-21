"""
Trims the leadership portraits for the redesigned "Our Leadership" cards.

The files in public/images/team/<slug>.jpg were cropped from an older comp and
carry a baked-in white margin (top ~14px, left 6-20px) plus a rounded top-left
corner. Inside the new rounded image well that reads as a white notch, so this
cuts each portrait to the largest square that is free of it. No pixels are
resampled or invented - it is a plain crop, re-saved at high quality.

    python scripts/crop-leadership-portraits.py
"""
from PIL import Image
from pathlib import Path

TEAM = Path(__file__).resolve().parent.parent / "public" / "images" / "team"
SIZE = 208          # widest clean square available across all three portraits
TOP = 16            # first fully-clean row (rounded corner clipped by CSS radius)
LEFT = {"lokesh-mathur": 14, "gaurav-singh": 12, "manish-temani": 22}

for slug, x0 in LEFT.items():
    im = Image.open(TEAM / f"{slug}.jpg").convert("RGB")
    im.crop((x0, TOP, x0 + SIZE, TOP + SIZE)).save(
        TEAM / f"{slug}-portrait.jpg", quality=95, subsampling=0
    )
    print(slug, "->", f"{slug}-portrait.jpg")
