/* Cockpit original da mesa. Estado local neste aparelho, por deal. */
const DEAL_DEFAULT = "francesca";

function storageKey(id) {
  return "af-mesa-" + id + "-v1";
}

function emptyState() {
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

function load(id) {
  try {
    return { ...emptyState(), ...JSON.parse(localStorage.getItem(storageKey(id)) || "{}") };
  } catch {
    return emptyState();
  }
}

function save() {
  const { running, ...rest } = state;
  localStorage.setItem(storageKey(dealId), JSON.stringify(rest));
}

let dealId = DEAL_DEFAULT;
let state = load(dealId);
let view = (location.hash || "#mesa").slice(1) || "mesa";
let copied = "";
let toastTimer = 0;

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

function acts() {
  return state.mode === "entrada" ? ENTRADA_ACTS : FECHAMENTO_ACTS;
}

function deal() {
  const list = typeof DEALS !== "undefined" ? DEALS : [];
  return list.find((d) => d.id === dealId) || list[0] || { id: "francesca", name: "Francesca" };
}

function svg(name) {
  if (name === "copy")
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  if (name === "check")
    return '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg>';
  if (name === "left")
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
  if (name === "right")
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
  if (name === "play")
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  if (name === "pause")
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
  return "";
}

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 1400);
}

function copyLine(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      copied = text;
      toast("Frase copiada");
      render();
      setTimeout(() => {
        if (copied === text) copied = "";
        const icos = document.querySelectorAll(".line .ico.ok");
        icos.forEach((n) => n.classList.remove("ok"));
      }, 1400);
    },
    () => toast("Não foi possível copiar")
  );
}

function line(text, italic) {
  const ok = copied === text;
  return `<button type="button" class="line ${italic ? "italic" : ""}" data-copy="${esc(text)}">
    <span>${esc(text)}</span>
    <i class="ico ${ok ? "ok" : ""}">${ok ? svg("check") : svg("copy")}</i>
  </button>`;
}

function renderShell() {
  document.querySelectorAll("[data-view]").forEach((b) => {
    b.classList.toggle("on", b.getAttribute("data-view") === view);
  });
  const badge = document.getElementById("modeBadge");
  if (badge) {
    badge.textContent = state.mode === "fechamento" ? "Fechamento" : "Entrada";
    badge.classList.toggle("badge-warn", state.mode === "entrada");
  }
  const closed = document.getElementById("closedBadge");
  if (closed) closed.hidden = !state.closed;
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = clockLabel();
  const tbtn = document.getElementById("btnTimer");
  if (tbtn) {
    tbtn.innerHTML = state.running ? svg("pause") : svg("play");
    tbtn.setAttribute("aria-label", state.running ? "Pausar" : "Iniciar cronômetro");
  }
  const person = deal();
  const brandSpan = document.querySelector(".brand span");
  if (brandSpan && person) brandSpan.textContent = person.name;
}

function renderMesa() {
  const list = acts();
  const act = list[Math.min(state.act, list.length - 1)];
  const faixa = faixaFor(state.named);
  const doneCount = CADERNO.filter((c) => state.caderno[c.id]).length;
  const fechamento = state.mode === "fechamento";

  return `
    <div class="hero">
      <div>
        <p class="kicker">Cockpit privado · não compartilhar tela</p>
        <h1>${fechamento ? "Call de fechamento" : "Call de entrada"}</h1>
        <p class="lede">${
          fechamento
            ? "Peer para peer. Diagnóstico → PIT → obra. Ela não é mentoranda."
            : "Sessão de Alinhamento, 1h30. Continuidade só se fizer sentido."
        }</p>
      </div>
      <div class="hero-actions">
        <button type="button" class="btn ${fechamento ? "btn-primary" : "btn-outline"}" data-mode="fechamento">Fechamento</button>
        <button type="button" class="btn ${!fechamento ? "btn-primary" : "btn-outline"}" data-mode="entrada">Entrada · R$ 350</button>
        <button type="button" class="btn btn-ghost" id="btnReset">Resetar mesa</button>
      </div>
    </div>

    <ol class="acts">
      ${list
        .map(
          (a, i) => `<li>
          <button type="button" class="act-tab ${i === state.act ? "on" : ""}" data-act="${i}">
            <small>${String(a.n).padStart(2, "0")} · ${esc(a.minutes)}</small>
            ${esc(a.label)}
          </button>
        </li>`
        )
        .join("")}
    </ol>

    <div class="grid">
      <div class="stack">
        <section class="panel">
          <div class="act-head">
            <div>
              <p class="kicker">Ato ${act.n} · ${esc(act.minutes)}</p>
              <h2>${esc(act.label)}</h2>
              <p class="intent">${esc(act.intent)}</p>
            </div>
            <div class="nav-btns">
              <button type="button" class="btn-icon" data-act-dir="-1" ${state.act === 0 ? "disabled" : ""} aria-label="Ato anterior">${svg("left")}</button>
              <button type="button" class="btn-icon" data-act-dir="1" ${state.act >= list.length - 1 ? "disabled" : ""} aria-label="Próximo ato">${svg("right")}</button>
            </div>
          </div>
          <p class="lbl">Falar</p>
          <div>${act.script.map((l) => line(l, true)).join("")}</div>
          <p class="lbl">Perguntar · e calar</p>
          <div>${act.questions.map((q) => line(q, false)).join("")}</div>
          <div class="split">
            <div class="box">
              <p class="lbl">Não fazer</p>
              <ul>${act.never.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
            </div>
            <div class="box warn">
              <p class="lbl">Se esfriar</p>
              <p>${esc(act.nextIfCold)}</p>
            </div>
          </div>
        </section>

        <section class="panel panel-flush">
          <div class="panel-head">
            <h3>Caderno · ${doneCount}/20</h3>
            <span class="kicker" style="letter-spacing:.16em">riscar</span>
          </div>
          <ol class="caderno">
            ${CADERNO.map((item) => {
              const on = !!state.caderno[item.id];
              return `<li>
                <button type="button" class="cad-item ${on ? "on" : ""}" data-cad="${esc(item.id)}">
                  <span class="check ${on ? "on" : ""}">${on ? svg("check") : ""}</span>
                  <span>
                    <strong>${item.n}. ${esc(item.title)}</strong>
                    <small>${esc(item.speak)}</small>
                  </span>
                </button>
              </li>`;
            }).join("")}
          </ol>
        </section>
      </div>

      <div class="stack">
        <section class="panel">
          <h3>PIT 01 · 0 a 10</h3>
          <div class="pit">
            ${Array.from({ length: 11 }, (_, n) => {
              const cls = state.pit === n ? (n >= 10 ? "on ok" : n >= 8 ? "on warn" : "on") : "";
              return `<button type="button" data-pit="${n}" class="${cls}">${n}</button>`;
            }).join("")}
          </div>
          <p class="hint">${esc(PIT_RECOVERY[state.pit] || PIT_RECOVERY[0])}</p>
          <p class="flag ${state.pit < 10 ? "danger" : "ok"}">${
            state.pit < 10 ? "Não apresentar solução" : "Autorizado a avançar"
          }</p>
        </section>

        <section class="panel">
          <h3>Recurso nomeado</h3>
          <p class="muted">Ela fala o número. Você não fala o piso. Digite o que ela disser.</p>
          <div class="vals">
            ${VALUES.map(
              (v) =>
                `<button type="button" class="btn ${state.named === v ? "btn-primary" : "btn-outline"}" data-val="${v}">${formatBRL(v)}</button>`
            ).join("")}
            <button type="button" class="btn btn-ghost" data-val="">Limpar</button>
          </div>
          ${
            faixa
              ? `<div class="faixa-card">
                  <p class="kicker">${esc(faixa.range)} · ${esc(faixa.name)}</p>
                  <h4>${esc(faixa.done)}</h4>
                  <p class="muted">Abre: ${esc(faixa.opens[0])}</p>
                  <p class="flag danger">Não abre: ${esc(faixa.closed[0])}</p>
                </div>`
              : `<p class="muted" style="margin-top:12px">${esc(
                  typeof formatHint === "function" ? formatHint() : "Aguarde o número dela. Se perguntar o preço, recorte o nível — não o piso."
                )}</p>`
          }
        </section>

        <section class="panel">
          <div class="energy-row">
            <h3>Energia na mesa</h3>
            <div class="energy">
              ${["baixa", "media", "alta"]
                .map(
                  (e) =>
                    `<button type="button" class="${state.energy === e ? "on" : ""}" data-energy="${e}">${e}</button>`
                )
                .join("")}
            </div>
          </div>
          ${
            state.energy === "baixa"
              ? `<p class="flag danger" style="letter-spacing:0;text-transform:none;font-size:14px">Sem energia, não apresenta produto. Devolver o diagnóstico. Pedir presença.</p>`
              : `<p class="muted">Decisão é emocional. Manter silêncio depois da pergunta de recurso.</p>`
          }
          <button type="button" class="btn btn-block ${state.closed ? "btn-primary" : "btn-outline"}" id="btnClosed" style="margin-top:16px">
            ${state.closed ? "Marcada como fechada" : "Marcar fechamento"}
          </button>
        </section>

        <section class="panel">
          <h3>Bloco de notas da call</h3>
          <textarea id="notes" placeholder="Gargalo dela, palavras que ela usou, número, papel que ela se deu…">${esc(
            state.notes
          )}</textarea>
        </section>

        <section class="panel">
          <h3>Lembrar quem ela é</h3>
          <ul class="posture">${POSTURE.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </section>

        <section class="panel">
          <h3>Faixas internas</h3>
          <ul class="faixa-list">
            ${FAIXAS.map(
              (f) => `<li><span>${esc(f.name)}</span><b>${esc(f.range)}</b></li>`
            ).join("")}
          </ul>
        </section>
      </div>
    </div>
  `;
}

function renderCaderno() {
  const done = CADERNO.filter((c) => state.caderno[c.id]).length;
  const keep = typeof STORY_KEEP !== "undefined" ? STORY_KEEP : [];
  const cut = typeof STORY_CUT !== "undefined" ? STORY_CUT : [];
  return `
    <div class="hero">
      <div>
        <p class="kicker">Folha de caderno</p>
        <h1>Vinte pontos. Riscar na call.</h1>
        <p class="lede">Ordem fixa. ${done} de 20 riscados. História serve à tese — não ao documentário.</p>
      </div>
    </div>
    <div class="grid">
      <ol class="cad-full">
        ${CADERNO.map((item) => {
          const on = !!state.caderno[item.id];
          return `<li>
            <button type="button" class="cad-item ${on ? "on" : ""}" data-cad="${esc(item.id)}">
              <span class="num">${String(item.n).padStart(2, "0")}</span>
              <span class="check ${on ? "on" : ""}">${on ? svg("check") : ""}</span>
              <span>
                <strong>${esc(item.title)}</strong>
                <small>${esc(item.speak)}</small>
                ${item.note ? `<small>${esc(item.note)}</small>` : ""}
              </span>
            </button>
          </li>`;
        }).join("")}
      </ol>
      <div class="stack">
        <section class="panel">
          <h3>Manter na história</h3>
          <ul class="posture">${keep.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </section>
        <section class="panel">
          <h3>Cortar</h3>
          <ul class="posture">${cut.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </section>
      </div>
    </div>
  `;
}

function renderDossie() {
  const f = typeof FRANCESCA !== "undefined" ? FRANCESCA : { name: "Francesca", facts: [], ecosystems: [], overlap: [], posture: POSTURE };
  return `
    <div class="hero">
      <div>
        <p class="kicker">Dossiê · não compartilhar tela</p>
        <h1>${esc(f.name)}</h1>
        <p class="lede">${esc(f.role || "")}</p>
      </div>
    </div>
    <div class="grid">
      <div class="stack">
        <section class="panel dossie-block">
          <h3>Quem ela é</h3>
          <ul>${(f.facts || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </section>
        <section class="panel dossie-block">
          <h3>Ecossistemas</h3>
          ${(f.ecosystems || [])
            .map(
              (e) => `<div class="box" style="margin-bottom:8px">
                <p class="lbl" style="color:var(--accent)">${esc(e.name)}</p>
                <p>${esc(e.body)}</p>
              </div>`
            )
            .join("")}
        </section>
      </div>
      <div class="stack">
        <section class="panel dossie-block">
          <h3>Sobreposição com o Akasha</h3>
          <ul class="overlap">
            ${(f.overlap || [])
              .map(
                (o) => `<li><span><b>Ela</b><br>${esc(o.her)}</span><span><b>Você</b><br>${esc(o.you)}</span></li>`
              )
              .join("")}
          </ul>
        </section>
        <section class="panel">
          <h3>Postura na mesa</h3>
          <ul class="posture">${(f.posture || POSTURE).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </section>
      </div>
    </div>
  `;
}

function renderFaixas() {
  const above = typeof ABOVE_17 !== "undefined" ? ABOVE_17 : null;
  return `
    <div class="hero">
      <div>
        <p class="kicker">Tabela interna</p>
        <h1>Faixas. Ela fala o número.</h1>
        <p class="lede">Você não anuncia o piso. Casa o recurso com uma obra definida.</p>
      </div>
    </div>
    <div class="faixa-full">
      ${FAIXAS.map(
        (f) => `<section class="panel">
          <p class="kicker">${esc(f.range)}</p>
          <h4>${esc(f.name)}</h4>
          <p class="muted">${esc(f.done)}</p>
          <div class="cols">
            <div>
              <p class="lbl" style="color:var(--ok)">Abre</p>
              <ul class="posture">${f.opens.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
            <div>
              <p class="lbl">Não abre</p>
              <ul class="posture">${f.closed.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
          </div>
        </section>`
      ).join("")}
      ${
        above
          ? `<section class="panel"><h3>${esc(above.title)}</h3><p class="hint">${esc(above.body)}</p></section>`
          : ""
      }
    </div>
  `;
}

function renderFechamentos() {
  const list = typeof DEALS !== "undefined" ? DEALS : [];
  const slot = typeof FUTURE_SLOT !== "undefined" ? FUTURE_SLOT : null;
  return `
    <div class="hero">
      <div>
        <p class="kicker">Mesmo motor · outro dossiê</p>
        <h1>Fechamentos</h1>
        <p class="lede">A AF do aluno não muda. Cada pessoa entra aqui como um deal. Só o mentor vê.</p>
      </div>
    </div>
    <div class="deal-grid">
      ${list
        .map(
          (d) => `<button type="button" class="deal" data-deal="${esc(d.id)}">
            <p class="kicker">${d.status === "ativa" ? "Ativa" : "Breve"} · ${esc(d.range)}</p>
            <h2>${esc(d.name)}</h2>
            <p class="muted">${esc(d.person)}</p>
            <p class="hint">${esc(d.blurb)}</p>
            <div class="tags">${(d.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          </button>`
        )
        .join("")}
      ${
        slot
          ? `<div class="deal slot">
              <p class="kicker">Em breve</p>
              <h2>${esc(slot.title)}</h2>
              <p class="hint">${esc(slot.body)}</p>
            </div>`
          : ""
      }
    </div>
  `;
}

function render() {
  renderShell();
  const page = document.getElementById("page");
  if (!page) return;
  if (view === "caderno") page.innerHTML = renderCaderno();
  else if (view === "dossie") page.innerHTML = renderDossie();
  else if (view === "faixas") page.innerHTML = renderFaixas();
  else if (view === "fechamentos") page.innerHTML = renderFechamentos();
  else page.innerHTML = renderMesa();
  save();
}

function setView(next) {
  view = next || "mesa";
  if (location.hash.slice(1) !== view) location.hash = view;
  render();
}

document.addEventListener("click", (e) => {
  const v = e.target.closest("[data-view]");
  if (v) {
    setView(v.getAttribute("data-view"));
    return;
  }
  const copy = e.target.closest("[data-copy]");
  if (copy) {
    copyLine(copy.getAttribute("data-copy"));
    return;
  }
  const mode = e.target.closest("[data-mode]");
  if (mode) {
    state.mode = mode.getAttribute("data-mode");
    state.act = 0;
    render();
    return;
  }
  const act = e.target.closest("[data-act]");
  if (act) {
    state.act = Number(act.getAttribute("data-act"));
    render();
    return;
  }
  const dir = e.target.closest("[data-act-dir]");
  if (dir) {
    const list = acts();
    state.act = Math.max(0, Math.min(list.length - 1, state.act + Number(dir.getAttribute("data-act-dir"))));
    render();
    return;
  }
  const cad = e.target.closest("[data-cad]");
  if (cad) {
    const id = cad.getAttribute("data-cad");
    state.caderno[id] = !state.caderno[id];
    render();
    return;
  }
  const pit = e.target.closest("[data-pit]");
  if (pit) {
    state.pit = Number(pit.getAttribute("data-pit"));
    render();
    return;
  }
  const val = e.target.closest("[data-val]");
  if (val) {
    const raw = val.getAttribute("data-val");
    state.named = raw === "" ? null : Number(raw);
    render();
    return;
  }
  const en = e.target.closest("[data-energy]");
  if (en) {
    state.energy = en.getAttribute("data-energy");
    render();
    return;
  }
  const d = e.target.closest("[data-deal]");
  if (d) {
    dealId = d.getAttribute("data-deal");
    state = load(dealId);
    setView("mesa");
    return;
  }
  if (e.target.id === "btnClosed" || e.target.closest("#btnClosed")) {
    state.closed = !state.closed;
    render();
    return;
  }
  if (e.target.id === "btnTimer" || e.target.closest("#btnTimer")) {
    state.running = !state.running;
    render();
    return;
  }
  if (e.target.id === "btnResetTimer" || e.target.closest("#btnResetTimer")) {
    state.running = false;
    state.elapsed = 0;
    render();
    return;
  }
  if (e.target.id === "btnReset") {
    const keepDeal = dealId;
    state = emptyState();
    dealId = keepDeal;
    render();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "notes") {
    state.notes = e.target.value;
    save();
  }
});

window.addEventListener("hashchange", () => {
  view = (location.hash || "#mesa").slice(1) || "mesa";
  render();
});

setInterval(() => {
  if (!state.running) return;
  state.elapsed += 1;
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = clockLabel();
  if (state.elapsed % 5 === 0) save();
}, 1000);

render();
