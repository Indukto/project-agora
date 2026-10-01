/**
 * Project Agora v1 content: field range comparisons.
 * All numbers are field-reported medians, not datasheet promises — with
 * conditions, terrain and caveat attached, because range claims without
 * context are how we all got burned.
 */

export type Band = "868 MHz" | "915 MHz" | "433 MHz";

export type ModemPreset =
  | "Long Fast"
  | "Long Slow"
  | "Medium Fast"
  | "Very Long";

export interface RangeRecord {
  radio: string;
  role: string;
  band: Band;
  preset: ModemPreset;
  terrain: "Urban" | "Suburban" | "Rural" | "Line of sight";
  antenna: string;
  rangeKm: number;
  conditions: string;
}

export const rangeRecords: RangeRecord[] = [
  {
    radio: "RAK4631 WisBlock",
    role: "Repeater → Gateway",
    band: "868 MHz",
    preset: "Long Fast",
    terrain: "Suburban",
    antenna: "5.8 dBi omni @ 12 m",
    rangeKm: 8.4,
    conditions:
      "Median over 6 weeks of telemetry. Timber-framed houses, some 3-storey blocks.",
  },
  {
    radio: "RAK4631 WisBlock",
    role: "Repeater → Gateway",
    band: "868 MHz",
    preset: "Long Fast",
    terrain: "Urban",
    antenna: "5.8 dBi omni @ 18 m",
    rangeKm: 3.1,
    conditions:
      "Dense city core, 4–6 storey buildings. Rooftop mounting mattered more than gain.",
  },
  {
    radio: "Heltec LoRa 32 V3",
    role: "Client → Repeater",
    band: "868 MHz",
    preset: "Long Fast",
    terrain: "Urban",
    antenna: "3 dBi whip @ 1.5 m",
    rangeKm: 1.2,
    conditions:
      "Handheld in the street. Basement nodes see 300–500 m — go up or go home.",
  },
  {
    radio: "LILYGO T-Beam SX1262",
    role: "Point-to-point",
    band: "868 MHz",
    preset: "Long Slow",
    terrain: "Line of sight",
    antenna: "8 dBi yagi both ends @ 6 m",
    rangeKm: 47,
    conditions:
      "Ridge-to-ridge, 14 m Fresnel clearance at midpoint. SNR peaked at −9 dB.",
  },
  {
    radio: "LILYGO T-Beam SX1262",
    role: "Point-to-point",
    band: "868 MHz",
    preset: "Long Slow",
    terrain: "Rural",
    antenna: "8 dBi yagi TX, 3 dBi whip RX",
    rangeKm: 11,
    conditions:
      "Farmland with hedgerows and single tree lines; the hedgerows cost ~6 dB each.",
  },
  {
    radio: "SenseCAP T1000-E",
    role: "Client → Gateway",
    band: "868 MHz",
    preset: "Long Fast",
    terrain: "Suburban",
    antenna: "Stock internal → 5.8 dBi omni",
    rangeKm: 4.8,
    conditions:
      "Card tracker to rooftop gateway. Stock antenna saw 1.6 km — antenna swap = 3×.",
  },
  {
    radio: "SenseCAP T1000-E",
    role: "Client → Gateway",
    band: "915 MHz",
    preset: "Long Fast",
    terrain: "Rural",
    antenna: "External 3 dBi whip @ 2 m",
    rangeKm: 9.7,
    conditions:
      "US Midwest, flat with corn in season. Summer attenuation is real: −15% vs spring.",
  },
  {
    radio: "RAK7268 gateway",
    role: "Gateway (8ch)",
    band: "868 MHz",
    preset: "Medium Fast",
    terrain: "Rural",
    antenna: "8 dBi omni @ 20 m",
    rangeKm: 22,
    conditions:
      "Village networks across rolling hills; hilltop placement is the whole ballgame.",
  },
  {
    radio: "RAK7268 gateway",
    role: "Gateway (8ch)",
    band: "915 MHz",
    preset: "Long Fast",
    terrain: "Line of sight",
    antenna: "6 dBi omni @ 30 m",
    rangeKm: 58,
    conditions:
      "Water tower to ridgeline. Calm, dry, cold morning — the best-case number.",
  },
  {
    radio: "T-Echo (nRF52840)",
    role: "Client → Repeater",
    band: "433 MHz",
    preset: "Very Long",
    terrain: "Rural",
    antenna: "5.5 dBi whip @ 4 m",
    rangeKm: 15.2,
    conditions:
      "433 MHz penetrates foliage better; payload budget shrinks accordingly.",
  },
  {
    radio: "Heltec LoRa 32 V3",
    role: "Point-to-point",
    band: "915 MHz",
    preset: "Long Fast",
    terrain: "Line of sight",
    antenna: "3 dBi whips both ends @ 10 m",
    rangeKm: 19,
    conditions:
      "Apartment rooftop to rooftop across a valley. Fog nights lost 20–30%.",
  },
  {
    radio: "Station G2",
    role: "Repeater → Gateway",
    band: "868 MHz",
    preset: "Long Fast",
    terrain: "Suburban",
    antenna: "6 dBi omni @ 14 m",
    rangeKm: 10.5,
    conditions:
      "SX1262 with better PA filtering; noticeably cleaner SNR in the 8–12 km band.",
  },
];

export const bands: Band[] = ["868 MHz", "915 MHz", "433 MHz"];

export const terrainTypes = [
  "All",
  "Urban",
  "Suburban",
  "Rural",
  "Line of sight",
] as const;

export const maxRangeKm = Math.max(...rangeRecords.map((r) => r.rangeKm));
