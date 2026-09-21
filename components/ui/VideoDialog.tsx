"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { VideoSource } from "@/content/videos";
import { Icon } from "./Icon";

/** A direct media file (served from /public) rather than a YouTube/Vimeo
    embed URL - these get a native <video controls> element instead of an
    <iframe>, and are resolved through `asset()` for the GitHub Pages
    basePath, since (unlike embed URLs) they're a same-origin /public path. */
const isDirectVideoFile = (url: string) => /\.(mp4|webm|ogv|mov)$/i.test(url);

/**
 * Accessible video player, opened on demand.
 *
 * Uses the native <dialog> element so focus trapping, Escape-to-close and
 * background inertness come from the platform rather than hand-rolled JavaScript.
 *
 * Nothing loads until the viewer opens it - the brief rules out autoplay and
 * heavy media on page load, and an iframe that only mounts on open keeps the
 * hero's LCP clean.
 *
 * Trigger variants:
 *   text    - play glyph + label, no chrome.
 *   pill    - outlined pill with a play glyph. What the hero cards use: still the
 *             lightest of the three actions, but a clear target.
 *   overlay - large centred play control, used on the Prephasz product visual.
 */
export function VideoDialog({
  video,
  label,
  variant = "text",
  className = "",
}: {
  video: VideoSource;
  label: string;
  variant?: "text" | "pill" | "overlay";
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  const open = () => {
    setMounted(true);
    ref.current?.showModal();
  };

  // Unmount the iframe on close so playback actually stops.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClose = () => setMounted(false);
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      {variant === "pill" ? (
        <button
          type="button"
          onClick={open}
          className={`group inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-4 pl-1.5 text-[0.875rem] font-semibold whitespace-nowrap text-navy transition-colors hover:border-navy/30 ${className}`}
        >
          {/* The play glyph sits inside its own outlined circle - a thin
              border matching the pill's own, NOT a dark fill - so the whole
              control reads as the lightest of the three actions. This can
              afford to sit roomier than the card's other two actions: it has
              its own row now, rather than sharing one with them, so it isn't
              competing for width the way it used to. */}
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-navy transition-colors group-hover:border-navy/30">
            <Icon name="play" className="ml-0.5 h-3 w-3" />
          </span>
          {label}
        </button>
      ) : variant === "text" ? (
        <button
          type="button"
          onClick={open}
          className={`group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-muted transition-colors hover:text-navy ${className}`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-navy transition-colors group-hover:border-navy/25">
            <Icon name="play" className="ml-0.5 h-3 w-3" />
          </span>
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={open}
          className={`group absolute inset-0 grid place-items-center ${className}`}
        >
          <span className="flex flex-col items-center px-3 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-navy/85 text-white shadow-lift transition-transform duration-200 group-hover:scale-105">
              <Icon name="play" className="ml-0.5 h-4 w-4" />
            </span>
            <span className="mt-2.5 text-[0.8125rem] font-semibold text-navy">{label}</span>
            {video.duration ? (
              <span className="mt-0.5 text-[0.6875rem] text-muted">{video.duration}</span>
            ) : null}
          </span>
        </button>
      )}

      {/* The browser's own `dialog:modal` UA style centers this via
          `position: fixed; inset: 0; margin: auto` - but Tailwind's
          preflight resets every element's margin to 0, which is what was
          actually pinning it to the top-left corner rather than "not quite
          centering" it: `inset: 0` with a fixed width/height and NO margin
          just anchors the box at that corner instead of centering it inside
          that box. `m-auto` is the whole fix - `position`/`inset` are
          already the browser's own, untouched.

          Width is a `min(cap, vw)` - same pattern as the trigger row's own
          sizing elsewhere in this file - deliberately smaller than before
          (56rem/70vw, was 60rem/92vw): at 92vw wide, a 16:9 video plus the
          header bar could exceed a short/wide viewport's own height (check
          this in-browser on a ~1536x674 window - the old sizing left under
          20px of clearance top+bottom combined), which is what actually
          read as "too large" more than raw width did. */}
      <dialog
        ref={ref}
        aria-label={video.title}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[92vw] rounded-2xl border-0 bg-navy p-0 text-white backdrop:bg-navy-deep/70 sm:w-[min(56rem,70vw)]"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="text-base font-semibold text-white">{video.title}</h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            aria-label="Close video"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="aspect-video w-full bg-navy-deep">
          {mounted && video.url && isDirectVideoFile(video.url) ? (
            // Native controls give play/pause, volume, a scrub bar and
            // fullscreen for free - object-contain keeps the video's own
            // aspect ratio intact rather than stretching it to fill this
            // 16:9 well (harmless here since the source already is 16:9,
            // but correct regardless of a future source's own ratio).
            <video
              key={video.url}
              src={asset(video.url)}
              controls
              playsInline
              autoPlay
              className="h-full w-full object-contain"
            >
              Your browser does not support embedded video.
            </video>
          ) : mounted && video.url ? (
            <iframe
              src={video.url}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-white/20">
                  <Icon name="play" className="ml-1 h-5 w-5 text-white/70" />
                </span>
                <p className="text-sm text-white/70">This walkthrough is coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
