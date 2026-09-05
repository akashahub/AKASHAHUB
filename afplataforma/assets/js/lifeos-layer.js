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
let sleepTimer = null;
let sleepBal = 0;
let pomodoro = { t: null, left: 25 * 60, run: false };

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
export function viewRotina() {
  const today = new Date().toISOString().slice(0, 10);
  const all = load("routine", {});
  const tasks = all[today] || [
    { t: "Revisar caixa (5 min)", done: false },
    { t: "Bloco de execução", done: false },
    { t: "1 contato de valor", done: false }
  ];
  window._routineDay = today;
  window._routine = tasks;
  return `<div class="view active">${back()}
    <p class="hero-line">Calendário e tarefas</p>
    <h2 class="hero-title">Rotina</h2>
    <p class="hero-sub">Hoje · ${today}. O dia tem um mínimo viável — o resto é bônus.</p>
    <div class="cash-row">
      <input id="rtNew" placeholder="Tarefa de hoje">
      <button class="tool-btn" type="button" data-act="afAddRotina">Adicionar</button>
    </div>
    <div id="rtList">${renderRoutine(tasks)}</div>
  </div>`;
}
function renderRoutine(tasks) {
  const n = tasks.filter((x) => x.done).length;
  return `<p class="notes-meta">${n}/${tasks.length} concluídas</p>` +
    tasks
      .map(
        (x, i) => `<div class="hab-row">
        <label><input type="checkbox" ${x.done ? "checked" : ""} data-act="afToggleRotina" data-i="${i}"> ${esc(x.t)}</label>
      </div>`
      )
      .join("");
}
function persistRoutine() {
  const all = load("routine", {});
  all[window._routineDay] = window._routine;
  save("routine", all);
}
window.afToggleRotina = (el) => {
  window._routine[+el.dataset.i].done = el.checked;
  persistRoutine();
  document.getElementById("rtList").innerHTML = renderRoutine(window._routine);
};
window.afAddRotina = () => {
  const v = document.getElementById("rtNew")?.value?.trim();
  if (!v) return;
  window._routine.push({ t: v, done: false });
  persistRoutine();
  document.getElementById("rtList").innerHTML = renderRoutine(window._routine);
  document.getElementById("rtNew").value = "";
};

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
  return `<div class="view active">${back()}
    <p class="hero-line">Modo sono</p>
    <h2 class="hero-title">Dinheiro entrando</h2>
    <p class="hero-sub">Em vez de ovelhas: depósitos em R$ / € / US$ + 7 frequências dos vetores. No celular, toque a frequência para o som começar.</p>
    <div class="freq-row">${btns}</div>
    <p class="notes-hint" id="sonoFreqLab">Toque uma frequência · 396 · 417 · 528 · 639 · 741 · 852 · 963 Hz</p>
    <button class="btn btn-inline" type="button" data-act="afOpenSleep" style="margin-top:16px">Abrir modo sono</button>
  </div>`;
}

window.afOpenSleep = () => {
  const o = document.getElementById("sleepOverlay");
  if (!o) return;
  const bar = document.getElementById("sleepFreqs");
  if (bar && !bar.childElementCount) {
    bar.innerHTML = FREQS.map(
      (f, i) =>
        `<button class="freq-btn" type="button" data-act="afPlayFreq" data-hz="${f.hz}" data-name="${esc(f.name)}">${String(i + 1).padStart(2, "0")}<small>${f.hz} Hz</small></button>`
    ).join("");
  }
  o.classList.add("open");
  sleepBal = 0;
  const list = document.getElementById("sleepTx");
  if (list) list.innerHTML = "";
  renderSleepTx("Inicio da sessao", 0);
  startSleepLoop();
  const first = document.querySelector("#sleepOverlay .freq-btn[data-hz='396']");
  if (first) window.afPlayFreq(first);
  else playFreq(396);
};
window.afCloseSleep = () => {
  document.getElementById("sleepOverlay")?.classList.remove("open");
  stopFreq();
  clearInterval(sleepTimer);
  const lab2 = document.getElementById("sonoFreqLab");
  if (lab2) lab2.textContent = "Frequência pausada";
};
window.afPlayFreq = (el) => {
  const hz = +el.dataset.hz;
  if (!hz) return;
  const name = el.dataset.name || hz + " Hz";
  playFreq(hz);
  document.querySelectorAll(".freq-btn").forEach((b) => b.classList.toggle("on", +b.dataset.hz === hz));
  const lab = document.getElementById("sleepFreqLab");
  if (lab) lab.textContent = name + " · " + hz + " Hz";
  const lab2 = document.getElementById("sonoFreqLab");
  if (lab2) lab2.textContent = "Tocando · " + name + " · " + hz + " Hz";
};

function playFreq(hz) {
  stopFreq();
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    oscNode = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    oscNode.frequency.value = hz;
    oscNode.type = "sine";
    g.gain.value = 0.04;
    oscNode.connect(g);
    g.connect(audioCtx.destination);
    oscNode.start();
  } catch (e) {}
}
function stopFreq() {
  try {
    oscNode?.stop();
  } catch (e) {}
  oscNode = null;
}
function startSleepLoop() {
  clearInterval(sleepTimer);
  const curs = ["R$", "€", "US$"];
  const tick = () => {
    const cur = curs[Math.floor(Math.random() * 3)];
    const v = Math.round(80 + Math.random() * 920);
    sleepBal += v;
    renderSleepTx(cur + " " + v.toLocaleString("pt-BR") + " creditado", v);
    spawnCoin(cur, v);
    spawnCoin(cur, v);
  };
  tick();
  sleepTimer = setInterval(tick, 2200);
}
function renderSleepTx(text, v) {
  const bal = document.getElementById("sleepBal");
  const list = document.getElementById("sleepTx");
  if (bal) bal.textContent = "R$ " + sleepBal.toLocaleString("pt-BR");
  if (!list) return;
  const row = document.createElement("div");
  row.className = "sleep-tx";
  row.textContent = (v ? "+" : "") + " " + text;
  list.prepend(row);
  while (list.children.length > 8) list.removeChild(list.lastChild);
}
function spawnCoin(cur, v) {
  const o = document.getElementById("sleepOverlay");
  if (!o) return;
  const c = document.createElement("div");
  c.className = "sleep-coin";
  c.textContent = (cur || "R$") + " " + Number(v || 0).toLocaleString("pt-BR");
  c.style.left = 6 + Math.random() * 82 + "%";
  c.style.bottom = 10 + Math.random() * 18 + "%";
  c.style.animationDuration = 1.8 + Math.random() * 1.2 + "s";
  o.appendChild(c);
  setTimeout(() => c.remove(), 2800);
}

function back() {
  return `<div class="back-link" data-nav="complementar">← Complementar</div>`;
}

export { FREQS, WA };
