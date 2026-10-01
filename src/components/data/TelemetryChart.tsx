import {
  formatDayMonth,
  formatNumber,
  formatTime,
  METRIC_META,
} from "@/lib/format";
import type { SeriesPoint } from "@/data/measurements";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * One measurement over time, drawn the way the rest of the site is set.
 *
 * Recharts is used directly rather than through the shadcn `ChartContainer`
 * wrapper: that component injects its own CSS custom properties and a fixed
 * height contract, and this chart needs to sit on the lagoon paper with a
 * transparent fill and rules drawn in the border colour, not in a themed box.
 *
 * The `chart-*` slots are the hanada → lagoon ramp already defined in
 * `src/index.css`. They resolve as `var(--color-chart-N)` on SVG attributes.
 */

const TICK = "var(--color-muted-foreground)";

export function TelemetryChart({
  data,
  metric,
  slot = 1,
  height = 260,
  average,
}: {
  data: SeriesPoint[];
  metric: string;
  slot?: 1 | 2 | 3 | 4 | 5;
  height?: number;
  /** Draws a dashed mean line — used on the statistics page. */
  average?: number;
}) {
  const meta = METRIC_META[metric];
  const stroke = `var(--color-chart-${slot})`;

  // A little headroom above and below so the stroke is never clipped.
  const values = data.map((d) => d.value);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const pad = Math.max((max - min) * 0.18, 0.5);

  const shortRange =
    data.length > 0 && data[data.length - 1].ts - data[0].ts < 3 * 86_400_000;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id={`fill-${metric}-${slot}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--color-border)" vertical={false} />

          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) =>
              shortRange ? formatTime(ts) : formatDayMonth(ts)
            }
            tick={{ fill: TICK, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            minTickGap={32}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tick={{ fill: TICK, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v) => formatNumber(v)}
          />

          {average !== undefined && (
            <ReferenceLine
              y={average}
              stroke="var(--color-muted-foreground)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />
          )}

          <Tooltip
            cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="border border-border bg-background/95 px-3 py-2 text-xs backdrop-blur-sm">
                  <p className="text-muted-foreground">
                    {shortRange ? formatTime(Number(label)) : formatDayMonth(Number(label))}
                  </p>
                  <p className="mt-0.5 font-medium tabular-nums">
                    {formatNumber(payload[0].value as number, meta.digits)} {meta.unit}
                  </p>
                </div>
              );
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.5}
            fill={`url(#fill-${metric}-${slot})`}
            dot={false}
            activeDot={{ r: 3, fill: stroke, stroke: "none" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
