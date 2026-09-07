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
  });
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
  const nome = sleepName();
  return `<div class="view active sono-gate">${back()}
    <div class="sono-preview">
      <div class="sono-preview-top">
        <p>Olá, ${esc(nome)}</p>
        <small>Modo Sono · Alinhamento Financeiro</small>
      </div>
      <div class="sono-preview-card">
        <span>Saldo em conta</span>
        <strong>R$ 10.000,00</strong>
        <em>Visualização simulada · nenhum valor é real</em>
      </div>
    </div>
    <p class="notes-hint" id="sonoFreqLab">Escolhe a frequência e abre o modo sono</p>
    <div class="freq-row">${btns}</div>
    <button class="btn btn-inline sono-open" type="button" data-act="afOpenSleep">Abrir modo sono</button>
  </div>`;
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
