const COL = "afCrmInteligente";
let currentUser = null;
let data = { contatos: "", oportunidades: "", relacionamento: "", automacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  contatos: {
    title: "Descobrir contatos",
    subtitle: "Defina como organizar seus contatos.",
    questions: [
      { id: "q1", label: "Quais tipos de contatos você tem?", options: ["Leads", "Clientes", "Parceiros", "Indicações", "Outro"] },
      { id: "q2", label: "Como você classifica hoje?", options: ["Por estágio", "Por origem", "Por potencial", "Não classifico", "Outro"] },
      { id: "q3", label: "O que você precisa saber sobre cada contato?", type: "text" }
    ],
    generate: (a) => `Tipos: ${a.q1 || "leads e clientes"}. Classifico ${a.q2 || "por estágio"}. Preciso saber: ${a.q3 || "origem, estágio e próxima ação"}.`
  },
  oportunidades: {
    title: "Descobrir oportunidades",
    subtitle: "Defina como acompanhar oportunidades.",
    questions: [
      { id: "q1", label: "Quais estágios você usa?", options: ["Lead", "Conversando", "Proposta", "Fechado", "Perdido"] },
      { id: "q2", label: "O que define uma oportunidade quente?", options: ["Tem urgência", "Tem orçamento", "Já decidiu", "Está engajado", "Outro"] },
      { id: "q3", label: "Como você acompanha o progresso?", type: "text" }
    ],
    generate: (a) => `Estágios: ${a.q1 || "Lead, Conversando, Proposta"}. Quente quando ${a.q2 || "tem urgência e está engajado"}. Acompanho: ${a.q3 || "próxima ação e data"}.`
  },
  relacionamento: {
    title: "Descobrir relacionamento",
    subtitle: "Defina como manter relacionamento.",
    questions: [
      { id: "q1", label: "Como você mantém contato?", options: ["E-mail", "WhatsApp", "Reuniões", "Conteúdo", "Outro"] },
      { id: "q2", label: "Qual frequência faz sentido?", options: ["Semanal", "Quinzenal", "Mensal", "Quando faz sentido", "Outro"] },
      { id: "q3", label: "O que gera confiança no relacionamento?", type: "text" }
    ],
    generate: (a) => `Mantenho contato por ${a.q1 || "conversas e conteúdo"}. Frequência: ${a.q2 || "quando faz sentido"}. Gera confiança: ${a.q3 || "coerência e clareza"}.`
  },
  automacoes: {
    title: "Descobrir automações",
    subtitle: "Defina o que pode ser automatizado.",
    questions: [
      { id: "q1", label: "O que pode ser automatizado?", options: ["Follow-up", "Lembretes", "Sequência de e-mail", "Registro de interação", "Outro"] },
      { id: "q2", label: "O que você não quer automatizar?", options: ["Conversas importantes", "Fechamento", "Relacionamento profundo", "Decisões estratégicas", "Outro"] },
      { id: "q3", label: "Qual automação teria mais impacto?", type: "text" }
    ],
    generate: (a) => `Pode automatizar: ${a.q1 || "follow-up e lembretes"}. Não automatizar: ${a.q2 || "conversas importantes"}. Mais impacto: ${a.q3 || "lembrar de fazer follow-up no momento certo"}.`
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
  const fields = ["contatos", "oportunidades", "relacionamento", "automacoes"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["contatos", "oportunidades", "relacionamento", "automacoes"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CRM / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">CRM Inteligente</h1>
      <p class="sub">Organize contatos, oportunidades e relacionamento.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="contatos">Começar</button></div>`;
  } else if (view === "contatos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Contatos</h1>
      <div class="field"><label>Como organizar contatos</label><textarea id="f-contatos">${esc(data.contatos)}</textarea></div>
      ${discoverBtn("contatos")}
      <button class="btn" data-continue="contatos">Salvar e Continuar</button>`;
  } else if (view === "oportunidades") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Oportunidades</h1>
      <div class="field"><label>Como acompanhar oportunidades</label><textarea id="f-oportunidades">${esc(data.oportunidades)}</textarea></div>
      ${discoverBtn("oportunidades")}
      <button class="btn" data-continue="oportunidades">Salvar e Continuar</button>`;
  } else if (view === "relacionamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Relacionamento</h1>
      <div class="field"><label>Como manter relacionamento</label><textarea id="f-relacionamento">${esc(data.relacionamento)}</textarea></div>
      ${discoverBtn("relacionamento")}
      <button class="btn" data-continue="relacionamento">Salvar e Continuar</button>`;
  } else if (view === "automacoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Automações</h1>
      <div class="field"><label>O que pode ser automatizado</label><textarea id="f-automacoes">${esc(data.automacoes)}</textarea></div>
      ${discoverBtn("automacoes")}
      <button class="btn" data-continue="automacoes">Salvar e Finalizar</button>`;
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
