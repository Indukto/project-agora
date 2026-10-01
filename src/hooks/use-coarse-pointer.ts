import { useState } from "react";

/**
 * Whether this device's primary input is a finger rather than a mouse.
 *
 * `navigator.maxTouchPoints` is deliberately NOT consulted. A touchscreen
 * laptop reports touch points but also reports a fine primary pointer and owns a
 * keyboard — it is exactly the machine the blue screen is for. `pointer:
 * coarse` asks the narrower question: can this thing be driven by touch alone.
 *
 * Evaluated once per mount and never re-read. The 404 picks between two
 * different pages, not between two states of one page, and re-deciding on
 * rotation would swap the whole thing under the visitor mid-read.
 */
export function useCoarsePointer(): boolean {
  const [coarse] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(pointer: coarse)").matches;
  });

  return coarse;
}
