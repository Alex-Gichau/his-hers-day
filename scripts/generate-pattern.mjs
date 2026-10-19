/**
 * Generates a randomized damask SVG tile used as the site background pattern.
 * Run: node scripts/generate-pattern.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "patterns");

const TILE = 1200;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n) => Math.round(n * 100) / 100;

const DEFS = `
    <g id="rosette">
      <path d="M0 0C-11 -8 -16 -24 0 -36c16 12 11 28 0 36Z"/>
      <path d="M0 0C-11 -8 -16 -24 0 -36c16 12 11 28 0 36Z" transform="rotate(90)"/>
      <path d="M0 0C-11 -8 -16 -24 0 -36c16 12 11 28 0 36Z" transform="rotate(180)"/>
      <path d="M0 0C-11 -8 -16 -24 0 -36c16 12 11 28 0 36Z" transform="rotate(270)"/>
      <path d="M0 0c-6-6-7-13 0-20 7 7 6 14 0 20Z" transform="rotate(45)"/>
      <path d="M0 0c-6-6-7-13 0-20 7 7 6 14 0 20Z" transform="rotate(135)"/>
      <path d="M0 0c-6-6-7-13 0-20 7 7 6 14 0 20Z" transform="rotate(225)"/>
      <path d="M0 0c-6-6-7-13 0-20 7 7 6 14 0 20Z" transform="rotate(315)"/>
      <circle r="8" stroke-opacity="0.55"/>
      <circle r="3.4" fill="COLOR" stroke="none"/>
    </g>
    <g id="sprig">
      <path d="M0 0C-9 -3 -13 -11 -9 -19c7 2 12 9 9 19Z"/>
      <path d="M0 0C-9 -3 -13 -11 -9 -19c7 2 12 9 9 19Z" transform="rotate(120)"/>
      <path d="M0 0C-9 -3 -13 -11 -9 -19c7 2 12 9 9 19Z" transform="rotate(240)"/>
      <circle r="2" fill="COLOR" stroke="none"/>
    </g>
    <g id="vine">
      <path d="M-30 0C-19 -13 -8 13 4 3S22 -11 31 1"/>
      <path d="M-15 -6c-3 -7 -10 -8 -13 -3 4 5 9 6 13 3Z"/>
      <path d="M10 7c3 7 10 8 13 3-4-5-9-6-13-3Z"/>
    </g>
    <g id="berry">
      <circle r="5"/>
      <circle r="1.6" fill="COLOR" stroke="none"/>
      <path d="M0 -5c-3 -4 -3 -8 0 -11 3 3 3 7 0 11Z"/>
    </g>
    <g id="curl">
      <path d="M0 0c-14 0 -20 -12 -12 -21 7 -8 20 -4 21 6 1 9 -8 13 -14 9"/>
      <circle r="1.8" fill="COLOR" stroke="none"/>
    </g>
    <g id="teardrop">
      <path d="M0 0C-9 -7 -10 -19 0 -26c10 7 9 19 0 26Z"/>
      <path d="M0 -22c-2 -4 -2 -7 0 -9 2 2 2 5 0 9Z" fill="COLOR" stroke="none"/>
    </g>`;

function buildTile({ seed, color, opacity }) {
  const rnd = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const range = (min, max) => min + rnd() * (max - min);
  const parts = [];

  const motifs = ["rosette", "sprig", "vine", "berry", "curl", "teardrop"];
  // Weighted so big statement blooms are rarer than filler sprigs.
  const weights = [0.26, 0.24, 0.2, 0.12, 0.1, 0.08];

  const count = 190;
  for (let i = 0; i < count; i++) {
    let r = rnd();
    let motif = motifs[0];
    let acc = 0;
    for (let m = 0; m < motifs.length; m++) {
      acc += weights[m];
      if (r <= acc) {
        motif = motifs[m];
        break;
      }
    }
    const x = round(range(12, TILE - 12));
    const y = round(range(12, TILE - 12));
    const rot = round(range(0, 360));
    let scale = 1;
    if (motif === "rosette") scale = round(range(0.3, 0.72));
    else if (motif === "sprig") scale = round(range(0.5, 1.05));
    else if (motif === "vine") scale = round(range(0.55, 1.0));
    else if (motif === "berry") scale = round(range(0.5, 1.05));
    else if (motif === "curl") scale = round(range(0.5, 1.0));
    else if (motif === "teardrop") scale = round(range(0.5, 1.0));

    const scaleAttr = scale === 1 ? "" : ` scale(${scale})`;
    // Draw the motif at wrapped positions so anything crossing a tile edge
    // reappears on the opposite side. This makes the tile seamless.
    const margin = 40;
    const offsets = [[0, 0]];
    if (x < margin) offsets.push([TILE, 0]);
    if (x > TILE - margin) offsets.push([-TILE, 0]);
    if (y < margin) offsets.push([0, TILE]);
    if (y > TILE - margin) offsets.push([0, -TILE]);
    if (x < margin && y < margin) offsets.push([TILE, TILE]);
    if (x > TILE - margin && y < margin) offsets.push([-TILE, TILE]);
    if (x < margin && y > TILE - margin) offsets.push([TILE, -TILE]);
    if (x > TILE - margin && y > TILE - margin) offsets.push([-TILE, -TILE]);

    for (const [dx, dy] of offsets) {
      parts.push(
        `    <use href="#${motif}" transform="translate(${round(x + dx)} ${round(
          y + dy,
        )}) rotate(${rot})${scaleAttr}"/>`,
      );
    }
  }

  // Scattered micro-dots for texture.
  for (let i = 0; i < 70; i++) {
    const x = round(range(6, TILE - 6));
    const y = round(range(6, TILE - 6));
    const r = round(range(0.9, 2.1));
    const offsets = [[0, 0]];
    if (x < 6) offsets.push([TILE, 0]);
    if (x > TILE - 6) offsets.push([-TILE, 0]);
    if (y < 6) offsets.push([0, TILE]);
    if (y > TILE - 6) offsets.push([0, -TILE]);
    for (const [dx, dy] of offsets) {
      parts.push(
        `    <circle cx="${round(x + dx)}" cy="${round(y + dy)}" r="${r}" fill="${color}" stroke="none" opacity="0.7"/>`,
      );
    }
  }

  // A few open rings and arcs for variety.
  for (let i = 0; i < 34; i++) {
    const x = round(range(10, TILE - 10));
    const y = round(range(10, TILE - 10));
    const r = round(range(3, 13));
    const start = round(range(0, 360));
    const sweep = round(range(60, 260));
    const ex = round(r * 2 * Math.sin((sweep * Math.PI) / 360));
    const ey = round(-r * (1 - Math.cos((sweep * Math.PI) / 360)));
    const offsets = [[0, 0]];
    if (x < 14) offsets.push([TILE, 0]);
    if (x > TILE - 14) offsets.push([-TILE, 0]);
    if (y < 14) offsets.push([0, TILE]);
    if (y > TILE - 14) offsets.push([0, -TILE]);
    for (const [dx, dy] of offsets) {
      parts.push(
        `    <path d="M${round(x + dx)} ${round(y + dy)}a${r} ${r} 0 0 1 ${ex} ${ey}" stroke-opacity="0.65"/>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none" stroke="${color}" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">
  <defs>${DEFS.replaceAll("COLOR", color)}</defs>
  <g opacity="${opacity}">
${parts.join("\n")}
  </g>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

const variants = [
  { file: "damask-dark.svg", color: "#D79A78", opacity: 0.1, seed: 20261206 },
];

for (const v of variants) {
  const svg = buildTile(v);
  writeFileSync(resolve(OUT_DIR, v.file), svg, "utf8");
  console.log(`wrote ${v.file} (${svg.length} bytes)`);
}
