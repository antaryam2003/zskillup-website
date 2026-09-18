"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import type { VideoSource } from "@/content/videos";
import { PrephaszLogo } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";

/**
 * The Prephasz product visual - now a real inline video experience rather
 * than a mocked-up dashboard screenshot with a small play well buried inside
 * it (see the removed PrephaszDashboard).
 *
 * Two stacked layers inside one 16:9 box: a built (not screenshotted) cover
 * - the section's own cream/yellow field plus the official logo, so it reads
 * as branded Prephasz cover art rather than a random video frame - and the
 * real <video>, which does not mount until the viewer clicks. That, not a
 * `poster` attribute, is what guarantees no stray first frame ever flashes:
 * there is nothing to flash because the element does not exist yet. Clicking
 * anywhere on the cover crossfades it out and starts native, fully-controlled
 * playback (play/pause, seek, volume, fullscreen) in the same box - never a
 * dialog, another page or another site.
 */
export function PrephaszVideo({ video, label }: { video: VideoSource; label: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lift">
      {/* --- Real player: mounted (and already painted, full-bleed) the
          moment the viewer presses play, sitting BELOW the cover in paint
          order so fading the cover's opacity out gradually reveals it -
          a crossfade, without a separate enter animation on this layer. --- */}
      {playing && video.url ? (
        <video
          // Calling .play() explicitly the moment this element mounts, rather
          // than relying solely on the `autoPlay` attribute, is what makes
          // playback reliably start immediately on click - `autoPlay` alone
          // is inconsistently honoured for an element inserted after the
          // click rather than present at page load.
          ref={(el) => {
            el?.play().catch(() => {});
          }}
          src={asset(video.url)}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          Your browser does not support embedded video.
        </video>
      ) : null}

      {/* --- Cover: built branded artwork, not a dashboard mock or a video frame --- */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${playing ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 bg-prep-soft" />
        <div
          aria-hidden="true"
          className="absolute -top-1/3 -right-1/4 h-[85%] w-[65%] rounded-full bg-prep/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-1/3 -left-1/4 h-[70%] w-[55%] rounded-full bg-prep/25 blur-3xl"
        />

        <PrephaszLogo className="absolute top-4 left-4 h-6 sm:top-5 sm:left-5 sm:h-7" />

        {video.url ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${video.title}`}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-navy/90 text-white shadow-lift transition-transform duration-200 group-hover:scale-105 sm:h-[4.75rem] sm:w-[4.75rem]">
              <Icon name="play" className="ml-1 h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <span className="flex flex-col items-center px-4 text-center">
              <span className="text-[0.9375rem] font-bold text-navy sm:text-base">{label}</span>
              {video.duration ? (
                <span className="mt-0.5 text-[0.8125rem] text-navy/60">{video.duration}</span>
              ) : null}
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="text-sm text-navy/60">This walkthrough is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
