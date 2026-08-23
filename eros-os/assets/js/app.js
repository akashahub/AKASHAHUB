import {
  CONTINENTS,
  TECHNICAS,
  SCRIPTS,
  ACERVO,
  tasksNow,
  legends,
  hooks
} from "../data/core.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function go(id) {
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + id));
  $$(".nav button").forEach((b) => b.classList.toggle("active", b.dataset.go === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNav() {
  document.body.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) {
      e.preventDefault();
      go(b.dataset.go);
    }
  });
}

function renderComando() {
  $("#continents").innerHTML = CONTINENTS.map(
    (c) => `<div class="card">
      <div class="glow" style="background:${c.color}"></div>
      <p class="cont-name" style="color:${c.color}">${c.name}</p>
      <p class="metric">—</p>
      <p>${c.metric}</p>
    </div>`
  ).join("");
  $("#tasks").innerHTML = tasksNow()
    .map(
      (t) => `<div class="task">
      <div class="hour">${String(t.hour).padStart(2, "0")}h</div>
      <p style="color:rgba(255,255,255,.85);font-size:13px;line-height:1.45">${t.task}</p>
    </div>`
    )
    .join("");
}

function initFabrica() {
  $("#btnLegends").onclick = () => {
    const list = legends($("#legTheme").value);
    $("#legOut").innerHTML = list.map((l) => `<pre class="pre">${l}</pre>`).join("");
  };
  $("#btnAv").onclick = () => {
    const musics = [
      "Einaudi — piano esparso, respiração",
      "Grave tribal controlado",
      "432 Hz + sussurro",
      "Silêncio + um hit de presença"
    ];
    const texts = ["SUOR É CÓDIGO", "MENOS BARULHO", "ENTREGA HOJE", "CAIXA · RITUAL"];
    const cuts = [
      "Corte a cada 1.2s no gancho; segure 3s no olhar",
      "Jump cut no suor → texto → gesto",
      "Plano baixo 4s → mão → face"
    ];
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    $("#avOut").innerHTML = `<p style="margin-top:10px;font-size:13px;line-height:1.6">
      <span style="color:var(--gold)">Música:</span> ${pick(musics)}<br>
      <span style="color:var(--gold)">Texto:</span> ${pick(texts)}<br>
      <span style="color:var(--gold)">Corte:</span> ${pick(cuts)}
    </p>`;
  };
}

function initArsenal() {
  $("#techList").innerHTML = TECHNICAS.map(
    (t) => `<div class="card"><h3>${t.name}</h3><p>${t.desc}</p></div>`
  ).join("");
  $("#btnHooks").onclick = () => {
    $("#hookOut").innerHTML = hooks($("#hookTheme").value)
      .map((h) => `<li>${h}</li>`)
      .join("");
  };
}

/* Vendas + kanban */
const COLS = [
  { id: "interessados", label: "Interessados" },
  { id: "quente", label: "Quente" },
  { id: "pagou", label: "Pagou" },
  { id: "entrega", label: "Entrega" }
];
let leads = [];
try {
  leads = JSON.parse(localStorage.getItem("eros_kanban") || "[]");
} catch {}

function saveLeads() {
  localStorage.setItem("eros_kanban", JSON.stringify(leads));
}

function renderScripts(tab = "alegre") {
  $("#scriptOut").innerHTML = SCRIPTS[tab]
    .map(
      (s, i) => `<div class="card">
      <p class="kicker" style="color:var(--gold)">Script ${i + 1}</p>
      <p style="color:rgba(255,255,255,.85);font-size:13px;line-height:1.55;margin-top:6px">${s}</p>
      <button type="button" class="btn btn-ghost" style="margin-top:8px" data-copy="${encodeURIComponent(s)}">Copiar</button>
    </div>`
    )
    .join("");
}

function renderKanban() {
  $("#kanban").innerHTML = COLS.map((c) => {
    const items = leads.filter((l) => l.col === c.id);
    return `<div class="col"><div class="col-h">${c.label}</div>${items
      .map(
        (l) => `<div class="lead">${l.name}
        <select data-lead="${l.id}" style="margin-top:6px;font-size:10px;padding:6px">
          ${COLS.map((x) => `<option value="${x.id}" ${x.id === l.col ? "selected" : ""}>${x.label}</option>`).join("")}
        </select></div>`
      )
      .join("")}</div>`;
  }).join("");
}

function initVendas() {
  renderScripts("alegre");
  renderKanban();
  $("#scriptTabs").onclick = (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    $$("#scriptTabs button").forEach((x) => x.classList.toggle("on", x === b));
    renderScripts(b.dataset.tab);
  };
  $("#btnLead").onclick = () => {
    const name = $("#leadName").value.trim();
    if (!name) return;
    leads.push({ id: crypto.randomUUID(), name, col: "interessados" });
    $("#leadName").value = "";
    saveLeads();
    renderKanban();
  };
  $("#kanban").onchange = (e) => {
    const s = e.target.closest("select[data-lead]");
    if (!s) return;
    const id = s.dataset.lead;
    leads = leads.map((l) => (l.id === id ? { ...l, col: s.value } : l));
    saveLeads();
    renderKanban();
  };
  document.body.addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) {
      navigator.clipboard?.writeText(decodeURIComponent(c.dataset.copy));
      c.textContent = "Copiado";
      setTimeout(() => (c.textContent = "Copiar"), 1200);
    }
  });
}

function renderAcervo(q = "") {
  const s = q.trim().toLowerCase();
  const list = !s
    ? ACERVO
    : ACERVO.filter(
        (a) =>
          a.text.toLowerCase().includes(s) ||
          a.source.toLowerCase().includes(s) ||
          a.tags.some((t) => t.includes(s))
      );
  $("#acervoOut").innerHTML =
    list
      .map(
        (a) => `<div class="card">
      <p class="kicker" style="color:var(--gold)">${a.source}</p>
      <h3 style="margin-top:6px">${a.text}</h3>
      <p style="margin-top:6px">Uso: ${a.use}</p>
      <div style="margin-top:6px">${a.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    </div>`
      )
      .join("") || `<p class="muted">Nenhum código encontrado.</p>`;
}

function initAcervo() {
  renderAcervo();
  $("#acervoQ").oninput = (e) => renderAcervo(e.target.value);
}

function initRep() {
  const diary = localStorage.getItem("eros_diary") || "";
  $("#diary").value = diary;
  $("#btnDiary").onclick = () => {
    localStorage.setItem("eros_diary", $("#diary").value);
    $("#diaryMsg").textContent = "Salvo neste aparelho.";
  };
  $("#btnRep").onclick = () => {
    $("#repIdle").style.display = "none";
    $("#repBreath").style.display = "block";
    $("#repDone").style.display = "none";
    let n = 4;
    $("#repCount").textContent = n;
    const iv = setInterval(() => {
      n -= 1;
      $("#repCount").textContent = n;
      if (n <= 0) {
        clearInterval(iv);
        $("#repBreath").style.display = "none";
        $("#repDone").style.display = "block";
        const t = tasksNow()[0];
        $("#repTask").textContent = t ? t.task : "Abrir o Comando e executar o próximo bloco.";
      }
    }, 1000);
  };
  $("#btnRepReset").onclick = () => {
    $("#repIdle").style.display = "block";
    $("#repBreath").style.display = "none";
    $("#repDone").style.display = "none";
  };
}

initNav();
renderComando();
initFabrica();
initArsenal();
initVendas();
initAcervo();
initRep();
