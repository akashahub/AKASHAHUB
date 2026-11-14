const COL = "afFluxosTrabalho";
let currentUser = null;
let data = { mapeamento: "", gargalos: "", otimizacao: "", acompanhamento: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  mapeamento: {
    title: "Descobrir mapeamento",
    subtitle: "Mapeie os fluxos de trabalho principais.",
    questions: [
      { id: "q1", label: "Quais fluxos são centrais?", options: ["Venda", "Entrega", "Onboarding", "Follow-up", "Conteúdo", "Outro"] },
      { id: "q2", label: "Onde o fluxo mais para?", options: ["Espera de mim", "Falta de informação", "Ferramenta", "Decisão", "Outro"] },
      { id: "q3", label: "Qual fluxo mais impacta o resultado?", type: "text" }
    ],
    generate: (a) => `Fluxos centrais: ${a.q1 || "entrega e follow-up"}. Para em: ${a.q2 || "espera de mim"}. Mais impacta: ${a.q3 || "o fluxo de entrega"}.`
  },
  gargalos: {
    title: "Descobrir gargalos",
    subtitle: "Identifique onde o fluxo trava.",
    questions: [
      { id: "q1", label: "Quais são os principais gargalos?", options: ["Dependência de mim", "Informação dispersa", "Falta de processo", "Ferramenta", "Outro"] },
      { id: "q2", label: "Qual gargalo é mais frequente?", options: ["Espera de aprovação", "Falta de clareza", "Retrabalho", "Comunicação", "Outro"] },
      { id: "q3", label: "Qual gargalo você quer resolver primeiro?", type: "text" }
    ],
    generate: (a) => `Gargalos: ${a.q1 || "dependência e falta de processo"}. Mais frequente: ${a.q2 || "espera de aprovação"}. Resolver primeiro: ${a.q3 || "criar um checklist para reduzir espera"}.`
  },
  otimizacao: {
    title: "Descobrir otimização",
    subtitle: "Defina como otimizar fluxos.",
    questions: [
      { id: "q1", label: "Como otimizar?", options: ["Automatizar", "Checklist", "Delegar", "Simplificar", "Outro"] },
      { id: "q2", label: "O que pode ser removido?", options: ["Etapas desnecessárias", "Aprovações", "Reuniões", "Ferramentas", "Outro"] },
      { id: "q3", label: "Qual otimização teria mais impacto?", type: "text" }
    ],
    generate: (a) => `Otimizar com ${a.q1 || "checklist e delegação"}. Remover: ${a.q2 || "etapas desnecessárias"}. Impacto: ${a.q3 || "reduzir etapas que dependem de mim"}.`
  },
  acompanhamento: {
    title: "Descobrir acompanhamento",
    subtitle: "Defina como acompanhar os fluxos.",
    questions: [
      { id: "q1", label: "Como você acompanha o fluxo?", options: ["Checklist", "Dashboard", "Reunião", "Relatório", "Outro"] },
      { id: "q2", label: "O que indica que o fluxo está saudável?", options: ["Avança sem mim", "Prazo cumprido", "Poucos retrabalhos", "Clareza", "Outro"] },
      { id: "q3", label: "Como você corrige quando o fluxo trava?", type: "text" }
    ],
    generate: (a) => `Acompanho com ${a.q1 || "checklist"}. Saudável quando ${a.q2 || "avança sem mim"}. Corrijo: ${a.q3 || "identificando o ponto de travamento e simplificando"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["mapeamento", "gargalos", "otimizacao", "acompanhamento"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["mapeamento", "gargalos", "otimizacao", "acompanhamento"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "FLUXOS / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Fluxos de Trabalho</h1><p class="sub">Mapeie, identifique gargalos e otimize fluxos.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="mapeamento">Começar</button></div>`; } else if (view === "mapeamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Mapeamento</h1><div class="field"><label>Fluxos de trabalho principais</label><textarea id="f-mapeamento">${esc(data.mapeamento)}</textarea></div>${discoverBtn("mapeamento")}<button class="btn" data-continue="mapeamento">Salvar e Continuar</button>`; } else if (view === "gargalos") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Gargalos</h1><div class="field"><label>Onde o fluxo trava</label><textarea id="f-gargalos">${esc(data.gargalos)}</textarea></div>${discoverBtn("gargalos")}<button class="btn" data-continue="gargalos">Salvar e Continuar</button>`; } else if (view === "otimizacao") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Otimização</h1><div class="field"><label>Como otimizar fluxos</label><textarea id="f-otimizacao">${esc(data.otimizacao)}</textarea></div>${discoverBtn("otimizacao")}<button class="btn" data-continue="otimizacao">Salvar e Continuar</button>`; } else if (view === "acompanhamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Acompanhamento</h1><div class="field"><label>Como acompanhar os fluxos</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>${discoverBtn("acompanhamento")}<button class="btn" data-continue="acompanhamento">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "F")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
