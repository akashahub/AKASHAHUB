/* Cockpit da call Francesca. Estado local neste aparelho. */
const KEY = "af-mesa-francesca-v1";

const state = load();

function load() {
  try {
    return {
      mode: "fechamento",
      act: 0,
      pit: 0,
      named: null,
      caderno: {},
      notes: "",
      energy: "media",
      closed: false,
      elapsed: 0,
      running: false,
      ...JSON.parse(localStorage.getItem(KEY) || "{}"),
    };
  } catch {
    return {
      mode: "fechamento",
      act: 0,
      pit: 0,
      named: null,
      caderno: {},
      notes: "",
      energy: "media",
      closed: false,
      elapsed: 0,
      running: false,
    };
  }
}

function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      mode: state.mode,
      act: state.act,
      pit: state.pit,
      named: state.named,
      caderno: state.caderno,
      notes: state.notes,
      energy: state.energy,
      closed: state.closed,
      elapsed: state.elapsed,
    })
  );
}

function acts() {
  return state.mode === "entrada" ? ENTRADA_ACTS : FECHAMENTO_ACTS;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function clockLabel() {
  const m = Math.floor(state.elapsed / 60);
  const s = state.elapsed % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function renderMap() {
  const list = acts();
  document.getElementById("map").innerHTML = list
    .map(
      (a, i) =>
        `<button type="button" data-act="${i}" class="${i === state.act ? "on" : ""}">
          <small>${String(a.n).padStart(2, "0")} · ${esc(a.minutes)}</small>
          ${esc(a.label)}
        </button>`
    )
    .join("");
}

function renderMain() {
  const list = acts();
  const a = list[Math.min(state.act, list.length - 1)];
  document.getElementById("main").innerHTML = `
    <p class="kicker">Ato ${a.n} · ${esc(a.minutes)} · não compartilhar tela</p>
    <h1>${esc(a.label)}</h1>
    <p class="hint">${esc(a.intent)}</p>
    <p class="kicker">Falar</p>
    ${a.script.map((l) => `<div class="speak">${esc(l)}</div>`).join("")}
    <p class="kicker">Perguntar · e calar</p>
    ${a.questions.map((q) => `<div class="q">${esc(q)}</div>`).join("")}
    <div class="never"><span class="lbl">Não fazer</span>${a.never.map((n) => `<p>${esc(n)}</p>`).join("")}</div>
    <p class="hint"><strong>Se esfriar.</strong> ${esc(a.nextIfCold)}</p>
    <p class="kicker">Caderno · ${CADERNO.filter((c) => state.caderno[c.id]).length}/20</p>
    <ul class="caderno">
      ${CADERNO.map(
        (c) =>
          `<li><button type="button" data-cad="${esc(c.id)}" class="${state.caderno[c.id] ? "on" : ""}">
            ${c.n}. ${esc(c.title)}<small>${esc(c.speak)}</small>
          </button></li>`
      ).join("")}
    </ul>
  `;
}

function renderSide() {
  const f = faixaFor(state.named);
  document.getElementById("side").innerHTML = `
    <p class="kicker">PIT 01 · 0 a 10</p>
    <div class="pit">
      ${Array.from({ length: 11 }, (_, n) => {
        const on = state.pit === n ? (n >= 10 ? "on ok" : "on") : "";
        return `<button type="button" data-pit="${n}" class="${on}">${n}</button>`;
      }).join("")}
    </div>
    <p class="hint">${esc(PIT_RECOVERY[state.pit] || PIT_RECOVERY[0])}</p>
    <p class="${state.pit < 10 ? "kicker kicker-danger" : "kicker kicker-ok"}">${
      state.pit < 10 ? "Não apresentar solução" : "Autorizado a avançar"
    }</p>
    <p class="kicker">Recurso nomeado</p>
    <p class="hint">Ela fala o número. Você não fala o piso.</p>
    <div class="vals">
      ${VALUES.map(
        (v) =>
          `<button type="button" class="btn ${state.named === v ? "on" : ""}" data-val="${v}">${formatBRL(v)}</button>`
      ).join("")}
      <button type="button" class="btn" data-val="">Limpar</button>
    </div>
    ${
      f
        ? `<div class="hint"><strong>${esc(f.range)} · ${esc(f.name)}</strong><br>${esc(f.done)}<br>Abre: ${esc(f.opens[0])}<br>Não abre: ${esc(f.closed[0])}</div>`
        : `<p class="hint">Aguarde o número dela. Se perguntar o preço, recorte o nível — não o piso.</p>`
    }
    <p class="kicker">Energia</p>
    <div class="row energy">
      ${["baixa", "media", "alta"]
        .map(
          (e) =>
            `<button type="button" class="btn ${state.energy === e ? "on" : ""}" data-energy="${e}">${e}</button>`
        )
        .join("")}
    </div>
    ${
      state.energy === "baixa"
        ? `<p class="never">Sem energia, não apresenta produto. Devolver o diagnóstico.</p>`
        : `<p class="hint">Decisão é emocional. Silêncio depois da pergunta de recurso.</p>`
    }
    <button type="button" class="btn ${state.closed ? "btn-a" : ""}" id="btnClosed">${
      state.closed ? "Marcada como fechada" : "Marcar fechamento"
    }</button>
    <p class="kicker" style="margin-top:14px">Notas da call</p>
    <textarea id="notes" placeholder="Gargalo, palavras dela, número, papel…">${esc(state.notes)}</textarea>
    <p class="kicker">Lembrar quem ela é</p>
    ${POSTURE.map((p) => `<p class="hint">${esc(p)}</p>`).join("")}
    <p class="kicker">Faixas internas</p>
    ${FAIXAS.map((x) => `<p class="hint">${esc(x.name)} · <strong>${esc(x.range)}</strong></p>`).join("")}
  `;
}

function render() {
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.classList.toggle("on", b.dataset.mode === state.mode);
  });
  document.getElementById("clock").textContent = clockLabel();
  document.getElementById("btnTimer").textContent = state.running ? "Pausar" : "Iniciar";
  renderMap();
  renderMain();
  renderSide();
  save();
}

document.addEventListener("click", (e) => {
  const mode = e.target.closest("[data-mode]");
  if (mode) {
    state.mode = mode.dataset.mode;
    state.act = 0;
    render();
    return;
  }
  const act = e.target.closest("[data-act]");
  if (act) {
    state.act = Number(act.dataset.act);
    render();
    return;
  }
  const cad = e.target.closest("[data-cad]");
  if (cad) {
    state.caderno[cad.dataset.cad] = !state.caderno[cad.dataset.cad];
    render();
    return;
  }
  const pit = e.target.closest("[data-pit]");
  if (pit) {
    state.pit = Number(pit.dataset.pit);
    render();
    return;
  }
  const val = e.target.closest("[data-val]");
  if (val) {
    state.named = val.dataset.val === "" ? null : Number(val.dataset.val);
    render();
    return;
  }
  const en = e.target.closest("[data-energy]");
  if (en) {
    state.energy = en.dataset.energy;
    render();
    return;
  }
  if (e.target.id === "btnClosed") {
    state.closed = !state.closed;
    render();
    return;
  }
  if (e.target.id === "btnTimer") {
    state.running = !state.running;
    render();
    return;
  }
  if (e.target.id === "btnResetTimer") {
    state.running = false;
    state.elapsed = 0;
    render();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "notes") {
    state.notes = e.target.value;
    save();
  }
});

setInterval(() => {
  if (!state.running) return;
  state.elapsed += 1;
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = clockLabel();
  if (state.elapsed % 5 === 0) save();
}, 1000);

render();
