const COL = "afSdrOs";
let currentUser = null;
let data = { prospeccao: "", qualificacao: "", acompanhamento: "", scripts: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  prospeccao: {
    title: "Descobrir prospecção",
    subtitle: "Defina como e onde prospectar.",
    questions: [
      { id: "q1", label: "Onde você prospecta?", options: ["LinkedIn", "Indicações", "Conteúdo", "Eventos", "Outro"] },
      { id: "q2", label: "Qual abordagem faz sentido?", options: ["Conteúdo de autoridade", "Indicações", "Conversas 1 a 1", "Sem prospecção fria", "Outro"] },
      { id: "q3", label: "O que você evita na prospecção?", type: "text" }
    ],
    generate: (a) => `Prospecto em ${a.q1 || "LinkedIn e indicações"}. Abordagem: ${a.q2 || "conteúdo de autoridade"}. Evito ${a.q3 || "prospecção fria em massa"}.`
  },
  qualificacao: {
    title: "Descobrir qualificação",
    subtitle: "Defina os critérios de qualificação.",
    questions: [
      { id: "q1", label: "Quais critérios são essenciais? (até 3)", options: ["Alinhamento com a essência", "Capacidade de investir", "Desejo real de construir", "Clareza mínima", "Disposição para agir"], multi: true },
      { id: "q2", label: "O que desqualifica uma pessoa?", options: ["Só quer mais conteúdo", "Não tem disposição", "Não alinha com a marca", "Falta de clareza", "Outro"] },
      { id: "q3", label: "Como você identifica uma pessoa qualificada?", type: "text" }
    ],
    generate: (a) => `Critérios: ${(a.q1 || []).join(", ") || "alinhamento e disposição"}. Desqualifica: ${a.q2 || "só quer mais conteúdo"}. Identifico quando ${a.q3 || "a pessoa já tem clareza mínima e quer agir"}.`
  },
  acompanhamento: {
    title: "Descobrir acompanhamento",
    subtitle: "Defina como acompanhar o progresso.",
    questions: [
      { id: "q1", label: "Como você acompanha?", options: ["Mentor view", "Conversas estratégicas", "Dados da plataforma", "Pontos de contato", "Outro"] },
      { id: "q2", label: "O que é mais importante acompanhar?", options: ["Progressão real", "Engajamento", "Próximos passos", "Resultados", "Outro"] },
      { id: "q3", label: "Como você sabe se a pessoa está avançando?", type: "text" }
    ],
    generate: (a) => `Acompanho por ${a.q1 || "mentor view e conversas"}. Mais importante: ${a.q2 || "progressão real"}. Sei que avança quando ${a.q3 || "completa etapas e toma ações concretas"}.`
  },
  scripts: {
    title: "Descobrir scripts e playbook",
    subtitle: "Defina a abordagem de comunicação.",
    questions: [
      { id: "q1", label: "Qual abordagem você usa?", options: ["Escuta e alinhamento", "Clareza e frequência", "Sem pressão", "Baseada em identidade", "Outro"] },
      { id: "q2", label: "O que você não faz?", options: ["Pressionar", "Falar antes de ouvir", "Usar scripts genéricos", "Forçar fechamento", "Outro"] },
      { id: "q3", label: "Qual é o objetivo principal da conversa?", type: "text" }
    ],
    generate: (a) => `Abordagem: ${a.q1 || "escuta e alinhamento"}. Não faço ${a.q2 || "pressionar ou falar antes de ouvir"}. Objetivo: ${a.q3 || "entender a realidade da pessoa e ver se há alinhamento"}.`
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
  const fields = ["prospeccao", "qualificacao", "acompanhamento", "scripts"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["prospeccao", "qualificacao", "acompanhamento", "scripts"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "SDR OS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">SDR OS</h1>
      <p class="sub">Sistema de prospecção, qualificação e acompanhamento.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="prospeccao">Começar</button></div>`;
  } else if (view === "prospeccao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Prospecção</h1>
      <div class="field"><label>Como e onde prospectar</label><textarea id="f-prospeccao">${esc(data.prospeccao)}</textarea></div>
      ${discoverBtn("prospeccao")}
      <button class="btn" data-continue="prospeccao">Salvar e Continuar</button>`;
  } else if (view === "qualificacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Qualificação</h1>
      <div class="field"><label>Critérios de qualificação</label><textarea id="f-qualificacao">${esc(data.qualificacao)}</textarea></div>
      ${discoverBtn("qualificacao")}
      <button class="btn" data-continue="qualificacao">Salvar e Continuar</button>`;
  } else if (view === "acompanhamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Acompanhamento</h1>
      <div class="field"><label>Como acompanhar o progresso</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>
      ${discoverBtn("acompanhamento")}
      <button class="btn" data-continue="acompanhamento">Salvar e Continuar</button>`;
  } else if (view === "scripts") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Scripts e playbook</h1>
      <div class="field"><label>Scripts e processos</label><textarea id="f-scripts">${esc(data.scripts)}</textarea></div>
      ${discoverBtn("scripts")}
      <button class="btn" data-continue="scripts">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "S")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
