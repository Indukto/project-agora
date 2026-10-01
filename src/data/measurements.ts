/**
 * The one seam every page reads measurements through.
 *
 * Right now it answers from the deterministic model in `@/lib/telemetry`, so
 * the site works with no backend, offline, and identically on every machine. The
 * day a LoRaWAN network server is connected, this file is the only thing that
 * changes: each function body becomes a Convex query call and the pages keep
 * their imports. That is the whole reason the generator lives in a pure module
 * instead of inside a page.
 *
 * Every function takes `now` rather than reading the clock, so a caller can
 * freeze time for a consistent export and the tests stay deterministic.
 */

import { INTERVAL_MINUTES, NODES, STATION } from "@/data/fixtures";
import {
  latestBefore,
  readingsBetween,
  uplinkAt,
  type Node,
  type Reading,
  type Uplink,
} from "@/lib/telemetry";

export { NODES, STATION, INTERVAL_MINUTES };
export type { Reading, Uplink, Node };

export const RANGES = [
  { key: "24h", label: "24 Stunden", hours: 24 },
  { key: "7d", label: "7 Tage", hours: 24 * 7 },
  { key: "30d", label: "30 Tage", hours: 24 * 30 },
] as const;

export type RangeKey = (typeof RANGES)[number]["key"];

export function rangeHours(key: RangeKey): number {
  return RANGES.find((r) => r.key === key)?.hours ?? 24;
}

export function nodeById(id: string): Node {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown node: ${id}`);
  return node;
}

function intervalMs(node: Node): number {
  return (INTERVAL_MINUTES[node.id] ?? 10) * 60_000;
}

/* ── live ──────────────────────────────────────────────────────────────── */

export interface LiveReading extends Reading {
  nodeName: string;
  nodeKind: Node["kind"];
  /** Milliseconds since this reading was received. */
  ageMs: number;
}

/** The most recent transmission from every node, newest first. */
export function getLive(now: number): LiveReading[] {
  return NODES.map((node) => {
    const reading = latestBefore(node, STATION, now, intervalMs(node));
    if (!reading) throw new Error(`No reading found for ${node.id}`);
    return {
      ...reading,
      nodeName: node.name,
      nodeKind: node.kind,
      ageMs: Math.max(0, now - reading.ts),
    };
  }).sort((a, b) => a.ts - b.ts);
}

/** Worst link on the campus right now — the headline number for the homepage. */
export function getWorstLink(now: number): { rssi: number; snr: number; nodeName: string } {
  const live = getLive(now);
  const worst = live.reduce((a, b) => (a.rssi <= b.rssi ? a : b));
  return { rssi: worst.rssi, snr: worst.snr, nodeName: worst.nodeName };
}

/* ── history ───────────────────────────────────────────────────────────── */

export interface SeriesPoint {
  ts: number;
  value: number;
  /** Mean across the bucket — a short gap should not punch a hole in a line. */
  samples: number;
}

/**
 * One node's main measurement over a range, bucketed so a 30-day view stays
 * around two hundred points. Buckets with no transmission at all are dropped,
 * which keeps the gaps honest instead of drawing a line straight through them.
 */
export function getSeries(
  nodeId: string,
  range: RangeKey,
  now: number,
  metric: "temperatureC" | "humidityPct" | "soilMoisturePct" | "pressureHpa" | "rssi" | "snr" | "batteryPct" = "temperatureC",
): SeriesPoint[] {
  const node = nodeById(nodeId);
  const hours = rangeHours(range);
  const from = now - hours * 3_600_000;
  const step = intervalMs(node);
  const readings = readingsBetween(node, STATION, from, now, step);

  const target = Math.max(1, Math.round((hours * 3_600_000) / (200 * step)));
  const bucketMs = step * target;
  const buckets = new Map<number, number[]>();

  for (const r of readings) {
    const v = r[metric];
    if (v === null || v === undefined) continue;
    const key = Math.floor(r.ts / bucketMs);
    const arr = buckets.get(key);
    if (arr) arr.push(v);
    else buckets.set(key, [v]);
  }

  return [...buckets.entries()]
    .map(([key, values]) => ({
      ts: key * bucketMs,
      value: values.reduce((a, b) => a + b, 0) / values.length,
      samples: values.length,
    }))
    .sort((a, b) => a.ts - b.ts);
}

export interface Stat {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export function getStats(
  nodeId: string,
  range: RangeKey,
  now: number,
  metric: "temperatureC" | "humidityPct" | "soilMoisturePct" | "pressureHpa" | "rssi" | "snr" | "batteryPct" = "temperatureC",
): Stat | null {
  const node = nodeById(nodeId);
  const from = now - rangeHours(range) * 3_600_000;
  const readings = readingsBetween(node, STATION, from, now, intervalMs(node));
  const values = readings
    .map((r) => r[metric])
    .filter((v): v is number => v !== null && v !== undefined);
  if (!values.length) return null;
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
  };
}

/* ── radio log ─────────────────────────────────────────────────────────── */

/** The most recent uplinks across all nodes, newest first. */
export function getUplinkLog(now: number, limit = 40): Uplink[] {
  const out: Uplink[] = [];
  for (const node of NODES) {
    for (const r of readingsBetween(node, STATION, now - 6 * 3_600_000, now, intervalMs(node))) {
      out.push(uplinkAt(r));
    }
  }
  return out.sort((a, b) => b.ts - a.ts).slice(0, limit);
}

/* ── export ────────────────────────────────────────────────────────────── */

const CSV_COLUMNS = [
  "node_id",
  "node_name",
  "timestamp_iso",
  "metric",
  "value",
  "rssi_dbm",
  "snr_db",
  "spreading_factor",
  "airtime_ms",
  "payload_bytes",
  "battery_pct",
] as const;

/** Long format: one row per node, timestamp and measured quantity. */
export function toCsv(nodeId: string, range: RangeKey, now: number): string {
  const node = nodeById(nodeId);
  const from = now - rangeHours(range) * 3_600_000;
  const readings = readingsBetween(node, STATION, from, now, intervalMs(node));

  const lines = [CSV_COLUMNS.join(",")];
  for (const r of readings) {
    for (const metric of ["temperatureC", "humidityPct", "soilMoisturePct", "pressureHpa"] as const) {
      const v = r[metric];
      if (v === null || v === undefined) continue;
      lines.push(
        [
          r.nodeId,
          node.name,
          new Date(r.ts).toISOString(),
          metric,
          v,
          r.rssi,
          r.snr,
          r.spreadingFactor,
          r.airtimeMs,
          r.payloadBytes,
          r.batteryPct,
        ].join(","),
      );
    }
  }
  return lines.join("\n");
}

export function toJson(nodeId: string, range: RangeKey, now: number): string {
  const node = nodeById(nodeId);
  const from = now - rangeHours(range) * 3_600_000;
  return JSON.stringify(
    {
      station: STATION.slug,
      node: { id: node.id, name: node.name, kind: node.kind, payloadVersion: node.payloadVersion },
      range,
      generatedAt: new Date(now).toISOString(),
      readings: readingsBetween(node, STATION, from, now, intervalMs(node)),
    },
    null,
    2,
  );
}
