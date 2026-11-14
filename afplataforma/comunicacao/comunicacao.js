const COL = "afComunicacao";
let currentUser = null;
let data = { estilo: "", mensagens: "", presenca: "", autoridade: "", plano: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  estilo: {
    title: "Descobrir meu estilo de comunicação",
    subtitle: "Defina como você se comunica no seu melhor.",
    questions: [
      { id: "q1", label: "Qual tom combina com você?", options: ["Claro e direto", "Profundo e preciso", "Elegante e contido", "Caloroso e humano", "Outro"] },
      { id: "q2", label: "O que você evita?", options: ["Hype e exagero", "Frases prontas", "Volume sem substância", "Linguagem forçada", "Outro"] },
      { id: "q3", label: "Como as pessoas se sentem ao interagir com você?", type: "text" }
    ],
    generate: (a) => `Meu estilo é ${a.q1 || "claro e direto"}. Evito ${a.q2 || "hype e exagero"}. As pessoas se sentem ${a.q3 || "respeitadas e com mais clareza"}.`
  },
  mensagens: {
    title: "Descobrir minhas mensagens-chave",
    subtitle: "Defina o que você quer que as pessoas lembrem.",
    questions: [
      { id: "q1", label: "Qual é sua mensagem principal?", options: ["Clareza gera autoridade", "Pare de consumir e comece a construir", "Identidade antes de estratégia", "Sistema acima de esforço", "Outro"] },
      { id: "q2", label: "Quantas mensagens você quer sustentar?", options: ["1 mensagem central", "2-3 mensagens", "Varia conforme o contexto", "Outro"] },
      { id: "q3", label: "Qual mensagem você mais quer que as pessoas lembrem?", type: "text" }
    ],
    generate: (a) => `Mensagem principal: ${a.q1 || "clareza gera autoridade real"}. Sustento ${a.q2 || "2-3 mensagens"}. Quero que lembrem: ${a.q3 || "que eu ajudo a sair do consumo e entrar na construção"}.`
  },
  presenca: {
    title: "Descobrir minha presença",
    subtitle: "Defina como você ocupa espaço.",
    questions: [
      { id: "q1", label: "Como você quer ocupar espaço?", options: ["Menos volume, mais profundidade", "Presença seletiva", "Qualidade sobre quantidade", "Consistência com essência", "Outro"] },
      { id: "q2", label: "O que as pessoas devem sentir?", options: ["Confiança", "Clareza", "Respeito", "Direção", "Outro"] },
      { id: "q3", label: "O que você não faz na sua presença?", type: "text" }
    ],
    generate: (a) => `Ocupo espaço com ${a.q1 || "profundidade e menos volume"}. As pessoas devem sentir ${a.q2 || "confiança e clareza"}. Não faço ${a.q3 || "postar todos os dias sem substância"}.`
  },
  autoridade: {
    title: "Descobrir minha autoridade na comunicação",
    subtitle: "Defina como você transmite autoridade.",
    questions: [
      { id: "q1", label: "Como você transmite autoridade?", options: ["Pela coerência", "Pela precisão", "Pelo que faz", "Pela clareza", "Outro"] },
      { id: "q2", label: "O que você não faz para proteger isso?", options: ["Promessas exageradas", "Falar de tudo", "Seguir modismos", "Postar sem substância", "Outro"] },
      { id: "q3", label: "Como as pessoas reconhecem sua autoridade?", type: "text" }
    ],
    generate: (a) => `Transmito autoridade ${a.q1 || "pela coerência e precisão"}. Não faço ${a.q2 || "promessas exageradas"}. As pessoas reconhecem ${a.q3 || "que há experiência e clareza por trás do que digo"}.`
  }
};

function toast(msg) {
  const el = document.getElementById("toast"); if (!el) return;
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) {
  if (!s) return "";
  return String(s).replace(/</g, "<").replace(/>/g, ">");
}
function progress() {
  const fields = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "plano" : STEPS[i + 1];
}
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar"); if (side) side.classList.remove("open");
  render();
}
window.setView = setView;

function openDiscovery(field) {
  const cfg = DISCOVERY[field];
  if (!cfg) return;
  currentTargetField = field;
  document.getElementById("modalTitle").textContent = cfg.title;
  document.getElementById("modalSubtitle").textContent = cfg.subtitle;
  const qEl = document.getElementById("modalQuestions");
  qEl.innerHTML = cfg.questions.map(q => {
    if (q.options) {
      const multi = q.multi ? ' data-multi="1"' : '';
      return `<div class="field"><label>${q.label}</label>
        <div class="options" data-qid="${q.id}"${multi}>
          ${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}
        </div>
        ${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}
      </div>`;
    }
    return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`;
  }).join("");

  qEl.querySelectorAll(".options").forEach(box => {
    const multi = box.dataset.multi;
    box.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (multi) btn.classList.toggle("selected");
        else {
          box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          const other = box.parentElement.querySelector(".other-input");
          if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro");
        }
      };
    });
  });

  document.getElementById("modalResult").classList.add("hidden");
  document.getElementById("discoveryForm").classList.remove("hidden");
  document.getElementById("discoveryModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("discoveryModal").classList.add("hidden");
  currentTargetField = null;
}

function collectAnswers(cfg) {
  const answers = {};
  cfg.questions.forEach(q => {
    if (q.options) {
      const box = document.querySelector(`.options[data-qid="${q.id}"]`);
      if (q.multi) {
        answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value);
      } else {
        const sel = box.querySelector(".opt.selected");
        let val = sel ? sel.dataset.value : "";
        if (val === "Outro") {
          const other = document.querySelector(`.other-input[data-for="${q.id}"]`);
          val = other ? other.value.trim() : "";
        }
        answers[q.id] = val;
      }
    } else {
      const el = document.getElementById("disc-" + q.id);
      answers[q.id] = el ? el.value.trim() : "";
    }
  });
  return answers;
}

function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
      return;
    }
    const disc = e.target.closest("[data-discover]");
    if (disc) openDiscovery(disc.dataset.discover);
  });

  document.getElementById("modalClose").onclick = closeModal;
  document.getElementById("modalCancel").onclick = closeModal;
  document.querySelector(".modal-backdrop").onclick = closeModal;

  document.getElementById("discoveryForm").onsubmit = (e) => {
    e.preventDefault();
    const cfg = DISCOVERY[currentTargetField];
    if (!cfg) return;
    const answers = collectAnswers(cfg);
    const suggestion = cfg.generate(answers);
    document.getElementById("suggestionText").textContent = suggestion;
    document.getElementById("discoveryForm").classList.add("hidden");
    document.getElementById("modalResult").classList.remove("hidden");
  };

  document.getElementById("useSuggestion").onclick = () => {
    const text = document.getElementById("suggestionText").textContent;
    if (currentTargetField && text) {
      data[currentTargetField] = text;
      const ta = document.getElementById("f-" + currentTargetField);
      if (ta) ta.value = text;
      toast("Sugestão aplicada. Você pode editar antes de salvar.");
    }
    closeModal();
    render();
  };
}

async function saveData() {
  if (!currentUser || !db) { toast("Faça login para salvar."); return; }
  try {
    const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
    toast("Salvo com sucesso.");
  } catch { toast("Erro ao salvar."); }
  render();
}

function discoverBtn(field) {
  return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`;
}

function render() {
  const p = progress();
  const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "COMUNICAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Comunicação</div>
      <h1 class="title">Sua comunicação</h1>
      <p class="sub">Defina estilo, mensagens, presença e autoridade.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="estilo">Começar</button></div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de comunicação</h1>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      ${discoverBtn("estilo")}
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "mensagens") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Mensagens-chave</h1>
      <div class="field"><label>Mensagens principais</label><textarea id="f-mensagens">${esc(data.mensagens)}</textarea></div>
      ${discoverBtn("mensagens")}
      <button class="btn" data-continue="mensagens">Salvar e Continuar</button>`;
  } else if (view === "presenca") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Presença e impacto</h1>
      <div class="field"><label>Presença e impacto</label><textarea id="f-presenca">${esc(data.presenca)}</textarea></div>
      ${discoverBtn("presenca")}
      <button class="btn" data-continue="presenca">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade</h1>
      <div class="field"><label>Autoridade na comunicação</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      ${discoverBtn("autoridade")}
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Comunicação</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Mensagens</h3><p>${esc(data.mensagens) || "—"}</p></div>
      <div class="card"><h3>Presença</h3><p>${esc(data.presenca) || "—"}</p></div>
      <div class="card"><h3>Autoridade</h3><p>${esc(data.autoridade) || "—"}</p></div>`;
  }
}

bind();
render();

(async () => {
  try {
    const configMod = await import("../firebase/firebase-config.js");
    auth = configMod.auth;
    db = configMod.db;
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    onAuthStateChanged(auth, user => {
      currentUser = user || null;
      if (user) {
        const pill = document.getElementById("userPill");
        const av = document.getElementById("avatar");
        if (pill) pill.textContent = user.email || "Mentorando";
        if (av) av.textContent = (user.email || "C")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
