// Generates the retro terminal SVGs used by the profile README.
// Run: node scripts/generate.mjs   (no dependencies)
// Edit the DATA section, run again, commit the files in assets/.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

// ───────────────────────────── DATA ─────────────────────────────
const HANDLE = "goonnnn0101";
const ROLE = "developer // games, SaaS and web tools in TypeScript";
const STATUS = "OPEN TO WORK";
const STATUS_DETAIL = "internships & junior roles";

const PROJECTS = [
  {
    icon: "cursor",
    name: "CURSOR CAIDO",
    type: "GAME",
    lines: [
      "2D sandbox/action game where your real Windows desktop is the world:",
      "open windows become platforms. Procedural pixel art and chiptune audio.",
    ],
    stack: ["Electron", "TypeScript", "PixiJS 8", "Win32 FFI", "Web Audio"],
  },
  {
    icon: "chart",
    name: "COMMERCE ADMIN LAB",
    type: "WEB APP",
    lines: [
      "E-commerce admin running on simulated stores. Every dashboard figure is",
      "computed from stored records by its own analytics engine. Multi-store.",
    ],
    stack: ["Next.js 16", "React 19", "Prisma", "SQLite", "Zod", "Vitest", "Playwright"],
  },
  {
    icon: "play",
    name: "AIPROVID",
    type: "SAAS",
    lines: [
      "AI video SaaS: a text prompt becomes a professional animated video.",
      "Product app with auth, plus an animated waitlist landing page.",
    ],
    stack: ["React 19", "Vite", "Next.js 16", "Clerk", "GSAP", "Tailwind 4"],
  },
];

// kind: lang | front | data | tool
const INVENTORY = [
  ["TypeScript", "lang"], ["JavaScript", "lang"], ["React 19", "front"], ["Next.js 16", "front"],
  ["Tailwind CSS", "front"], ["GSAP", "front"], ["PixiJS", "front"], ["Electron", "front"],
  ["Node.js", "data"], ["Prisma", "data"], ["SQLite", "data"], ["Zod", "data"],
  ["Vite", "tool"], ["Vitest", "tool"], ["Playwright", "tool"], ["Git", "tool"],
];
// ────────────────────────────────────────────────────────────────

const W = 840;
const C = {
  bg: "#0a0e0b",
  panel: "#0f1511",
  line: "#1c3a26",
  green: "#39ff7a",
  dim: "#1f9a4d",
  mute: "#5f7f69",
  amber: "#ffb000",
  pink: "#ff3d9a",
  cyan: "#3df2ff",
  white: "#d8ffe4",
  clawd: "#d97757",
};
const KIND = { lang: C.amber, front: C.cyan, data: C.green, tool: C.pink };
const FONT = `'Courier New', Courier, 'Liberation Mono', monospace`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const GLYPHS = {
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
};
const ICONS = {
  cursor: ["10000000", "11000000", "11100000", "11110000", "11111000", "11100000", "10110000", "00011000"],
  play: ["00100000", "00110000", "00111000", "00111100", "00111100", "00111000", "00110000", "00100000"],
  chart: ["00000010", "00000010", "00001010", "00001010", "00101010", "00101010", "10101010", "11111111"],
};

// Clawd, the Claude Code mascot: body plus two leg frames that alternate while it walks.
const CLAWD = {
  body: ["011111111110", "011011110110", "111111111111", "111111111111", "011111111110"],
  legsA: ["010100001010", "010100001010"],
  legsB: ["001010010100", "001010010100"],
};
const CLAWD_CSS = `.la { animation: legs 0.36s steps(1) infinite; } .lb { animation: legs 0.36s steps(1) infinite; animation-delay: -0.18s; } @keyframes legs { 50% { opacity: 0; } }`;

function clawd(x, y, px) {
  return `${bitmap(CLAWD.body, x, y, px, C.clawd)}<g class="la">${bitmap(CLAWD.legsA, x, y + 5 * px, px, C.clawd)}</g><g class="lb">${bitmap(CLAWD.legsB, x, y + 5 * px, px, C.clawd)}</g>`;
}

function bitmap(rows, x, y, px, fill) {
  let out = "";
  rows.forEach((row, r) => {
    [...row].forEach((bit, c) => {
      if (bit === "1") out += `<rect x="${x + c * px}" y="${y + r * px}" width="${px}" height="${px}" fill="${fill}"/>`;
    });
  });
  return out;
}

function pixelText(text, x, y, px, fill) {
  let out = "";
  [...text.toUpperCase()].forEach((ch, i) => {
    const g = GLYPHS[ch];
    if (!g) throw new Error(`No pixel glyph for "${ch}" — add it to GLYPHS`);
    out += bitmap(g, x + i * 6 * px, y, px, fill);
  });
  return out;
}
const pixelTextWidth = (text, px) => (text.length * 6 - 1) * px;

// Shared chrome: CRT screen with a title bar, scanlines and a soft glow.
function frame(height, title, body, extraCss = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${esc(title)}">
<defs>
  <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity="0.22"/></pattern>
  <radialGradient id="glow" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${C.green}" stop-opacity="0.07"/><stop offset="1" stop-color="${C.green}" stop-opacity="0"/></radialGradient>
  <clipPath id="screen"><rect x="2" y="2" width="${W - 4}" height="${height - 4}" rx="10"/></clipPath>
</defs>
<style>
  text { font-family: ${FONT}; font-size: 14px; fill: ${C.green}; }
  .dim { fill: ${C.dim}; } .mute { fill: ${C.mute}; } .amber { fill: ${C.amber}; }
  .pink { fill: ${C.pink}; } .cyan { fill: ${C.cyan}; } .white { fill: ${C.white}; }
  .b { font-weight: bold; }
  .blink { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  ${extraCss}
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; opacity: 1 !important; } }
</style>
<rect x="2" y="2" width="${W - 4}" height="${height - 4}" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>
<g clip-path="url(#screen)">
  <rect width="${W}" height="${height}" fill="url(#glow)"/>
  <rect x="2" y="2" width="${W - 4}" height="30" fill="${C.panel}"/>
  <rect x="2" y="32" width="${W - 4}" height="2" fill="${C.line}"/>
  <rect x="18" y="12" width="10" height="10" fill="${C.pink}"/><rect x="34" y="12" width="10" height="10" fill="${C.amber}"/><rect x="50" y="12" width="10" height="10" fill="${C.green}"/>
  <text x="${W / 2}" y="22" text-anchor="middle" class="mute" style="font-size:13px">${esc(title)}</text>
  ${body}
  <rect width="${W}" height="${height}" fill="url(#scan)"/>
</g>
</svg>
`;
}

function header() {
  const H = 392;
  const px = 9;
  const tx = Math.round((W - pixelTextWidth(HANDLE, px)) / 2);
  const ty = 122;
  // Each boot line fades in on its own delay, like a slow terminal.
  const show = (i) => `class="l" style="animation-delay:${(0.35 * i).toFixed(2)}s"`;
  const body = `
  <g ${show(0)}><text x="30" y="62" class="mute">GOON-BIOS v2.0.01  (C) 2001-2026</text></g>
  <g ${show(1)}><text x="30" y="82" class="mute">MEMORY CHECK ......... 640K OK</text></g>
  <g ${show(2)}><text x="30" y="102" class="dim">&gt; LOADING PROFILE.EXE ............ <tspan class="amber b">OK</tspan></text></g>
  <g ${show(3)}>
    ${pixelText(HANDLE, tx + 5, ty + 5, px, C.pink)}
    ${pixelText(HANDLE, tx, ty, px, C.green)}
    <text x="${W / 2}" y="${ty + 92}" text-anchor="middle" class="cyan" style="font-size:13px;letter-spacing:4px">- PRESS START -</text>
  </g>
  <g ${show(5)}><text x="30" y="262"><tspan class="pink b">$</tspan> whoami</text></g>
  <g ${show(6)}><text x="48" y="284" class="white">${esc(ROLE)}</text></g>
  <g ${show(7)}><text x="30" y="312"><tspan class="pink b">$</tspan> status --job</text></g>
  <g ${show(8)}>
    <rect x="48" y="322" width="126" height="22" fill="${C.amber}"/>
    <text x="111" y="338" text-anchor="middle" class="b" style="fill:${C.bg}">${esc(STATUS)}</text>
    <text x="186" y="338" class="white">${esc(STATUS_DETAIL)}</text>
  </g>
  <g ${show(9)}><text x="30" y="368"><tspan class="pink b">$</tspan></text><rect x="48" y="355" width="10" height="16" fill="${C.green}" class="blink"/></g>
  <g ${show(9)}>
    <g class="roam lead">${bitmap(ICONS.cursor, 596, 262, 3, C.white)}</g>
    <g class="roam">${clawd(520, 268, 5)}</g>
  </g>`;
  // The pixel cursor and Clawd share one path; Clawd runs it a beat later, so it chases the cursor.
  const css = `.l { opacity: 0; animation: on 0.01s linear forwards; } @keyframes on { to { opacity: 1; } }
  .roam { animation: roam 11s ease-in-out infinite; } .lead { animation-delay: -0.9s; }
  @keyframes roam { 0%, 100% { transform: translate(0, 40px); } 20% { transform: translate(150px, 0); } 40% { transform: translate(200px, 55px); } 60% { transform: translate(90px, 62px); } 80% { transform: translate(15px, 5px); } }
  ${CLAWD_CSS}`;
  return frame(H, `${HANDLE}@github: ~`, body, css);
}

function projects() {
  const slotH = 124;
  const gap = 12;
  const top = 92;
  const H = top + PROJECTS.length * (slotH + gap) + 30;
  const step = slotH + gap;
  let body = `
  <text x="30" y="62" class="amber b" style="font-size:16px;letter-spacing:3px">SELECT PROJECT</text>
  <text x="${W - 30}" y="62" text-anchor="end" class="mute">${PROJECTS.length} SAVE FILES FOUND</text>
  <rect x="30" y="72" width="${W - 60}" height="2" fill="${C.line}"/>
  <g class="sel"><path d="M12 ${top + slotH / 2 - 8} l12 8 l-12 8 z" fill="${C.amber}"/></g>`;
  PROJECTS.forEach((p, i) => {
    const y = top + i * step;
    let tagX = 138;
    const tags = p.stack
      .map((t) => {
        const w = Math.round(t.length * 7.3 + 14);
        const s = `<rect x="${tagX}" y="${y + 88}" width="${w}" height="20" fill="none" stroke="${C.dim}"/><text x="${tagX + w / 2}" y="${y + 102}" text-anchor="middle" class="dim" style="font-size:12px">${esc(t)}</text>`;
        tagX += w + 6;
        return s;
      })
      .join("");
    body += `
  <rect x="30" y="${y}" width="${W - 60}" height="${slotH}" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
  <rect x="46" y="${y + 22}" width="76" height="76" fill="${C.bg}" stroke="${C.dim}" stroke-width="2"/>
  ${bitmap(ICONS[p.icon], 56, y + 32, 7, C.green)}
  <text x="138" y="${y + 30}" class="amber b" style="font-size:17px">${String(i + 1).padStart(2, "0")}  ${esc(p.name)}</text>
  <text x="${W - 46}" y="${y + 30}" text-anchor="end" class="cyan" style="font-size:12px">[ ${esc(p.type)} ]  <tspan class="mute">SRC: PRIVATE</tspan></text>
  ${p.lines.map((l, k) => `<text x="138" y="${y + 54 + k * 19}" class="white" style="font-size:13px">${esc(l)}</text>`).join("")}
  ${tags}`;
  });
  // The selector arrow steps through the slots like a menu cursor.
  const n = PROJECTS.length;
  const frames = PROJECTS.map((_, i) => `${((i / n) * 100).toFixed(2)}% { transform: translateY(${i * step}px); }`).join(" ");
  const css = `.sel { animation: sel ${n * 1.6}s steps(1) infinite; } @keyframes sel { ${frames} }`;
  return frame(H, "C:\\PROJECTS\\SELECT.EXE", body, css);
}

function inventory() {
  const cols = 8;
  const sw = 95, sh = 62, gap = 5;
  const left = Math.round((W - (cols * sw + (cols - 1) * gap)) / 2);
  const top = 88;
  const rows = Math.ceil(INVENTORY.length / cols);
  const H = top + rows * (sh + gap) + 46;
  let body = `
  <text x="30" y="62" class="amber b" style="font-size:16px;letter-spacing:3px">INVENTORY</text>
  <text x="${W - 30}" y="62" text-anchor="end" class="mute">${INVENTORY.length} ITEMS EQUIPPED</text>
  <rect x="30" y="72" width="${W - 60}" height="2" fill="${C.line}"/>`;
  INVENTORY.forEach(([name, kind], i) => {
    const x = left + (i % cols) * (sw + gap);
    const y = top + Math.floor(i / cols) * (sh + gap);
    const col = KIND[kind];
    body += `
  <rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
  <rect x="${x + sw / 2 - 7}" y="${y + 12}" width="14" height="14" fill="${col}"/><rect x="${x + sw / 2 - 3}" y="${y + 16}" width="6" height="6" fill="${C.bg}"/>
  <text x="${x + sw / 2}" y="${y + 48}" text-anchor="middle" class="white" style="font-size:11.5px">${esc(name)}</text>`;
  });
  const ly = top + rows * (sh + gap) + 20;
  const legend = [["LANGUAGES", "lang"], ["FRONTEND / GAME", "front"], ["BACKEND / DATA", "data"], ["TOOLING / TESTS", "tool"]];
  legend.forEach(([label, kind], i) => {
    const x = left + i * 200;
    body += `<rect x="${x}" y="${ly - 10}" width="10" height="10" fill="${KIND[kind]}"/><text x="${x + 18}" y="${ly}" class="mute" style="font-size:12px">${label}</text>`;
  });
  return frame(H, "C:\\PLAYER\\INVENTORY.DAT", body);
}

// Standalone sprite, used by index.html where it follows the real cursor.
function clawdSprite() {
  const px = 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${12 * px} ${7 * px}" width="${12 * px}" height="${7 * px}" role="img" aria-label="Clawd">
<style>${CLAWD_CSS} @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .lb { display: none; } }</style>
${clawd(0, 0, px)}
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
for (const [name, svg] of Object.entries({ header: header(), projects: projects(), inventory: inventory(), clawd: clawdSprite() })) {
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`assets/${name}.svg  ${(svg.length / 1024).toFixed(1)} kB`);
}
