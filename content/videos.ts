/**
 * Video sources for the "Watch Video" actions.
 *
 * ---------------------------------------------------------------------------
 *  Each entry is `null` until a real URL exists. While an entry is null the
 *  player opens and states plainly that the walkthrough is coming soon - it does
 *  not pretend to load something that does not exist, and no fake embed ships.
 *
 *  To enable: set `url` to an embed URL (YouTube/Vimeo `embed` form) or a
 *  direct file path under /public (e.g. "/videos/name.mp4" - VideoDialog
 *  detects the file extension and renders a native <video controls> element
 *  instead of an <iframe> for these, and runs the path through `asset()` so
 *  it resolves under the GitHub Pages basePath). Nothing else needs to change.
 * ---------------------------------------------------------------------------
 *
 *  The brief requires no autoplay and no oversized background media, so videos
 *  load only once the viewer opens the dialog - never on page load.
 */

export type VideoSource = {
  /** Embed URL, or null while the video does not exist yet. */
  url: string | null;
  title: string;
  /** Shown beside the play control. */
  duration?: string;
};

export const videos: Record<"institutions" | "prephasz" | "commerce", VideoSource> = {
  institutions: {
    url: null,
    title: "How ZSkillup works with institutions",
  },
  prephasz: {
    url: "/videos/prephasz-tour.mp4",
    title: "Watch prephasz in action",
    duration: "2 min",
  },
  commerce: {
    url: null,
    title: "Inside the B.Com + ACCA pathway",
  },
};
