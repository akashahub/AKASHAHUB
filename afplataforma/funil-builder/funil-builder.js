const COL = "afFunilBuilder";
let currentUser = null;
let data = { publico: "", oferta: "", etapas: "", paginas: "", metricas: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  publico: {
    title: "Descobrir público e dor",
    subtitle: "Defina quem é a pessoa ideal e sua dor.",
    questions: [
      { id: "q1", label: "Quem é o público principal?", options: ["Empresários", "Profissionais", "Empreendedores", "Líderes", "Outro"] },
      { id: "q2", label: "Qual é a dor ou desejo central?", options: ["Cansados de consumir sem construir", "Querem construir legado", "Buscam clareza", "Estão sempre se preparando", "Outro"] },
      { id: "q3", label: "O que essa pessoa já tentou?", type: "text" }
    ],
    generate: (a) => `Público: ${a.q1 || "empresários e profissionais"} que ${a.q2 || "estão cansados de consumir sem construir"}. Já tentaram ${a.q3 || "cursos e mentorias sem resultado consistente"}.`
  },
  oferta: {
    title: "Descobrir oferta e promessa",
    subtitle: "Defina o que você oferece e a promessa.",
    questions: [
      { id: "q1", label: "Qual é a oferta principal?", options: ["Acesso à plataforma", "Acompanhamento", "Diagnóstico + sistema", "Estrutura de legado", "Outro"] },
      { id: "q2", label: "Qual é a promessa clara?", options: ["Sair do consumo e construir", "Clareza e continuidade", "Sistema operacional de identidade", "Legado com estrutura", "Outro"] },
      { id: "q3", label: "O que a pessoa recebe de concreto?", type: "text" }
    ],
    generate: (a) => `Oferta: ${a.q1 || "acesso à plataforma e acompanhamento"}. Promessa: ${a.q2 || "sair do consumo e entrar na construção"}. Recebe: ${a.q3 || "estrutura e continuidade"}.`
  },
  etapas: {
    title: "Descobrir etapas do funil",
    subtitle: "Defina o caminho da awareness à conversão.",
    questions: [
      { id: "q1", label: "Quantas etapas principais?", options: ["3 etapas", "4 etapas", "5 etapas", "Outro"] },
      { id: "q2", label: "Qual é a primeira etapa?", options: ["Conteúdo de autoridade", "Lead magnet", "Diagnóstico", "Sessão", "Outro"] },
      { id: "q3", label: "Qual é o objetivo da etapa final?", type: "text" }
    ],
    generate: (a) => `Funil com ${a.q1 || "4 etapas"}. Primeira: ${a.q2 || "conteúdo de autoridade"}. Objetivo final: ${a.q3 || "acesso à plataforma ou conversa qualificada"}.`
  },
  paginas: {
    title: "Descobrir páginas e criativos",
    subtitle: "Defina o que é necessário.",
    questions: [
      { id: "q1", label: "Quais páginas são necessárias? (até 3)", options: ["Landing de captação", "Página de obrigado", "Sequência de e-mail", "Página de vendas", "WhatsApp"], multi: true },
      { id: "q2", label: "Qual tipo de criativo?", options: ["Luxo silencioso", "Autoridade e clareza", "Direto e preciso", "Sem hype", "Outro"] },
      { id: "q3", label: "O que os criativos devem transmitir?", type: "text" }
    ],
    generate: (a) => `Páginas: ${(a.q1 || []).join(", ") || "landing e sequência"}. Criativos: ${a.q2 || "autoridade e clareza"}. Transmitir: ${a.q3 || "profundidade e confiança"}.`
  },
  metricas: {
    title: "Descobrir métricas",
    subtitle: "Defina o que realmente importa.",
    questions: [
      { id: "q1", label: "Quais métricas são prioritárias? (até 3)", options: ["Leads qualificados", "Custo por lead", "Taxa de conversão", "Engajamento", "Qualidade da conversa"], multi: true },
      { id: "q2", label: "Qual métrica mais importa agora?", options: ["Qualidade dos leads", "Conversão para conversa", "Engajamento", "Custo", "Outro"] },
      { id: "q3", label: "Como você vai medir sucesso?", type: "text" }
    ],
    generate: (a) => `Métricas: ${(a.q1 || []).join(", ") || "leads qualificados e conversão"}. Mais importante agora: ${a.q2 || "qualidade dos leads"}. Sucesso: ${a.q3 || "pessoas certas entrando no sistema"}.`
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
  const fields = ["publico", "oferta", "etapas", "paginas", "metricas"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["publico", "oferta", "etapas", "paginas", "metricas"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "FUNIL BUILDER / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Funil Builder</h1>
      <p class="sub">Estruture funis de captação e conversão.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="publico">Começar</button></div>`;
  } else if (view === "publico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Público e dor</h1>
      <div class="field"><label>Público e dor</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      ${discoverBtn("publico")}
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "oferta") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Oferta e promessa</h1>
      <div class="field"><label>Oferta e promessa</label><textarea id="f-oferta">${esc(data.oferta)}</textarea></div>
      ${discoverBtn("oferta")}
      <button class="btn" data-continue="oferta">Salvar e Continuar</button>`;
  } else if (view === "etapas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Etapas do funil</h1>
      <div class="field"><label>Etapas</label><textarea id="f-etapas">${esc(data.etapas)}</textarea></div>
      ${discoverBtn("etapas")}
      <button class="btn" data-continue="etapas">Salvar e Continuar</button>`;
  } else if (view === "paginas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Páginas e criativos</h1>
      <div class="field"><label>Páginas e criativos</label><textarea id="f-paginas">${esc(data.paginas)}</textarea></div>
      ${discoverBtn("paginas")}
      <button class="btn" data-continue="paginas">Salvar e Continuar</button>`;
  } else if (view === "metricas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 5</div>
      <h1 class="title">Métricas</h1>
      <div class="field"><label>Métricas</label><textarea id="f-metricas">${esc(data.metricas)}</textarea></div>
      ${discoverBtn("metricas")}
      <button class="btn" data-continue="metricas">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "F")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
