const COL = "afProcessosOperacionais";
let currentUser = null;
let data = { mapeamento: "", padroes: "", melhoria: "", documentacao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  mapeamento: {
    title: "Descobrir mapeamento",
    subtitle: "Mapeie os processos operacionais principais.",
    questions: [
      { id: "q1", label: "Quais processos são essenciais?", options: ["Onboarding", "Entrega", "Follow-up", "Atendimento", "Produção", "Outro"] },
      { id: "q2", label: "Quais processos acontecem toda semana?", options: ["Conteúdo", "Vendas", "Entrega", "Revisão", "Outro"] },
      { id: "q3", label: "Qual processo mais precisa de organização?", type: "text" }
    ],
    generate: (a) => `Essenciais: ${a.q1 || "entrega e follow-up"}. Semanais: ${a.q2 || "conteúdo e revisão"}. Precisa organização: ${a.q3 || "o processo de entrega ainda depende de mim"}.`
  },
  padroes: {
    title: "Descobrir padrões",
    subtitle: "Identifique o que já se repete.",
    questions: [
      { id: "q1", label: "O que já é repetitivo?", options: ["Mensagens", "Checklists", "Sequências", "Relatórios", "Outro"] },
      { id: "q2", label: "O que varia demais?", options: ["Entrega", "Atendimento", "Preço", "Prazo", "Outro"] },
      { id: "q3", label: "Qual padrão você quer fortalecer?", type: "text" }
    ],
    generate: (a) => `Repetitivo: ${a.q1 || "mensagens e checklists"}. Varia: ${a.q2 || "entrega"}. Fortalecer: ${a.q3 || "um checklist de entrega consistente"}.`
  },
  melhoria: {
    title: "Descobrir melhoria",
    subtitle: "Defina como melhorar processos.",
    questions: [
      { id: "q1", label: "O que mais atrasa os processos?", options: ["Falta de clareza", "Dependência de mim", "Ferramentas", "Informação dispersa", "Outro"] },
      { id: "q2", label: "Qual melhoria teria mais impacto?", options: ["Checklist", "Template", "Automação", "Treinamento", "Outro"] },
      { id: "q3", label: "Como você mede se um processo melhorou?", type: "text" }
    ],
    generate: (a) => `Atrasa: ${a.q1 || "falta de clareza"}. Impacto: ${a.q2 || "checklist e template"}. Medo quando ${a.q3 || "o processo avança sem eu precisar intervir"}.`
  },
  documentacao: {
    title: "Descobrir documentação",
    subtitle: "Defina como documentar processos.",
    questions: [
      { id: "q1", label: "Onde você documenta?", options: ["Notion", "Google Docs", "Plataforma", "Caderno", "Outro"] },
      { id: "q2", label: "O que precisa estar no documento?", options: ["Passos", "Critérios", "Exemplo", "Responsável", "Outro"] },
      { id: "q3", label: "Qual processo você quer documentar primeiro?", type: "text" }
    ],
    generate: (a) => `Documento em ${a.q1 || "Notion ou Docs"}. Precisa ter: ${a.q2 || "passos e critérios"}. Primeiro: ${a.q3 || "o processo de entrega"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["mapeamento", "padroes", "melhoria", "documentacao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["mapeamento", "padroes", "melhoria", "documentacao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PROCESSOS / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Processos Operacionais</h1><p class="sub">Mapeie, padronize e documente processos.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="mapeamento">Começar</button></div>`; } else if (view === "mapeamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Mapeamento</h1><div class="field"><label>Processos operacionais principais</label><textarea id="f-mapeamento">${esc(data.mapeamento)}</textarea></div>${discoverBtn("mapeamento")}<button class="btn" data-continue="mapeamento">Salvar e Continuar</button>`; } else if (view === "padroes") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Padrões</h1><div class="field"><label>O que já se repete</label><textarea id="f-padroes">${esc(data.padroes)}</textarea></div>${discoverBtn("padroes")}<button class="btn" data-continue="padroes">Salvar e Continuar</button>`; } else if (view === "melhoria") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Melhoria</h1><div class="field"><label>Como melhorar processos</label><textarea id="f-melhoria">${esc(data.melhoria)}</textarea></div>${discoverBtn("melhoria")}<button class="btn" data-continue="melhoria">Salvar e Continuar</button>`; } else if (view === "documentacao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Documentação</h1><div class="field"><label>Como documentar processos</label><textarea id="f-documentacao">${esc(data.documentacao)}</textarea></div>${discoverBtn("documentacao")}<button class="btn" data-continue="documentacao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "P")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
