/**
 * Post-processes `out/` for GitHub Pages.
 *
 * Two fixes, both specific to hosting a Next.js static export on Pages:
 *
 *   1. `.nojekyll` - Pages runs Jekyll by default, which silently drops any
 *      directory starting with an underscore. Next puts every asset in `_next/`,
 *      so without this file the whole site loads unstyled.
 *
 *   2. RSC prefetch payloads - with `trailingSlash: true`, Next writes a route's
 *      payload to `<route>/__next.<route>/__PAGE__.txt` but the client prefetches
 *      it at `<route>/__next.<route>.__PAGE__.txt`. The mismatch is harmless
 *      (navigation falls back to a full page load) but logs a 404 in the console,
 *      so the file is also copied to the flat name the client asks for.
 *
 * Run automatically by `npm run build:pages`.
 */

import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

if (!existsSync(OUT)) {
  console.error("No out/ directory - run `next build` first.");
  process.exit(1);
}

writeFileSync(join(OUT, ".nojekyll"), "");
console.log("  .nojekyll written");

let flattened = 0;

// Walks the export, flattening every "__next.<route>" directory's __PAGE__.txt
// up to the flat filename the client prefetches.
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;

    if (entry.startsWith("__next.")) {
      const payload = join(full, "__PAGE__.txt");
      if (existsSync(payload)) {
        const flat = join(dir, `${entry}.__PAGE__.txt`);
        copyFileSync(payload, flat);
        flattened += 1;
        console.log(`  flattened ${flat}`);
      }
      continue;
    }
    walk(full);
  }
}

walk(OUT);
console.log(`Done - ${flattened} prefetch payload(s) flattened.`);
