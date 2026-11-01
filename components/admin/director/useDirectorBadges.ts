"use client";

import { useEffect, useState } from "react";
import type { DirectorBadges } from "../types";

const POLL_MS = 30_000;

// Counts of things waiting on this director. Refetched when the active tab
// changes (so a badge clears right after you act) and every 30s while visible.
export function useDirectorBadges(
  enabled: boolean,
  activeTab: string,
): DirectorBadges {
  const [badges, setBadges] = useState<DirectorBadges>({
    policies: 0,
    finance: 0,
    discussions: 0,
    assets: 0,
  });

  // activeTab is a dependency on purpose: it triggers the refetch
  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch on tab change
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const load = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/director/badges");
        if (res.ok && !cancelled) setBadges(await res.json());
      } catch {
        /* keep the last known counts */
      }
    };
    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [enabled, activeTab]);

  return badges;
}
