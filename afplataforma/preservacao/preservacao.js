const COL = "afPreservacao";
let currentUser = null;
let data = { oque: "", como: "", transmissao: "", continuidade: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  oque: {
    title: "Descobrir o que preservar",
    subtitle: "Defina o que precisa ser preservado.",
    questions: [
      { id: "q1", label: "O que precisa ser preservado?", options: ["Princípios", "Processos", "Histórias", "Critérios", "Essência", "Outro"] },
      { id: "q2", label: "O que já está registrado?", options: ["Pouco", "Parcialmente", "Bastante", "Quase nada", "Outro"] },
      { id: "q3", label: "O que não pode se perder?", type: "text" }
    ],
    generate: (a) => `Preservar: ${a.q1 || "princípios e processos"}. Registrado: ${a.q2 || "parcialmente"}. Não pode se perder: ${a.q3 || "a essência e os critérios de decisão"}.`
  },
  como: {
    title: "Descobrir como preservar",
    subtitle: "Defina como preservar o que importa.",
    questions: [
      { id: "q1", label: "Como você preserva?", options: ["Documentação", "Gravações", "Templates", "Livros", "Sistemas", "Outro"] },
      { id: "q2", label: "Onde fica?", options: ["Plataforma", "Notion", "Drive", "Livro", "Outro"] },
      { id: "q3", label: "O que facilita a preservação?", type: "text" }
    ],
    generate: (a) => `Preservo com ${a.q1 || "documentação"}. Fica em ${a.q2 || "plataforma e Notion"}. Facilita: ${a.q3 || "registrar no momento e organizar por fase"}.`
  },
  transmissao: {
    title: "Descobrir transmissão",
    subtitle: "Defina como o que foi preservado é transmitido.",
    questions: [
      { id: "q1", label: "Como é transmitido?", options: ["Documentação", "Sessões", "Comunidade", "Mentoria", "Outro"] },
      { id: "q2", label: "Quem transmite?", options: ["Eu", "Mentorados", "Time", "Sistema", "Outro"] },
      { id: "q3", label: "O que uma pessoa precisa para transmitir?", type: "text" }
    ],
    generate: (a) => `Transmitido por ${a.q1 || "documentação e sessões"}. Transmite: ${a.q2 || "eu e alguns mentorados"}. Precisa: ${a.q3 || "entender a essência e ter experiência"}.`
  },
  continuidade: {
    title: "Descobrir continuidade",
    subtitle: "Defina como a preservação continua.",
    questions: [
      { id: "q1", label: "O que garante continuidade?", options: ["Documentação", "Pessoas", "Rituais", "Sistemas", "Outro"] },
      { id: "q2", label: "O que ameaça?", options: ["Dependência de mim", "Falta de registro", "Perda de essência", "Dispersão", "Outro"] },
      { id: "q3", label: "Como isso sobrevive sem você?", type: "text" }
    ],
    generate: (a) => `Garante: ${a.q1 || "documentação e pessoas"}. Ameaça: ${a.q2 || "dependência de mim"}. Sobrevive quando ${a.q3 || "está documentado e há pessoas que o sustentam"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;") }
function progress() { const fields = ["oque", "como", "transmissao", "continuidade"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["oque", "como", "transmissao", "continuidade"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PRESERVAÇÃO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Preservação e Transmissão</h1><p class="sub">O que preservar, como, transmissão e continuidade.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="oque">Começar</button></div>`; } else if (view === "oque") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">O que preservar</h1><div class="field"><label>O que precisa ser preservado</label><textarea id="f-oque">${esc(data.oque)}</textarea></div>${discoverBtn("oque")}<button class="btn" data-continue="oque">Salvar e Continuar</button>`; } else if (view === "como") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Como preservar</h1><div class="field"><label>Como preservar</label><textarea id="f-como">${esc(data.como)}</textarea></div>${discoverBtn("como")}<button class="btn" data-continue="como">Salvar e Continuar</button>`; } else if (view === "transmissao") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Transmissão</h1><div class="field"><label>Como é transmitido</label><textarea id="f-transmissao">${esc(data.transmissao)}</textarea></div>${discoverBtn("transmissao")}<button class="btn" data-continue="transmissao">Salvar e Continuar</button>`; } else if (view === "continuidade") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Continuidade</h1><div class="field"><label>Como a preservação continua</label><textarea id="f-continuidade">${esc(data.continuidade)}</textarea></div>${discoverBtn("continuidade")}<button class="btn" data-continue="continuidade">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "P")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
