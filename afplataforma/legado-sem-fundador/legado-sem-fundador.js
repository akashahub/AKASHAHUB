const COL = "afLegadoSemFundador";
let currentUser = null;
let data = { oque: "", nome: "", estrutura: "", transmissao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  oque: {
    title: "Descobrir o que continua",
    subtitle: "Defina o que continua funcionando sem você.",
    questions: [
      { id: "q1", label: "O que já continua sem você?", options: ["Alguns processos", "Nada", "Documentação", "Comunidade parcial", "Outro"] },
      { id: "q2", label: "O que precisa continuar?", options: ["Essência", "Processos", "Comunidade", "Metodologia", "Outro"] },
      { id: "q3", label: "O que só funciona com você hoje?", type: "text" }
    ],
    generate: (a) => `Já continua: ${a.q1 || "alguns processos"}. Precisa continuar: ${a.q2 || "essência e metodologia"}. Só comigo: ${a.q3 || "decisões estratégicas e nuances"}.`
  },
  nome: {
    title: "Descobrir nome e doutrina",
    subtitle: "Nomeie a comunidade, o movimento e a doutrina.",
    questions: [
      { id: "q1", label: "O que precisa de nome?", options: ["Comunidade", "Movimento", "Doutrina", "Metodologia", "Outro"] },
      { id: "q2", label: "O que o nome precisa comunicar?", options: ["Essência", "Continuidade", "Profundidade", "Legado", "Outro"] },
      { id: "q3", label: "Qual nome ou ideia faz sentido?", type: "text" }
    ],
    generate: (a) => `Nomear: ${a.q1 || "comunidade e doutrina"}. Comunicar: ${a.q2 || "essência e continuidade"}. Ideia: ${a.q3 || "algo que carregue a essência"}.`
  },
  estrutura: {
    title: "Descobrir estrutura",
    subtitle: "Defina a estrutura que permanece.",
    questions: [
      { id: "q1", label: "O que a estrutura precisa ter?", options: ["Processos", "Pessoas", "Documentação", "Rituais", "Outro"] },
      { id: "q2", label: "O que já existe?", options: ["Documentação", "Alguns processos", "Pessoas", "Nada", "Outro"] },
      { id: "q3", label: "Qual estrutura é prioritária?", type: "text" }
    ],
    generate: (a) => `Precisa ter: ${a.q1 || "processos e documentação"}. Já existe: ${a.q2 || "documentação parcial"}. Prioritária: ${a.q3 || "documentar o que só eu sei"}.`
  },
  transmissao: {
    title: "Descobrir transmissão",
    subtitle: "Defina como o legado é transmitido.",
    questions: [
      { id: "q1", label: "Como o legado é transmitido?", options: ["Documentação", "Pessoas", "Comunidade", "Sistemas", "Outro"] },
      { id: "q2", label: "Quem transmite?", options: ["Mentorados", "Time", "Comunidade", "Sistema", "Outro"] },
      { id: "q3", label: "O que garante que o legado continua?", type: "text" }
    ],
    generate: (a) => `Transmitido por ${a.q1 || "documentação e pessoas"}. Transmite: ${a.q2 || "mentorados e comunidade"}. Garante: ${a.q3 || "quando está documentado e as pessoas o vivem"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """); }
function progress() { const fields = ["oque", "nome", "estrutura", "transmissao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["oque", "nome", "estrutura", "transmissao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden");
  if (window.AfApoio) window.AfApoio.quizify(); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "LEGADO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Legado · Fase 05</div><h1 class="title">Legado sem o Fundador</h1><p class="sub">O que continua, nome, estrutura e transmissão.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="oque">Começar</button></div>`; } else if (view === "oque") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">O que continua</h1><div class="field"><label>O que continua funcionando sem você</label><textarea id="f-oque">${esc(data.oque)}</textarea></div>${discoverBtn("oque")}<button class="btn" data-continue="oque">Salvar e Continuar</button>`; } else if (view === "nome") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Nome e doutrina</h1><div class="field"><label>Nome da comunidade, movimento e doutrina</label><textarea id="f-nome">${esc(data.nome)}</textarea></div>${discoverBtn("nome")}<button class="btn" data-continue="nome">Salvar e Continuar</button>`; } else if (view === "estrutura") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Estrutura</h1><div class="field"><label>Estrutura que permanece</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>${discoverBtn("estrutura")}<button class="btn" data-continue="estrutura">Salvar e Continuar</button>`; } else if (view === "transmissao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Transmissão</h1><div class="field"><label>Como o legado é transmitido</label><textarea id="f-transmissao">${esc(data.transmissao)}</textarea></div>${discoverBtn("transmissao")}<button class="btn" data-continue="transmissao">Salvar e Finalizar</button>`; } }
const __afRender = render;
render = function () {
  __afRender();
  window.__AF = { data: data, discovery: (typeof DISCOVERY !== "undefined" ? DISCOVERY : null), user: (typeof currentUser !== "undefined" ? currentUser : null) };
  if (window.AfApoio) window.AfApoio.mount(window.__AF);
};
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "L")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
