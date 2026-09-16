/**
 * Screenshot helper used during development to review the homepage at desktop
 * and mobile widths. Not part of the app build.
 *
 *   node scripts/shoot.mjs <baseUrl> <outDir>
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.argv[2] ?? "http://localhost:3210";
const out = process.argv[3] ?? "shots";
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
});

async function shoot(name, width, height, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(base + (opts.path ?? "/"), { waitUntil: "load", timeout: 90000 });
  // Let fonts settle and lazy images inside the viewport resolve.
  await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 600));
  if (opts.scrollThrough) {
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
  }
  if (opts.clip) {
    await page.screenshot({ path: `${out}/${name}.png`, clip: opts.clip });
  } else {
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: !!opts.full });
  }
  const errors = await page.evaluate(() => window.__errors ?? []);
  await page.close();
  return errors;
}

const desktop = { width: 1440, height: 900 };

// Individual section captures, so each can be compared against its comp.
const sections = [
  ["01-hero", "#main > section:nth-of-type(1)"],
  ["02-about", "#about"],
  ["03-choose-route", "#choose-your-route"],
  ["04-institutions", "#institutions"],
  ["05-prephasz", "#prephasz"],
  ["06-bcom-acca", "#bcom-acca"],
  ["07-education-path", "#education-to-career"],
  ["08-partners", "#partners"],
  ["09-testimonials", "#testimonials"],
  ["10-in-action", "#in-action"],
  ["11-faqs", "#faqs"],
  ["12-final-cta", "#partner-with-us"],
];

const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
await page.setViewport({ ...desktop, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 600));
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 140));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));
});

for (const [name, selector] of sections) {
  const el = await page.$(selector);
  if (!el) {
    console.log(`MISSING ${selector}`);
    continue;
  }
  await el.screenshot({ path: `${out}/${name}.png` });
  console.log(`shot ${name}`);
}

await page.close();

await shoot("mobile-top", 390, 844, { scrollThrough: false });
await shoot("mobile-full", 390, 844, { full: true, scrollThrough: true });
console.log("shot mobile");

if (consoleErrors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of [...new Set(consoleErrors)]) console.log(" -", e);
} else {
  console.log("\nNo console errors.");
}

await browser.close();
