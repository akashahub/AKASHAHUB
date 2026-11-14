const COL = "afPlanejamentoFinanceiro";
let currentUser = null;
let data = { visao: "", estrutura: "", decisoes: "", revisao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  visao: {
    title: "Descobrir visão e horizonte",
    subtitle: "Defina a visão financeira do planejamento.",
    questions: [
      { id: "q1", label: "Qual horizonte faz sentido?", options: ["90 dias", "6 meses", "12 meses", "3 anos", "Outro"] },
      { id: "q2", label: "O que é mais importante na visão?", options: ["Sustentabilidade", "Crescimento", "Reserva", "Liberdade", "Outro"] },
      { id: "q3", label: "O que a visão te permite decidir hoje?", type: "text" }
    ],
    generate: (a) => `Horizonte: ${a.q1 || "12 meses"}. Prioridade: ${a.q2 || "sustentabilidade e reserva"}. Permite: ${a.q3 || "priorizar o que gera caixa e postergar o que não é essencial"}.`
  },
  estrutura: {
    title: "Descobrir estrutura",
    subtitle: "Defina como o planejamento é estruturado.",
    questions: [
      { id: "q1", label: "Como você estrutura o planejamento?", options: ["Por fase", "Por oferta", "Por mês", "Por meta", "Outro"] },
      { id: "q2", label: "O que entra na estrutura?", options: ["Receitas", "Custos", "Investimentos", "Reserva", "Impostos", "Outro"] },
      { id: "q3", label: "O que torna a estrutura útil?", type: "text" }
    ],
    generate: (a) => `Estruturo por ${a.q1 || "meta e mês"}. Inclui ${a.q2 || "receitas, custos e reserva"}. Útil porque ${a.q3 || "mostra o que é possível e o que precisa de ajuste"}.`
  },
  decisoes: {
    title: "Descobrir decisões",
    subtitle: "Defina como o planejamento orienta decisões.",
    questions: [
      { id: "q1", label: "Que tipo de decisão o planejamento apoia?", options: ["Investir ou não", "Preço", "Contratação", "Oferta", "Outro"] },
      { id: "q2", label: "O que você evita decidir sem planejamento?", options: ["Grandes investimentos", "Mudança de preço", "Nova oferta", "Contratação", "Outro"] },
      { id: "q3", label: "Como o planejamento reduz pressão?", type: "text" }
    ],
    generate: (a) => `Apoia decisões de ${a.q1 || "investimento e preço"}. Evito decidir sem ele: ${a.q2 || "grandes investimentos"}. Reduz pressão porque ${a.q3 || "mostra o impacto antes de agir"}.`
  },
  revisao: {
    title: "Descobrir revisão do planejamento",
    subtitle: "Defina como revisar o planejamento.",
    questions: [
      { id: "q1", label: "Com que frequência você revisa?", options: ["Mensal", "Trimestral", "Semestral", "Quando muda o contexto", "Outro"] },
      { id: "q2", label: "O que pode mudar na revisão?", options: ["Metas", "Prioridades", "Alocação", "Horizonte", "Outro"] },
      { id: "q3", label: "O que a revisão te permite ajustar?", type: "text" }
    ],
    generate: (a) => `Reviso ${a.q1 || "trimestralmente"}. Pode mudar: ${a.q2 || "prioridades e alocação"}. Permite ajustar: ${a.q3 || "o que não está gerando o resultado esperado"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["visao", "estrutura", "decisoes", "revisao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["visao", "estrutura", "decisoes", "revisao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PLANEJAMENTO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Planejamento Financeiro</h1><p class="sub">Visão, estrutura, decisões e revisão.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="visao">Começar</button></div>`; } else if (view === "visao") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Visão e horizonte</h1><div class="field"><label>Visão financeira do planejamento</label><textarea id="f-visao">${esc(data.visao)}</textarea></div>${discoverBtn("visao")}<button class="btn" data-continue="visao">Salvar e Continuar</button>`; } else if (view === "estrutura") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Estrutura</h1><div class="field"><label>Como o planejamento é estruturado</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>${discoverBtn("estrutura")}<button class="btn" data-continue="estrutura">Salvar e Continuar</button>`; } else if (view === "decisoes") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Decisões</h1><div class="field"><label>Como o planejamento orienta decisões</label><textarea id="f-decisoes">${esc(data.decisoes)}</textarea></div>${discoverBtn("decisoes")}<button class="btn" data-continue="decisoes">Salvar e Continuar</button>`; } else if (view === "revisao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Revisão</h1><div class="field"><label>Como revisar o planejamento</label><textarea id="f-revisao">${esc(data.revisao)}</textarea></div>${discoverBtn("revisao")}<button class="btn" data-continue="revisao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "P")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
