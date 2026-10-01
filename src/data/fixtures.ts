/**
 * The station and its nodes — the one place any of this is configured.
 *
 * The coordinates below are PLACEHOLDERS. They are roughly central Berlin so
 * the map has a sensible, non-zero area to project, but they are not the
 * school's position. Replace `lat`/`lng` on the station and every node with the
 * real figures before the site goes in front of anyone; nothing else has to
 * change, because the range model, the link budget and the map all read the
 * distance from these numbers.
 */

import { distanceM, type Node, type Station } from "@/lib/telemetry";

/** Straight-line distance from a point to the station, in metres. */
export function distanceFromStation(lat: number, lng: number): number {
  return distanceM(lat, lng, STATION.lat, STATION.lng);
}

/** Days since the epoch used to age the batteries plausibly. */
const BOOT = Date.UTC(2026, 4, 12); // 12 May 2026 — station brought up

export const STATION: Station = {
  name: "Funkstation Schulcampus",
  slug: "campus",
  description:
    "Gateway am Dach des Hauptgebäudes. Empfängt die Uplinks aller Knoten auf dem Campus und leitet sie an den LoRaWAN-Netzwerkserver weiter.",
  lat: 52.52,
  lng: 13.405,
  elevationM: 41,
  gatewayModel: "Semtech SX1302 / LoRa-Elektronik concentrator",
  antenna: "2× λ/4-Stabantenne, 868 MHz, 2 dBi",
  installedAt: BOOT,
  frequencyMhz: 868.1,
  // Urban line-of-sight reach per spreading factor, rounded to the figures
  // printed in the common deployment guides.
  rangeBySf: { 7: 2_000, 8: 4_000, 9: 7_000, 10: 11_000, 11: 17_000, 12: 22_000 },
};

export const NODES: Node[] = [
  {
    id: "node-atrium",
    stationSlug: "campus",
    name: "Atrium",
    kind: "climate",
    lat: 52.5209,
    lng: 13.4035,
    payloadVersion: 3,
    spreadingFactor: 9,
    bandwidthKhz: 125,
    codingRate: 4,
    installedAt: BOOT,
    // Tuned so the batteries are mid-life rather than flat: the station went up
    // in May, so a 30-point-per-100-days drain leaves these nodes at 40–70 %
    // in autumn instead of all reading 3 %.
    drainPerDay: 0.3,
    swing: 4.5,
    baseline: 19.5,
  },
  {
    id: "node-courtyard",
    stationSlug: "campus",
    name: "Schulhof West",
    kind: "climate",
    lat: 52.5186,
    lng: 13.4072,
    payloadVersion: 3,
    spreadingFactor: 9,
    bandwidthKhz: 125,
    codingRate: 4,
    installedAt: BOOT,
    drainPerDay: 0.38,
    swing: 6.2,
    baseline: 17.8,
  },
  {
    id: "node-garden",
    stationSlug: "campus",
    name: "Schulgarten",
    kind: "soil",
    lat: 52.5179,
    lng: 13.4021,
    payloadVersion: 2,
    spreadingFactor: 11,
    bandwidthKhz: 125,
    codingRate: 4,
    installedAt: BOOT,
    drainPerDay: 0.2,
    swing: 8,
    baseline: 33,
  },
  {
    id: "node-roof",
    stationSlug: "campus",
    name: "Dachmesspunkt",
    kind: "weather",
    lat: 52.5214,
    lng: 13.4061,
    payloadVersion: 4,
    spreadingFactor: 7,
    bandwidthKhz: 125,
    codingRate: 4,
    installedAt: BOOT,
    drainPerDay: 0.42,
    swing: 5.4,
    baseline: 21.0,
  },
];

/** How often each node transmits, in minutes. */
export const INTERVAL_MINUTES: Record<string, number> = {
  "node-atrium": 10,
  "node-courtyard": 10,
  "node-garden": 30,
  "node-roof": 15,
};

/** German labels for the node kinds, used across the site. */
export const KIND_LABEL: Record<Node["kind"], string> = {
  climate: "Temperatur und Feuchte",
  soil: "Bodenfeuchte",
  weather: "Wetter (Temperatur und Luftdruck)",
};
