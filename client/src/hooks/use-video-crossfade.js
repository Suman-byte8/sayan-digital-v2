"use client";

import { useEffect, useRef, useState } from "react";

const CROSSFADE_SECONDS = 0.5;

export function useVideoCrossfade() {
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const crossfadingRef = useRef(false);
  const [activeVideo, setActiveVideo] = useState("a");

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    const makeHandler = (activeRef, inactiveRef, nextKey) => () => {
      const active = activeRef.current;
      const inactive = inactiveRef.current;
      if (!active || !inactive || crossfadingRef.current) return;
      if (!active.duration) return;

      if (active.duration - active.currentTime <= CROSSFADE_SECONDS) {
        crossfadingRef.current = true;
        inactive.currentTime = 0;
        inactive.play().catch(() => {});
        setActiveVideo(nextKey);

        window.setTimeout(() => {
          active.pause();
          crossfadingRef.current = false;
        }, CROSSFADE_SECONDS * 1000);
      }
    };

    const onATimeUpdate = makeHandler(videoARef, videoBRef, "b");
    const onBTimeUpdate = makeHandler(videoBRef, videoARef, "a");

    videoA.addEventListener("timeupdate", onATimeUpdate);
    videoB.addEventListener("timeupdate", onBTimeUpdate);
    videoA.play().catch(() => {});

    return () => {
      videoA.removeEventListener("timeupdate", onATimeUpdate);
      videoB.removeEventListener("timeupdate", onBTimeUpdate);
    };
  }, []);

  return { videoARef, videoBRef, activeVideo };
}
