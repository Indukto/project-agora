import { useEffect, useState } from "react";

/**
 * A clock that ticks, for pages that show how old a reading is.
 *
 * Every measurement on the site is derived from `now`, so a single ticking
 * timestamp keeps the whole page consistent within a render instead of each
 * tile deciding for itself. Paused on a hidden tab — a backgrounded browser
 * re-rendering the live view every second is wasted work and no one is looking.
 */
export function useNow(intervalMs = 5_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (typeof document !== "undefined" && document.hidden) return;

    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
