// Generates the retro-Mac style SVGs used by the profile README.
// Run: node scripts/generate.mjs   (no dependencies)
// Edit the DATA section, run again, commit the files in assets/.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

// ───────────────────────────── DATA ─────────────────────────────
const HANDLE = "goonnnn0101";
const TAGLINE = "Developer into AI, cybersecurity and building products.";
const STATUS = "Open to internships and junior roles";

// accent: index into RAINBOW
const FOCUS = [
  { icon: "spark", accent: 0, title: "AI", lines: ["AI-powered products and", "AI-assisted engineering."], note: "see AiProvid" },
  { icon: "lock", accent: 3, title: "Security", lines: ["Hardening what I ship: CSP,", "CSRF, rate limits, validation."], note: "secure by default" },
  { icon: "prompt", accent: 5, title: "Build", lines: ["Games, SaaS and research", "tools, UI to database."], note: "4 projects below" },
];

const PROJECTS = [
  {
    icon: "search",
    accent: 5,
    name: "Commerce Admin Lab",
    kind: "Research lab",
    lines: [
      "A lab for researching how e-commerce companies really operate. It analyses public",
      "data from Shopify stores to map the processes, tools and methodologies they use.",
    ],
    stack: "Next.js · React · Prisma · SQLite · Zod · Vitest · Playwright",
  },
  {
    icon: "play",
    accent: 0,
    name: "AiProvid",
    kind: "AI SaaS",
    lines: [
      "AI video SaaS: a text prompt becomes a professional animated video.",
      "Product app with authentication, plus an animated waitlist landing page.",
    ],
    stack: "React · Vite · Next.js · Clerk · GSAP · Tailwind CSS",
  },
  {
    icon: "lock",
    accent: 3,
    name: "Limpiar Metadatos IA",
    kind: "Privacy tool · open source",
    lines: [
      "Browser-only tool that strips metadata from Word, Excel, PowerPoint, PDF and image",
      "files: author, dates, EXIF, GPS, C2PA. Nothing is uploaded; it all runs locally.",
    ],
    stack: "HTML · JavaScript · JSZip · pdf-lib",
  },
  {
    icon: "cursor",
    accent: 2,
    name: "Cursor Caído",
    kind: "Game",
    lines: [
      "2D sandbox game where your real Windows desktop is the world: open windows",
      "become platforms. Pixel art and chiptune audio are generated in code.",
    ],
    stack: "Electron · TypeScript · PixiJS · Win32 FFI · Web Audio",
  },
];

const STACK = ["TypeScript", "React", "Next.js", "Node.js", "Prisma", "SQLite", "Electron", "PixiJS", "Tailwind CSS", "Vitest", "Playwright"];
// ────────────────────────────────────────────────────────────────

const W = 840;
const C = { paper: "#fbfaf6", ink: "#1d1d1f", soft: "#48484d", gray: "#86868b", hair: "#d9d6cd", tint: "#f1eee6" };
// The six-colour stripe is the only colour on the page.
const RAINBOW = ["#61bb46", "#fdb827", "#f5821f", "#e03a3e", "#963d97", "#009ddc"];
const SANS = `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif`;
const MONO = `'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ICONS = {
  spark: ["00010000", "00010000", "00111000", "11111110", "00111000", "00010000", "00010000", "00000000"],
  lock: ["00111100", "01000010", "01000010", "11111111", "11111111", "11100111", "11111111", "11111111"],
  prompt: ["00000000", "10000000", "01000000", "00100000", "01000000", "10000000", "00001111", "00000000"],
  cursor: ["10000000", "11000000", "11100000", "11110000", "11111000", "11100000", "10110000", "00011000"],
  play: ["00100000", "00110000", "00111000", "00111100", "00111100", "00111000", "00110000", "00100000"],
  search: ["00111000", "01000100", "10000010", "10000010", "01000100", "00111100", "00000110", "00000011"],
};

function bitmap(rows, x, y, px, fill = C.ink) {
  let out = "";
  rows.forEach((row, r) => {
    [...row].forEach((bit, c) => {
      if (bit === "1") out += `<rect x="${x + c * px}" y="${y + r * px}" width="${px}" height="${px}" fill="${fill}"/>`;
    });
  });
  return out;
}

// Horizontal nudge that centres a bitmap's drawn pixels inside its 8-column cell.
function centerShift(rows, px) {
  const cols = rows.flatMap((row) => [...row].flatMap((bit, c) => (bit === "1" ? [c] : [])));
  return ((7 - Math.max(...cols) - Math.min(...cols)) * px) / 2;
}

// A classic window: hard shadow, 1.5px border, pinstriped title bar with a close box.
function win(x, y, w, h, title, body) {
  const bar = 26;
  const tw = title.length * 8 + 28;
  let stripes = "";
  for (let i = 0; i < 6; i++) stripes += `<rect x="${x + 34}" y="${y + 6 + i * 3}" width="${w - 46}" height="1" fill="${C.ink}"/>`;
  return `
  <rect x="${x + 4}" y="${y + 4}" width="${w}" height="${h}" fill="${C.ink}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>
  ${stripes}
  <rect x="${x + 12}" y="${y + 7}" width="12" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>
  <rect x="${x + w / 2 - tw / 2}" y="${y + 3}" width="${tw}" height="${bar - 6}" fill="${C.paper}"/>
  <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" class="mono b" style="font-size:13px">${esc(title)}</text>
  <rect x="${x}" y="${y + bar}" width="${w}" height="1.5" fill="${C.ink}"/>
  ${body}`;
}

function svg(height, label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${esc(label)}">
<style>
  text { font-family: ${SANS}; fill: ${C.ink}; }
  .mono { font-family: ${MONO}; } .b { font-weight: 700; }
  .soft { fill: ${C.soft}; } .gray { fill: ${C.gray}; }
  .cap { font-family: ${MONO}; font-size: 11px; letter-spacing: 1.5px; fill: ${C.gray}; }
  .blink { animation: blink 1.2s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .blink { animation: none; } }
</style>
<g shape-rendering="crispEdges">${body}</g>
</svg>
`;
}

// Original compact-computer drawing: screen with a prompt, drive slot, foot.
function computer(x, y) {
  return `
  <rect x="${x}" y="${y}" width="104" height="120" rx="6" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
  <rect x="${x + 14}" y="${y + 14}" width="76" height="58" rx="3" fill="${C.ink}"/>
  <path d="M${x + 26} ${y + 32} l10 8 l-10 8" fill="none" stroke="${C.paper}" stroke-width="3"/>
  <rect x="${x + 42}" y="${y + 46}" width="14" height="3" fill="${C.paper}" class="blink"/>
  <rect x="${x + 56}" y="${y + 90}" width="34" height="4" fill="${C.ink}"/>
  <rect x="${x + 14}" y="${y + 88}" width="8" height="8" fill="${RAINBOW[0]}"/>
  <rect x="${x + 10}" y="${y + 120}" width="84" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>`;
}

// Menu bar across the top of the header, with a six-stripe mark in place of a logo.
function menubar(y) {
  const mark = RAINBOW.map((c, i) => `<rect x="24" y="${y + 6 + i * 2}" width="13" height="2" fill="${c}"/>`).join("");
  const items = ["File", "Edit", "View", "Special"]
    .map((m, i) => `<text x="${56 + i * 52}" y="${y + 17}" class="b" style="font-size:13px" shape-rendering="auto">${m}</text>`)
    .join("");
  return `
  <rect x="8" y="${y}" width="${W - 16}" height="24" rx="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>
  ${mark}${items}
  <text x="${W - 24}" y="${y + 16}" text-anchor="end" class="mono" style="font-size:12px">${esc(HANDLE)}</text>`;
}

function header() {
  const top = 46;
  const H = 318;
  const stripe = RAINBOW.map((c, i) => `<rect x="${236 + i * 30}" y="${top + 172}" width="30" height="5" fill="${c}"/>`).join("");
  const body = menubar(6) + win(8, top, W - 20, H - top - 12, "About this developer", `
  ${computer(70, top + 60)}
  <text x="238" y="${top + 72}" class="cap">HELLO, I AM</text>
  <text x="236" y="${top + 120}" class="b" style="font-size:46px;letter-spacing:-1.5px" shape-rendering="auto">${esc(HANDLE)}</text>
  <text x="237" y="${top + 152}" class="soft" style="font-size:18px">${esc(TAGLINE)}</text>
  ${stripe}
  <rect x="237" y="${top + 203}" width="9" height="9" fill="${RAINBOW[0]}"/>
  <text x="256" y="${top + 212}" class="mono" style="font-size:13px">${esc(STATUS)}</text>`);
  return svg(H, `${HANDLE} — ${TAGLINE} ${STATUS}.`, body);
}

function focus() {
  const H = 204;
  const gap = 20;
  const w = (W - 20 - 2 * gap) / 3;
  let body = "";
  FOCUS.forEach((f, i) => {
    const x = 8 + i * (w + gap);
    body += win(x, 8, w, H - 20, f.title, `
  <rect x="${x + 22}" y="56" width="44" height="44" fill="${C.tint}" stroke="${C.ink}" stroke-width="1.5"/>
  ${bitmap(ICONS[f.icon], x + 28 + centerShift(ICONS[f.icon], 4), 62, 4)}
  <text x="${x + 80}" y="76" class="cap">FOCUS 0${i + 1}</text>
  <text x="${x + 80}" y="97" class="b" style="font-size:20px">${esc(f.title)}</text>
  ${f.lines.map((l, k) => `<text x="${x + 22}" y="${126 + k * 19}" class="soft" style="font-size:13.5px">${esc(l)}</text>`).join("")}
  <rect x="${x + 22}" y="164" width="8" height="8" fill="${RAINBOW[f.accent]}"/>
  <text x="${x + 38}" y="172" class="mono gray" style="font-size:11.5px">${esc(f.note)}</text>`);
  });
  return svg(H, `Focus: ${FOCUS.map((f) => `${f.title} — ${f.lines.join(" ")}`).join(" ")}`, body);
}

function projects() {
  const rowH = 112;
  const top = 8 + 26 + 30;
  const H = top + PROJECTS.length * rowH + 30 + 12;
  let rows = `
  <rect x="9" y="35" width="${W - 22}" height="28" fill="${C.tint}"/>
  <text x="104" y="54" class="cap">NAME</text>
  <text x="${W - 36}" y="54" text-anchor="end" class="cap">KIND</text>
  <rect x="8" y="${top - 1}" width="${W - 20}" height="1" fill="${C.ink}"/>`;
  PROJECTS.forEach((p, i) => {
    const y = top + i * rowH;
    const kw = Math.round(p.kind.length * 7.4 + 30);
    const kx = W - 36 - kw;
    rows += `
  <rect x="34" y="${y + 24}" width="50" height="50" fill="${C.tint}" stroke="${C.ink}" stroke-width="1.5"/>
  ${bitmap(ICONS[p.icon], 43 + centerShift(ICONS[p.icon], 4), y + 33, 4)}
  <text x="104" y="${y + 36}" class="b" style="font-size:18px">${esc(p.name)}</text>
  <rect x="${kx}" y="${y + 20}" width="${kw}" height="22" rx="11" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5" shape-rendering="auto"/>
  <rect x="${kx + 10}" y="${y + 27}" width="8" height="8" fill="${RAINBOW[p.accent]}"/>
  <text x="${kx + 23}" y="${y + 35}" class="mono" style="font-size:12px">${esc(p.kind)}</text>
  ${p.lines.map((l, k) => `<text x="104" y="${y + 58 + k * 19}" class="soft" style="font-size:13.5px">${esc(l)}</text>`).join("")}
  <text x="104" y="${y + 98}" class="mono gray" style="font-size:11.5px">${esc(p.stack)}</text>
  <rect x="8" y="${y + rowH - 1}" width="${W - 20}" height="1.5" fill="${i === PROJECTS.length - 1 ? C.ink : C.hair}"/>`;
  });
  const fy = top + PROJECTS.length * rowH;
  rows += `<text x="${W / 2}" y="${fy + 20}" text-anchor="middle" class="mono gray" style="font-size:11.5px">${PROJECTS.length} items · private source unless marked, walkthrough on request</text>`;
  const body = win(8, 8, W - 20, H - 20, "Projects", rows);
  return svg(H, `Projects: ${PROJECTS.map((p) => `${p.name} (${p.kind}) — ${p.lines.join(" ")}`).join(" ")}`, body);
}

function stack() {
  // Lay the chips out in centred rows, wrapping when a row is full.
  const chipW = (s) => Math.round(s.length * 7.4 + 22);
  const gap = 8, maxW = W - 20 - 56;
  const lines = [[]];
  let used = 0;
  for (const s of STACK) {
    const w = chipW(s);
    if (used + w > maxW && lines.at(-1).length) { lines.push([]); used = 0; }
    lines.at(-1).push(s);
    used += w + gap;
  }
  // Rebalance so the last row is not left with one or two orphans.
  const per = Math.ceil(STACK.length / lines.length);
  lines.splice(0, lines.length, ...Array.from({ length: Math.ceil(STACK.length / per) }, (_, r) => STACK.slice(r * per, r * per + per)));
  const H = 8 + 26 + 22 + lines.length * 34 + 12 + 12;
  let chips = "";
  lines.forEach((line, r) => {
    const total = line.reduce((a, s) => a + chipW(s) + gap, -gap);
    let x = Math.round((W - 4 - total) / 2);
    const y = 8 + 26 + 22 + r * 34;
    for (const s of line) {
      const w = chipW(s);
      chips += `<rect x="${x}" y="${y}" width="${w}" height="24" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + 16}" text-anchor="middle" class="mono" style="font-size:12px">${esc(s)}</text>`;
      x += w + gap;
    }
  });
  return svg(H, `Stack: ${STACK.join(", ")}`, win(8, 8, W - 20, H - 20, "Stack", chips));
}

mkdirSync(OUT, { recursive: true });
for (const [name, out] of Object.entries({ header: header(), focus: focus(), projects: projects(), stack: stack() })) {
  writeFileSync(join(OUT, `${name}.svg`), out);
  console.log(`assets/${name}.svg  ${(out.length / 1024).toFixed(1)} kB`);
}
