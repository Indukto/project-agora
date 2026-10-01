/**
 * "Signal burst" — the BrandMark's concentric LoRa arcs blown up to poster
 * scale. Static rings give the composition a drawing; four pulses expand out
 * of the centre on a slow loop, and a dashed orbit turns once a minute, so the
 * hero has movement that is not part of the watercolour itself.
 *
 * Timing lives in `src/index.css` (`.signal-burst-*`) and shuts off under
 * `prefers-reduced-motion`, where the static rings remain.
 */

const STATIC_RINGS = [58, 100, 142, 184];
const PULSE_DELAYS = ["0s", "1.2s", "2.4s", "3.6s"];

export function SignalBurst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Drawn rings: the signal already sent. */}
      <g stroke="currentColor">
        {STATIC_RINGS.map((r) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            strokeWidth="0.8"
            opacity="0.18"
          />
        ))}
      </g>

      {/* Pulses expanding outward, staggered around the loop. */}
      <g stroke="currentColor">
        {PULSE_DELAYS.map((delay) => (
          <circle
            key={delay}
            cx="200"
            cy="200"
            r="184"
            strokeWidth="1.4"
            className="signal-burst-ring"
            style={{ animationDelay: delay }}
          />
        ))}
      </g>

      {/* Slow dashed orbit. */}
      <circle
        cx="200"
        cy="200"
        r="176"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1.5 10"
        strokeLinecap="round"
        opacity="0.4"
        className="signal-burst-orbit"
      />

      {/* Beacon origin. */}
      <circle
        cx="200"
        cy="200"
        r="4"
        fill="currentColor"
        className="signal-burst-core"
      />
    </svg>
  );
}
