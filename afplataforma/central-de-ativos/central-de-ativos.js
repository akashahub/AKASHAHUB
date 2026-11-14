const COL = "afCentralAtivos";
let currentUser = null;
let data = { inventario: "", organizacao: "", integracao: "", evolucao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  inventario: {
    title: "Descobrir inventário",
    subtitle: "Liste os ativos digitais que você já tem ou está construindo.",
    questions: [
      { id: "q1", label: "Quais tipos de ativos você tem?", options: ["Site", "Apps da plataforma", "Conteúdos", "Funis", "CRM", "Agentes de IA", "Produtos digitais", "Outro"], multi: true },
      { id: "q2", label: "Qual é o mais importante agora?", options: ["Plataforma AF", "Site institucional", "Conteúdo de autoridade", "Funil", "Outro"] },
      { id: "q3", label: "O que ainda falta no inventário?", type: "text" }
    ],
    generate: (a) => `Ativos: ${(a.q1 || []).join(", ") || "site, plataforma e conteúdos"}. Mais importante: ${a.q2 || "plataforma AF"}. Falta: ${a.q3 || "integração completa entre os ativos"}.`
  },
  organizacao: {
    title: "Descobrir organização",
    subtitle: "Defina como organizar e categorizar seus ativos.",
    questions: [
      { id: "q1", label: "Como você organiza os ativos?", options: ["Por fase da Arquitetura", "Por função", "Por público", "Por resultado", "Outro"] },
      { id: "q2", label: "O que evita desorganização?", options: ["Sistema único", "Nomenclatura clara", "Conexões visíveis", "Revisão periódica", "Outro"] },
      { id: "q3", label: "Como um ativo se conecta aos outros?", type: "text" }
    ],
    generate: (a) => `Organizo ${a.q1 || "por fase da Arquitetura de Legado"}. Evito desorganização com ${a.q2 || "sistema único e nomenclatura clara"}. Conexão: ${a.q3 || "cada ativo serve a uma etapa e conversa com os outros"}.`
  },
  integracao: {
    title: "Descobrir integração",
    subtitle: "Defina como os ativos se integram e conversam.",
    questions: [
      { id: "q1", label: "Qual é o backbone da integração?", options: ["Firebase", "Links entre apps", "Dados compartilhados", "Mentor view", "Outro"] },
      { id: "q2", label: "O que a integração deve permitir?", options: ["Visão do progresso", "Fluxo de dados", "Experiência contínua", "Acompanhamento do mentor", "Outro"] },
      { id: "q3", label: "Como a pessoa sente a integração?", type: "text" }
    ],
    generate: (a) => `Backbone: ${a.q1 || "Firebase e links entre apps"}. Permite ${a.q2 || "visão clara do progresso"}. A pessoa sente: ${a.q3 || "que tudo faz parte de um sistema coerente"}.`
  },
  evolucao: {
    title: "Descobrir evolução",
    subtitle: "Defina como os ativos vão evoluir.",
    questions: [
      { id: "q1", label: "Como os ativos vão evoluir?", options: ["Novas fases", "Novos apps", "Aprofundamento", "Feedback real", "Outro"] },
      { id: "q2", label: "O que guia a evolução?", options: ["Uso real", "Necessidade dos mentorandos", "Coerência com a essência", "Resultados", "Outro"] },
      { id: "q3", label: "Qual é o próximo passo de evolução?", type: "text" }
    ],
    generate: (a) => `Evolução por ${a.q1 || "novas fases e aprofundamento"}. Guiada por ${a.q2 || "uso real e necessidade dos mentorandos"}. Próximo passo: ${a.q3 || "completar a integração e abrir as próximas fases"}.`
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
  const fields = ["inventario", "organizacao", "integracao", "evolucao"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["inventario", "organizacao", "integracao", "evolucao"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CENTRAL DE ATIVOS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Central de Ativos</h1>
      <p class="sub">Organize e integre todos os seus ativos digitais em um sistema coerente.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="inventario">Começar</button></div>`;
  } else if (view === "inventario") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Inventário</h1>
      <div class="field"><label>Quais ativos digitais você já tem?</label><textarea id="f-inventario">${esc(data.inventario)}</textarea></div>
      ${discoverBtn("inventario")}
      <button class="btn" data-continue="inventario">Salvar e Continuar</button>`;
  } else if (view === "organizacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Organização</h1>
      <div class="field"><label>Como organizar esses ativos?</label><textarea id="f-organizacao">${esc(data.organizacao)}</textarea></div>
      ${discoverBtn("organizacao")}
      <button class="btn" data-continue="organizacao">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Integração</h1>
      <div class="field"><label>Como integrar os ativos?</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      ${discoverBtn("integracao")}
      <button class="btn" data-continue="integracao">Salvar e Continuar</button>`;
  } else if (view === "evolucao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Evolução</h1>
      <div class="field"><label>Como os ativos vão evoluir?</label><textarea id="f-evolucao">${esc(data.evolucao)}</textarea></div>
      ${discoverBtn("evolucao")}
      <button class="btn" data-continue="evolucao">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "A")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
