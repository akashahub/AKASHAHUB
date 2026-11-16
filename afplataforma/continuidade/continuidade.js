const COL = "afContinuidade";
let currentUser = null;
let data = { mecanismos: "", riscos: "", estrutura: "", acompanhamento: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  mecanismos: {
    title: "Descobrir mecanismos",
    subtitle: "Defina os mecanismos de continuidade.",
    questions: [
      { id: "q1", label: "Quais mecanismos existem?", options: ["Documentação", "Processos", "Pessoas", "Rituais", "Sistemas", "Outro"] },
      { id: "q2", label: "O que já funciona sem você?", options: ["Alguns processos", "Nada", "Quase tudo", "Só o essencial", "Outro"] },
      { id: "q3", label: "Qual mecanismo mais precisa ser criado?", type: "text" }
    ],
    generate: (a) => `Mecanismos: ${a.q1 || "documentação e processos"}. Funciona sem mim: ${a.q2 || "alguns processos"}. Precisa criar: ${a.q3 || "processos que não dependam de mim"}.`
  },
  riscos: {
    title: "Descobrir riscos",
    subtitle: "Identifique o que ameaça a continuidade.",
    questions: [
      { id: "q1", label: "Quais são os principais riscos?", options: ["Dependência do fundador", "Falta de documentação", "Perda de essência", "Dispersão", "Outro"] },
      { id: "q2", label: "Qual risco é mais imediato?", options: ["Dependência", "Falta de processo", "Falta de pessoas", "Falta de clareza", "Outro"] },
      { id: "q3", label: "O que você faria para reduzir o maior risco?", type: "text" }
    ],
    generate: (a) => `Riscos: ${a.q1 || "dependência do fundador"}. Mais imediato: ${a.q2 || "dependência"}. Reduziria: ${a.q3 || "documentando e transferindo processos"}.`
  },
  estrutura: {
    title: "Descobrir estrutura",
    subtitle: "Defina a estrutura que sustenta a continuidade.",
    questions: [
      { id: "q1", label: "O que a estrutura precisa ter?", options: ["Processos", "Pessoas", "Documentação", "Rituais", "Outro"] },
      { id: "q2", label: "O que já existe?", options: ["Documentação parcial", "Alguns processos", "Pessoas", "Nada estruturado", "Outro"] },
      { id: "q3", label: "Qual estrutura você quer construir primeiro?", type: "text" }
    ],
    generate: (a) => `Precisa ter: ${a.q1 || "processos e documentação"}. Já existe: ${a.q2 || "documentação parcial"}. Primeiro: ${a.q3 || "documentar os processos principais"}.`
  },
  acompanhamento: {
    title: "Descobrir acompanhamento",
    subtitle: "Defina como acompanhar a continuidade.",
    questions: [
      { id: "q1", label: "Como você acompanha?", options: ["Revisão periódica", "Indicadores", "Conversas", "Checklists", "Outro"] },
      { id: "q2", label: "O que indica que a continuidade está saudável?", options: ["Funciona sem mim", "Processos claros", "Pessoas engajadas", "Documentação atualizada", "Outro"] },
      { id: "q3", label: "O que você faria se a continuidade enfraquecesse?", type: "text" }
    ],
    generate: (a) => `Acompanho com ${a.q1 || "revisão periódica"}. Saudável quando ${a.q2 || "funciona sem mim"}. Se enfraquecer: ${a.q3 || "reviso processos e reforço documentação"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;") }
function progress() { const fields = ["mecanismos", "riscos", "estrutura", "acompanhamento"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["mecanismos", "riscos", "estrutura", "acompanhamento"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CONTINUIDADE / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Continuidade</h1><p class="sub">Mecanismos, riscos, estrutura e acompanhamento.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="mecanismos">Começar</button></div>`; } else if (view === "mecanismos") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Mecanismos</h1><div class="field"><label>Mecanismos de continuidade</label><textarea id="f-mecanismos">${esc(data.mecanismos)}</textarea></div>${discoverBtn("mecanismos")}<button class="btn" data-continue="mecanismos">Salvar e Continuar</button>`; } else if (view === "riscos") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Riscos</h1><div class="field"><label>O que ameaça a continuidade</label><textarea id="f-riscos">${esc(data.riscos)}</textarea></div>${discoverBtn("riscos")}<button class="btn" data-continue="riscos">Salvar e Continuar</button>`; } else if (view === "estrutura") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Estrutura</h1><div class="field"><label>Estrutura que sustenta a continuidade</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>${discoverBtn("estrutura")}<button class="btn" data-continue="estrutura">Salvar e Continuar</button>`; } else if (view === "acompanhamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Acompanhamento</h1><div class="field"><label>Como acompanhar a continuidade</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>${discoverBtn("acompanhamento")}<button class="btn" data-continue="acompanhamento">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "C")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
