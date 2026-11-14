const COL = "afProdutosDigitais";
let currentUser = null;
let data = { catalogo: "", ofertas: "", entrega: "", monetizacao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  catalogo: {
    title: "Descobrir catálogo",
    subtitle: "Defina quais produtos digitais você tem ou quer criar.",
    questions: [
      { id: "q1", label: "Quais tipos de produtos você tem ou quer?", options: ["Curso", "E-book", "Comunidade", "Assinatura", "Mentoria", "Outro"] },
      { id: "q2", label: "Qual é o mais prioritário agora?", options: ["Curso", "E-book", "Comunidade", "Assinatura", "Outro"] },
      { id: "q3", label: "O que esse produto resolve?", type: "text" }
    ],
    generate: (a) => `Produtos: ${a.q1 || "curso e comunidade"}. Prioritário: ${a.q2 || "curso"}. Resolve: ${a.q3 || "falta de estrutura e clareza"}.`
  },
  ofertas: {
    title: "Descobrir ofertas",
    subtitle: "Defina como apresentar os produtos.",
    questions: [
      { id: "q1", label: "Como você apresenta a oferta?", options: ["Clareza e essência", "Resultado concreto", "Experiência", "Transformação", "Outro"] },
      { id: "q2", label: "Qual é a promessa principal?", options: ["Clareza e sistema", "Construção de legado", "Autoridade", "Continuidade", "Outro"] },
      { id: "q3", label: "O que a pessoa recebe de concreto?", type: "text" }
    ],
    generate: (a) => `Apresento com ${a.q1 || "clareza e essência"}. Promessa: ${a.q2 || "clareza e sistema"}. Recebe: ${a.q3 || "estrutura e acompanhamento"}.`
  },
  entrega: {
    title: "Descobrir entrega e experiência",
    subtitle: "Defina como o produto é entregue.",
    questions: [
      { id: "q1", label: "Como o produto é entregue?", options: ["Plataforma", "E-mail", "Comunidade", "Sessões", "Outro"] },
      { id: "q2", label: "O que torna a experiência boa?", options: ["Clareza", "Continuidade", "Suporte", "Profundidade", "Outro"] },
      { id: "q3", label: "Como a pessoa sente que está progredindo?", type: "text" }
    ],
    generate: (a) => `Entrega via ${a.q1 || "plataforma"}. Experiência boa com ${a.q2 || "clareza e continuidade"}. Progresso: ${a.q3 || "quando completa etapas e vê resultados"}.`
  },
  monetizacao: {
    title: "Descobrir monetização",
    subtitle: "Defina como o produto gera valor.",
    questions: [
      { id: "q1", label: "Qual modelo de monetização?", options: ["Pagamento único", "Assinatura", "Mentoria", "Pacote", "Outro"] },
      { id: "q2", label: "O que justifica o valor?", options: ["Clareza e resultado", "Sistema e continuidade", "Acompanhamento", "Transformação", "Outro"] },
      { id: "q3", label: "Como você posiciona o preço?", type: "text" }
    ],
    generate: (a) => `Modelo: ${a.q1 || "pagamento único ou assinatura"}. Justifica: ${a.q2 || "clareza e resultado"}. Posiciono o preço ${a.q3 || "pelo valor da estrutura e continuidade"}.`
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
  const fields = ["catalogo", "ofertas", "entrega", "monetizacao"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["catalogo", "ofertas", "entrega", "monetizacao"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PRODUTOS DIGITAIS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Produtos Digitais</h1>
      <p class="sub">Catálogo, ofertas, entrega e monetização.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="catalogo">Começar</button></div>`;
  } else if (view === "catalogo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Catálogo</h1>
      <div class="field"><label>Produtos digitais</label><textarea id="f-catalogo">${esc(data.catalogo)}</textarea></div>
      ${discoverBtn("catalogo")}
      <button class="btn" data-continue="catalogo">Salvar e Continuar</button>`;
  } else if (view === "ofertas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Ofertas</h1>
      <div class="field"><label>Como apresentar as ofertas</label><textarea id="f-ofertas">${esc(data.ofertas)}</textarea></div>
      ${discoverBtn("ofertas")}
      <button class="btn" data-continue="ofertas">Salvar e Continuar</button>`;
  } else if (view === "entrega") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Entrega e experiência</h1>
      <div class="field"><label>Como o produto é entregue</label><textarea id="f-entrega">${esc(data.entrega)}</textarea></div>
      ${discoverBtn("entrega")}
      <button class="btn" data-continue="entrega">Salvar e Continuar</button>`;
  } else if (view === "monetizacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Monetização</h1>
      <div class="field"><label>Modelo de monetização</label><textarea id="f-monetizacao">${esc(data.monetizacao)}</textarea></div>
      ${discoverBtn("monetizacao")}
      <button class="btn" data-continue="monetizacao">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "P")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
