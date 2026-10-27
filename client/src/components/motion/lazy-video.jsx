"use client";

import { useEffect, useRef } from "react";

// Muted looping video that only downloads and plays once it's near the
// viewport. A plain `autoPlay` video below the fold downloads during page
// load and competes with the Hero for bandwidth (hurting LCP).
export function LazyVideo({ src, className }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return <video ref={videoRef} src={src} preload="none" loop muted playsInline className={className} />;
}
