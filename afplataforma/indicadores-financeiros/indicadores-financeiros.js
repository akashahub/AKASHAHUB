const COL = "afIndicadoresFinanceiros";
let currentUser = null;
let data = { principais: "", acompanhamento: "", alertas: "", revisao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  principais: {
    title: "Descobrir indicadores principais",
    subtitle: "Defina quais números você acompanha.",
    questions: [
      { id: "q1", label: "Quais indicadores são essenciais?", options: ["Saldo de caixa", "Margem", "Ticket médio", "Custo de aquisição", "LTV", "Outro"], multi: true },
      { id: "q2", label: "Qual você olha com mais frequência?", options: ["Saldo", "Entradas", "Margem", "Custos", "Outro"] },
      { id: "q3", label: "O que esses números te dizem sobre o negócio?", type: "text" }
    ],
    generate: (a) => `Indicadores: ${(a.q1 || []).join(", ") || "saldo e margem"}. Mais frequente: ${a.q2 || "saldo"}. Dizem: ${a.q3 || "se o negócio é sustentável e se posso investir"}.`
  },
  acompanhamento: {
    title: "Descobrir acompanhamento",
    subtitle: "Defina como você acompanha os indicadores.",
    questions: [
      { id: "q1", label: "Com que frequência você revisa?", options: ["Semanal", "Quinzenal", "Mensal", "Trimestral", "Outro"] },
      { id: "q2", label: "Onde você registra?", options: ["Planilha", "App", "Dashboard", "Caderno", "Outro"] },
      { id: "q3", label: "O que você faz com o que vê?", type: "text" }
    ],
    generate: (a) => `Reviso ${a.q1 || "mensalmente"}. Registro em ${a.q2 || "planilha"}. Faço: ${a.q3 || "ajustes nas próximas decisões comerciais"}.`
  },
  alertas: {
    title: "Descobrir alertas e limites",
    subtitle: "Defina quando um indicador pede ação.",
    questions: [
      { id: "q1", label: "Quais limites são importantes?", options: ["Saldo mínimo", "Margem mínima", "Custo máximo", "Inadimplência", "Outro"] },
      { id: "q2", label: "O que você faz quando um limite é atingido?", options: ["Reviso ofertas", "Corto custos", "Acelero vendas", "Pauso investimentos", "Outro"] },
      { id: "q3", label: "Qual alerta te ajudaria mais hoje?", type: "text" }
    ],
    generate: (a) => `Limites: ${a.q1 || "saldo e margem mínima"}. Quando atinge: ${a.q2 || "reviso ofertas e corto custos"}. Alerta útil: ${a.q3 || "quando o saldo cai abaixo do necessário para 60 dias"}.`
  },
  revisao: {
    title: "Descobrir revisão",
    subtitle: "Defina como você revisa os indicadores.",
    questions: [
      { id: "q1", label: "Com que frequência você revisa a estratégia com base nos números?", options: ["Mensal", "Trimestral", "Semestral", "Quando muda algo", "Outro"] },
      { id: "q2", label: "O que muda depois da revisão?", options: ["Ofertas", "Preços", "Custos", "Metas", "Outro"] },
      { id: "q3", label: "O que a revisão te permite enxergar?", type: "text" }
    ],
    generate: (a) => `Reviso ${a.q1 || "trimestralmente"}. Muda: ${a.q2 || "ofertas e metas"}. Permite enxergar: ${a.q3 || "o que está funcionando e o que precisa de ajuste"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["principais", "acompanhamento", "alertas", "revisao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["principais", "acompanhamento", "alertas", "revisao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;

function openDiscovery(field) {
  const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field;
  document.getElementById("modalTitle").textContent = cfg.title;
  document.getElementById("modalSubtitle").textContent = cfg.subtitle;
  const qEl = document.getElementById("modalQuestions");
  qEl.innerHTML = cfg.questions.map(q => {
    if (q.options) {
      const multi = q.multi ? ' data-multi="1"' : '';
      return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`;
    }
    return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`;
  }).join("");
  qEl.querySelectorAll(".options").forEach(box => {
    const multi = box.dataset.multi;
    box.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (multi) btn.classList.toggle("selected");
        else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); }
      };
    });
  });
  document.getElementById("modalResult").classList.add("hidden");
  document.getElementById("discoveryForm").classList.remove("hidden");
  document.getElementById("discoveryModal").classList.remove("hidden");
}
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) {
  const answers = {};
  cfg.questions.forEach(q => {
    if (q.options) {
      const box = document.querySelector(`.options[data-qid="${q.id}"]`);
      if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value);
      else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; }
    } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; }
  });
  return answers;
}
function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; }
    const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover);
  });
  document.getElementById("modalClose").onclick = closeModal;
  document.getElementById("modalCancel").onclick = closeModal;
  document.querySelector(".modal-backdrop").onclick = closeModal;
  document.getElementById("discoveryForm").onsubmit = (e) => {
    e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return;
    const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers);
    document.getElementById("suggestionText").textContent = suggestion;
    document.getElementById("discoveryForm").classList.add("hidden");
    document.getElementById("modalResult").classList.remove("hidden");
  };
  document.getElementById("useSuggestion").onclick = () => {
    const text = document.getElementById("suggestionText").textContent;
    if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); }
    closeModal(); render();
  };
}
async function saveData() {
  if (!currentUser || !db) { toast("Faça login para salvar."); return; }
  try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); }
  render();
}
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() {
  const p = progress(); const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "INDICADORES / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";
  if (view === "dashboard") {
    content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Indicadores Financeiros</h1><p class="sub">Números principais, acompanhamento, alertas e revisão.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="principais">Começar</button></div>`;
  } else if (view === "principais") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Indicadores principais</h1><div class="field"><label>Quais números você acompanha</label><textarea id="f-principais">${esc(data.principais)}</textarea></div>${discoverBtn("principais")}<button class="btn" data-continue="principais">Salvar e Continuar</button>`;
  } else if (view === "acompanhamento") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Acompanhamento</h1><div class="field"><label>Como você acompanha</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>${discoverBtn("acompanhamento")}<button class="btn" data-continue="acompanhamento">Salvar e Continuar</button>`;
  } else if (view === "alertas") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Alertas e limites</h1><div class="field"><label>Quando um indicador pede ação</label><textarea id="f-alertas">${esc(data.alertas)}</textarea></div>${discoverBtn("alertas")}<button class="btn" data-continue="alertas">Salvar e Continuar</button>`;
  } else if (view === "revisao") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Revisão</h1><div class="field"><label>Como você revisa a estratégia</label><textarea id="f-revisao">${esc(data.revisao)}</textarea></div>${discoverBtn("revisao")}<button class="btn" data-continue="revisao">Salvar e Finalizar</button>`;
  }
}
bind(); render();
(async () => {
  try {
    const configMod = await import("../firebase/firebase-config.js");
    auth = configMod.auth; db = configMod.db;
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "I")[0].toUpperCase(); } render(); });
  } catch (e) { console.warn("Firebase opcional falhou:", e); }
})();
