/**
 * Telemetry — a pure, deterministic model of what the school station measures.
 *
 * `valueAt(node, ts)` is a pure function: the same node and timestamp always
 * produce the same reading. That is what makes the seam real. Today
 * `src/data/measurements.ts` calls it directly, so the site works with no
 * backend at all; a LoRaWAN network server can call the *same* functions to
 * write the rows into a database, and the pages switch to reading those. No
 * page changes, and the numbers a school class sees today are the numbers the
 * backend serves tomorrow.
 *
 * Nothing here reads `Math.random()` or the clock — time arrives as an argument.
 */

/* ── deterministic noise ───────────────────────────────────────────────── */

/** 32-bit FNV-1a over a string, mixed with a salt so channels stay independent. */
function hash(salt: string): number {
  let h = 2166136261;
  for (let i = 0; i < salt.length; i++) {
    h ^= salt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Uniform 0..1 for one integer lattice point. */
function lattice(seed: number, i: number): number {
  let t = (seed + Math.imul(i, 0x9e3779b9)) >>> 0;
  t = Math.imul(t ^ (t >>> 16), 0x85ebca6b) >>> 0;
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35) >>> 0;
  return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
}

/**
 * Value noise: a random value at every `periodMs` step, smoothstep-interpolated
 * in between. This is what gives the series its slow drift — a warm front
 * moving through over hours — instead of per-sample static.
 */
function drift(seed: number, ts: number, periodMs: number): number {
  const x = ts / periodMs;
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = lattice(seed, i);
  const b = lattice(seed, i + 1);
  return a + (b - a) * u;
}

/** Fine-grained wobble, correlated over roughly a reading interval. */
function jitter(seed: number, ts: number, windowMs: number): number {
  return lattice(seed ^ hash("j"), Math.floor(ts / windowMs)) * 2 - 1;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, digits = 1) => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};

/* ── link budget ───────────────────────────────────────────────────────── */

const TX_POWER_DBM = 14; // EU 868 MHz duty-cycle limit
const RX_GAIN_DBI = 2;
const NOISE_FLOOR_DBM = -121; // measured at the gateway, BW 125 kHz, SF7

/** Great-circle distance in metres. */
export function distanceM(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * LoRa time-on-air from the Semtech AN1200.22 formula, including the low-data-
 * rate optimisation that only switches on above SF11 at 125 kHz.
 *
 * `codingRate` is the numerator of the rate — 4 means 4/5 — because the formula
 * multiplies by the *denominator*, CR + 4. Passing 4 straight through
 * understates every airtime by exactly a factor of two.
 */
export function airtimeMs(opts: {
  spreadingFactor: number;
  bandwidthKhz: number;
  payloadBytes: number;
  codingRate: number; // 4 = 4/5, 5 = 4/6 …
  crcOn: boolean;
}): number {
  const { spreadingFactor: sf, bandwidthKhz: bw, payloadBytes: pl } = opts;
  const tsym = (2 ** sf) / bw; // ms
  const preamble = (8 + 4.25) * tsym;
  const de = sf >= 11 && bw === 125 ? 1 : 0;
  const numerator = 8 * pl - 4 * sf + 28 + 16 * (opts.crcOn ? 1 : 0) - 20 * de;
  const denominator = 4 * (sf - 2 * de);
  const payloadSymbNb =
    8 + Math.max(Math.ceil(numerator / denominator) * (opts.codingRate + 4), 0);
  return preamble + payloadSymbNb * tsym;
}

/* ── the model ─────────────────────────────────────────────────────────── */

export type NodeKind = "climate" | "soil" | "weather";

export interface Station {
  name: string;
  slug: string;
  description: string;
  lat: number;
  lng: number;
  elevationM: number;
  gatewayModel: string;
  antenna: string;
  installedAt: number;
  frequencyMhz: number;
  /** Theoretical urban range per spreading factor, metres. */
  rangeBySf: Record<number, number>;
}

export interface Node {
  id: string;
  stationSlug: string;
  name: string;
  kind: NodeKind;
  lat: number;
  lng: number;
  payloadVersion: number;
  spreadingFactor: number;
  bandwidthKhz: number;
  codingRate: number;
  installedAt: number;
  /** Battery drain per day, percentage points. */
  drainPerDay: number;
  /** Daily peak-to-trough swing for the node's main measurement. */
  swing: number;
  /** Long-run mean of the node's main measurement. */
  baseline: number;
}

export interface Reading {
  nodeId: string;
  ts: number;
  temperatureC: number | null;
  humidityPct: number | null;
  soilMoisturePct: number | null;
  pressureHpa: number | null;
  rssi: number;
  snr: number;
  spreadingFactor: number;
  airtimeMs: number;
  payloadBytes: number;
  batteryPct: number;
  frequencyMhz: number;
  bandwidthKhz: number;
  codingRate: string;
}

export interface Uplink {
  nodeId: string;
  ts: number;
  frequencyMhz: number;
  bandwidthKhz: number;
  spreadingFactor: number;
  codingRate: string;
  payloadBytes: number;
  rssi: number;
  snr: number;
}

/** Minutes past local midnight — the diurnal model is a school-day climate. */
function localHour(ts: number, utcOffsetMinutes: number): number {
  return (((ts + utcOffsetMinutes * 60_000) % 86_400_000) + 86_400_000) % 86_400_000 / 3_600_000;
}

/**
 * The reading a node transmits at `ts`, or `null` when it is not transmitting.
 * Roughly one slot in sixteen is a genuine gap — battery sleep, a missed
 * downlink window — so the charts show that data is not a smooth invention.
 */
export function readingAt(node: Node, station: Station, ts: number): Reading | null {
  const seed = hash(node.id);
  if (drift(seed ^ hash("duty"), ts, 6 * 3_600_000) < 0.062) return null;

  const h = localHour(ts, 120); // Europe/Berlin, CEST
  const d = distanceM(node.lat, node.lng, station.lat, station.lng);

  // Free-space path loss, plus terrain shadowing that drifts. The constant
  // 147.55 is the form `20log10(d_m) + 20log10(f_Hz) − 147.55`; the frequency
  // therefore has to go in in hertz, not in the MHz the UI displays.
  const fspl =
    20 * Math.log10(Math.max(d, 1)) +
    20 * Math.log10(station.frequencyMhz * 1e6) -
    147.55;
  const shadow = 5.5 * drift(seed ^ hash("shadow"), ts, 3 * 3_600_000);
  const rssi = round(
    clamp(TX_POWER_DBM + RX_GAIN_DBI - fspl - shadow, -135, -42),
    0,
  );
  const snr = round(clamp(2.6 + (rssi - NOISE_FLOOR_DBM) * 0.072 + jitter(seed, ts, 900_000) * 0.9, -12, 12.5), 1);

  const days = (ts - node.installedAt) / 86_400_000;
  const batteryPct = round(clamp(100 - days * node.drainPerDay, 3, 100), 0);

  const payloadBytes = node.kind === "climate" ? 10 : node.kind === "soil" ? 6 : 14;

  const common = {
    nodeId: node.id,
    ts,
    rssi,
    snr,
    spreadingFactor: node.spreadingFactor,
    airtimeMs: round(
      airtimeMs({
        spreadingFactor: node.spreadingFactor,
        bandwidthKhz: node.bandwidthKhz,
        payloadBytes,
        codingRate: node.codingRate,
        crcOn: true,
      }),
      1,
    ),
    payloadBytes,
    batteryPct,
    frequencyMhz: station.frequencyMhz,
    bandwidthKhz: node.bandwidthKhz,
    codingRate: `4/${node.codingRate + 1}`,
  };

  // Diurnal shape: coldest around 03:00, warmest around 15:00.
  const diurnal = node.swing * Math.sin(((h - 9) / 24) * 2 * Math.PI);
  const weatherFront = 2.6 * (drift(seed ^ hash("front"), ts, 6 * 3_600_000) - 0.5) * 2;
  const fine = jitter(seed, ts, 1_800_000) * 0.35;

  if (node.kind === "soil") {
    // Soil dries over days, then a rain event rewets it — slow, not diurnal.
    const wet = 1.05 * (drift(seed ^ hash("rain"), ts, 20 * 3_600_000) - 0.5) * 2;
    const soilMoisturePct = round(clamp(node.baseline + wet * 9 + fine * 1.4, 4, 62), 1);
    return { ...common, temperatureC: null, humidityPct: null, soilMoisturePct, pressureHpa: null };
  }

  const temperatureC = round(
    clamp(node.baseline + diurnal + weatherFront + fine, -12, 44),
    1,
  );

  if (node.kind === "weather") {
    const pressureHpa = round(
      clamp(1013 + 9 * (drift(seed ^ hash("pressure"), ts, 12 * 3_600_000) - 0.5) * 2, 975, 1045),
      1,
    );
    return { ...common, temperatureC, humidityPct: null, soilMoisturePct: null, pressureHpa };
  }

  // Climate: humidity tracks temperature inversely, plus its own slow drift.
  const humidityPct = round(
    clamp(88 - 1.15 * (temperatureC - node.baseline) + 7 * (drift(seed ^ hash("hum"), ts, 9 * 3_600_000) - 0.5) * 2, 18, 99),
    0,
  );
  return { ...common, temperatureC, humidityPct, soilMoisturePct: null, pressureHpa: null };
}

export function uplinkAt(reading: Reading): Uplink {
  return {
    nodeId: reading.nodeId,
    ts: reading.ts,
    frequencyMhz: reading.frequencyMhz,
    bandwidthKhz: reading.bandwidthKhz,
    spreadingFactor: reading.spreadingFactor,
    codingRate: reading.codingRate,
    payloadBytes: reading.payloadBytes,
    rssi: reading.rssi,
    snr: reading.snr,
  };
}

/** Every reading in `(from, to]` at the node's reporting interval. */
export function readingsBetween(
  node: Node,
  station: Station,
  from: number,
  to: number,
  intervalMs: number,
): Reading[] {
  const out: Reading[] = [];
  // Align to the interval grid so a range always starts on a clean boundary.
  const start = Math.floor(from / intervalMs) * intervalMs;
  for (let ts = start; ts <= to; ts += intervalMs) {
    if (ts <= from) continue;
    const r = readingAt(node, station, ts);
    if (r) out.push(r);
  }
  return out;
}

/** Most recent reading at or before `ts`, scanning back over ~4 hours. */
export function latestBefore(
  node: Node,
  station: Station,
  ts: number,
  intervalMs: number,
): Reading | null {
  for (let i = 0; i < 240; i++) {
    const at = ts - i * intervalMs;
    const r = readingAt(node, station, at);
    if (r) return r;
  }
  return null;
}
