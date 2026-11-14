const COL = "afPadronizacao";
let currentUser = null;
let data = { identificacao: "", criterios: "", templates: "", adocao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  identificacao: {
    title: "Descobrir identificação",
    subtitle: "Identifique o que pode ser padronizado.",
    questions: [
      { id: "q1", label: "O que já é repetitivo?", options: ["Mensagens", "Checklists", "Relatórios", "Onboarding", "Entrega", "Outro"] },
      { id: "q2", label: "O que mais varia sem necessidade?", options: ["Entrega", "Comunicação", "Prazo", "Formato", "Outro"] },
      { id: "q3", label: "Qual padronização liberaria mais tempo?", type: "text" }
    ],
    generate: (a) => `Repetitivo: ${a.q1 || "mensagens e checklists"}. Varia: ${a.q2 || "entrega"}. Liberaria tempo: ${a.q3 || "um template de entrega consistente"}.`
  },
  criterios: {
    title: "Descobrir critérios",
    subtitle: "Defina critérios para padronizar.",
    questions: [
      { id: "q1", label: "O que merece ser padronizado?", options: ["Alta frequência", "Alto impacto", "Baixa variação", "Facilidade", "Outro"] },
      { id: "q2", label: "O que não deve ser padronizado?", options: ["Decisões estratégicas", "Relacionamento profundo", "Criação original", "Exceções", "Outro"] },
      { id: "q3", label: "Qual critério é mais importante?", type: "text" }
    ],
    generate: (a) => `Merece padronizar: ${a.q1 || "alta frequência e impacto"}. Não padronizar: ${a.q2 || "decisões estratégicas"}. Critério: ${a.q3 || "se se repete e gera resultado consistente"}.`
  },
  templates: {
    title: "Descobrir templates",
    subtitle: "Defina templates úteis.",
    questions: [
      { id: "q1", label: "Quais templates seriam úteis?", options: ["Checklist", "Mensagem", "Relatório", "Onboarding", "Entrega", "Outro"] },
      { id: "q2", label: "Onde os templates ficam?", options: ["Notion", "Docs", "Plataforma", "Drive", "Outro"] },
      { id: "q3", label: "Qual template você quer criar primeiro?", type: "text" }
    ],
    generate: (a) => `Templates úteis: ${a.q1 || "checklist e mensagem"}. Ficam em ${a.q2 || "Notion"}. Primeiro: ${a.q3 || "checklist de entrega"}.`
  },
  adocao: {
    title: "Descobrir adoção",
    subtitle: "Defina como os padrões são adotados.",
    questions: [
      { id: "q1", label: "Como você garante que o padrão é usado?", options: ["Checklist", "Treinamento", "Revisão", "Automação", "Outro"] },
      { id: "q2", label: "O que facilita a adoção?", options: ["Simplicidade", "Exemplo", "Benefício claro", "Obrigatoriedade", "Outro"] },
      { id: "q3", label: "Como você sabe se o padrão está funcionando?", type: "text" }
    ],
    generate: (a) => `Garanto com ${a.q1 || "checklist e revisão"}. Facilita: ${a.q2 || "simplicidade e exemplo"}. Funciona quando ${a.q3 || "o resultado é consistente sem eu precisar corrigir"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["identificacao", "criterios", "templates", "adocao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["identificacao", "criterios", "templates", "adocao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PADRONIZAÇÃO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Padronização</h1><p class="sub">Identifique, crie templates e adote padrões.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="identificacao">Começar</button></div>`; } else if (view === "identificacao") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Identificação</h1><div class="field"><label>O que pode ser padronizado</label><textarea id="f-identificacao">${esc(data.identificacao)}</textarea></div>${discoverBtn("identificacao")}<button class="btn" data-continue="identificacao">Salvar e Continuar</button>`; } else if (view === "criterios") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Critérios</h1><div class="field"><label>Critérios para padronizar</label><textarea id="f-criterios">${esc(data.criterios)}</textarea></div>${discoverBtn("criterios")}<button class="btn" data-continue="criterios">Salvar e Continuar</button>`; } else if (view === "templates") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Templates</h1><div class="field"><label>Templates úteis</label><textarea id="f-templates">${esc(data.templates)}</textarea></div>${discoverBtn("templates")}<button class="btn" data-continue="templates">Salvar e Continuar</button>`; } else if (view === "adocao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Adoção</h1><div class="field"><label>Como os padrões são adotados</label><textarea id="f-adocao">${esc(data.adocao)}</textarea></div>${discoverBtn("adocao")}<button class="btn" data-continue="adocao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "P")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
