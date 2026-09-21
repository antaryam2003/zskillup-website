/**
 * Prepares the photo for "A ZSkillup career pathway".
 *
 * The comp render baked three things into commerce-student.jpg that the page now
 * needs to own itself:
 *
 *   1. The book-spine labels ("B.Com / ACCA / Global Career") - printed into the
 *      pixels, so they can't be edited or made accessible. They are erased here
 *      and re-drawn as live text in BcomAcca.tsx.
 *   2. A stray teal "t" on the left edge - the tail of an old baked handwritten
 *      note that the page already renders in real type.
 *
 * Erasing works row by row: each pixel row inside a patch is a straight blend
 * between the clean spine colour just left of the text and just right of it,
 * which preserves the soft light-to-dark shading of the book face. A touch of
 * noise keeps the patch from looking smoother than the JPEG around it.
 *
 * The original commerce-student.jpg is left untouched; this writes a sibling file.
 *
 *   node scripts/clean-commerce-student.mjs   (needs the dev server on :3000)
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "public/images/commerce-student-pathway.jpg";

/** Patches in source-image pixels (609 x 750). Margins are deliberately generous. */
const spinePatches = [
  { x0: 355, x1: 441, y0: 546, y1: 574 }, // "B.Com"
  { x0: 349, x1: 425, y0: 584, y1: 609 }, // "ACCA"
  { x0: 343, x1: 492, y0: 619, y1: 646 }, // "Global Career"
];
const strayMark = { x0: 0, x1: 17, y0: 89, y1: 114 };

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto(`${BASE}/images/commerce-student.jpg`);

const dataUrl = await page.evaluate(
  ({ spinePatches, strayMark }) => {
    const img = document.images[0];
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext("2d");
    g.drawImage(img, 0, 0);
    const data = g.getImageData(0, 0, W, H);
    const d = data.data;

    // Deterministic noise so the output is reproducible.
    let seed = 7;
    const noise = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed / 2147483647 - 0.5) * 3;
    };

    /** Mean colour of a small block, averaged over three rows for stability. */
    const sample = (xa, xb, y) => {
      const acc = [0, 0, 0];
      let n = 0;
      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = xa; xx <= xb; xx++) {
          const i = (yy * W + xx) * 4;
          acc[0] += d[i];
          acc[1] += d[i + 1];
          acc[2] += d[i + 2];
          n++;
        }
      return acc.map((v) => v / n);
    };

    // Horizontal blend per row: for flat, softly shaded surfaces.
    const fillRows = ({ x0, x1, y0, y1 }) => {
      for (let y = y0; y <= y1; y++) {
        const left = sample(Math.max(0, x0 - 6), Math.max(0, x0 - 3), y);
        const right = sample(x1 + 3, Math.min(W - 1, x1 + 6), y);
        for (let x = x0; x <= x1; x++) {
          const t = (x - x0) / (x1 - x0 || 1);
          const i = (y * W + x) * 4;
          for (let c = 0; c < 3; c++) {
            const v = left[c] + (right[c] - left[c]) * t + noise();
            d[i + c] = Math.max(0, Math.min(255, v));
          }
        }
      }
    };

    // Vertical blend per column: for the stray mark, whose neighbours above and
    // below are clean white haze (there is no clean pixel to its left - it sits
    // on the image edge).
    const fillColumns = ({ x0, x1, y0, y1 }) => {
      for (let x = x0; x <= x1; x++) {
        const at = (y) => {
          const acc = [0, 0, 0];
          let n = 0;
          for (let xx = Math.max(0, x - 1); xx <= Math.min(W - 1, x + 1); xx++) {
            const i = (y * W + xx) * 4;
            acc[0] += d[i];
            acc[1] += d[i + 1];
            acc[2] += d[i + 2];
            n++;
          }
          return acc.map((v) => v / n);
        };
        const top = at(y0 - 3);
        const bottom = at(y1 + 3);
        for (let y = y0; y <= y1; y++) {
          const t = (y - y0) / (y1 - y0 || 1);
          const i = (y * W + x) * 4;
          for (let c = 0; c < 3; c++) {
            d[i + c] = Math.max(0, Math.min(255, top[c] + (bottom[c] - top[c]) * t + noise()));
          }
        }
      }
    };

    spinePatches.forEach(fillRows);
    fillColumns(strayMark);

    g.putImageData(data, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95);
  },
  { spinePatches, strayMark },
);

writeFileSync(OUT, Buffer.from(dataUrl.split(",")[1], "base64"));
await browser.close();
console.log("wrote", OUT);
