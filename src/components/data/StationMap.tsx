import { NODES, STATION } from "@/data/fixtures";

/**
 * The campus, drawn from the coordinates in `src/data/fixtures.ts`.
 *
 * Deliberately not a tile map. A Leaflet/OpenStreetMap layer would need the
 * network to answer, which is a bad property for a page someone demonstrates in
 * a classroom, and it would pull in attribution and tile-usage obligations for
 * a footprint that is under two kilometres across. At this scale a hand-drawn
 * range map is both more honest and more useful: the circles are the reach
 * quoted for each spreading factor, so the reader sees *why* the soil node runs
 * SF11 and the roof node runs SF7.
 *
 * The projection is equirectangular with a cos(latitude) correction, which
 * keeps the range circles circular instead of shearing them north — a Mercator
 * map would turn the radius into an ellipse and quietly misstate the reach.
 */

const W = 1000;
const H = 700;
const M_PER_DEG = 111_320;

export function StationMap() {
  const midLat = (STATION.lat + NODES.reduce((a, n) => a + n.lat, 0) / NODES.length) / 2;
  const mPerLng = M_PER_DEG * Math.cos((midLat * Math.PI) / 180);

  // Everything positioned relative to the gateway, in metres.
  const rel = NODES.map((n) => ({
    node: n,
    x: (n.lng - STATION.lng) * mPerLng,
    y: (n.lat - STATION.lat) * M_PER_DEG,
  }));

  const reach = (spreadingFactor: number) =>
    STATION.rangeBySf[spreadingFactor] ?? 2_000;
  const maxRange = Math.max(...rel.map((p) => reach(p.node.spreadingFactor)));

  const minX = Math.min(0, ...rel.map((p) => p.x)) - maxRange;
  const maxX = Math.max(0, ...rel.map((p) => p.x)) + maxRange;
  const minY = Math.min(0, ...rel.map((p) => p.y)) - maxRange;
  const maxY = Math.max(0, ...rel.map((p) => p.y)) + maxRange;

  const scale = Math.min(W / (maxX - minX), H / (maxY - minY));
  const px = (mx: number) => (mx - minX) * scale;
  const py = (my: number) => (maxY - my) * scale;

  const gateway = { x: px(0), y: py(0) };

  // A round scale-bar length that fits the frame.
  const targetPx = 130;
  const niceM = [100, 200, 250, 500, 1_000, 2_000, 5_000, 10_000].reduce((best, m) =>
    Math.abs(m * scale - targetPx) < Math.abs(best * scale - targetPx) ? m : best,
  );

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Karte der Funkstation ${STATION.name} mit ${NODES.length} Sensorknoten und ihren Reichweiten`}
      >
        <defs>
          <radialGradient id="map-wash" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="var(--color-surface-1)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-surface-1)" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#map-wash)" />

        {/* Hairline grid — texture without a background image. */}
        <g stroke="var(--color-border)" strokeWidth="0.6" opacity="0.7">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={(W / 10) * i} y1={0} x2={(W / 10) * i} y2={H} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={(H / 7) * i} x2={W} y2={(H / 7) * i} />
          ))}
        </g>

        {/* Range circles, one per node, sized by its spreading factor. */}
        <g fill="none" stroke="var(--color-chart-1)" strokeWidth="0.8" strokeOpacity="0.5">
          {rel.map((p) => (
            <circle
              key={`r-${p.node.id}`}
              cx={px(p.x)}
              cy={py(p.y)}
              r={reach(p.node.spreadingFactor) * scale}
              strokeDasharray="5 5"
            />
          ))}
        </g>

        {/* Link lines from each node to the gateway. */}
        <g stroke="var(--color-muted-foreground)" strokeWidth="0.8" strokeOpacity="0.55">
          {rel.map((p) => (
            <line key={`l-${p.node.id}`} x1={px(p.x)} y1={py(p.y)} x2={gateway.x} y2={gateway.y} />
          ))}
        </g>

        {/* Nodes. */}
        {rel.map((p) => (
          <circle
            key={p.node.id}
            cx={px(p.x)}
            cy={py(p.y)}
            r={5.5}
            fill="var(--color-chart-2)"
            stroke="var(--color-background)"
            strokeWidth="1.5"
          />
        ))}

        {/* The gateway: concentric, like the BrandMark. */}
        <g stroke="var(--color-primary)">
          <circle cx={gateway.x} cy={gateway.y} r={15} fill="none" strokeWidth="1" strokeOpacity="0.45" />
          <circle cx={gateway.x} cy={gateway.y} r={24} fill="none" strokeWidth="1" strokeOpacity="0.25" />
          <circle cx={gateway.x} cy={gateway.y} r={4} fill="var(--color-primary)" stroke="none" />
        </g>

        {/* Scale bar. */}
        <g transform={`translate(${W - niceM * scale - 40}, ${H - 34})`}>
          <line
            x1={0}
            y1={0}
            x2={niceM * scale}
            y2={0}
            stroke="var(--color-muted-foreground)"
            strokeWidth="1.2"
          />
          <line x1={0} y1={-4} x2={0} y2={4} stroke="var(--color-muted-foreground)" strokeWidth="1.2" />
          <line
            x1={niceM * scale}
            y1={-4}
            x2={niceM * scale}
            y2={4}
            stroke="var(--color-muted-foreground)"
            strokeWidth="1.2"
          />
          <text
            x={niceM * scale / 2}
            y={-10}
            textAnchor="middle"
            fontSize="13"
            fill="var(--color-muted-foreground)"
          >
            {niceM >= 1000 ? `${niceM / 1000} km` : `${niceM} m`}
          </text>
        </g>
      </svg>

      <figcaption className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
        Gestrichelte Kreise zeigen die Reichweite, die für den Spreading Factor des
        jeweiligen Knotens angegeben ist. Gestrichelte Linien verbinden jeden Knoten
        mit dem Gateway. Der äußere Punkt ist der Dachmesspunkt mit SF7, der
        innerste der Schulgarten mit SF11 — dieselbe Funkstärke, viermal so lange
        gesendet.
      </figcaption>
    </figure>
  );
}
