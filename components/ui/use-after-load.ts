"use client";

import { useEffect, useState } from "react";

// Heavy decoration (WebGL, 3D scenes, brand video) waits until the page has
// loaded and the browser is idle, so it never competes with first paint.
export const useAfterLoad = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    const start = () => {
      const run = () => {
        if (!cancelled) setReady(true);
      };
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 200);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, []);
  return ready;
};
