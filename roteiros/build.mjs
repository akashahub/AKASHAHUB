import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeEpisode, formatClock } from "./timing.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "..");
const version = "20260923b";
const ordem = JSON.parse(fs.readFileSync(path.join(root, "ordem.json"), "utf8"));

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadSeries(slug) {
  const file = path.join(root, "series", slug + ".json");
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const stats = (data.episodes || []).map(analyzeEpisode);
  const ok = stats.length > 0 && stats.every((s) => s.words >= 500 && s.words <= 660 && s.hookWords <= 12 && s.hookWords >= 3);
  return { data, stats, ok };
}

const ready = new Map();
for (const section of ordem.sections) {
  for (const item of section.items) {
    const loaded = loadSeries(item.slug);
    if (loaded) ready.set(item.slug, { ...item, ...loaded });
  }
}

const biblioteca = {
  updated: version,
  sections: ordem.sections.map((section) => {
    const items = [];
    if (ordem.reference && ordem.reference.section === section.id) {
      items.push({ ...ordem.reference, ref: true });
    }
    for (const item of section.items) {
      const found = ready.get(item.slug);
      if (!found) {
        items.push({
          title: item.label,
          meta: "roteiro em preparação",
          hook: "A página entra no ar quando a fala fechar 3 a 6 minutos.",
          pending: true,
        });
        continue;
      }
      const first = found.data.episodes[0];
      const slow = Math.min(...found.stats.map((s) => s.sec));
      const fast = Math.max(...found.stats.map((s) => s.sec));
      items.push({
        href: "/" + item.slug + "/",
        title: item.label,
        meta: found.data.episodes.length + " episódios · " + formatClock(slow) + " a " + formatClock(fast),
        hook: found.stats[0].hook,
        ok: found.ok,
      });
      if (!first) continue;
    }
    return { id: section.id, title: section.title, lead: section.lead, items };
  }),
};

fs.writeFileSync(path.join(root, "biblioteca.json"), JSON.stringify(biblioteca, null, 2));

function shell(slug, data) {
  const title = String(data.title || slug).replace(/\n/g, " ");
  const description = data.subtitle || data.logic || title;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} · Akasha Hub</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="https://akashahub.com.br/${esc(slug)}/">
<meta name="theme-color" content="#070608">
<meta property="og:title" content="${esc(title)} · Akasha Hub">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="https://akashahub.com.br/${esc(slug)}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/roteiros/teleprompt.css?v=${version}">
</head>
<body data-series="/roteiros/series/${esc(slug)}.json?v=${version}">
<div id="app"></div>
<script src="/roteiros/teleprompt.js?v=${version}"></script>
</body>
</html>
`;
}

let pages = 0;
for (const [slug, found] of ready) {
  const dir = path.join(repo, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shell(slug, found.data));
  pages += 1;
}

const sitemapPath = path.join(repo, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, "utf8");
  const locs = [`https://akashahub.com.br/roteiros/`, ...[...ready.keys()].map((slug) => `https://akashahub.com.br/${slug}/`)];
  const fresh = locs.filter((loc) => !xml.includes(loc));
  if (fresh.length) {
    const block = fresh
      .map((loc) => `  <url><loc>${loc}</loc><lastmod>2026-09-23</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
      .join("\n");
    xml = xml.replace("</urlset>", block + "\n</urlset>");
    fs.writeFileSync(sitemapPath, xml);
  }
}

console.log("Biblioteca atualizada. Páginas: " + pages + ". Fora do tempo: " + [...ready.values()].filter((item) => !item.ok).map((item) => item.slug).join(", "));
