import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeEpisode, BANNED, formatClock } from "./timing.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const seriesDir = path.join(root, "series");
const files = fs.existsSync(seriesDir)
  ? fs.readdirSync(seriesDir).filter((f) => f.endsWith(".json")).sort()
  : [];

let failed = 0;
if (!files.length) {
  console.log("Nenhum roteiro em roteiros/series.");
  process.exit(1);
}

for (const file of files) {
  const full = path.join(seriesDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (err) {
    failed += 1;
    console.log("JSON " + file + " " + err.message);
    continue;
  }
  const eps = data.episodes || [];
  console.log("\n" + (data.slug || file) + " · " + eps.length + " episódios");
  eps.forEach((ep, index) => {
    const stat = analyzeEpisode(ep);
    const problems = [];
    if (stat.words < 500 || stat.words > 660) problems.push("palavras " + stat.words);
    if (stat.sec < 180 || stat.sec > 370) problems.push("tempo " + formatClock(stat.sec));
    if (stat.hookWords < 3 || stat.hookWords > 12) problems.push("gancho " + stat.hookWords + " · " + stat.hook);
    if (!ep.blocks || ep.blocks[0]?.type !== "hook") problems.push("abre sem hook");
    if (ep.blocks && ep.blocks[ep.blocks.length - 1]?.type !== "close") problems.push("fecha sem ponte");
    if (ep.blocks && !ep.blocks.some((b) => b.type === "micro")) problems.push("sem micro-gancho");
    const speech = (ep.blocks || []).flatMap((b) => b.lines || []).join(" \n ").toLowerCase();
    for (const ban of BANNED) {
      if (speech.includes(ban)) problems.push("fala banida: " + ban);
    }
    const mark = problems.length ? "AJUSTAR" : "ok";
    if (problems.length) failed += 1;
    console.log(
      "  " + mark + " " + (ep.id || index) + "  " + formatClock(stat.sec) +
      "  " + stat.words + " palavras  " + stat.lines + " linhas" +
      (problems.length ? "  — " + problems.join("; ") : "")
    );
  });
}

console.log(failed ? "\n" + failed + " episódio(s) fora do padrão." : "\nTudo dentro de 3 a 6 minutos, com gancho de até 12 palavras.");
process.exit(failed ? 1 : 0);
