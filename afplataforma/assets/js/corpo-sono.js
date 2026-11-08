import { esc } from "./navigation.js";
import { session } from "./auth.js";
import { Store } from "./storage.js";

const KEY = "corpo_sleep_v1";
function state() {
  const uid = session.uid || "local";
  return Store.get(KEY + "_" + uid, { logs: [] });
}
function save(data) {
  const uid = session.uid || "local";
  Store.set(KEY + "_" + uid, data);
}
function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function navHead(kicker, title, sub) {
  return `<button class="corpo-back" type="button" data-nav="corpo:regeneracao">← Recuperação e Regeneração</button>
    <section class="corpo-area-hero"><span>${kicker}</span><h1>${title}</h1><p>${sub}</p></section>`;
}

function sleepMarkup(data) {
  const recent = [...data.logs].reverse().slice(0, 10);
  return `<div class="ct-layout">
    <section class="ct-panel">
      <h2>Registrar sono</h2>
      <p>Registre horários e qualidade subjetiva. Não é diagnóstico.</p>
      <form id="sleepForm" class="ct-form">
        <label class="ct-field"><span>Data</span><input name="date" type="date" value="${today()}" required></label>
        <label class="ct-field"><span>Hora de deitar</span><input name="bed" type="time" required></label>
        <label class="ct-field"><span>Hora de levantar</span><input name="wake" type="time" required></label>
        <label class="ct-field"><span>Qualidade (1 a 10)</span><input name="quality" type="number" min="1" max="10" value="7" required></label>
        <label class="ct-field"><span>Observações</span><textarea name="notes" rows="2" placeholder="Despertou, sonhos, ambiente..."></textarea></label>
        <button class="tool-btn" type="submit">Salvar registro</button>
      </form>
    </section>
    <section class="ct-panel">
      <h2>Registros recentes</h2>
      ${recent.length ? recent.map(l => `<article class="ct-log-row"><b>${esc(l.date)}</b><small>Deitar ${esc(l.bed)} · Levantar ${esc(l.wake)} · Qualidade ${l.quality}/10</small>${l.notes ? `<p>${esc(l.notes)}</p>` : ""}</article>`).join("") : '<p class="ct-empty">Nenhum registro ainda.</p>'}
    </section>
  </div>
  <section class="ct-panel" style="margin-top:16px">
    <h2>Higiene do sono (educativo)</h2>
    <ul style="font-size:12px;line-height:1.7;color:var(--muted);padding-left:18px">
      <li>Manter horários regulares de deitar e levantar.</li>
      <li>Reduzir luz forte e telas na hora antes de dormir.</li>
      <li>Ambiente escuro, silencioso e com temperatura confortável.</li>
      <li>Evitar cafeína no fim da tarde e refeições pesadas perto da hora de dormir.</li>
    </ul>
    <p class="ct-note">Conteúdo educativo. Não substitui avaliação médica ou de sono.</p>
  </section>`;
}

export function renderCorpoSonoSpace(slug) {
  if (slug !== "sono-e-ritmo-circadiano") return null;
  const data = state();
  return `<div class="view active corpo-view ct-view">
    ${navHead("RECUPERAÇÃO · SONO", "Diário de sono", "Registro de horários e qualidade subjetiva. Sem diagnóstico.")}
    ${sleepMarkup(data)}
  </div>`;
}

export function bindCorpoSono() {
  const root = document.getElementById("content");
  const form = root?.querySelector("#sleepForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = state();
    d.logs.push({
      date: f.get("date"),
      bed: f.get("bed"),
      wake: f.get("wake"),
      quality: Number(f.get("quality")),
      notes: String(f.get("notes") || "").slice(0, 400)
    });
    save(d);
    // Re-render via navigation would be ideal; for now reload current view
    location.hash = "corpo:regeneracao:sono-e-ritmo-circadiano";
    location.reload();
  });
}
