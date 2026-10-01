/**
 * Project Agora v1 content: hardware build guides.
 * Scope note: v1 ships hardware guides + range comparisons only — resource
 * hub, forums and meet-up maps are explicitly out of scope.
 */

export type Difficulty = "starter" | "intermediate" | "advanced";

export interface GuideStep {
  title: string;
  body: string;
}

export interface Guide {
  slug: string;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  readMinutes: number;
  updated: string;
  summary: string;
  materials: string[];
  steps: GuideStep[];
}

export const difficultyLabel: Record<Difficulty, string> = {
  starter: "Starter",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const guides: Guide[] = [
  {
    slug: "solar-gateway",
    title: "Off-Grid Solar Gateway",
    tagline: "A gateway that never needs an outlet — sun to spectrum in an afternoon.",
    difficulty: "starter",
    readMinutes: 9,
    updated: "2026-09-14",
    summary:
      "Pair a LoRa 32 v3 with a 10W panel and a modest LiFePO4 pack to run an always-on gateway through a week of clouds. The trick is duty-cycle budgeting, not battery math.",
    materials: [
      "Heltec LoRa 32 V3 (868/915 MHz)",
      "10W 12V solar panel",
      "LiFePO4 12.8V 6Ah pack with BMS",
      "MPPT charge controller (small, e.g. 10A)",
      "IP65 enclosure with cable glands",
      "Waterproof SMA bulkhead + 3 dBi fiberglass antenna",
    ],
    steps: [
      {
        title: "Budget the power before you buy it",
        body: "A V3 gateway draws ~120 mW idle and ~900 mW during TX bursts. With a 12% duty cycle that averages out near 180 mW. A 10W panel in temperate latitudes yields 25–40 Wh/day in winter — five times the ~4.5 Wh/day you need. Oversize the panel, not the battery.",
      },
      {
        title: "Wire the charge path",
        body: "Panel → MPPT in, battery → MPPT battery terminals, load output → a 5V buck converter → the LoRa board's 5V pin. Never power a radio board straight from an unregulated lithium cell; brownouts during TX resets corrupt the filesystem.",
      },
      {
        title: "Keep the radio out of the enclosure's RF shadow",
        body: "Mount the antenna on a bulkhead connector through the enclosure wall, with the antenna outside and vertical. A board antenna inside an IP65 box loses 6–10 dB instantly — half your range for free.",
      },
      {
        title: "Firmware and duty cycle",
        body: "Flash Meshtastic (firmware ≥ 2.5) or MUI, set REGION to your ISM band, and let the router role handle retransmissions. If you're writing custom firmware, keep airtime under 1% per hour per EU 868 rules — schedule telemetry, don't stream it.",
      },
      {
        title: "Aim, mount, and forget",
        body: "Gateway antennas want height, not gain. A 3 dBi whip at 8 m beats a 9 dBi yagi at 2 m in flat terrain. Zip-tie, seal the gland, log the first 48 h of packets, and only then call it done.",
      },
    ],
  },
  {
    slug: "rooftop-yagi-backhaul",
    title: "Rooftop Yagi Backhaul",
    tagline: "Point-to-point 40+ km links with two antennas and a straight line.",
    difficulty: "intermediate",
    readMinutes: 12,
    updated: "2026-08-30",
    summary:
      "When you need to bridge two sites — a barn, a hilltop node, a friend's rooftop — a pair of 8 dBi yagis and disciplined aiming will outperform any 'long range' marketing. This is the link-budget method.",
    materials: [
      "2× LILYGO T-Beam (SX1262) or RAK4631",
      "2× 8 dBi 868/915 MHz yagi antennas",
      "Low-loss RG-58 or LMR-240 jumpers (under 3 m each)",
      "Pole mounts with azimuth protractor markings",
      "Weatherproof boxes for the radios",
    ],
    steps: [
      {
        title: "Run the link budget first",
        body: "TX 21 dBm + TX antenna 8 dBi + RX antenna 8 dBi − free-space path loss − 3 dB misc − RX sensitivity (≈ −137 dBm at SF12/125 kHz). At 40 km, FSPL ≈ 133.5 dB, leaving ~18 dB of margin. Comfortable. At 80 km, margin is razor thin — pick your sites accordingly.",
      },
      {
        title: "Verify line of sight",
        body: "Use a terrain profile tool (heysplit / HeyWhatsThat) between the two coordinates. Fresnel zone clearance at 868 MHz for 40 km is ~14 m at the midpoint: trees are not 'mostly fine', they are a 10–20 dB hole in your link.",
      },
      {
        title: "Polarization and mounting",
        body: "Yagis are linearly polarized — mount both vertically and keep them that way. A 90° mismatch costs 20+ dB. Mark the boresight with tape before you climb.",
      },
      {
        title: "Aim with RSSI, not guesswork",
        body: "One end transmits a test beacon every 10 s. Watch RSSI/SNR on the other end while sweeping ±15° azimuth in 2° steps, then fine-tune elevation. Lock it in when SNR peaks; write down the compass bearing.",
      },
      {
        title: "Payload reality check",
        body: "A solid SF7 40 km link moves a few hundred bits per second of useful data. Great for telemetry, chat, and sensor packets. It is not broadband — design the applications around that and the link will never disappoint you.",
      },
    ],
  },
  {
    slug: "pocket-node",
    title: "Pocket Node on a Power Bank",
    tagline: "A ten-minute, ten-dollar node you'll actually carry.",
    difficulty: "starter",
    readMinutes: 6,
    updated: "2026-09-21",
    summary:
      "The cheapest way onto a mesh: a RAK or T-Echo board, a slim power bank, and a case you can print. Tuned for days of runtime and a pocket-friendly footprint.",
    materials: [
      "RAK4631 WisBlock or T-Echo",
      "5000 mAh slim USB power bank with low-current mode",
      "Short SMA whip antenna (2–3 dBi)",
      "3D-printed or EVA case",
      "USB-C right-angle adapter (optional)",
    ],
    steps: [
      {
        title: "Pick a board with native USB charging",
        body: "Boards with a battery header and charge IC (RAK, T-Echo) can be powered by the bank through a short cable. Boards without one will reset when the bank's low-current mode kicks in — test before you commit to the enclosure.",
      },
      {
        title: "Enable the power bank's trickle mode",
        body: "Most banks shut off below ~50 mA draw. LoRa nodes idle at 30–80 mA. Double-press the bank's button (or use a 'small current' port) to keep it alive. A shunt resistor or a periodically blinking LED also works.",
      },
      {
        title: "Set a battery-aware role",
        body: "Client role, LONG_FAST modem preset, screen off after 30 s. Expect 4–7 days of runtime on a 5000 mAh bank. Router or repeater roles are for mains/solar nodes — a pocket node should never rebroadcast for the whole mesh.",
      },
      {
        title: "Antenna discipline",
        body: "Use the antenna matched to your region's band and never transmit without one attached — you'll fry the PA. A coiled 2 dBi whip is fine in town; a 5.8 dBi whip is for the hills.",
      },
    ],
  },
  {
    slug: "basement-to-city",
    title: "Basement-to-City Coverage Node",
    tagline: "How one good antenna placement covers a whole district.",
    difficulty: "advanced",
    readMinutes: 14,
    updated: "2026-09-02",
    summary:
      "Indoor antennas almost never work. This guide covers the rooftop relocation, coax loss math, grounding, and lightning discipline that turn one node into neighborhood-wide coverage.",
    materials: [
      "RAK7268 gateway or SenseCAP T1000-E",
      "5.8–8 dBi omni with radials",
      "LMR-400 coax (keep under 15 m)",
      "Lightning arrestor (gas-discharge, grounded)",
      "N-type or RP-SMA weatherproofing tape",
      "Ground rod + 10 AWG bonding wire",
    ],
    steps: [
      {
        title: "Move the radio, not the antenna",
        body: "Every dB of coax at 868 MHz is coverage you paid for. LMR-400 loses ~0.6 dB/m; RG-58 loses ~2.2 dB/m. A 10 m RG-58 run throws away 22 dB — over half your margin. Put the radio within 3 m of the antenna or use fiber for long runs.",
      },
      {
        title: "Compute the coverage radius honestly",
        body: "Use a 20 m rooftop, 5 dBi omni, 21 dBm TX and −120 dBm sensitivity at SF9: suburbs ≈ 6–10 km, dense urban ≈ 2–4 km, rural with hills — check the terrain tool, not the marketing sheet. Height beats gain, always.",
      },
      {
        title: "Ground it like you mean it",
        body: "Arrestor bonded to a ground rod with 10 AWG or better, coax bonded at the entry point, node on a surge-protected outlet. Rooftop antennas without grounding are how meshes lose gateways in the first storm.",
      },
      {
        title: "Plan for retransmission storms",
        body: "A popular coverage node rebroadcasts everything. Set router role, use moderate TTL (hop limit 3–4), and enable a channel with encryption so local chatter doesn't flood the region's airtime. Watch hop_count distribution after a week and retune.",
      },
      {
        title: "Document and share",
        body: "Add the node to the community map with location, height, band, and contact. Coverage nodes are civic infrastructure — label the enclosure with the mesh's contact info.",
      },
    ],
  },
  {
    slug: "mains-repeater",
    title: "Inline Mains Repeater",
    tagline: "The unglamorous box that fixes dead zones between you and the mesh.",
    difficulty: "intermediate",
    readMinutes: 8,
    updated: "2026-07-19",
    summary:
      "A repeater in a hallway outlet bridges the gap between your basement node and the hilltop gateway. This build is about placement discipline, not hardware.",
    materials: [
      "Heltec V3 or RAK4631",
      "5V USB-C power adapter (always-on outlet)",
      "2 dBi internal or short external whip",
      "Small vented case (heat is fine, moisture is not)",
      "Wired channel with moderate PSK (optional)",
    ],
    steps: [
      {
        title: "Choose placement by packet loss, not signal bars",
        body: "Stand at the dead zone, watch hop counts and RSSI from both ends, and place the repeater roughly at the 40–60% signal point between them. A repeater at the gateway's feet adds nothing.",
      },
      {
        title: "Configure the role and hops",
        body: "Repeater role, LONG_FAST, hop limit 3. Ignore the 'max hops' temptation — every extra hop adds airtime and collision probability for the whole mesh.",
      },
      {
        title: "Keep it boring and reliable",
        body: "Vented case, dry indoor spot, screen off, telemetry at 15-minute intervals. A repeater's entire job is to be forgotten about; check it after firmware upgrades.",
      },
    ],
  },
];
