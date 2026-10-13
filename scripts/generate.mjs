// Generates the SVG plates used by the profile README: black enamel panels
// with chrome bezels, in the spirit of vintage hi-fi faceplates.
// Run: node scripts/generate.mjs   (no dependencies)
// Edit the DATA section, run again, commit the files in assets/.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

// ───────────────────────────── DATA ─────────────────────────────
const HANDLE = "goonnnn0101";
const MODEL = "MODEL G—0101";
const TAGLINE = "Developer into AI, cybersecurity and building products.";
const STATUS = "AVAILABLE FOR INTERNSHIPS & JUNIOR ROLES";
const DISCIPLINES = "ARTIFICIAL INTELLIGENCE   /   CYBERSECURITY   /   PRODUCT ENGINEERING";
const SINCE = "EST. 2025";

const FOCUS = [
  { icon: "nodes", title: "Intelligence", lines: ["AI-powered products and", "AI-assisted engineering."], note: "SEE AIPROVID" },
  { icon: "shield", title: "Security", lines: ["Hardening what I ship: CSP,", "CSRF, rate limits, validation."], note: "SECURE BY DEFAULT" },
  { icon: "cube", title: "Build", lines: ["Games, SaaS and research", "tools, UI to database."], note: "FOUR PROJECTS BELOW" },
];

const PROJECTS = [
  {
    icon: "lens",
    name: "Commerce Admin Lab",
    kind: "RESEARCH LAB",
    lines: [
      "A lab for researching how e-commerce companies really operate. It analyses public",
      "data from Shopify stores to map the processes, tools and methodologies they use.",
    ],
    stack: "Next.js · React · Prisma · SQLite · Zod · Vitest · Playwright",
  },
  {
    icon: "film",
    name: "AiProvid",
    kind: "AI SAAS",
    lines: [
      "AI video SaaS: a text prompt becomes a professional animated video.",
      "Product app with authentication, plus an animated waitlist landing page.",
    ],
    stack: "React · Vite · Next.js · Clerk · GSAP · Tailwind CSS",
  },
  {
    icon: "doc",
    name: "Metadata Cleaner",
    kind: "PRIVACY TOOL · OPEN SOURCE",
    lines: [
      "Browser-only tool that strips metadata from Word, Excel, PowerPoint, PDF and image",
      "files: author, dates, EXIF, GPS, C2PA. Nothing is uploaded; it all runs locally.",
    ],
    stack: "HTML · JavaScript · JSZip · pdf-lib",
  },
  {
    icon: "pointer",
    name: "Cursor Caído",
    kind: "GAME",
    lines: [
      "2D sandbox game where your real Windows desktop is the world: open windows",
      "become platforms. Pixel art and chiptune audio are generated in code.",
    ],
    stack: "Electron · TypeScript · PixiJS · Win32 FFI · Web Audio",
  },
];

const STACK = [
  ["TypeScript", "React", "Next.js", "Node.js", "Prisma", "SQLite"],
  ["Electron", "PixiJS", "Tailwind CSS", "Vitest", "Playwright"],
];
// ────────────────────────────────────────────────────────────────

const W = 840;
const C = { ivory: "#ece8df", mute: "#a3a199", dim: "#6d6e73", groove: "#26282c", enamel: "#0b0b0d", led: "#8dffb0" };
const SANS = `'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `'SF Mono', Menlo, Consolas, 'Courier New', monospace`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Line icons drawn in a 40×40 box centred on 0,0. Strokes pick up the chrome gradient.
const ICONS = {
  nodes: `<circle r="17.5" stroke-dasharray="1.5 5" opacity="0.55"/><path d="M0 0 V-13 M0 0 L-12 8 M0 0 L12 8"/><circle cy="-13" r="3.2" class="fe"/><circle cx="-12" cy="8" r="3.2" class="fe"/><circle cx="12" cy="8" r="3.2" class="fe"/><circle r="4.2" class="fc"/>`,
  shield: `<path d="M0 -16 L13 -11 V0 C13 9 6 14 0 17 C-6 14 -13 9 -13 0 V-11 Z"/><circle cy="-3" r="3"/><path d="M0 0 V7"/>`,
  cube: `<path d="M0 -15 L13 -8 L0 -1 L-13 -8 Z"/><path d="M-13 -8 V7 L0 15 L13 7 V-8"/><path d="M0 -1 V15"/>`,
  lens: `<circle cx="-3" cy="-3" r="10"/><path d="M4.5 4.5 L14 14"/><path d="M-8 2 V-2 M-3 2 V-8 M2 2 V-5"/>`,
  film: `<rect x="-15" y="-11" width="30" height="22" rx="3.5"/><path d="M-4 -5.5 L6 0 L-4 5.5 Z" class="fc"/>`,
  doc: `<path d="M-10 -15 H3 L10 -8 V15 H-10 Z"/><path d="M3 -15 V-8 H10"/><path d="M-5 -1 H5"/><path d="M-5 5 H5" stroke-dasharray="1.5 3"/>`,
  pointer: `<path d="M-8 -15 V10 L-2 5 L3 15 L7 13 L2 3 H10 Z"/>`,
};

const DEFS = `<defs>
  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="0.32" stop-color="#c3c7ce"/><stop offset="0.5" stop-color="#666b73"/>
    <stop offset="0.53" stop-color="#f1f2f4"/><stop offset="0.82" stop-color="#b1b6be"/><stop offset="1" stop-color="#70757d"/>
  </linearGradient>
  <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fafafa"/><stop offset="0.22" stop-color="#9da2a9"/><stop offset="0.42" stop-color="#e9eaec"/>
    <stop offset="0.6" stop-color="#6c7178"/><stop offset="0.8" stop-color="#d6d8dc"/><stop offset="1" stop-color="#7c8188"/>
  </linearGradient>
  <linearGradient id="line" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="20">
    <stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#b9bdc4"/><stop offset="1" stop-color="#7d828a"/>
  </linearGradient>
  <linearGradient id="hair" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a8f96" stop-opacity="0"/><stop offset="0.12" stop-color="#c9ccd1"/><stop offset="0.5" stop-color="#f4f5f6"/>
    <stop offset="0.88" stop-color="#c9ccd1"/><stop offset="1" stop-color="#8a8f96" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1c20"/><stop offset="1" stop-color="#0b0b0d"/></linearGradient>
  <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="screw" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="#a4a9b0"/><stop offset="1" stop-color="#4d5157"/></radialGradient>
  <pattern id="brush" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="1" fill="#fff" opacity="0.022"/></pattern>
</defs>`;

function svg(height, label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${esc(label)}">
${DEFS}
<style>
  text { font-family: ${SANS}; fill: ${C.ivory}; }
  .label { font-size: 10.5px; letter-spacing: 2.6px; font-weight: 500; }
  .mute { fill: ${C.mute}; } .dim { fill: ${C.dim}; } .mono { font-family: ${MONO}; }
  .ch { fill: url(#chrome); }
  .ic { fill: none; stroke: url(#line); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .ic .fc { fill: url(#line); stroke: none; } .ic .fe { fill: ${C.enamel}; }
  .led { animation: led 3.2s ease-in-out infinite; }
  @keyframes led { 50% { opacity: 0.35; } }
  @media (prefers-reduced-motion: reduce) { .led { animation: none; } }
</style>
${body}
</svg>
`;
}

// Enamel plate with a chrome bezel, an inset groove and a soft top gloss.
function plate(x, y, w, h, body, r = 16) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#enamel)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#brush)"/>
  <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${Math.round(h * 0.42)}" rx="${r - 2}" fill="url(#gloss)"/>
  <rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="${r - 6}" fill="none" stroke="${C.groove}"/>
  <rect x="${x + 1.25}" y="${y + 1.25}" width="${w - 2.5}" height="${h - 2.5}" rx="${r - 1}" fill="none" stroke="url(#bezel)" stroke-width="2.5"/>
  ${body}`;
}

const hairline = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="1" fill="url(#hair)"/>`;

const screw = (cx, cy, rot) =>
  `<circle cx="${cx}" cy="${cy}" r="5.5" fill="url(#screw)" stroke="#2c2e33" stroke-width="0.75"/><path d="M${cx - 3.6} ${cy} H${cx + 3.6}" stroke="#2c2e33" stroke-width="1.3" transform="rotate(${rot} ${cx} ${cy})"/>`;

const led = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="7" fill="${C.led}" opacity="0.14" class="led"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="${C.led}" class="led"/><circle cx="${cx - 1}" cy="${cy - 1}" r="1" fill="#fff" opacity="0.8"/>`;

// Icon seated in a chrome-ringed dial.
function dial(cx, cy, icon, r = 25) {
  return `<g transform="translate(${cx} ${cy})">
    <circle r="${r}" fill="${C.enamel}"/><circle r="${r}" fill="none" stroke="url(#bezel)" stroke-width="1.6"/>
    <circle r="${r - 4}" fill="none" stroke="${C.groove}"/>
    <g class="ic" transform="scale(${(r / 25) * 0.86})">${ICONS[icon]}</g>
  </g>`;
}

// The mark: the handle's "0101" reduced to ring, bar, ring, bar.
function emblem(cx, cy) {
  const rings = [46, 41, 36].map((r) => `<circle r="${r}" fill="none" stroke="${C.groove}"/>`).join("");
  const ticks = Array.from({ length: 60 }, (_, i) => `<path d="M0 -52.5 V${i % 5 ? -50 : -48}" stroke="${i % 5 ? C.dim : "#c9ccd1"}" stroke-width="${i % 5 ? 0.6 : 1}" transform="rotate(${i * 6})"/>`).join("");
  return `<g transform="translate(${cx} ${cy})">
    <circle r="58" fill="${C.enamel}"/><circle r="58" fill="none" stroke="url(#bezel)" stroke-width="3"/>
    ${ticks}${rings}
    <g fill="none" stroke="url(#line)" stroke-width="3.4" stroke-linecap="round" transform="translate(1 0)">
      <circle cx="-22" r="7.5"/><path d="M-7 -11 V11"/><circle cx="8" r="7.5"/><path d="M23 -11 V11"/>
    </g>
  </g>`;
}

function header() {
  const H = 304;
  const body = plate(6, 6, W - 12, H - 12, `
  ${screw(28, 28, 20)}${screw(W - 28, 28, -35)}${screw(28, H - 28, 60)}${screw(W - 28, H - 28, 10)}
  <text x="54" y="46" class="label dim">${esc(MODEL)}</text>
  <text x="${W - 70}" y="46" text-anchor="end" class="label mute">${esc(STATUS)}</text>
  ${led(W - 56, 42)}
  ${emblem(124, 152)}
  <text x="212" y="166" style="font-size:56px;font-weight:700;letter-spacing:-1.5px;fill:#000" opacity="0.9" transform="translate(0 2.5)">${esc(HANDLE)}</text>
  <text x="212" y="166" class="ch" style="font-size:56px;font-weight:700;letter-spacing:-1.5px" stroke="#3a3d42" stroke-width="0.6">${esc(HANDLE)}</text>
  <text x="214" y="198" style="font-size:17px;font-weight:300;letter-spacing:0.2px">${esc(TAGLINE)}</text>
  ${hairline(54, 238, W - 108)}
  <text x="54" y="266" class="label mute">${esc(DISCIPLINES)}</text>
  <text x="${W - 54}" y="266" text-anchor="end" class="label dim">${esc(SINCE)}</text>`, 18);
  return svg(H, `${HANDLE} — ${TAGLINE} Available for internships and junior roles.`, body);
}

function focus() {
  const H = 232;
  const gap = 18;
  const w = (W - 12 - 2 * gap) / 3;
  let body = "";
  FOCUS.forEach((f, i) => {
    const x = 6 + i * (w + gap);
    body += plate(x, 6, w, H - 12, `
  ${dial(x + 50, 62, f.icon)}
  <text x="${x + w - 28}" y="42" text-anchor="end" class="mono ch" style="font-size:12px;letter-spacing:1px">0${i + 1}</text>
  <text x="${x + 90}" y="56" class="label dim">FOCUS</text>
  <text x="${x + 90}" y="78" style="font-size:16px;font-weight:600;letter-spacing:2.4px">${esc(f.title.toUpperCase())}</text>
  ${hairline(x + 24, 104, w - 48)}
  ${f.lines.map((l, k) => `<text x="${x + 26}" y="${134 + k * 20}" class="mute" style="font-size:13.5px">${esc(l)}</text>`).join("")}
  ${led(x + 31, 192)}
  <text x="${x + 46}" y="196" class="label dim" style="font-size:9.5px">${esc(f.note)}</text>`);
  });
  return svg(H, `Focus: ${FOCUS.map((f) => `${f.title} — ${f.lines.join(" ")}`).join(" ")}`, body);
}

function projects() {
  const rowH = 122;
  const top = 70;
  const H = top + PROJECTS.length * rowH + 54;
  let rows = `
  <text x="34" y="46" class="label">PROJECTS</text>
  <text x="${W - 34}" y="46" text-anchor="end" class="label dim">${String(PROJECTS.length).padStart(2, "0")} ITEMS</text>
  ${hairline(30, top - 8, W - 60)}`;
  PROJECTS.forEach((p, i) => {
    const y = top + i * rowH;
    const kw = Math.round(p.kind.length * 8.3 + 26);
    const kx = W - 34 - kw;
    rows += `
  ${dial(64, y + 56, p.icon, 27)}
  <text x="112" y="${y + 24}" class="mono ch" style="font-size:11px;letter-spacing:1.5px">No. ${String(i + 1).padStart(2, "0")}</text>
  <text x="112" y="${y + 48}" style="font-size:20px;font-weight:600;letter-spacing:-0.2px">${esc(p.name)}</text>
  <rect x="${kx}" y="${y + 12}" width="${kw}" height="22" rx="11" fill="${C.enamel}" stroke="url(#bezel)" stroke-width="1.2"/>
  <text x="${kx + kw / 2 + 1}" y="${y + 27}" text-anchor="middle" class="label mute" style="font-size:9.5px;letter-spacing:1.8px">${esc(p.kind)}</text>
  ${p.lines.map((l, k) => `<text x="112" y="${y + 70 + k * 19}" class="mute" style="font-size:13.5px">${esc(l)}</text>`).join("")}
  <text x="112" y="${y + 110}" class="mono dim" style="font-size:11px">${esc(p.stack)}</text>
  ${i < PROJECTS.length - 1 ? `<rect x="112" y="${y + rowH - 1}" width="${W - 146}" height="1" fill="${C.groove}"/>` : ""}`;
  });
  const fy = top + PROJECTS.length * rowH;
  rows += `${hairline(30, fy + 4, W - 60)}
  <text x="${W / 2}" y="${fy + 26}" text-anchor="middle" class="label dim" style="font-size:9.5px">PRIVATE SOURCE UNLESS MARKED  ·  WALKTHROUGH ON REQUEST</text>`;
  return svg(H, `Projects: ${PROJECTS.map((p) => `${p.name} (${p.kind.toLowerCase()}) — ${p.lines.join(" ")}`).join(" ")}`, plate(6, 6, W - 12, H - 12, rows));
}

function stack() {
  const H = 140;
  const lines = STACK.map(
    (row, r) => `<text x="${W / 2}" y="${82 + r * 24}" text-anchor="middle" class="label" style="font-size:11px;letter-spacing:2.2px">${esc(row.join("   ·   ").toUpperCase())}</text>`
  ).join("");
  const body = plate(6, 6, W - 12, H - 12, `
  <text x="34" y="46" class="label">STACK</text>
  <text x="${W - 34}" y="46" text-anchor="end" class="label dim">${String(STACK.flat().length).padStart(2, "0")} ITEMS</text>
  ${hairline(30, 58, W - 60)}
  ${lines}`);
  return svg(H, `Stack: ${STACK.flat().join(", ")}`, body);
}

mkdirSync(OUT, { recursive: true });
for (const [name, out] of Object.entries({ header: header(), focus: focus(), projects: projects(), stack: stack() })) {
  writeFileSync(join(OUT, `${name}.svg`), out);
  console.log(`assets/${name}.svg  ${(out.length / 1024).toFixed(1)} kB`);
}
