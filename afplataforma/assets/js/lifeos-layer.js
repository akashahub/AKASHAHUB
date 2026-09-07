/**
 * Camadas 1–3 — Life OS dentro do AF (sem duplicar cashflow/pitch/etc.)
 * Persistência: Store (local) + Firestore quando logado.
 */
import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";

const WA = "5571983448621";
const FREQS = [
  { hz: 396, name: "Vetor 01 · Base", note: "Soltar medo / fundação" },
  { hz: 417, name: "Vetor 02 · Criativo", note: "Mudança e fluxo" },
  { hz: 528, name: "Vetor 03 · Execução", note: "Foco e transformação" },
  { hz: 639, name: "Vetor 04 · Relacional", note: "Conexão" },
  { hz: 741, name: "Vetor 05 · Comunicação", note: "Expressão" },
  { hz: 852, name: "Vetor 06 · Visão", note: "Clareza" },
  { hz: 963, name: "Vetor 07 · Governança", note: "Integração" }
];

let audioCtx = null;
let oscNode = null;
let sleepGain = null;
let sleepTimer = null;
let sleepIdle = null;
let sleepAnim = null;
let sleepBal = 0;
let sleepShown = 0;
let sleepVol = 35;
let sleepPaused = false;
let sleepHz = 396;
let sleepFeed = [];
let sleepInTotal = 0;
let sleepInCount = 0;
let sleepHidden = false;
let sleepClock = null;
let sleepDim = null;
let pomodoro = { t: null, left: 25 * 60, run: false };

function sleepName() {
  const raw = String(session.name || session.email || "você").trim();
  const n = raw.split(/[\s@]+/)[0] || "você";
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function brl(n) {
  return Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function uidKey(k) {
  return k + "_" + (session.uid || "anon");
}
function load(k, fb) {
  return Store.get(uidKey(k), fb);
}
function save(k, v) {
  Store.set(uidKey(k), v);
}
function toast(msg, err) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2600);
}

export function bindLifeOsLayer() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const fn = window[el.dataset.act];
    if (typeof fn === "function") {
      e.preventDefault();
      fn(el);
    }
  });
  document.addEventListener("submit", onSubmit, true);
  document.addEventListener("input", (e) => {
    if (e.target?.id === "sleepVol") setSleepVol(+e.target.value);
    if (e.target?.id === "rtVol") window.afRtVol(e.target);
  });
  startRtGlobalWatch();
}

function onAct(e) {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  const fn = window["af_" + act] || window[act];
  if (typeof fn === "function") {
    e.preventDefault();
    fn(el);
  }
}

function onSubmit(e) {
  if (e.target?.id === "pedidoForm") {
    e.preventDefault();
    window.afEnviarPedido();
  }
}

/* ── Hábitos ── */
export function viewHabitos() {
  const list = load("habits", [
    { id: "h1", name: "Auditoria de caixa 5 min", on: false },
    { id: "h2", name: "Bloco de execução 45 min", on: false },
    { id: "h3", name: "1 entrega de valor na rede", on: false },
    { id: "h4", name: "Sono antes de 23h", on: false }
  ]);
  window._habits = list;
  return `<div class="view active">${back()}
    <p class="hero-line">Consistência</p>
    <h2 class="hero-title">Hábitos</h2>
    <p class="hero-sub">O que se repete vira sistema. Marque o dia — não o humor.</p>
    <div class="hab-add cash-row">
      <input id="habNew" placeholder="Novo hábito">
      <button class="tool-btn" type="button" data-act="afAddHabito">Adicionar</button>
    </div>
    <div id="habList">${renderHabits(list)}</div>
  </div>`;
}
function renderHabits(list) {
  return list
    .map(
      (h, i) => `<div class="hab-row">
      <label class="hab-label" data-act="afToggleHabito" data-i="${i}">
        <input type="checkbox" ${h.on ? "checked" : ""} data-i="${i}">
        <span>${esc(h.name)}</span>
      </label>
      <button type="button" class="link-rm" data-act="afRmHabito" data-i="${i}">remover</button>
    </div>`
    )
    .join("");
}
window.afToggleHabito = (el) => {
  const input = el.matches("input") ? el : el.querySelector("input");
  const i = +(el.dataset.i ?? input?.dataset.i);
  if (!window._habits[i]) return;
  if (input && el !== input) {
    /* label click already toggles the checkbox */
  }
  window._habits[i].on = !!(input ? input.checked : !window._habits[i].on);
  save("habits", window._habits);
};
window.afAddHabito = () => {
  const v = document.getElementById("habNew")?.value?.trim();
  if (!v) return;
  window._habits.push({ id: "h" + Date.now(), name: v, on: false });
  save("habits", window._habits);
  document.getElementById("habList").innerHTML = renderHabits(window._habits);
  document.getElementById("habNew").value = "";
};
window.afRmHabito = (el) => {
  window._habits.splice(+el.dataset.i, 1);
  save("habits", window._habits);
  document.getElementById("habList").innerHTML = renderHabits(window._habits);
};

/* ── Metas ── */
export function viewMetas() {
  const list = load("goals", []);
  window._goals = list;
  return `<div class="view active">${back()}
    <p class="hero-line">Objetivos e resultados</p>
    <h2 class="hero-title">Metas</h2>
    <p class="hero-sub">Uma meta = número + prazo + prova observável.</p>
    <div class="cash-row">
      <input id="gTitle" placeholder="Meta (ex: reserva de 6 meses)">
      <input id="gTarget" type="number" placeholder="Alvo numérico">
    </div>
    <div class="cash-row">
      <input id="gCurrent" type="number" placeholder="Agora">
      <input id="gWhen" type="date">
    </div>
    <button class="tool-btn" type="button" data-act="afAddMeta">⬡ Nova Meta</button>
    <div id="goalList" class="mat-grid" style="margin-top:16px">${renderGoals(list)}</div>
  </div>`;
}
function renderGoals(list) {
  if (!list.length) return `<p class="empty">Nenhuma meta ainda.</p>`;
  return list
    .map((g, i) => {
      const p = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
      return `<div class="mat-card">
        <h4>${esc(g.title)}</h4>
        <p>${g.current} / ${g.target} · ${p}% · ${esc(g.when || "sem prazo")}</p>
        <div class="bar"><i style="width:${p}%"></i></div>
        <button class="link-rm" type="button" data-act="afRmMeta" data-i="${i}">remover</button>
      </div>`;
    })
    .join("");
}
window.afAddMeta = () => {
  const title = document.getElementById("gTitle")?.value?.trim();
  if (!title) return toast("Escreva o nome da meta", true);
  window._goals.push({
    title,
    target: parseFloat(document.getElementById("gTarget").value) || 0,
    current: parseFloat(document.getElementById("gCurrent").value) || 0,
    when: document.getElementById("gWhen").value
  });
  save("goals", window._goals);
  document.getElementById("goalList").innerHTML = renderGoals(window._goals);
};
window.afRmMeta = (el) => {
  window._goals.splice(+el.dataset.i, 1);
  save("goals", window._goals);
  document.getElementById("goalList").innerHTML = renderGoals(window._goals);
};

/* ── Rotina ── */
const RT_PRESETS = {
  acordar: "assets/img/rotina/01.jpg",
  foco: "assets/img/rotina/02.jpg",
  cafe: "assets/img/rotina/03.jpg",
  treino: "assets/img/rotina/04.jpg",
  refeicao: "assets/img/rotina/05.jpg",
  trabalho: "assets/img/rotina/06.jpg",
  pausa: "assets/img/rotina/07.jpg",
  plano: "assets/img/rotina/08.jpg",
  exec: "assets/img/rotina/09.jpg",
  ar: "assets/img/rotina/10.jpg",
  noite: "assets/img/rotina/01.jpg"
};
function rtSuggested() {
  return [
    { id: "r1", name: "Acordar + planejar o dia", start: "04:00", end: "04:15", days: "all", banner: RT_PRESETS.acordar, remind: 5 },
    { id: "r2", name: "Trabalho profundo", start: "04:15", end: "06:00", days: "all", banner: RT_PRESETS.foco, remind: 5 },
    { id: "r3", name: "Café da manhã / conteúdo", start: "06:00", end: "06:30", days: "all", banner: RT_PRESETS.cafe, remind: 5 },
    { id: "r4", name: "Academia", start: "06:30", end: "08:00", days: "all", banner: RT_PRESETS.treino, remind: 10 },
    { id: "r5", name: "Refeição", start: "08:00", end: "09:00", days: "all", banner: RT_PRESETS.refeicao, remind: 5 },
    { id: "r6", name: "Trabalho", start: "09:00", end: "12:00", days: "week", banner: RT_PRESETS.trabalho, remind: 10 },
    { id: "r7", name: "Pausa / café", start: "12:00", end: "13:00", days: "all", banner: RT_PRESETS.pausa, remind: 5 },
    { id: "r8", name: "Planejamento", start: "13:00", end: "14:00", days: "all", banner: RT_PRESETS.plano, remind: 5 },
    { id: "r9", name: "Produção / execução", start: "14:00", end: "19:00", days: "week", banner: RT_PRESETS.exec, remind: 10 },
    { id: "r10", name: "Caminhada / treino", start: "19:00", end: "20:00", days: "all", banner: RT_PRESETS.ar, remind: 10 },
    { id: "r11", name: "Encerramento do dia", start: "20:00", end: "21:00", days: "all", banner: RT_PRESETS.noite, remind: 5 }
  ];
}
function rtLoad() {
  const data = load("routinePlan", null);
  const seed = rtSuggested();
  if (!Array.isArray(data) || !data.length) {
    save("routinePlan", seed);
    return seed;
  }
  let changed = false;
  data.forEach((b) => {
    const s = seed.find((x) => x.id === b.id);
    if (!s) return;
    const custom = String(b.banner || "").startsWith("data:");
    const stale = !b.banner || /unsplash|images\.unsplash/.test(b.banner);
    if (!custom && stale) {
      b.banner = s.banner;
      changed = true;
    }
  });
  if (changed) save("routinePlan", data);
  return data;
}
function rtSave(list) {
  window._rt = list;
  save("routinePlan", list);
}
function rtMin(hhmm) {
  const [h, m] = String(hhmm || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
function rtTodayApplies(block) {
  const d = new Date().getDay();
  if (block.days === "week") return d >= 1 && d <= 5;
  if (block.days && block.days !== "all") {
    return String(block.days).split(",").map(Number).includes(d);
  }
  return true;
}
function rtState(list) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const today = list.filter(rtTodayApplies).sort((a, b) => rtMin(a.start) - rtMin(b.start));
  const current = today.find((b) => cur >= rtMin(b.start) && cur < rtMin(b.end));
  const next = today.find((b) => rtMin(b.start) > cur);
  return { current, next };
}
export function viewRotina() {
  const list = rtLoad();
  window._rt = list;
  setTimeout(rtWatch, 40);
  const { current, next } = rtState(list);
  return `<div class="view active rt-wrap">${back()}
    <p class="hero-line">Estrutura fixa do dia</p>
    <h2 class="hero-title">Rotina</h2>
    <p class="hero-sub">Horário, atividade e duração. Não é lista de tarefas: é o esqueleto do dia.</p>
    <div class="rt-now">
      <div><small>Agora</small><b>${current ? esc(current.name) + " · " + current.start + "–" + current.end : "Fora da rotina agora"}</b></div>
      <div><small>Próxima</small><b>${next ? esc(next.name) + " · " + next.start : "Nada à frente hoje"}</b></div>
    </div>
    <div class="rt-acts">
      <button class="tool-btn" type="button" data-act="afRtAdd">+ Adicionar à rotina</button>
      <button class="tool-btn" type="button" data-act="afRtSuggest">Usar rotina sugerida</button>
      <button class="tool-btn" type="button" data-act="afRtNotify">Ativar lembretes</button>
      <button class="tool-btn" type="button" data-act="afRtTestAlarm">Testar alarme</button>
    </div>
    <label class="rt-vol">Volume do alarme
      <input id="rtVol" type="range" min="10" max="100" value="${Number(load("rtAlarmVol", 85))}" data-act="afRtVol">
      <b id="rtVolLab">${Number(load("rtAlarmVol", 85))}</b>
    </label>
    <div id="rtForm" hidden></div>
    <div id="rtList">${renderRt(list)}</div>
    <input id="rtFile" type="file" accept="image/*" hidden>
  </div>`;
}
function renderRt(list) {
  const { current, next } = rtState(list);
  return list
    .slice()
    .sort((a, b) => rtMin(a.start) - rtMin(b.start))
    .map((b) => {
      const mark = current && current.id === b.id ? "agora" : next && next.id === b.id ? "prox" : "";
      return `<article class="rt-card ${mark}" data-id="${esc(b.id)}">
        <div class="rt-banner">
          <img src="${esc(b.banner || RT_PRESETS.plano)}" alt="" onerror="this.style.opacity='.2'">
          <span class="rt-time">${esc(b.start)} — ${esc(b.end)}</span>
        </div>
        <div class="rt-body">
          <h3>${esc(b.name)}</h3>
          <p>${b.days === "week" ? "Segunda a sexta" : b.days === "all" ? "Todos os dias" : "Dias escolhidos"} · lembrete ${b.remind ? b.remind + " min antes" : "off"}</p>
          <div class="rt-row">
            <button type="button" data-act="afRtEdit" data-id="${esc(b.id)}">Editar</button>
            <button type="button" data-act="afRtPic" data-id="${esc(b.id)}">Alterar imagem</button>
            <button type="button" data-act="afRtDel" data-id="${esc(b.id)}">Excluir</button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}
function rtForm(block) {
  const b = block || { id: "", name: "", start: "07:00", end: "08:00", days: "all", banner: RT_PRESETS.plano, remind: 10 };
  const presets = Object.entries(RT_PRESETS).map(([k, url]) => `<button type="button" class="rt-pre" data-act="afRtPreset" data-url="${esc(url)}"><img src="${url}" alt="${k}"></button>`).join("");
  return `<form class="rt-form" id="rtFormEl">
    <input type="hidden" name="id" value="${esc(b.id)}">
    <label>Nome<input name="name" value="${esc(b.name)}" placeholder="Academia" required></label>
    <div class="rt-grid">
      <label>Início<input type="time" name="start" value="${esc(b.start)}" required></label>
      <label>Fim<input type="time" name="end" value="${esc(b.end)}" required></label>
    </div>
    <label>Repetição
      <select name="days">
        <option value="all" ${b.days === "all" ? "selected" : ""}>Todos os dias</option>
        <option value="week" ${b.days === "week" ? "selected" : ""}>Segunda a sexta</option>
      </select>
    </label>
    <label>Lembrete
      <select name="remind">
        ${[0, 5, 10, 15, 30].map((n) => `<option value="${n}" ${+b.remind === n ? "selected" : ""}>${n ? n + " minutos antes" : "Sem lembrete"}</option>`).join("")}
      </select>
    </label>
    <p class="notes-hint">Banner sugerido</p>
    <div class="rt-presets">${presets}</div>
    <input type="hidden" name="banner" id="rtBannerVal" value="${esc(b.banner || "")}">
    <div class="rt-row">
      <button class="tool-btn" type="submit">Salvar</button>
      <button class="tool-btn" type="button" data-act="afRtCancel">Cancelar</button>
    </div>
  </form>`;
}
function rtRedraw() {
  const list = document.getElementById("rtList");
  if (list) list.innerHTML = renderRt(window._rt || rtLoad());
  const now = document.querySelector(".rt-now");
  if (now) {
    const { current, next } = rtState(window._rt || []);
    now.innerHTML = `<div><small>Agora</small><b>${current ? esc(current.name) + " · " + current.start + "–" + current.end : "Fora da rotina agora"}</b></div>
      <div><small>Próxima</small><b>${next ? esc(next.name) + " · " + next.start : "Nada à frente hoje"}</b></div>`;
  }
}
function rtWatch() {
  if (!window._rt) window._rt = rtLoad();
  rtRedraw();
  startRtGlobalWatch();
}
function startRtGlobalWatch() {
  if (!window._rt) window._rt = rtLoad();
  rtTickRemind();
  if (window._rtWatch) return;
  window._rtWatch = setInterval(() => {
    if (!window._rt) window._rt = rtLoad();
    if (document.getElementById("rtList")) rtRedraw();
    rtTickRemind();
  }, 8000);
}
const _rtFired = new Set();
const _rtSnooze = [];
let rtAlarmCtx = null;
let rtAlarmNodes = [];
let rtAlarmLoops = 0;
let rtAlarmLoopT = null;
let rtAlarmCurrent = null;
function rtVolLevel() {
  return Math.max(0.1, Math.min(1, Number(load("rtAlarmVol", 85)) / 100));
}
function stopRtAlarm() {
  rtAlarmLoops = 0;
  clearTimeout(rtAlarmLoopT);
  rtAlarmNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
  rtAlarmNodes = [];
}
function playRtAlarmOnce() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!rtAlarmCtx) rtAlarmCtx = new AC();
  if (rtAlarmCtx.state === "suspended") rtAlarmCtx.resume();
  const ctx = rtAlarmCtx;
  const master = ctx.createGain();
  master.gain.value = rtVolLevel();
  master.connect(ctx.destination);
  const now = ctx.currentTime;
  const hits = [0, 0.18, 0.36, 0.9, 1.08, 1.26, 1.8, 1.98, 2.16, 2.7, 2.88, 3.06];
  hits.forEach((t, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i % 3 === 0 ? "square" : "triangle";
    o.frequency.value = i % 2 === 0 ? 880 : 1320;
    g.gain.setValueAtTime(0.0001, now + t);
    g.gain.exponentialRampToValueAtTime(0.9, now + t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.16);
    o.connect(g); g.connect(master);
    o.start(now + t); o.stop(now + t + 0.18);
    rtAlarmNodes.push(o);
  });
  [0, 3.4].forEach((t) => {
    const ding = ctx.createOscillator();
    const g = ctx.createGain();
    ding.type = "sine";
    ding.frequency.setValueAtTime(2093, now + t);
    ding.frequency.exponentialRampToValueAtTime(1318, now + t + 0.35);
    g.gain.setValueAtTime(0.0001, now + t);
    g.gain.exponentialRampToValueAtTime(1, now + t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.4);
    ding.connect(g); g.connect(master);
    ding.start(now + t); ding.stop(now + t + 0.42);
    rtAlarmNodes.push(ding);
  });
}
function showRtAlarmPop(info) {
  rtAlarmCurrent = info;
  let pop = document.getElementById("rtAlarmPop");
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "rtAlarmPop";
    pop.className = "rt-alarm-pop";
    document.body.appendChild(pop);
  }
  const why = info.remind ? "Lembrete · " + info.remind + " min antes" : "Horário da rotina";
  pop.innerHTML = `<div class="rt-alarm-card">
    <p class="rt-alarm-k">Alarme da rotina</p>
    <h3>${esc(info.name || "Atividade")}</h3>
    <p>${esc(why)}</p>
    <p>Horário ${esc(info.start || "--:--")} — ${esc(info.end || "--:--")}</p>
    <p class="rt-alarm-loop">Toque ${Math.min(3, (info.n || 1))}/3</p>
    <div class="rt-row">
      <button type="button" data-act="afRtSnooze" data-m="1">Daqui 1 min</button>
      <button type="button" data-act="afRtSnooze" data-m="2">Daqui 2 min</button>
      <button type="button" data-act="afRtStopAlarm">Parar</button>
    </div>
  </div>`;
  pop.hidden = false;
}
function playRtAlarm(info) {
  const data = typeof info === "string" ? { name: info, start: "", end: "", remind: 0 } : (info || {});
  stopRtAlarm();
  rtAlarmLoops = 3;
  const ring = () => {
    if (rtAlarmLoops <= 0) return;
    playRtAlarmOnce();
    showRtAlarmPop({ ...data, n: 4 - rtAlarmLoops });
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(data.name || "Rotina", {
          body: (data.remind ? data.remind + " min antes · " : "") + (data.start || "") + " — " + (data.end || "")
        });
      } catch (e) {}
    }
    rtAlarmLoops -= 1;
    if (rtAlarmLoops > 0) rtAlarmLoopT = setTimeout(ring, 9000);
  };
  ring();
}
function rtTickRemind() {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const list = window._rt || rtLoad();
  list.filter(rtTodayApplies).forEach((b) => {
    if (!b.remind && b.remind !== 0) return;
    if (!b.remind) return;
    const fire = rtMin(b.start) - Number(b.remind);
    const key = b.id + "-" + now.toISOString().slice(0, 10) + "-" + fire;
    if (cur >= fire && cur <= fire + 1 && !_rtFired.has(key)) {
      _rtFired.add(key);
      playRtAlarm({ name: b.name, start: b.start, end: b.end, remind: b.remind });
    }
  });
  for (let i = _rtSnooze.length - 1; i >= 0; i--) {
    const s = _rtSnooze[i];
    if (cur >= s.fire && cur <= s.fire + 1) {
      _rtSnooze.splice(i, 1);
      playRtAlarm(s);
    }
  }
}
window.afRtTestAlarm = () => playRtAlarm({ name: "Teste do alarme", start: "agora", end: "", remind: 0 });
window.afRtStopAlarm = () => {
  stopRtAlarm();
  const pop = document.getElementById("rtAlarmPop");
  if (pop) pop.hidden = true;
};
window.afRtSnooze = (el) => {
  const m = Number(el?.dataset.m || 1);
  const now = new Date();
  const fire = now.getHours() * 60 + now.getMinutes() + m;
  _rtSnooze.push({ ...(rtAlarmCurrent || { name: "Rotina" }), fire });
  window.afRtStopAlarm();
  toast("Alarme de novo em " + m + " min");
};
window.afRtVol = (el) => {
  const v = Number(el.value || 85);
  save("rtAlarmVol", v);
  const lab = document.getElementById("rtVolLab");
  if (lab) lab.textContent = String(v);
};
window.afRtSuggest = () => {
  if (!confirm("Substituir a rotina atual pela sugerida?")) return;
  rtSave(rtSuggested());
  rtRedraw();
};
window.afRtAdd = () => {
  const box = document.getElementById("rtForm");
  if (!box) return;
  box.hidden = false;
  box.innerHTML = rtForm(null);
  box.querySelector("form")?.addEventListener("submit", onRtSubmit);
};
window.afRtEdit = (el) => {
  const b = (window._rt || []).find((x) => x.id === el.dataset.id);
  const box = document.getElementById("rtForm");
  if (!box || !b) return;
  box.hidden = false;
  box.innerHTML = rtForm(b);
  box.querySelector("form")?.addEventListener("submit", onRtSubmit);
};
window.afRtCancel = () => {
  const box = document.getElementById("rtForm");
  if (box) { box.hidden = true; box.innerHTML = ""; }
};
window.afRtDel = (el) => {
  if (!confirm("Excluir esta atividade da rotina?")) return;
  rtSave((window._rt || []).filter((x) => x.id !== el.dataset.id));
  rtRedraw();
};
window.afRtPreset = (el) => {
  const inp = document.getElementById("rtBannerVal");
  if (inp) inp.value = el.dataset.url || "";
};
window.afRtPic = (el) => {
  const input = document.getElementById("rtFile");
  if (!input) return;
  input.onchange = () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const list = window._rt || [];
      const item = list.find((x) => x.id === el.dataset.id);
      if (item) { item.banner = String(reader.result || ""); rtSave(list); rtRedraw(); }
    };
    reader.readAsDataURL(file);
  };
  input.click();
};
window.afRtNotify = () => {
  startRtGlobalWatch();
  playRtAlarm({ name: "Lembretes ligados", start: "", end: "", remind: 0 });
  if (typeof Notification === "undefined") { toast("Som ligado nesta aba. Feche a AF e o alarme para."); return; }
  Notification.requestPermission().then((p) => toast(p === "granted" ? "Som + aviso. Vale em qualquer tela da AF, com a aba aberta." : "Som ativo nesta aba."));
};
function onRtSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const item = {
    id: fd.get("id") || ("r" + Date.now()),
    name: String(fd.get("name") || "").trim(),
    start: String(fd.get("start") || "07:00"),
    end: String(fd.get("end") || "08:00"),
    days: String(fd.get("days") || "all"),
    banner: String(fd.get("banner") || RT_PRESETS.plano),
    remind: Number(fd.get("remind") || 0)
  };
  if (!item.name) return;
  const list = window._rt || [];
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) list[i] = item; else list.push(item);
  rtSave(list);
  window.afRtCancel();
  rtRedraw();
}

window.afToggleRotina = () => {};
window.afAddRotina = window.afRtAdd;

/* ── MindZone ── */
export function viewMindZone() {
  return `<div class="view active">${back()}
    <p class="hero-line">Respiração · Meditação · Jogos</p>
    <h2 class="hero-title">MindZone</h2>
    <p class="hero-sub">Largura de banda antes de decisão financeira. Feito para o celular.</p>
    <div class="mz-grid">
      <div class="mat-card mz-card">
        <h4>Respiração 4-7-8</h4>
        <p>Inspira 4 · segura 7 · solta 8. Três ciclos.</p>
        <div class="mz-stage" id="breathStage">pronto</div>
        <button class="tool-btn mz-btn" type="button" data-act="afBreath478">Iniciar 4-7-8</button>
      </div>
      <div class="mat-card mz-card">
        <h4>Box 4×4</h4>
        <p>Inspira · segura · expira · segura. 4 segundos cada.</p>
        <div class="mz-stage" id="boxStage">pronto</div>
        <button class="tool-btn mz-btn" type="button" data-act="afBreathBox">Iniciar box</button>
      </div>
      <div class="mat-card mz-card">
        <h4>Jogo · Foco</h4>
        <p>Toque só o ponto ouro. Dedo grande no celular.</p>
        <button class="tool-btn mz-btn" type="button" data-act="afFocusGame">Jogar</button>
        <p class="notes-meta" id="focusScore">0 acertos</p>
        <div id="focusGame" class="focus-board"></div>
      </div>
    </div>
    <p class="notes-hint">Áudios guiados: cole arquivos em assets/audio/ quando tiver.</p>
  </div>`;
}
window._mzScore = 0;
window.afBreath478 = () => {
  const el = document.getElementById("breathStage");
  if (!el) return;
  const seq = [
    ["inspira", 4000], ["segura", 7000], ["solta", 8000],
    ["inspira", 4000], ["segura", 7000], ["solta", 8000],
    ["inspira", 4000], ["segura", 7000], ["solta", 8000],
    ["concluído", 800]
  ];
  let i = 0;
  const step = () => {
    if (!seq[i]) return;
    el.textContent = seq[i][0];
    const wait = seq[i][1];
    i++;
    setTimeout(step, wait);
  };
  step();
};
window.afBreathBox = () => {
  const el = document.getElementById("boxStage");
  if (!el) return;
  const seq = [];
  for (let r = 1; r <= 4; r++) {
    seq.push(["inspira", 4000], ["segura", 4000], ["solta", 4000], ["segura", 4000]);
  }
  seq.push(["concluído", 600]);
  let i = 0;
  const step = () => {
    if (!seq[i]) return;
    el.textContent = seq[i][0];
    const wait = seq[i][1];
    i++;
    setTimeout(step, wait);
  };
  step();
};
window.afFocusGame = () => {
  const board = document.getElementById("focusGame");
  if (!board) return;
  board.innerHTML = "";
  const gold = Math.floor(Math.random() * 9);
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "focus-dot" + (i === gold ? " gold" : "");
    b.onclick = () => {
      if (i === gold) {
        window._mzScore = (window._mzScore || 0) + 1;
        const s = document.getElementById("focusScore");
        if (s) s.textContent = window._mzScore + " acertos";
        window.afFocusGame();
      }
    };
    board.appendChild(b);
  }
};

/* ── Produtividade ── */
export function viewProdutividade() {
  return `<div class="view active">${back()}
    <p class="hero-line">Foco, tempo e performance</p>
    <h2 class="hero-title">Produtividade</h2>
    <p class="hero-sub">Bloco de execução do módulo 3, no relógio.</p>
    <div class="stat-card pom-help">
      <div class="lbl">O que é Pomodoro</div>
      <p>É um método de foco em fatias. Você trabalha 25 minutos em uma tarefa só. Depois para 5 minutos. A cada 4 fatias, para 15 a 30 minutos.</p>
      <p>Serve para quem começa dez coisas e não termina nenhuma. No AF, o Pomodoro é o relógio do bloco de execução: uma decisão, um bloco, um registro.</p>
      <p>Como usar aqui: aperte Play. Celular virado para baixo. Quando o alarme interno terminar, marque a tarefa na Rotina ou no hábito. Reset volta para 25:00.</p>
    </div>
    <div class="stat-card" style="max-width:320px;text-align:center">
      <div class="lbl">Pomodoro</div>
      <div class="val" id="pomTime">25:00</div>
      <button class="tool-btn" type="button" data-act="afPomStart">Play / Pausa</button>
      <button class="tool-btn" type="button" data-act="afPomReset">Reset</button>
    </div>
  </div>`;
}
function tickPom() {
  const el = document.getElementById("pomTime");
  if (!el) return;
  const m = Math.floor(pomodoro.left / 60);
  const s = pomodoro.left % 60;
  el.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  if (pomodoro.left <= 0) {
    pomodoro.run = false;
    clearInterval(pomodoro.t);
    toast("Bloco concluído");
  }
}
window.afPomStart = () => {
  pomodoro.run = !pomodoro.run;
  if (pomodoro.run) {
    pomodoro.t = setInterval(() => {
      pomodoro.left--;
      tickPom();
    }, 1000);
  } else clearInterval(pomodoro.t);
};
window.afPomReset = () => {
  clearInterval(pomodoro.t);
  pomodoro = { t: null, left: 25 * 60, run: false };
  tickPom();
};

/* ── Coach placeholder ── */
export function viewCoach() {
  return `<div class="view active">${back()}
    <p class="hero-line">★ IA Life Coach</p>
    <h2 class="hero-title">AF Coach</h2>
    <p class="hero-sub">Análise inteligente — estrutura pronta. A IA será ligada quando você ativar no Firebase / API.</p>
    <div class="stat-card" style="max-width:560px">
      <div class="lbl">Status</div>
      <div class="hint" style="margin-top:10px;line-height:1.7">
        Camada desligada de propósito (custo zero).<br>
        Quando ligar: o coach lê hábitos, metas, rotina e caixa já salvos nesta conta.<br>
        Placeholder não envia dado nenhum para fora.
      </div>
    </div>
    <textarea class="notes-area" disabled placeholder="Campo de conversa — ativa na fase de IA."></textarea>
  </div>`;
}

/* ── Sono ── */
export function viewSono() {
  const btns = FREQS.map(
    (f, i) =>
      `<button class="freq-btn" type="button" data-act="afPlayFreq" data-hz="${f.hz}" data-name="${esc(f.name)}">${String(i + 1).padStart(2, "0")}<small>${f.hz} Hz</small></button>`
  ).join("");
  const nome = sleepName();
  setTimeout(startSonoPreview, 40);
  return `<div class="view active sono-gate">${back()}
    <div class="sono-preview">
      <div class="sono-preview-top">
        <p>Olá, ${esc(nome)}</p>
        <small>Modo Sono · Alinhamento Financeiro</small>
      </div>
      <div class="sono-preview-card">
        <span>Saldo em conta</span>
        <strong id="sonoPrevBal">R$ 10.000,00</strong>
        <div class="sono-in" id="sonoPrevIn">
          <b id="sonoPrevVal">+ R$ 0,00</b>
          <small>Entrada recebida</small>
        </div>
        <em>Colapsando isso será manifestado na sua conta bancária</em>
      </div>
    </div>
    <p class="notes-hint" id="sonoFreqLab">Escolhe a frequência e abre o modo sono</p>
    <div class="freq-row">${btns}</div>
    <button class="btn btn-inline sono-open" type="button" data-act="afOpenSleep">Abrir modo sono</button>
  </div>`;
}

let sonoPrevTimer = null;
let sonoPrevAnim = null;
let sonoPrevBal = 10000;
let sonoPrevShown = 10000;
function startSonoPreview() {
  clearTimeout(sonoPrevTimer);
  const el = document.getElementById("sonoPrevBal");
  if (!el) return;
  sonoPrevBal = 10000;
  sonoPrevShown = 10000;
  el.textContent = brl(10000);
  const tick = () => {
    if (!document.getElementById("sonoPrevBal")) return;
    const bag = [300, 500, 800, 1000, 2000, 7000, 20000, 50000, 90000];
    const v = bag[Math.floor(Math.random() * bag.length)];
    const from = sonoPrevBal;
    sonoPrevBal += v;
    const line = document.getElementById("sonoPrevIn");
    const val = document.getElementById("sonoPrevVal");
    if (val) val.textContent = "+ " + brl(v);
    if (line) {
      line.classList.remove("on");
      requestAnimationFrame(() => line.classList.add("on"));
    }
    if (sonoPrevAnim) cancelAnimationFrame(sonoPrevAnim);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 900);
      const e = 1 - Math.pow(1 - p, 3);
      sonoPrevShown = from + (sonoPrevBal - from) * e;
      const bal = document.getElementById("sonoPrevBal");
      if (bal) bal.textContent = brl(sonoPrevShown);
      if (p < 1) sonoPrevAnim = requestAnimationFrame(step);
    };
    sonoPrevAnim = requestAnimationFrame(step);
    sonoPrevTimer = setTimeout(tick, 3000);
  };
  sonoPrevTimer = setTimeout(tick, 1200);
}

window.afSleepStart = (el) => {
  const n = +el.dataset.n;
  save("sonoStart", n);
  document.querySelectorAll("#sonoStartRow .freq-btn").forEach((b) => b.classList.toggle("on", +b.dataset.n === n));
  const custom = document.getElementById("sonoStartCustom");
  if (custom) custom.value = String(n);
};
window.afSleepGoal = (el) => {
  save("sonoGoal", +el.dataset.n);
  el.parentElement.querySelectorAll(".freq-btn").forEach((b) => b.classList.toggle("on", b === el));
};

window.afOpenSleep = () => {
  clearTimeout(sonoPrevTimer);
  const o = document.getElementById("sleepOverlay");
  if (!o) return;
  const bar = document.getElementById("sleepFreqs");
  if (bar && !bar.childElementCount) {
    bar.innerHTML = FREQS.map(
      (f, i) =>
        `<button class="freq-btn" type="button" data-act="afPlayFreq" data-hz="${f.hz}" data-name="${esc(f.name)}">${String(i + 1).padStart(2, "0")} · ${f.hz} Hz</button>`
    ).join("");
  }
  const custom = Number(document.getElementById("sonoStartCustom")?.value || 0);
  const start = custom > 0 ? custom : Number(load("sonoStart", 10000));
  sleepGoal = Number(load("sonoGoal", 0));
  sleepBal = start;
  sleepShown = start;
  sleepPaused = false;
  sleepHidden = false;
  sleepFeed = [];
  sleepInTotal = 0;
  sleepInCount = 0;
  const hi = document.getElementById("sleepHi");
  if (hi) hi.textContent = "Olá, " + sleepName();
  const av = document.getElementById("sleepAv");
  if (av) av.textContent = sleepName().slice(0, 2).toUpperCase();
  paintSleepBal();
  const inn = document.getElementById("sleepIn");
  if (inn) { inn.hidden = true; inn.classList.remove("on"); }
  const feed = document.getElementById("sleepFeed");
  if (feed) feed.innerHTML = "";
  const today = document.getElementById("sleepToday");
  const todayN = document.getElementById("sleepTodayN");
  if (today) today.textContent = "+ " + brl(0);
  if (todayN) todayN.textContent = "0 entradas";
  const eye = document.getElementById("sleepEye");
  if (eye) eye.textContent = "◐";
  const saved = Number(localStorage.getItem("af_sleep_vol") || sleepVol);
  setSleepVol(Number.isFinite(saved) ? saved : 35);
  const pause = document.getElementById("sleepPauseBtn");
  if (pause) pause.textContent = "Pausar";
  o.classList.add("open");
  o.classList.remove("idle");
  wakeSleepDock();
  if (!o.dataset.wake) {
    o.dataset.wake = "1";
    o.addEventListener("pointerdown", wakeSleepDock);
  }
  startSleepLoop();
  startSleepClock();
  const first = document.querySelector("#sleepOverlay .freq-btn[data-hz='396']");
  if (first) window.afPlayFreq(first);
  else playFreq(396);
};
window.afCloseSleep = () => {
  document.getElementById("sleepOverlay")?.classList.remove("open", "idle", "dim");
  stopFreq();
  clearTimeout(sleepTimer);
  clearTimeout(sleepIdle);
  clearTimeout(sleepDim);
  clearInterval(sleepClock);
  if (sleepAnim) cancelAnimationFrame(sleepAnim);
  const lab2 = document.getElementById("sonoFreqLab");
  if (lab2) lab2.textContent = "Frequência pausada";
};
window.afSleepPause = () => {
  sleepPaused = !sleepPaused;
  const b = document.getElementById("sleepPauseBtn");
  if (b) b.textContent = sleepPaused ? "Continuar" : "Pausar";
  if (sleepPaused) {
    stopFreq();
    clearTimeout(sleepTimer);
  } else {
    playFreq(sleepHz);
    queueSleepTick();
  }
  wakeSleepDock();
};
window.afSleepHide = () => {
  sleepHidden = !sleepHidden;
  const eye = document.getElementById("sleepEye");
  if (eye) eye.textContent = sleepHidden ? "●" : "◐";
  paintSleepBal();
  wakeSleepDock();
};
window.afSleepVol = (el) => {
  setSleepVol(sleepVol + Number(el?.dataset?.d || 0) * 8);
  wakeSleepDock();
};
window.afPlayFreq = (el) => {
  const hz = +el.dataset.hz;
  if (!hz) return;
  sleepHz = hz;
  const name = el.dataset.name || hz + " Hz";
  if (!sleepPaused) playFreq(hz);
  document.querySelectorAll(".freq-btn").forEach((b) => b.classList.toggle("on", +b.dataset.hz === hz));
  const label = name + " · " + hz + " Hz";
  const lab = document.getElementById("sleepFreqLab");
  if (lab) lab.textContent = label;
  const mini = document.getElementById("sleepMini");
  if (mini) mini.textContent = label;
  const lab2 = document.getElementById("sonoFreqLab");
  if (lab2) lab2.textContent = "Tocando · " + label;
};

function setSleepVol(n) {
  sleepVol = Math.max(0, Math.min(100, Math.round(n)));
  localStorage.setItem("af_sleep_vol", String(sleepVol));
  if (sleepGain && audioCtx) sleepGain.gain.setTargetAtTime((sleepVol / 100) * 0.12, audioCtx.currentTime, 0.08);
  const sl = document.getElementById("sleepVol");
  const lab = document.getElementById("sleepVolLab");
  if (sl) sl.value = String(sleepVol);
  if (lab) lab.textContent = String(sleepVol);
}
function playFreq(hz) {
  if (oscNode && audioCtx && Math.round(oscNode.frequency.value) === Math.round(hz)) {
    try { if (sleepGain) sleepGain.gain.setTargetAtTime((sleepVol / 100) * 0.12, audioCtx.currentTime, 0.08); } catch (e) {}
    return;
  }
  stopFreq();
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    oscNode = audioCtx.createOscillator();
    sleepGain = audioCtx.createGain();
    oscNode.frequency.value = hz;
    oscNode.type = "sine";
    sleepGain.gain.value = (sleepVol / 100) * 0.12;
    oscNode.connect(sleepGain);
    sleepGain.connect(audioCtx.destination);
    oscNode.start();
  } catch (e) {}
}
function stopFreq() {
  try { oscNode?.stop(); } catch (e) {}
  oscNode = null;
}
function startSleepLoop() {
  clearTimeout(sleepTimer);
  queueSleepTick(1800);
}
function queueSleepTick(ms) {
  clearTimeout(sleepTimer);
  const wait = ms != null ? ms : 8000 + Math.random() * 12000;
  sleepTimer = setTimeout(sleepTick, wait);
}
function sleepTick() {
  if (sleepPaused) return;
  const amounts = [50, 100, 250, 500, 750, 1000, 1500, 2500, 5000];
  const v = amounts[Math.floor(Math.random() * amounts.length)];
  sleepBal += v;
  sleepInTotal += v;
  sleepInCount += 1;
  sleepFeed.unshift({ v, at: Date.now() });
  if (sleepFeed.length > 8) sleepFeed.length = 8;
  const inn = document.getElementById("sleepIn");
  const val = document.getElementById("sleepInVal");
  if (val) val.textContent = "+ " + brl(v);
  if (inn) {
    inn.hidden = false;
    inn.classList.remove("on");
    requestAnimationFrame(() => inn.classList.add("on"));
  }
  const card = document.getElementById("sleepBalCard");
  if (card) {
    card.classList.remove("pulse");
    void card.offsetWidth;
    card.classList.add("pulse");
    setTimeout(() => card.classList.remove("pulse"), 700);
  }
  const today = document.getElementById("sleepToday");
  const todayN = document.getElementById("sleepTodayN");
  if (today) today.textContent = "+ " + brl(sleepInTotal);
  if (todayN) todayN.textContent = sleepInCount + (sleepInCount === 1 ? " entrada" : " entradas");
  paintFeed();
  animateBal();
  queueSleepTick();
}
function ago(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 3) return "Agora";
  if (s < 60) return "há " + s + "s";
  return "há " + Math.floor(s / 60) + " min";
}
function paintFeed() {
  const el = document.getElementById("sleepFeed");
  if (!el) return;
  el.innerHTML = sleepFeed.slice(0, 4).map((t) =>
    `<div class="sf-tx"><span class="sf-tx-ico">↙</span><div class="sf-tx-copy"><b>Crédito recebido</b><small>Visualização financeira · ${ago(t.at)}</small></div><div class="sf-tx-val">+ ${brl(t.v)}</div></div>`
  ).join("") || `<p class="sf-muted">As entradas aparecem aqui.</p>`;
}
function paintSleepBal() {
  const el = document.getElementById("sleepBal");
  if (!el) return;
  el.textContent = sleepHidden ? "R$ •••••" : brl(sleepShown);
}
function startSleepClock() {
  clearInterval(sleepClock);
  sleepClock = setInterval(() => { if (!sleepHidden) paintFeed(); }, 1000);
}
function animateBal() {
  if (sleepAnim) cancelAnimationFrame(sleepAnim);
  const from = sleepShown;
  const to = sleepBal;
  const t0 = performance.now();
  const dur = 1200;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    sleepShown = from + (to - from) * e;
    paintSleepBal();
    if (p < 1) sleepAnim = requestAnimationFrame(step);
    else sleepShown = to;
  };
  sleepAnim = requestAnimationFrame(step);
}
function wakeSleepDock() {
  const o = document.getElementById("sleepOverlay");
  o?.classList.remove("idle", "dim");
  clearTimeout(sleepIdle);
  clearTimeout(sleepDim);
  sleepIdle = setTimeout(() => o?.classList.add("idle"), 6000);
  sleepDim = setTimeout(() => o?.classList.add("dim"), 20000);
}

function back() {
  return `<div class="back-link" data-nav="complementar">← Complementar</div>`;
}

export { FREQS, WA };
