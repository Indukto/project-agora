import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ── AGORA: LoRaWAN telemetry ─────────────────────────────────────────
    // Four tables carry the whole data path. Nothing else in the app writes to
    // them: today the deterministic model in `src/lib/telemetry.ts` fills them,
    // tomorrow a LoRaWAN network server (The Things Stack / ChirpStack)
    // replaces that one writer.
    //
    // The pages do NOT read these tables yet, and that is deliberate. This
    // checkout has no Convex deployment — `VITE_CONVEX_URL` is the placeholder
    // `https://placeholder-123.convex.cloud` — so `src/convex/_generated` does
    // not exist and any `query`/`mutation` written here would fail to compile
    // and could not be exercised. The site answers from the generator instead,
    // which means it works offline and needs no credentials.
    //
    // To connect a real backend, without touching a single page:
    //   1. set CONVEX_DEPLOYMENT, then `npx convex dev` to emit _generated
    //   2. add a writer that calls `readingAt()` from `src/lib/telemetry.ts`
    //      (or an uplink webhook from the network server) and inserts the rows
    //      below; `stations` and `nodes` come straight from `src/data/fixtures.ts`
    //   3. add read queries with `.withIndex("by_node_ts", ...)` /
    //      `.withIndex("by_ts", ...)` — the indices are already declared here
    //   4. replace the function bodies in `src/data/measurements.ts` with those
    //      queries; every page imports from that one module and stays unchanged
    //
    // The generator is a pure function of (node, timestamp), so the series the
    // backend will serve are the same numbers the site shows today.

    // The gateway installation itself — one row per school campus.
    stations: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      lat: v.number(),
      lng: v.number(),
      elevationM: v.optional(v.number()),
      gatewayModel: v.optional(v.string()),
      antenna: v.optional(v.string()),
      installedAt: v.optional(v.number()),
    }).index("by_slug", ["slug"]),

    // A battery-powered sensor node belonging to a station.
    nodes: defineTable({
      stationId: v.id("stations"),
      name: v.string(),
      // Which readings a node actually produces; drives which fields are set.
      kind: v.union(
        v.literal("climate"),
        v.literal("soil"),
        v.literal("weather"),
      ),
      lat: v.number(),
      lng: v.number(),
      payloadVersion: v.number(),
      spreadingFactor: v.number(),
      bandwidthKhz: v.number(),
      installedAt: v.optional(v.number()),
    })
      .index("by_station", ["stationId"])
      .index("by_kind", ["kind"]),

    // One decoded uplink payload plus the link quality measured on receipt.
    readings: defineTable({
      nodeId: v.id("nodes"),
      ts: v.number(),
      // Optional because a soil node has no temperature — a field is set only
      // for the kinds the node reports.
      temperatureC: v.optional(v.number()),
      humidityPct: v.optional(v.number()),
      soilMoisturePct: v.optional(v.number()),
      pressureHpa: v.optional(v.number()),
      rssi: v.number(),
      snr: v.number(),
      spreadingFactor: v.number(),
      airtimeMs: v.number(),
      batteryPct: v.number(),
    })
      .index("by_node_ts", ["nodeId", "ts"])
      .index("by_ts", ["ts"]),

    // Raw frame metadata, kept separate from `readings` so the radio layer can
    // be inspected on its own (payload size, coding rate, airtime).
    uplinks: defineTable({
      nodeId: v.id("nodes"),
      ts: v.number(),
      frequencyMhz: v.number(),
      bandwidthKhz: v.number(),
      spreadingFactor: v.number(),
      codingRate: v.string(),
      payloadBytes: v.number(),
      rssi: v.number(),
      snr: v.number(),
    }).index("by_ts", ["ts"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
