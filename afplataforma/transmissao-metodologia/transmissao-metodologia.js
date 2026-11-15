const COL = "afTransmissaoMetodologia";
let currentUser = null;
let data = { conteudo: "", formato: "", pessoas: "", continuidade: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  conteudo: {
    title: "Descobrir conteúdo",
    subtitle: "Defina o que é transmitido.",
    questions: [
      { id: "q1", label: "O que precisa ser transmitido?", options: ["Princípios", "Processos", "Decisões", "Histórias", "Critérios", "Outro"] },
      { id: "q2", label: "O que ainda está só com você?", options: ["Critérios", "Histórias", "Decisões", "Nuances", "Outro"] },
      { id: "q3", label: "O que não pode se perder?", type: "text" }
    ],
    generate: (a) => `Transmitir: ${a.q1 || "princípios e processos"}. Só comigo: ${a.q2 || "critérios e nuances"}. Não pode se perder: ${a.q3 || "a essência e os critérios de decisão"}.`
  },
  formato: {
    title: "Descobrir formato",
    subtitle: "Defina como a metodologia é transmitida.",
    questions: [
      { id: "q1", label: "Qual formato funciona?", options: ["Documentação", "Vídeos", "Sessões", "Templates", "Livro", "Outro"] },
      { id: "q2", label: "O que facilita a transmissão?", options: ["Clareza", "Exemplo", "Prática", "Acompanhamento", "Outro"] },
      { id: "q3", label: "Qual formato você quer priorizar?", type: "text" }
    ],
    generate: (a) => `Formato: ${a.q1 || "documentação e sessões"}. Facilita: ${a.q2 || "clareza e exemplo"}. Priorizar: ${a.q3 || "documentar os princípios e critérios"}.`
  },
  pessoas: {
    title: "Descobrir pessoas",
    subtitle: "Defina quem transmite e quem recebe.",
    questions: [
      { id: "q1", label: "Quem pode transmitir?", options: ["Só eu", "Mentorados", "Time", "Comunidade", "Outro"] },
      { id: "q2", label: "Quem precisa receber?", options: ["Novos mentorandos", "Time", "Comunidade", "Parceiros", "Outro"] },
      { id: "q3", label: "O que uma pessoa precisa para transmitir?", type: "text" }
    ],
    generate: (a) => `Transmite: ${a.q1 || "eu e alguns mentorados"}. Recebe: ${a.q2 || "novos mentorandos"}. Precisa: ${a.q3 || "entender os princípios e ter experiência"}.`
  },
  continuidade: {
    title: "Descobrir continuidade",
    subtitle: "Defina como a transmissão continua.",
    questions: [
      { id: "q1", label: "O que garante que a metodologia continua?", options: ["Documentação", "Pessoas", "Rituais", "Estrutura", "Outro"] },
      { id: "q2", label: "O que ameaça a continuidade?", options: ["Dependência de mim", "Falta de registro", "Perda de essência", "Dispersão", "Outro"] },
      { id: "q3", label: "Como a metodologia sobrevive sem você?", type: "text" }
    ],
    generate: (a) => `Garante: ${a.q1 || "documentação e pessoas"}. Ameaça: ${a.q2 || "dependência de mim"}. Sobrevive quando ${a.q3 || "está documentada e há pessoas que a sustentam"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """); }
function progress() { const fields = ["conteudo", "formato", "pessoas", "continuidade"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["conteudo", "formato", "pessoas", "continuidade"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "TRANSMISSÃO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Transmissão da Metodologia</h1><p class="sub">Conteúdo, formato, pessoas e continuidade.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="conteudo">Começar</button></div>`; } else if (view === "conteudo") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Conteúdo</h1><div class="field"><label>O que é transmitido</label><textarea id="f-conteudo">${esc(data.conteudo)}</textarea></div>${discoverBtn("conteudo")}<button class="btn" data-continue="conteudo">Salvar e Continuar</button>`; } else if (view === "formato") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Formato</h1><div class="field"><label>Como a metodologia é transmitida</label><textarea id="f-formato">${esc(data.formato)}</textarea></div>${discoverBtn("formato")}<button class="btn" data-continue="formato">Salvar e Continuar</button>`; } else if (view === "pessoas") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Pessoas</h1><div class="field"><label>Quem transmite e quem recebe</label><textarea id="f-pessoas">${esc(data.pessoas)}</textarea></div>${discoverBtn("pessoas")}<button class="btn" data-continue="pessoas">Salvar e Continuar</button>`; } else if (view === "continuidade") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Continuidade</h1><div class="field"><label>Como a transmissão continua</label><textarea id="f-continuidade">${esc(data.continuidade)}</textarea></div>${discoverBtn("continuidade")}<button class="btn" data-continue="continuidade">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "T")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
