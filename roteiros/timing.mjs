export function analyzeEpisode(ep) {
  const lines = (ep.blocks || []).flatMap((b) => b.lines || []);
  const words = lines
    .join(" ")
    .replace(/\*/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const hookLine = String((ep.blocks && ep.blocks[0] && ep.blocks[0].lines && ep.blocks[0].lines[0]) || "");
  const hookWords = hookLine.replace(/\*/g, " ").trim().split(/\s+/).filter(Boolean);
  const sec = Math.round((words.length / 120) * 60 + Math.max(0, lines.length - 1) * 0.55);
  return {
    words: words.length,
    lines: lines.length,
    sec,
    hookWords: hookWords.length,
    hook: hookWords.join(" "),
  };
}

export function formatClock(sec) {
  const sign = sec < 0 ? "-" : "";
  const abs = Math.abs(sec);
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return sign + m + ":" + String(s).padStart(2, "0");
}

export const BANNED = [
  "não vai acreditar",
  "nao vai acreditar",
  "se inscreve",
  "deixa o like",
  "deixa o teu like",
  "comenta aqui",
  "os ricos não querem",
  "os ricos nao querem",
  "comprovado cientificamente",
  "vai ficar rico",
  "renda garantida",
  "garantido que você",
  "você é um fracasso",
  "voce e um fracasso",
];
