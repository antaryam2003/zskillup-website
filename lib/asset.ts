/**
 * Prefixes a /public asset path with the deployment's basePath.
 *
 * next/image normally handles this itself, but NOT when `images.unoptimized` is
 * set - which it is for the GitHub Pages build, because Pages has no image
 * optimiser. Without this, every `/images/...` src resolves against the domain
 * root and 404s, since the site is served from /<repo>/.
 *
 * Returns the path untouched when there is no basePath, which is the case in
 * development and on any root-domain host - so this is safe to leave in place
 * after moving off Pages.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (src: string) =>
  src.startsWith("/") ? `${BASE_PATH}${src}` : src;
