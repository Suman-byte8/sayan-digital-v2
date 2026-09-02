"use client";

import { useVideoCrossfade } from "@/hooks/use-video-crossfade";
import { SITE } from "@/constants/site";

export function HeroBackgroundVideo() {
  const { videoARef, videoBRef, activeVideo } = useVideoCrossfade();

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <video
        ref={videoARef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          activeVideo === "a" ? "opacity-100" : "opacity-0"
        }`}
        src={SITE.videoSrc}
        muted
        autoPlay
        playsInline
        preload="auto"
      />
      <video
        ref={videoBRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          activeVideo === "b" ? "opacity-100" : "opacity-0"
        }`}
        src={SITE.videoSrc}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
