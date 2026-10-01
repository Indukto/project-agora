import { TelemetryChart } from "@/components/data/TelemetryChart";
import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { Figure, FigureGrid } from "@/components/site/Figure";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { KIND_LABEL } from "@/data/fixtures";
import {
  getSeries,
  getStats,
  getUplinkLog,
  NODES,
  RANGES,
  type RangeKey,
} from "@/data/measurements";
import { useNow } from "@/hooks/use-now";
import {
  formatDayTime,
  formatNumber,
  formatTime,
  METRIC_META,
} from "@/lib/format";
import { cn } from "@/lib/utils";

import { useSearchParams } from "react-router";

/**
 * Statistiken — the history behind each live number.
 *
 * The node and the range live in the query string, so a link from the live page
 * or a screenshot in a presentation opens on exactly the same view. Long ranges
 * are bucketed by `getSeries`; buckets where a node did not transmit stay
 * missing instead of being interpolated, because a gap in a real measurement is
 * information and a straight line through it is a lie.
 */

/** Which measurements a node kind can actually report. */
const METRICS_BY_KIND = {
  climate: ["temperatureC", "humidityPct"],
  soil: ["soilMoisturePct"],
  weather: ["temperatureC", "pressureHpa"],
} as const;

const SLOT_BY_METRIC: Record<string, 1 | 2 | 3 | 4 | 5> = {
  temperatureC: 1,
  humidityPct: 2,
  soilMoisturePct: 3,
  pressureHpa: 4,
  rssi: 4,
  snr: 5,
  batteryPct: 2,
};

function Selector<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={cn(
            "border-b pb-1 text-sm transition-colors",
            value === option.key
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function Statistics() {
  const now = useNow(60_000);
  const [params, setParams] = useSearchParams();

  const nodeId = params.get("node") ?? NODES[0].id;
  const node = NODES.find((n) => n.id === nodeId) ?? NODES[0];

  const rangeParam = params.get("range");
  const range: RangeKey = (RANGES.find((r) => r.key === rangeParam)?.key ??
    "24h") as RangeKey;

  const metrics = METRICS_BY_KIND[node.kind];
  const metricParam = params.get("metric");
  const metric = (metrics as readonly string[]).includes(metricParam ?? "")
    ? (metricParam as string)
    : metrics[0];

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  };

  const series = getSeries(node.id, range, now, metric as never);
  const stats = getStats(node.id, range, now, metric as never);
  const meta = METRIC_META[metric];
  const uplinks = getUplinkLog(now, 12);
  const nameOf = (id: string) => NODES.find((n) => n.id === id)?.name ?? id;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Statistiken"
        title="Verlauf der Messwerte"
        lede="Jede Kurve ist aus echten Uplinks aufgebaut. Lücken bleiben Lücken — wo ein Knoten nicht gesendet hat, wurde nichts gemalt."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <Reveal>
          <Selector
            label="Knoten"
            value={node.id}
            onChange={(v) => set("node", v)}
            options={NODES.map((n) => ({ key: n.id, label: n.name }))}
          />
        </Reveal>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <Reveal>
            <Selector
              label="Zeitraum"
              value={range}
              onChange={(v) => set("range", v)}
              options={RANGES.map((r) => ({ key: r.key, label: r.label }))}
            />
          </Reveal>
          <p className="text-sm text-muted-foreground">{KIND_LABEL[node.kind]}</p>
        </div>

        {metrics.length > 1 && (
          <Reveal>
            <div className="mt-10 border-t border-border pt-6">
              <Selector
                label="Messgröße"
                value={metric}
                onChange={(v) => set("metric", v)}
                options={metrics.map((m) => ({ key: m, label: METRIC_META[m].label }))}
              />
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl">
                {meta.label} — {node.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {RANGES.find((r) => r.key === range)?.label}
              </span>
            </div>

            {series.length > 1 ? (
              <TelemetryChart
                data={series}
                metric={metric}
                slot={SLOT_BY_METRIC[metric] ?? 1}
                average={stats?.avg}
                height={300}
              />
            ) : (
              <p className="mt-6 border-y border-border py-10 text-center text-sm text-muted-foreground">
                Für diesen Zeitraum liegen zu wenige Uplinks vor.
              </p>
            )}
          </div>
        </Reveal>

        {stats && (
          <Reveal>
            <FigureGrid columns={4} className="mt-12">
              <Figure
                label="Mittelwert"
                value={formatNumber(stats.avg, meta.digits)}
                unit={meta.unit}
              />
              <Figure
                label="Minimum"
                value={formatNumber(stats.min, meta.digits)}
                unit={meta.unit}
              />
              <Figure
                label="Maximum"
                value={formatNumber(stats.max, meta.digits)}
                unit={meta.unit}
              />
              <Figure
                label="Uplinks"
                value={formatNumber(stats.count)}
                unit="Stück"
              />
            </FigureGrid>
          </Reveal>
        )}

        <Reveal>
          <section className="mt-16">
            <h2 className="text-xl">Letzte Funkframes</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Jede Zeile ist ein Uplink am Gateway, mit den Parametern, mit denen
              er wirklich gesendet wurde.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Knoten", "Zeit", "RSSI", "SNR", "SF", "BW", "Payload"].map(
                      (label, i) => (
                        <th
                          key={label}
                          scope="col"
                          className={cn(
                            "py-3 pr-4 text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase",
                            i === 0 || i === 1 ? "text-left" : "text-right",
                          )}
                        >
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {uplinks.map((u, i) => (
                    <tr key={`${u.nodeId}-${u.ts}-${i}`} className="border-b border-border/60">
                      <td className="py-3 pr-4">{nameOf(u.nodeId)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDayTime(u.ts)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatNumber(u.rssi)} dBm
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatNumber(u.snr, 1)} dB
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        SF{u.spreadingFactor}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatNumber(u.bandwidthKhz)} kHz
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {u.payloadBytes} B
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Frame um {formatTime(now)} aus dem Gateway-Protokoll abgerufen.
            </p>
          </section>
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
