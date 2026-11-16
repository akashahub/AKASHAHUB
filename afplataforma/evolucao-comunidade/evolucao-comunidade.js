const COL = "afEvolucaoComunidade";
let currentUser = null;
let data = { direcao: "", ritmo: "", indicadores: "", ajustes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  direcao: {
    title: "Descobrir direção",
    subtitle: "Defina a direção da evolução.",
    questions: [
      { id: "q1", label: "Para onde a comunidade evolui?", options: ["Mais profundidade", "Mais autonomia", "Mais pessoas", "Mais estrutura", "Outro"] },
      { id: "q2", label: "O que não pode se perder na evolução?", options: ["Essência", "Profundidade", "Continuidade", "Autenticidade", "Outro"] },
      { id: "q3", label: "Qual evolução é prioritária?", type: "text" }
    ],
    generate: (a) => `Evolui para ${a.q1 || "mais profundidade e autonomia"}. Não perder: ${a.q2 || "essência"}. Prioritária: ${a.q3 || "mais autonomia sem perder profundidade"}.`
  },
  ritmo: {
    title: "Descobrir ritmo",
    subtitle: "Defina o ritmo de evolução.",
    questions: [
      { id: "q1", label: "Qual ritmo faz sentido?", options: ["Lento e profundo", "Gradual", "Por ciclos", "Quando faz sentido", "Outro"] },
      { id: "q2", label: "O que acelera demais?", options: ["Crescimento rápido", "Muitas pessoas", "Muitos temas", "Pressão externa", "Outro"] },
      { id: "q3", label: "Como o ritmo protege a essência?", type: "text" }
    ],
    generate: (a) => `Ritmo: ${a.q1 || "lento e profundo"}. Acelera demais: ${a.q2 || "crescimento rápido"}. Protege porque ${a.q3 || "permite profundidade e ajuste"}.`
  },
  indicadores: {
    title: "Descobrir indicadores",
    subtitle: "Defina como saber se a evolução está saudável.",
    questions: [
      { id: "q1", label: "Quais indicadores importam?", options: ["Profundidade", "Continuidade", "Autonomia", "Engajamento real", "Outro"] },
      { id: "q2", label: "O que indica que está saudável?", options: ["Pessoas voltam", "Profundidade aumenta", "Menos dependência", "Mais contribuição", "Outro"] },
      { id: "q3", label: "Como você mede a evolução?", type: "text" }
    ],
    generate: (a) => `Indicadores: ${a.q1 || "profundidade e continuidade"}. Saudável quando ${a.q2 || "pessoas voltam e contribuem"}. Medo: ${a.q3 || "pela qualidade das conversas e pela autonomia"}.`
  },
  ajustes: {
    title: "Descobrir ajustes",
    subtitle: "Defina como ajustar a evolução.",
    questions: [
      { id: "q1", label: "Quando você ajusta?", options: ["Revisão periódica", "Quando sente dispersão", "Feedback", "Mudança de fase", "Outro"] },
      { id: "q2", label: "O que pode ser ajustado?", options: ["Ritmo", "Estrutura", "Temas", "Participação", "Outro"] },
      { id: "q3", label: "O que você nunca ajusta?", type: "text" }
    ],
    generate: (a) => `Ajusto ${a.q1 || "em revisão periódica"}. Pode ajustar: ${a.q2 || "ritmo e estrutura"}. Nunca ajusto: ${a.q3 || "a essência e os princípios"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;") }
function progress() { const fields = ["direcao", "ritmo", "indicadores", "ajustes"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["direcao", "ritmo", "indicadores", "ajustes"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } if (window.AkashaSubject && window.AkashaSubject.writingLocked(currentUser)) { toast("Você está vendo as respostas desta pessoa. Só ela pode salvar."); return; }  try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, (window.AkashaSubject ? window.AkashaSubject.uidFor(currentUser) : currentUser.uid)), { ...data, updatedAt: serverTimestamp(), uid: (window.AkashaSubject ? window.AkashaSubject.uidFor(currentUser) : currentUser.uid) }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "EVOLUÇÃO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Evolução da Comunidade</h1><p class="sub">Direção, ritmo, indicadores e ajustes.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="direcao">Começar</button></div>`; } else if (view === "direcao") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Direção</h1><div class="field"><label>Direção da evolução</label><textarea id="f-direcao">${esc(data.direcao)}</textarea></div>${discoverBtn("direcao")}<button class="btn" data-continue="direcao">Salvar e Continuar</button>`; } else if (view === "ritmo") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Ritmo</h1><div class="field"><label>Ritmo de evolução</label><textarea id="f-ritmo">${esc(data.ritmo)}</textarea></div>${discoverBtn("ritmo")}<button class="btn" data-continue="ritmo">Salvar e Continuar</button>`; } else if (view === "indicadores") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Indicadores</h1><div class="field"><label>Como saber se está saudável</label><textarea id="f-indicadores">${esc(data.indicadores)}</textarea></div>${discoverBtn("indicadores")}<button class="btn" data-continue="indicadores">Salvar e Continuar</button>`; } else if (view === "ajustes") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Ajustes</h1><div class="field"><label>Como ajustar a evolução</label><textarea id="f-ajustes">${esc(data.ajustes)}</textarea></div>${discoverBtn("ajustes")}<button class="btn" data-continue="ajustes">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user && db && window.AkashaSubject) window.AkashaSubject.hydrate(db, COL, user, data).then(function () { if (typeof render === "function") render(); }).catch(function (e) { console.warn("[AF contexto]", e); }); if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "E")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
