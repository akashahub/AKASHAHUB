const COL = "afResponsabilidades";
let currentUser = null;
let data = { funcoes: "", distribuicao: "", clareza: "", evolucao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  funcoes: {
    title: "Descobrir funções",
    subtitle: "Defina as funções necessárias.",
    questions: [
      { id: "q1", label: "Quais funções são essenciais?", options: ["Operação", "Conteúdo", "Atendimento", "Vendas", "Estratégia", "Outro"] },
      { id: "q2", label: "Quais funções você ainda faz sozinho?", options: ["Todas", "Maioria", "Algumas", "Poucas", "Outro"] },
      { id: "q3", label: "Qual função mais precisa de clareza?", type: "text" }
    ],
    generate: (a) => `Essenciais: ${a.q1 || "operação e conteúdo"}. Faço sozinho: ${a.q2 || "maioria"}. Precisa clareza: ${a.q3 || "a função de entrega"}.`
  },
  distribuicao: {
    title: "Descobrir distribuição",
    subtitle: "Defina como distribuir responsabilidades.",
    questions: [
      { id: "q1", label: "Como você quer distribuir?", options: ["Por função", "Por processo", "Por projeto", "Por fase", "Outro"] },
      { id: "q2", label: "O que precisa estar claro na distribuição?", options: ["Responsável", "Resultado", "Limites", "Prazo", "Outro"] },
      { id: "q3", label: "Qual distribuição liberaria mais?", type: "text" }
    ],
    generate: (a) => `Distribuir por ${a.q1 || "função e processo"}. Claro: ${a.q2 || "responsável e resultado"}. Liberaria: ${a.q3 || "ter alguém responsável pelo follow-up"}.`
  },
  clareza: {
    title: "Descobrir clareza",
    subtitle: "Defina o que torna uma responsabilidade clara.",
    questions: [
      { id: "q1", label: "O que gera confusão hoje?", options: ["Sobreposição", "Falta de dono", "Escopo vago", "Comunicação", "Outro"] },
      { id: "q2", label: "Como você evita confusão?", options: ["Documento claro", "Check-in", "Critérios", "Responsável único", "Outro"] },
      { id: "q3", label: "Como você sabe se a responsabilidade está clara?", type: "text" }
    ],
    generate: (a) => `Confusão: ${a.q1 || "falta de dono"}. Evito com ${a.q2 || "responsável único e documento"}. Clara quando ${a.q3 || "a pessoa sabe o que entregar e quando"}.`
  },
  evolucao: {
    title: "Descobrir evolução",
    subtitle: "Defina como as responsabilidades evoluem.",
    questions: [
      { id: "q1", label: "Como as funções vão evoluir?", options: ["Mais especialização", "Mais autonomia", "Mais pessoas", "Mais sistemas", "Outro"] },
      { id: "q2", label: "O que precisa mudar para crescer?", options: ["Menos dependência", "Mais processo", "Mais pessoas", "Mais clareza", "Outro"] },
      { id: "q3", label: "Qual evolução é prioritária?", type: "text" }
    ],
    generate: (a) => `Evolução: ${a.q1 || "mais autonomia e processo"}. Precisa mudar: ${a.q2 || "menos dependência"}. Prioritária: ${a.q3 || "definir donos claros para os processos principais"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["funcoes", "distribuicao", "clareza", "evolucao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["funcoes", "distribuicao", "clareza", "evolucao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "RESPONSABILIDADES / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Responsabilidades e Funções</h1><p class="sub">Funções, distribuição, clareza e evolução.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="funcoes">Começar</button></div>`; } else if (view === "funcoes") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Funções</h1><div class="field"><label>Funções necessárias</label><textarea id="f-funcoes">${esc(data.funcoes)}</textarea></div>${discoverBtn("funcoes")}<button class="btn" data-continue="funcoes">Salvar e Continuar</button>`; } else if (view === "distribuicao") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Distribuição</h1><div class="field"><label>Como distribuir responsabilidades</label><textarea id="f-distribuicao">${esc(data.distribuicao)}</textarea></div>${discoverBtn("distribuicao")}<button class="btn" data-continue="distribuicao">Salvar e Continuar</button>`; } else if (view === "clareza") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Clareza</h1><div class="field"><label>O que torna uma responsabilidade clara</label><textarea id="f-clareza">${esc(data.clareza)}</textarea></div>${discoverBtn("clareza")}<button class="btn" data-continue="clareza">Salvar e Continuar</button>`; } else if (view === "evolucao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Evolução</h1><div class="field"><label>Como as responsabilidades evoluem</label><textarea id="f-evolucao">${esc(data.evolucao)}</textarea></div>${discoverBtn("evolucao")}<button class="btn" data-continue="evolucao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "R")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
