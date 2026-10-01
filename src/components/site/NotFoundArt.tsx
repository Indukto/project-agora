import { SignalBurst } from "@/components/site/SignalBurst";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * The 404's artwork — the same wash and the same LoRa arcs as the landing, with
 * one change: the arcs drift toward the pointer.
 *
 * That is the whole interaction. A missing page is a frame nobody received, and
 * the one thing a receiver actually does is follow a signal, so moving the
 * cursor is what brings the rings into reach. There is no control panel, no
 * readout and nothing to fail.
 *
 * The springs do the smoothing, not a rAF loop: a heavy pointer is damped into
 * a slow drift instead of snapping, and when the visitor stops, the arcs settle
 * rather than freeze mid-move. Under `prefers-reduced-motion` the travel drops
 * to a tenth and the spring is bypassed — the arcs still follow, but nothing
 * glides.
 */

/** How far the rings travel from centre, in px at the viewport edges. */
const TRAVEL = 90;
/** A tenth of that, and no spring, for `prefers-reduced-motion`. */
const TRAVEL_REDUCED = 9;

export function NotFoundArt() {
  const reduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 });

  // Under reduced motion the rings still answer the pointer — a page that does
  // not react at all is a dead page — but the travel drops to a tenth and the
  // spring is bypassed, so nothing glides across the field of view.
  const x = reduceMotion ? rawX : springX;
  const y = reduceMotion ? rawY : springY;
  const travel = reduceMotion ? TRAVEL_REDUCED : TRAVEL;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    rawX.set(nx * travel);
    rawY.set(ny * travel);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <SignalBurst
        className="pointer-events-none absolute -right-[24%] -bottom-[34%] size-[86vmin] text-[#0b3d3c] opacity-75 mix-blend-multiply sm:-right-[14%] sm:-bottom-[26%]"
        style={{ x, y }}
      />
    </div>
  );
}
