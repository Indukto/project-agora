import { useEffect, useRef } from "react";

/**
 * "Lagoon" — a soft blue-teal watercolor wash.
 *
 * Recipe (feralui `wc-lagoon`):
 *   stops   INKED LAPIS #0D5A75 · CLEAR HANADA #2AA79F / #63C8C1 · SOFT SAND #E7CFA6
 *   params  technique "wash", seed 17, angle 330, layers 5, coverage 76,
 *           wetness 74, spread 48, pigment 56, blooms 30, granulation 30,
 *           edges 40, texture 26, paperWarmth 20, speed 26
 *
 * Model: five soft elliptical washes are laid along the wash axis. Every wash
 * contributes optical density where it lands, modulated by paper cloudiness, a
 * feathered edge, a wet rim ridge, cauliflower blooms and granulation. Layers
 * combine by Beer–Lambert transmittance — a wash of colour c only absorbs the
 * light c does not reflect — so the paper stays luminous and the result reads
 * as pigment on paper rather than paint. Colour = paper × exp(-absorption).
 *
 * Rendered into a reduced-resolution buffer and upscaled (watercolour is soft),
 * with a very slow flow drift for life. The canvas is composited in `multiply`
 * so the saturated `.gradient-lagoon` colour field underneath supplies the hue
 * and the wash only adds pigment density, texture and edge behaviour on top.
 * The CSS gradient is also the fallback if 2D context is unavailable.
 */

type RGB = [number, number, number];

const STOPS: RGB[] = [
  [0x0d, 0x5a, 0x75], // inked lapis
  [0x17, 0x87, 0x9e], // lagoon shelf
  [0x2a, 0xa7, 0x9f], // clear hanada
  [0x63, 0xc8, 0xc1],
  [0xa9, 0xdc, 0xd2],
  [0xe7, 0xcf, 0xa6], // soft sand
];

const LAYERS = 5;
const WETNESS = 0.74;
const SPREAD = 0.48;
const PIGMENT = 0.56;
const BLOOMS = 0.3;
const GRANULATION = 0.3;
const EDGES = 0.4;
const TEXTURE = 0.26;
const WARMTH = 0.2;
const COVERAGE = 0.76;

/** Wash axis: 330° — lapis low-left drifting up to sand on the right. */
const ANGLE = (330 * Math.PI) / 180;

/**
 * Max optical density per channel. Watercolour can only go so dark before it
 * stops looking like watercolour — this keeps the wash pastel and guarantees
 * the canvas can never crush to black.
 */
const MAX_ABSORB = 1.5;

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function hash2(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const COS05 = Math.cos(0.5);
const SIN05 = Math.sin(0.5);

function fbm(x: number, y: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let px = x;
  let py = y;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(px, py);
    norm += amp;
    const nx = COS05 * px - SIN05 * py;
    const ny = SIN05 * px + COS05 * py;
    px = nx * 2.02 + 37;
    py = ny * 2.02 + 17;
    amp *= 0.5;
  }
  return sum / norm;
}

/**
 * Palette sampled the way the recipe does it: a gamma-space ramp, so mixes
 * between neighbouring hues stay clean instead of drifting through mud.
 */
function palette(t: number): RGB {
  const x = clamp01(t);
  const n = STOPS.length - 1;
  const s = x * n;
  const i = Math.min(n - 1, Math.floor(s));
  const f = s - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const ga = Math.pow(a[0] / 255, 0.72);
  const gb = Math.pow(b[0] / 255, 0.72);
  const gc = Math.pow(a[1] / 255, 0.72);
  const gd = Math.pow(b[1] / 255, 0.72);
  const ge = Math.pow(a[2] / 255, 0.72);
  const gf = Math.pow(b[2] / 255, 0.72);
  return [
    Math.pow(ga + (gb - ga) * f, 1 / 0.72) * 255,
    Math.pow(gc + (gd - gc) * f, 1 / 0.72) * 255,
    Math.pow(ge + (gf - ge) * f, 1 / 0.72) * 255,
  ];
}

function mulberry(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

interface Wash {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  c: number;
  s: number;
  strength: number;
  /** Per-channel transmittance, 0–1: what the wash leaves of the light. */
  tr: number;
  tg: number;
  tb: number;
  bx: number;
  by: number;
  br: number;
}

/**
 * Layer placement: centres march along the wash axis with a gentle sine drift
 * across it, radii come from coverage, and each layer takes its colour from its
 * own position along the palette ramp.
 */
function buildWashes(): Wash[] {
  const rnd = mulberry(17 * 8191 + 1);
  const washes: Wash[] = [];
  for (let i = 0; i < LAYERS; i++) {
    const t = (i + 0.5) / LAYERS;
    const v = (0.12 + COVERAGE * 0.26) * (0.76 + rnd() * 0.46);
    // Sample the full ramp across the layers so the left end anchors on true
    // lapis and the right end resolves to pale sand.
    const col = palette(i / (LAYERS - 1));
    const rot = (rnd() - 0.5) * 0.5;
    washes.push({
      cx: (t - 0.5) * 1.68 + 0.06 + (rnd() - 0.5) * 0.18,
      cy: Math.sin(t * Math.PI * 2 + 17 * 0.7) * 0.22 + (rnd() - 0.5) * 0.2,
      rx: v * 1.42,
      ry: v * 1.38,
      c: Math.cos(rot),
      s: Math.sin(rot),
      // The lapis end carries a little more pigment: a wet first wash settles
      // deeper and reads as the anchor of the composition.
      strength: (0.7 + rnd() * 0.4) * (i === 0 ? 1.5 : i === 1 ? 1.15 : 1),
      tr: col[0] / 255,
      tg: col[1] / 255,
      tb: col[2] / 255,
      bx: 0.34 * Math.sin(i * 2.3 + 1) + (rnd() - 0.5) * 0.2,
      by: 0.34 * Math.cos(i * 1.7) + (rnd() - 0.5) * 0.2,
      br: 0.18 + BLOOMS * (0.3 + rnd()),
    });
  }
  return washes;
}

interface Fields {
  w: number;
  h: number;
  cloudA: Float32Array;
  cloudB: Float32Array;
  midA: Float32Array;
  midB: Float32Array;
  fine: Float32Array;
  grain: Float32Array;
  tex: Float32Array;
  img: ImageData;
}

/**
 * Precompute the noise fields for a buffer. Noise coordinates are scaled by the
 * pixel counts so grain stays square on wide banners and narrow phones alike.
 */
function buildFields(ctx: CanvasRenderingContext2D, w: number, h: number): Fields {
  const S = Math.min(w, h);
  const cloudA = new Float32Array(w * h);
  const cloudB = new Float32Array(w * h);
  const midA = new Float32Array(w * h);
  const midB = new Float32Array(w * h);
  const fine = new Float32Array(w * h);
  const grain = new Float32Array(w * h);
  const tex = new Float32Array(w * h);

  for (let j = 0; j < h; j++) {
    const pv = ((j + 0.5 - h / 2) / S) * 5;
    for (let i = 0; i < w; i++) {
      const pu = ((i + 0.5 - w / 2) / S) * 5;
      const k = j * w + i;
      cloudA[k] = fbm(pu / 2.4, pv / 2.4, 3);
      cloudB[k] = fbm(pu / 2.4 + 51.9, pv / 2.4 + 23.1, 3);
      midA[k] = fbm(pu / 0.9, pv / 0.9, 2);
      midB[k] = fbm(pu / 0.9 + 77.7, pv / 0.9 + 33.8, 2);
      fine[k] = vnoise(pu / 0.3, pv / 0.3);
      const tooth = vnoise(pu / 0.11, pv / 0.11);
      const fiber = vnoise(pu / 0.26, pv / 0.26);
      grain[k] = (tooth - 0.5) * 0.68 + (fiber - 0.5) * 0.32;
      tex[k] = vnoise(pu / 0.2, pv / 0.2);
    }
  }

  return {
    w,
    h,
    cloudA,
    cloudB,
    midA,
    midB,
    fine,
    grain,
    tex,
    img: ctx.createImageData(w, h),
  };
}

function sampleField(
  f: Float32Array,
  w: number,
  h: number,
  x: number,
  y: number,
): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const x0 = xi < 0 ? 0 : xi >= w ? w - 1 : xi;
  const x1 = xi + 1 < 0 ? 0 : xi + 1 >= w ? w - 1 : xi + 1;
  const y0 = yi < 0 ? 0 : yi >= h ? h - 1 : yi;
  const y1 = yi + 1 < 0 ? 0 : yi + 1 >= h ? h - 1 : yi + 1;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = f[y0 * w + x0];
  const b = f[y0 * w + x1];
  const c = f[y1 * w + x0];
  const d = f[y1 * w + x1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Paper at warmth 20: bright white mixed 20% towards warm cream. */
const PAPER_R = 0.995 + (0.99 - 0.995) * WARMTH;
const PAPER_G = 0.994 + (0.949 - 0.994) * WARMTH;
const PAPER_B = 0.989 + (0.867 - 0.989) * WARMTH;

function renderFrame(
  ctx: CanvasRenderingContext2D,
  fields: Fields,
  washes: Wash[],
  time: number,
) {
  const { w, h, img } = fields;
  const data = img.data;

  // Wash plane rotated by the recipe angle so the axis runs across the banner.
  const cs = Math.cos(ANGLE);
  const sn = Math.sin(ANGLE);

  // Slow flow drift — recipe speed 26, heavily damped.
  const ox1 = Math.sin(time * 0.2) * 22;
  const oy1 = Math.cos(time * 0.16) * 16;
  const ox2 = Math.sin(time * 0.13 + 2.1) * 10;
  const oy2 = Math.cos(time * 0.17 + 1.3) * 8;

  // Wet (74) means soft, wide feathering.
  const feather = 0.03 + WETNESS * 0.3;
  const edgeDiv = 0.016 + feather * 0.12;
  const edgeAt = 0.97 - feather * 0.26;
  const edgeK = EDGES * (1 - WETNESS * 0.4) * 0.6;
  const pigK = PIGMENT * 1.05;
  const granK = GRANULATION * 0.55;
  const gran2 = GRANULATION * 0.2;
  const reach = 1 + feather + 0.1;
  const warpAmp = 0.16 * (0.35 + SPREAD);
  const halfW = w / 2;
  const halfH = h / 2;

  for (let j = 0; j < h; j++) {
    const ny = (j + 0.5 - halfH) / halfH;
    for (let i = 0; i < w; i++) {
      const nx = (i + 0.5 - halfW) / halfW;
      const k = j * w + i;
      const o = k * 4;

      // Rotate into wash space.
      const ux = nx * cs + ny * sn;
      const uy = -nx * sn + ny * cs;

      // Domain warp — pigment drifts with the water.
      const wa = sampleField(fields.cloudA, w, h, i + ox1, j + oy1);
      const wb = sampleField(fields.cloudB, w, h, i + ox1, j + oy1);
      const mc = sampleField(fields.midA, w, h, i + ox2, j + oy2);
      const md = sampleField(fields.midB, w, h, i + ox2, j + oy2);
      const wxp = ux + (wa - 0.5) * warpAmp + (mc - 0.5) * warpAmp * 0.4;
      const wyp = uy + (wb - 0.5) * warpAmp + (md - 0.5) * warpAmp * 0.4;

      const fineN = fields.fine[k];
      const grain = fields.grain[k];
      const cloud = wa;
      const uneven = 0.62 + cloud * 0.72 + (mc - 0.5) * 0.3;
      const granulate = Math.max(0.25, 1 + grain * granK + (fineN - 0.5) * gran2);

      // Pigment pools towards the lower left, the way a wash runs downhill.
      const down = ny * 0.5 + 0.5;
      const toward = 1 - clamp01(nx * 0.5 + 0.5);
      const pool = 1 + 0.5 * down * toward * (0.5 + cloud * 0.7);

      let absR = 0;
      let absG = 0;
      let absB = 0;

      for (let li = 0; li < washes.length; li++) {
        const wash = washes[li];
        const dx = wxp - wash.cx;
        const dy = wyp - wash.cy;
        const qx = (dx * wash.c - dy * wash.s) / wash.rx;
        const qy = (dx * wash.s + dy * wash.c) / wash.ry;
        const d = Math.sqrt(qx * qx + qy * qy) + (fineN - 0.5) * 0.07;
        if (d > reach) continue;

        const mask = 1 - smoothstep(1 - feather, 1 + feather, d);

        // Wet rim: pigment collects where the wash dried.
        const edgeT = (d - edgeAt) / edgeDiv;
        const ridge = Math.exp(-edgeT * edgeT) * edgeK * (0.2 + mc * 0.5);

        // Blooms: lighter cauliflower islands inside the deposit.
        const bdx = qx - wash.bx;
        const bdy = qy - wash.by;
        const bd = Math.sqrt(bdx * bdx + bdy * bdy) + (md - 0.5) * 0.4;
        const bloom = (1 - smoothstep(wash.br - 0.1, wash.br + 0.08, bd)) * BLOOMS;
        const bloomT = (bd - wash.br - 0.04) / 0.034;
        const bloomEdge = Math.exp(-bloomT * bloomT) * BLOOMS * 0.22;

        const density =
          (mask * uneven * (1 - bloom * 0.78) + ridge * mask + bloomEdge * mask) *
          granulate *
          pool *
          wash.strength *
          pigK;

        // Beer–Lambert: a wash absorbs only what its pigment does not reflect.
        absR += (1 - wash.tr) * density;
        absG += (1 - wash.tg) * density;
        absB += (1 - wash.tb) * density;
      }

      // Paper tooth: pigment settles unevenly into the sheet.
      const tooth =
        1 + grain * TEXTURE * 0.07 + (fields.tex[k] - 0.5) * TEXTURE * 0.02;

      const r = PAPER_R * Math.exp(-(absR > MAX_ABSORB ? MAX_ABSORB : absR)) * tooth;
      const g = PAPER_G * Math.exp(-(absG > MAX_ABSORB ? MAX_ABSORB : absG)) * tooth;
      const b = PAPER_B * Math.exp(-(absB > MAX_ABSORB ? MAX_ABSORB : absB)) * tooth;

      data[o] = clamp01(r) * 255;
      data[o + 1] = clamp01(g) * 255;
      data[o + 2] = clamp01(b) * 255;
      data[o + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
}

export function LagoonWash({
  className,
  opacity = 0.72,
}: {
  className?: string;
  /** Wash strength: 1 is full pigment, lower leaves more of the gradient. */
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let fields: Fields | null = null;
    const washes = buildWashes();
    let W = 0;
    let H = 0;
    let time = 0;
    let prevTs = 0;
    let lastFrame = 0;
    let inView = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (ts: number) => {
      if (!fields) return;
      if (prevTs) time += Math.min(0.05, (ts - prevTs) / 1000);
      prevTs = ts;
      renderFrame(ctx, fields, washes, time);
    };

    const ensure = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const long = Math.min(620, Math.max(rect.width, rect.height));
      const scale = long / Math.max(rect.width, rect.height);
      const w = Math.max(2, Math.round(rect.width * scale));
      const h = Math.max(2, Math.round(rect.height * scale));
      if (w === W && h === H) return;
      W = w;
      H = h;
      canvas.width = w;
      canvas.height = h;
      fields = buildFields(ctx, w, h);
      prevTs = 0;
      time = 0;
      draw(0); // paint immediately; also the reduced-motion frame
    };

    const loop = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (reduced || !inView || document.hidden) return;
      if (ts - lastFrame < 45) return; // ~22fps is plenty for a slow drift
      lastFrame = ts;
      draw(ts);
    };

    const ro = new ResizeObserver(ensure);
    ro.observe(parent);
    ensure();

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
          })
        : null;
    if (io) io.observe(parent);

    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        mixBlendMode: "multiply",
        opacity,
      }}
    />
  );
}

export default LagoonWash;
