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

const FOCUS = [
  { icon: "spark", title: "AI", lines: ["AI-powered products and", "AI-assisted engineering."], note: "see AiProvid" },
  { icon: "lock", title: "Security", lines: ["Hardening what I ship: CSP,", "CSRF, rate limits, validation."], note: "secure by default" },
  { icon: "prompt", title: "Build", lines: ["Games, SaaS and web tools,", "from the UI to the database."], note: "3 projects below" },
];

const PROJECTS = [
  {
    icon: "cursor",
    name: "Cursor Caído",
    kind: "Game",
    line: "2D sandbox game where your real Windows desktop is the world: open windows become platforms.",
    stack: "Electron · TypeScript · PixiJS · Win32 FFI · Web Audio",
  },
  {
    icon: "chart",
    name: "Commerce Admin Lab",
    kind: "Web app",
    line: "E-commerce admin on simulated stores, with every figure computed by its own analytics engine.",
    stack: "Next.js · React · Prisma · SQLite · Zod · Vitest · Playwright",
  },
  {
    icon: "play",
    name: "AiProvid",
    kind: "SaaS",
    line: "AI video SaaS: a text prompt becomes a professional animated video.",
    stack: "React · Vite · Next.js · Clerk · GSAP · Tailwind CSS",
  },
];
// ────────────────────────────────────────────────────────────────

const W = 840;
const C = { paper: "#fbfaf6", ink: "#1d1d1f", soft: "#48484d", gray: "#86868b", hair: "#d9d6cd", green: "#61bb46" };
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
  chart: ["00000010", "00000010", "00001010", "00001010", "00101010", "00101010", "10101010", "11111111"],
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
  <rect x="${x + 14}" y="${y + 88}" width="8" height="8" fill="${C.green}"/>
  <rect x="${x + 10}" y="${y + 120}" width="84" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>`;
}

function header() {
  const H = 276;
  const stripe = RAINBOW.map((c, i) => `<rect x="${236 + i * 30}" y="172" width="30" height="5" fill="${c}"/>`).join("");
  const body = win(8, 8, W - 20, H - 20, `About ${HANDLE}`, `
  ${computer(70, 78)}
  <text x="236" y="112" class="b" style="font-size:46px;letter-spacing:-1.5px" shape-rendering="auto">${esc(HANDLE)}</text>
  <text x="237" y="146" class="soft" style="font-size:18px">${esc(TAGLINE)}</text>
  ${stripe}
  <rect x="237" y="205" width="9" height="9" fill="${C.green}"/>
  <text x="256" y="214" class="mono" style="font-size:13px">${esc(STATUS)}</text>`);
  return svg(H, `${HANDLE} — ${TAGLINE} ${STATUS}.`, body);
}

function focus() {
  const H = 196;
  const gap = 20;
  const w = (W - 20 - 2 * gap) / 3;
  let body = "";
  FOCUS.forEach((f, i) => {
    const x = 8 + i * (w + gap);
    body += win(x, 8, w, H - 20, f.title, `
  ${bitmap(ICONS[f.icon], x + 22, 54, 4)}
  <text x="${x + 68}" y="78" class="b" style="font-size:19px">${esc(f.title)}</text>
  ${f.lines.map((l, k) => `<text x="${x + 22}" y="${112 + k * 19}" class="soft" style="font-size:13.5px">${esc(l)}</text>`).join("")}
  <text x="${x + 22}" y="166" class="mono gray" style="font-size:11.5px">→ ${esc(f.note)}</text>`);
  });
  return svg(H, `Focus: ${FOCUS.map((f) => `${f.title} — ${f.lines.join(" ")}`).join(" ")}`, body);
}

function projects() {
  const rowH = 92;
  const top = 8 + 26 + 30;
  const H = top + PROJECTS.length * rowH + 30 + 12;
  let rows = `
  <text x="100" y="54" class="mono gray" style="font-size:11.5px">Name</text>
  <text x="${W - 36}" y="54" text-anchor="end" class="mono gray" style="font-size:11.5px">Kind</text>
  <rect x="8" y="${top - 1}" width="${W - 20}" height="1" fill="${C.hair}"/>`;
  PROJECTS.forEach((p, i) => {
    const y = top + i * rowH;
    rows += `
  <rect x="34" y="${y + 22}" width="46" height="46" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>
  ${bitmap(ICONS[p.icon], 41 + centerShift(ICONS[p.icon], 4), y + 29, 4)}
  <text x="100" y="${y + 32}" class="b" style="font-size:17px">${esc(p.name)}</text>
  <text x="${W - 36}" y="${y + 32}" text-anchor="end" class="mono gray" style="font-size:12px">${esc(p.kind)}</text>
  <text x="100" y="${y + 54}" class="soft" style="font-size:13.5px">${esc(p.line)}</text>
  <text x="100" y="${y + 74}" class="mono gray" style="font-size:11.5px">${esc(p.stack)}</text>
  <rect x="8" y="${y + rowH - 1}" width="${W - 20}" height="1" fill="${i === PROJECTS.length - 1 ? C.ink : C.hair}"/>`;
  });
  const fy = top + PROJECTS.length * rowH;
  rows += `<text x="${W / 2}" y="${fy + 20}" text-anchor="middle" class="mono gray" style="font-size:11.5px">${PROJECTS.length} items · private source, walkthrough on request</text>`;
  const body = win(8, 8, W - 20, H - 20, "Projects", rows);
  return svg(H, `Projects: ${PROJECTS.map((p) => `${p.name} (${p.kind}) — ${p.line}`).join(" ")}`, body);
}

mkdirSync(OUT, { recursive: true });
for (const [name, out] of Object.entries({ header: header(), focus: focus(), projects: projects() })) {
  writeFileSync(join(OUT, `${name}.svg`), out);
  console.log(`assets/${name}.svg  ${(out.length / 1024).toFixed(1)} kB`);
}
