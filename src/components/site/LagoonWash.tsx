import { useEffect, useRef } from "react";

/**
 * Lagoon watercolor wash — implemented from the feralui recipe:
 *   stops   #176B87  #30A7A0  #7AC7C4  #E7CFA6
 *   params  technique "wash", wetness 74, pigment 56, scale 54,
 *           spread 48, blooms 30, granulation 30, edges 40,
 *           texture 26, paperWarmth 20, coverage 76, seed 17,
 *           5 layers, speed 26
 *
 * Pigment-accumulation model: five soft washes laid along the diagonal,
 * each an elliptical pigment deposit with feathered edges, darker rim
 * ridges, inner blooms and paper granulation. Color = paper * exp(-absorption).
 * Rendered at reduced resolution and upscaled (watercolor is soft), with a
 * slow flow drift for life. Falls back to the CSS gradient behind it.
 */

type RGB = [number, number, number];

const STOPS: RGB[] = [
  [0x17, 0x6b, 0x87],
  [0x30, 0xa7, 0xa0],
  [0x7a, 0xc7, 0xc4],
  [0xe7, 0xcf, 0xa6],
];
const POS = [0, 0.25, 0.5, 0.75, 1];

const ANGLE = Math.PI / 4; // wash axis: top-left (lapis) → bottom-right (sand)
const LAYERS = 5;
const WETNESS = 0.74;
const PIGMENT = 0.56;
const BLOOMS = 0.3;
const GRANULATION = 0.3;
const EDGES = 0.4;
const TEXTURE = 0.26;
const WARMTH = 0.2;
const COVERAGE = 0.76;

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

/** Spread dial → warp amplitude (recipe: spread 48). */
const SPREAD_WARP = 0.48 * 1.4;

function fbm(x: number, y: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let px = x;
  let py = y;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(px, py);
    const nx = COS05 * px - SIN05 * py;
    const ny = SIN05 * px + COS05 * py;
    px = nx * 2.02 + 37;
    py = ny * 2.02 + 17;
    amp *= 0.5;
  }
  return sum;
}

function palette(t: number): RGB {
  const x = clamp01(t);
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (x <= POS[i + 1]) {
      const f = (x - POS[i]) / (POS[i + 1] - POS[i]);
      const a = STOPS[i];
      const b = STOPS[i + 1];
      return [
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        a[2] + (b[2] - a[2]) * f,
      ];
    }
  }
  return STOPS[STOPS.length - 1];
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
  color: RGB;
  bx: number;
  by: number;
  br: number;
}

function buildWashes(): Wash[] {
  const rnd = mulberry(17 * 8191 + 1);
  const washes: Wash[] = [];
  const span = 1.15;
  for (let i = 0; i < LAYERS; i++) {
    const t = (i + 0.5) / LAYERS;
    const cx = (t - 0.5) * span + (rnd() - 0.5) * 0.2 + 0.09 * (rnd() - 0.5) * 2;
    const cy =
      Math.sin(t * Math.PI * 2 + 17 * 0.7) * 0.2 +
      (rnd() - 0.5) * 0.28 +
      0.075 * (rnd() - 0.5) * 2;
    const v = (0.12 + COVERAGE * 0.26) * (0.76 + rnd() * 0.46);
    const rot = (rnd() - 0.5) * 2.5 + 0.12 * (rnd() - 0.5) * 2;
    washes.push({
      cx,
      cy,
      rx: v * 1.22 * (1 + 0.09 * (rnd() - 0.5) * 2),
      ry: v * 1.1 * (1 + 0.09 * (rnd() - 0.5) * 2),
      c: Math.cos(rot),
      s: Math.sin(rot),
      strength: 0.68 + rnd() * 0.4,
      color: palette(t),
      bx: 0.36 * Math.sin(i * 2.3 + 1) + 0.12 * (rnd() - 0.5) * 2,
      by: 0.36 * Math.cos(i * 1.7) + 0.12 * (rnd() - 0.5) * 2,
      br: 0.2 + BLOOMS * (0.32 + rnd()),
    });
  }
  return washes;
}

interface Fields {
  w: number;
  h: number;
  largeR: Float32Array;
  largeG: Float32Array;
  midR: Float32Array;
  midG: Float32Array;
  fine: Float32Array;
  grain: Float32Array;
  tex: Float32Array;
  img: ImageData;
}

/** Precompute the noise fields over the render buffer (in wash space). */
function buildFields(ctx: CanvasRenderingContext2D, w: number, h: number): Fields {
  const aspect = w / h;
  const cs = Math.cos(ANGLE);
  const sn = Math.sin(ANGLE);
  const largeR = new Float32Array(w * h);
  const largeG = new Float32Array(w * h);
  const midR = new Float32Array(w * h);
  const midG = new Float32Array(w * h);
  const fine = new Float32Array(w * h);
  const grain = new Float32Array(w * h);
  const tex = new Float32Array(w * h);

  // Wash space: one unit = the buffer's shorter side, so noise scale is
  // resolution-independent.
  const S = Math.min(w, h);
  for (let j = 0; j < h; j++) {
    const v = (j + 0.5 - h / 2) / S;
    for (let i = 0; i < w; i++) {
      const u = (i + 0.5 - w / 2) / S;
      const px = u * cs + v * sn;
      const py = -u * sn + v * cs;
      const k = j * w + i;
      largeR[k] = fbm(px / 0.55, py / 0.55, 3);
      largeG[k] = fbm(px / 0.55 + 51.9, py / 0.55 + 23.1, 3);
      midR[k] = fbm(px / 0.16, py / 0.16, 2);
      midG[k] = fbm(px / 0.16 + 77.7, py / 0.16 + 33.8, 2);
      fine[k] = vnoise(px / 0.05, py / 0.05);
      const tooth = vnoise(px / 0.018, py / 0.018);
      const fiber = vnoise(px / 0.04, py / 0.04);
      grain[k] = (tooth - 0.5) * 0.68 + (fiber - 0.5) * 0.32;
      tex[k] = vnoise(px / 0.035, py / 0.035);
    }
  }

  return {
    w,
    h,
    largeR,
    largeG,
    midR,
    midG,
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

function renderFrame(
  ctx: CanvasRenderingContext2D,
  fields: Fields,
  washes: Wash[],
  time: number,
) {
  const { w, h, img } = fields;
  const data = img.data;
  const cs = Math.cos(ANGLE);
  const sn = Math.sin(ANGLE);
  const S = Math.min(w, h);

  // Slow flow drift (recipe speed 26, heavily damped)
  const ox1 = Math.sin(time * 0.22) * 26;
  const oy1 = Math.cos(time * 0.17) * 18;
  const ox2 = Math.sin(time * 0.14 + 2.1) * 12;
  const oy2 = Math.cos(time * 0.19 + 1.3) * 9;

  const feather = 0.025 + WETNESS * 0.31;
  const edgeDiv = 0.014 + feather * 0.13;
  const edgeEdge = 0.97 - feather * 0.28;
  const edgeK = EDGES * (1 - WETNESS * 0.45);
  const pigK = PIGMENT * 1.05;
  const granK = GRANULATION * 0.85;
  const gran2 = GRANULATION * 0.32;
  const reach = 1 + feather + 0.08;

  // Paper with warmth 20: mix(white-ish, warm cream, 0.2)
  const pr = 0.994;
  const pg = 0.985;
  const pb = 0.965;

  for (let j = 0; j < h; j++) {
    const v = (j + 0.5 - h / 2) / S;
    for (let i = 0; i < w; i++) {
      const u = (i + 0.5 - w / 2) / S;
      const px = u * cs + v * sn;
      const py = -u * sn + v * cs;
      const k = j * w + i;

      // Domain warp from the large + mid fields, drifting with time
      const wx =
        (sampleField(fields.largeR, w, h, i + ox1, j + oy1) - 0.5) * 0.44 * (0.25 + SPREAD_WARP) +
        (sampleField(fields.midR, w, h, i + ox2, j + oy2) - 0.5) * 0.16 * (0.25 + SPREAD_WARP);
      const wy =
        (sampleField(fields.largeG, w, h, i + ox1, j + oy1) - 0.5) * 0.44 * (0.25 + SPREAD_WARP) +
        (sampleField(fields.midG, w, h, i + ox2, j + oy2) - 0.5) * 0.16 * (0.25 + SPREAD_WARP);

      const wxp = px + wx;
      const wyp = py + wy;

      const grain = fields.grain[k];
      const fineN = fields.fine[k];
      const texN = fields.tex[k];

      let absR = 0;
      let absG = 0;
      let absB = 0;

      for (let li = 0; li < washes.length; li++) {
        const wash = washes[li];
        const dx = wxp - wash.cx;
        const dy = wyp - wash.cy;
        const qx = (dx * wash.c - dy * wash.s) / wash.rx;
        const qy = (dx * wash.s + dy * wash.c) / wash.ry;
        const d = Math.sqrt(qx * qx + qy * qy) + (fineN - 0.5) * 0.08;
        if (d > reach) continue;

        const mask = 1 - smoothstep(1 - feather, 1 + feather, d);
        const cloud = li % 2 === 0
          ? sampleField(fields.largeR, w, h, i, j)
          : sampleField(fields.largeG, w, h, i, j);
        const midRs = sampleField(fields.midR, w, h, i, j);
        const midGs = sampleField(fields.midG, w, h, i, j);
        const uneven = 0.55 + cloud * 0.8 + (midRs - 0.5) * 0.34;

        const edgeDistance = (d - edgeEdge) / edgeDiv;
        const ridge =
          Math.exp(-edgeDistance * edgeDistance) *
          edgeK *
          (0.12 + midGs * 0.45);

        const bdx = qx - wash.bx;
        const bdy = qy - wash.by;
        const bd = Math.sqrt(bdx * bdx + bdy * bdy) + (midGs - 0.5) * 0.42;
        const bloom =
          (1 - smoothstep(wash.br - 0.09, wash.br + 0.08, bd)) * BLOOMS;
        const bloomDistance = (bd - wash.br - 0.045) / 0.036;
        const bloomEdge =
          Math.exp(-bloomDistance * bloomDistance) * BLOOMS * 0.33;

        const granulate = Math.max(
          0.15,
          1 + grain * granK + (fineN - 0.5) * gran2,
        );
        const density =
          (mask * uneven * (1 - bloom * 0.78) + ridge + bloomEdge * mask) *
          granulate *
          wash.strength *
          pigK;

        absR += wash.color[0] * density;
        absG += wash.color[1] * density;
        absB += wash.color[2] * density;
      }

      // Beer–Lambert absorption over the paper
      let r = pr * Math.exp(-absR);
      let g = pg * Math.exp(-absG);
      let b = pb * Math.exp(-absB);

      // Paper texture + granulation tooth
      const texMul = 1 + grain * TEXTURE * 0.095 + (texN - 0.5) * TEXTURE * 0.026;
      r *= texMul;
      g *= texMul;
      b *= texMul;

      // Saturation lift (recipe saturation 1.22) around luma
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const k4 = k * 4;
      data[k4] = clamp01(luma + (r - luma) * 1.22) * 255;
      data[k4 + 1] = clamp01(luma + (g - luma) * 1.22) * 255;
      data[k4 + 2] = clamp01(luma + (b - luma) * 1.22) * 255;
      data[k4 + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
}

export function LagoonWash({ className }: { className?: string }) {
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
      const long = Math.min(560, Math.max(rect.width, rect.height));
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
      draw(0); // static frame immediately (also the reduced-motion frame)
    };

    const loop = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (reduced || !inView || document.hidden) return;
      if (ts - lastFrame < 40) return; // ~25fps is plenty for a slow drift
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
      }}
    />
  );
}
