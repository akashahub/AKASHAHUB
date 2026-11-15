const COL = "afRelacionamentoLongoPrazo";
let currentUser = null;
let data = { proposito: "", rituais: "", profundidade: "", continuidade: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  proposito: {
    title: "Descobrir propósito",
    subtitle: "Defina o propósito do relacionamento de longo prazo.",
    questions: [
      { id: "q1", label: "Qual é o propósito?", options: ["Continuidade", "Profundidade", "Legado", "Troca real", "Outro"] },
      { id: "q2", label: "O que não é?", options: ["Networking", "Venda contínua", "Suporte genérico", "Conteúdo solto", "Outro"] },
      { id: "q3", label: "O que faz uma pessoa querer continuar?", type: "text" }
    ],
    generate: (a) => `Propósito: ${a.q1 || "continuidade e profundidade"}. Não é: ${a.q2 || "networking"}. Continua porque ${a.q3 || "encontra profundidade e sentido"}.`
  },
  rituais: {
    title: "Descobrir rituais",
    subtitle: "Defina rituais que sustentam o relacionamento.",
    questions: [
      { id: "q1", label: "Quais rituais fazem sentido?", options: ["Encontros periódicos", "Check-ins", "Conteúdo", "Celebracões", "Outro"] },
      { id: "q2", label: "Qual frequência funciona?", options: ["Mensal", "Trimestral", "Semestral", "Quando faz sentido", "Outro"] },
      { id: "q3", label: "O que um ritual precisa ter?", type: "text" }
    ],
    generate: (a) => `Rituais: ${a.q1 || "encontros periódicos"}. Frequência: ${a.q2 || "trimestral"}. Precisa ter: ${a.q3 || "profundidade e continuidade"}.`
  },
  profundidade: {
    title: "Descobrir profundidade",
    subtitle: "Defina o que gera profundidade no relacionamento.",
    questions: [
      { id: "q1", label: "O que gera profundidade?", options: ["Conversas reais", "Tempo", "Vulnerabilidade", "Contexto", "Outro"] },
      { id: "q2", label: "O que destrói profundidade?", options: ["Superficialidade", "Pressa", "Venda", "Falta de contexto", "Outro"] },
      { id: "q3", label: "Como você cultiva profundidade?", type: "text" }
    ],
    generate: (a) => `Gera: ${a.q1 || "conversas reais e tempo"}. Destrói: ${a.q2 || "superficialidade e pressa"}. Cultivo: ${a.q3 || "com tempo e conversas de verdade"}.`
  },
  continuidade: {
    title: "Descobrir continuidade",
    subtitle: "Defina o que faz o relacionamento continuar.",
    questions: [
      { id: "q1", label: "O que sustenta a continuidade?", options: ["Rituais", "Valor real", "Confiança", "Estrutura", "Outro"] },
      { id: "q2", label: "O que ameaça?", options: ["Falta de ritual", "Perda de profundidade", "Dependência", "Dispersão", "Outro"] },
      { id: "q3", label: "Como o relacionamento continua sem você?", type: "text" }
    ],
    generate: (a) => `Sustenta: ${a.q1 || "rituais e valor real"}. Ameaça: ${a.q2 || "falta de ritual"}. Continua quando ${a.q3 || "existem rituais e valor que não dependem de mim"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;") }
function progress() { const fields = ["proposito", "rituais", "profundidade", "continuidade"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["proposito", "rituais", "profundidade", "continuidade"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "RELACIONAMENTO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Relacionamento de Longo Prazo</h1><p class="sub">Propósito, rituais, profundidade e continuidade.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="proposito">Começar</button></div>`; } else if (view === "proposito") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Propósito</h1><div class="field"><label>Propósito do relacionamento</label><textarea id="f-proposito">${esc(data.proposito)}</textarea></div>${discoverBtn("proposito")}<button class="btn" data-continue="proposito">Salvar e Continuar</button>`; } else if (view === "rituais") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Rituais</h1><div class="field"><label>Rituais que sustentam</label><textarea id="f-rituais">${esc(data.rituais)}</textarea></div>${discoverBtn("rituais")}<button class="btn" data-continue="rituais">Salvar e Continuar</button>`; } else if (view === "profundidade") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Profundidade</h1><div class="field"><label>O que gera profundidade</label><textarea id="f-profundidade">${esc(data.profundidade)}</textarea></div>${discoverBtn("profundidade")}<button class="btn" data-continue="profundidade">Salvar e Continuar</button>`; } else if (view === "continuidade") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Continuidade</h1><div class="field"><label>O que faz continuar</label><textarea id="f-continuidade">${esc(data.continuidade)}</textarea></div>${discoverBtn("continuidade")}<button class="btn" data-continue="continuidade">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "R")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
