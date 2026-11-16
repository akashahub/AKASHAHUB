/**
 * Inteligência Central. Lê o mesmo dossiê e só mostra o cruzamento.
 * Não grava e não dá conselho.
 */
import { session, isMentorSession } from "./auth.js";
import { activeHubContext, loadAuthorizedMentees } from "./hub-context.js?v=etapa4-1";
import { loadDossieBlocks } from "./hub-dossie.js?v=etapa6-1";
import { subjectOf } from "./hub-dossie-rules.js?v=etapa6-1";
import { phaseReport, bridges } from "./hub-intel-rules.js?v=etapa6-1";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;"
  }[ch]));
}

function person() {
  return subjectOf({
    sessionUid: session.uid,
    mentor: isMentorSession(),
    context: activeHubContext()
  });
}

export function renderHubIntel() {
  const who = person();
  if (!who) return `<div class="view active"><p class="empty">Entre para ver as fases juntas.</p></div>`;
  const looking = who.own ? "as suas fases" : `as fases de ${esc(who.name)}`;
  return `<div class="view active" id="hubIntelRoot">
    <p class="hero-line">Cruzamento · sem conselho</p>
    <h2 class="hero-title">${who.own ? "Minhas fases" : "Inteligência Central"}</h2>
    <p class="hero-sub">Isto olha ${looking} e diz só o que está preenchido e o que está vazio. Não muda nada e não diz o que fazer.</p>
    <div id="hubIntelPhases" style="display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin:12px 0"></div>
    <div id="hubIntelBridges"></div>
    <p style="margin-top:12px"><button class="tool-btn" type="button" data-nav="hub-dossie">Abrir o dossiê</button></p>
  </div>`;
}

export async function bindHubIntel() {
  const root = document.getElementById("hubIntelRoot");
  if (!root) return;
  if (isMentorSession()) {
    try { await loadAuthorizedMentees(); } catch { /* segue no próprio UID */ }
  }
  const who = person();
  const phases = document.getElementById("hubIntelPhases");
  const bridgeBox = document.getElementById("hubIntelBridges");
  if (!who || !phases || !bridgeBox) return;
  const blocks = await loadDossieBlocks(who.uid);
  const report = phaseReport(blocks);
  const lines = bridges(report);
  phases.innerHTML = report.map((row) => `<article class="mat-card" style="margin:0;padding:12px">
    <p class="hero-line">${esc(row.phase)}</p>
    <h3 style="margin:4px 0">${row.filled} de ${row.total}</h3>
    <p class="notes-hint">com resposta${row.blocked ? ` · ${row.blocked} sem leitura` : ""}</p>
  </article>`).join("");
  bridgeBox.innerHTML = lines.map((line) => `<p class="notes-hint">${esc(line)}</p>`).join("");
}
