/**
 * German formatting for the AGORA pages, in one place so the live view, the
 * charts' axes and the CSV export never disagree about how a value reads.
 */

const number = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const number1 = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const number0 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

const number2 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

/** `digits` is the maximum number of decimals, not a forced width. */
export function formatNumber(v: number, digits: 0 | 1 | 2 = 0): string {
  return digits === 0 ? number0.format(v) : digits === 1 ? number1.format(v) : number2.format(v);
}

export function formatMs(v: number): string {
  return number.format(v);
}

/** Signed values keep their sign — an RSSI of −93 dBm must not read as 93. */
export function formatSigned(v: number, unit: string, digits: 0 | 1 | 2 = 0): string {
  return `${v > 0 ? "+" : ""}${formatNumber(v, digits)} ${unit}`;
}

export function formatPct(v: number): string {
  return `${formatNumber(v)} %`;
}

const time = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
const dateTime = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const dayTime = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
const dayMonth = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" });

export function formatTime(ts: number): string {
  return time.format(ts);
}

export function formatDayTime(ts: number): string {
  return dayTime.format(ts);
}

export function formatDayMonth(ts: number): string {
  return dayMonth.format(ts);
}

/** Installation dates and similar: "12. Mai 2026". */
export function formatDateTime(ts: number): string {
  return dateTime.format(ts);
}

/** "vor 4 Min." — the age of a reading, which is the honest live signal. */
export function formatAge(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return "gerade eben";
  const min = Math.round(s / 60);
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  if (h < 24) return rest ? `vor ${h} Std. ${rest} Min.` : `vor ${h} Std.`;
  const d = Math.round(h / 24);
  return d === 1 ? "gestern" : `vor ${d} Tagen`;
}

export type Freshness = "live" | "delayed" | "stale";

/**
 * How far behind a node is, relative to its own reporting interval.
 *
 * Thresholds are a multiple of the interval rather than a fixed number of
 * minutes: a soil node transmits every half hour, so it is not "stale" at twenty
 * minutes. A badge that cries wolf is worse than no badge, because the reader
 * learns to ignore it.
 */
export function freshness(ageMs: number, intervalMs: number): Freshness {
  if (ageMs <= intervalMs * 1.6) return "live";
  if (ageMs <= intervalMs * 4) return "delayed";
  return "stale";
}

/** A short unit label for a measurement series. */
export const METRIC_META: Record<
  string,
  { label: string; short: string; unit: string; digits: 0 | 1 }
> = {
  temperatureC: { label: "Temperatur", short: "Temp.", unit: "°C", digits: 1 },
  humidityPct: { label: "Luftfeuchte", short: "Feuchte", unit: "%", digits: 0 },
  soilMoisturePct: { label: "Bodenfeuchte", short: "Boden", unit: "%", digits: 1 },
  pressureHpa: { label: "Luftdruck", short: "Druck", unit: "hPa", digits: 0 },
  rssi: { label: "Empfangsstärke", short: "RSSI", unit: "dBm", digits: 0 },
  snr: { label: "Signal-Rausch-Verhältnis", short: "SNR", unit: "dB", digits: 1 },
  batteryPct: { label: "Batterie", short: "Batterie", unit: "%", digits: 0 },
};
