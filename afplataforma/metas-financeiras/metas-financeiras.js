const COL = "afMetasFinanceiras";
let currentUser = null;
let data = { metas: "", comerciais: "", acompanhamento: "", revisao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  metas: {
    title: "Descobrir metas principais",
    subtitle: "Defina as metas financeiras centrais.",
    questions: [
      { id: "q1", label: "Quais metas são prioritárias?", options: ["Reserva de caixa", "Receita mensal", "Margem", "Redução de custos", "Investimento", "Outro"] },
      { id: "q2", label: "Qual horizonte faz sentido?", options: ["30 dias", "90 dias", "6 meses", "12 meses", "Outro"] },
      { id: "q3", label: "O que essas metas permitem?", type: "text" }
    ],
    generate: (a) => `Metas: ${a.q1 || "reserva e receita mensal"}. Horizonte: ${a.q2 || "90 dias"}. Permitem: ${a.q3 || "decidir com mais calma e investir com critério"}.`
  },
  comerciais: {
    title: "Descobrir metas comerciais",
    subtitle: "Defina metas ligadas a vendas e ofertas.",
    questions: [
      { id: "q1", label: "Quais metas comerciais importam?", options: ["Número de vendas", "Ticket médio", "Taxa de conversão", "Novos clientes", "Renovações", "Outro"] },
      { id: "q2", label: "Qual meta comercial é mais urgente?", options: ["Mais vendas", "Melhor ticket", "Mais conversão", "Mais recorrência", "Outro"] },
      { id: "q3", label: "Como a meta comercial se conecta à financeira?", type: "text" }
    ],
    generate: (a) => `Metas comerciais: ${a.q1 || "vendas e ticket"}. Urgente: ${a.q2 || "mais conversão"}. Conecta: ${a.q3 || "mais vendas com margem saudável alimentam o caixa"}.`
  },
  acompanhamento: {
    title: "Descobrir acompanhamento",
    subtitle: "Defina como acompanhar as metas.",
    questions: [
      { id: "q1", label: "Com que frequência você olha as metas?", options: ["Semanal", "Quinzenal", "Mensal", "Quando faz sentido", "Outro"] },
      { id: "q2", label: "O que você compara?", options: ["Meta vs realizado", "Tendência", "Mês anterior", "Projeção", "Outro"] },
      { id: "q3", label: "O que você faz quando a meta não avança?", type: "text" }
    ],
    generate: (a) => `Olho ${a.q1 || "mensalmente"}. Comparo ${a.q2 || "meta vs realizado"}. Quando não avança: ${a.q3 || "reviso a oferta ou o processo comercial"}.`
  },
  revisao: {
    title: "Descobrir revisão de metas",
    subtitle: "Defina como revisar e ajustar metas.",
    questions: [
      { id: "q1", label: "Quando você revisa as metas?", options: ["Todo mês", "Todo trimestre", "Quando muda o contexto", "No início do ano", "Outro"] },
      { id: "q2", label: "O que pode mudar na revisão?", options: ["Valor da meta", "Prazo", "Prioridade", "Ação", "Outro"] },
      { id: "q3", label: "O que a revisão te permite decidir?", type: "text" }
    ],
    generate: (a) => `Reviso ${a.q1 || "trimestralmente"}. Pode mudar: ${a.q2 || "prioridade e ação"}. Permite: ${a.q3 || "ajustar o que não está funcionando sem perder a direção"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["metas", "comerciais", "acompanhamento", "revisao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["metas", "comerciais", "acompanhamento", "revisao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "METAS / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Metas Financeiras</h1><p class="sub">Metas principais, comerciais, acompanhamento e revisão.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="metas">Começar</button></div>`; } else if (view === "metas") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Metas principais</h1><div class="field"><label>Metas financeiras centrais</label><textarea id="f-metas">${esc(data.metas)}</textarea></div>${discoverBtn("metas")}<button class="btn" data-continue="metas">Salvar e Continuar</button>`; } else if (view === "comerciais") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Metas comerciais</h1><div class="field"><label>Metas ligadas a vendas e ofertas</label><textarea id="f-comerciais">${esc(data.comerciais)}</textarea></div>${discoverBtn("comerciais")}<button class="btn" data-continue="comerciais">Salvar e Continuar</button>`; } else if (view === "acompanhamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Acompanhamento</h1><div class="field"><label>Como acompanhar as metas</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>${discoverBtn("acompanhamento")}<button class="btn" data-continue="acompanhamento">Salvar e Continuar</button>`; } else if (view === "revisao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Revisão</h1><div class="field"><label>Como revisar e ajustar metas</label><textarea id="f-revisao">${esc(data.revisao)}</textarea></div>${discoverBtn("revisao")}<button class="btn" data-continue="revisao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "M")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
