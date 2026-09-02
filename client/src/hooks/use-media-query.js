"use client";

import { useCallback, useSyncExternalStore } from "react";

// SSR-safe: always `false` on the server and the client's first render, then
// tracks live changes via useSyncExternalStore — no setState-in-effect.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
