const COL = "afDivulgacao";
let currentUser = null;
let data = { presenca: "", organico: "", pago: "", revisao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  presenca: {
    title: "Descobrir presença",
    subtitle: "Defina onde o projeto aparece.",
    questions: [
      { id: "q1", label: "Onde o projeto aparece hoje?", options: ["Instagram", "LinkedIn", "YouTube", "Site", "Newsletter", "Outro"] },
      { id: "q2", label: "Onde faz mais sentido aparecer?", options: ["LinkedIn", "Instagram", "YouTube", "Site", "Comunidade", "Outro"] },
      { id: "q3", label: "O que a presença precisa comunicar?", type: "text" }
    ],
    generate: (a) => `Aparece em ${a.q1 || "Instagram e site"}. Faz sentido: ${a.q2 || "LinkedIn e site"}. Comunica: ${a.q3 || "clareza e autoridade"}.`
  },
  organico: {
    title: "Descobrir orgânico",
    subtitle: "Defina a divulgação orgânica.",
    questions: [
      { id: "q1", label: "O que você publica organicamente?", options: ["Conteúdo de autoridade", "Bastidores", "Ofertas", "Histórias", "Outro"] },
      { id: "q2", label: "Qual frequência faz sentido?", options: ["Diário", "3x semana", "Semanal", "Quando faz sentido", "Outro"] },
      { id: "q3", label: "O que o orgânico precisa gerar?", type: "text" }
    ],
    generate: (a) => `Publico: ${a.q1 || "conteúdo de autoridade"}. Frequência: ${a.q2 || "3x semana"}. Gera: ${a.q3 || "confiança e conversas qualificadas"}.`
  },
  pago: {
    title: "Descobrir pago",
    subtitle: "Defina o tráfego pago.",
    questions: [
      { id: "q1", label: "Quando faz sentido usar pago?", options: ["Para escalar o que funciona", "Para testar", "Para lançamento", "Não uso", "Outro"] },
      { id: "q2", label: "O que você não faz no pago?", options: ["Prometer o que não entrega", "Gastar sem teste", "Ignorar orgânico", "Forçar volume", "Outro"] },
      { id: "q3", label: "Como o pago se conecta ao orgânico?", type: "text" }
    ],
    generate: (a) => `Uso pago ${a.q1 || "para escalar o que funciona"}. Não faço: ${a.q2 || "prometer o que não entrega"}. Conecta: ${a.q3 || "o pago amplifica o que o orgânico já valida"}.`
  },
  revisao: {
    title: "Descobrir revisão",
    subtitle: "Defina como revisar o que foi publicado.",
    questions: [
      { id: "q1", label: "O que você revisa?", options: ["O que foi publicado", "Engajamento", "Conversas geradas", "Conversão", "Outro"] },
      { id: "q2", label: "Com que frequência?", options: ["Semanal", "Mensal", "Após publicação", "Trimestral", "Outro"] },
      { id: "q3", label: "O que a revisão te permite ajustar?", type: "text" }
    ],
    generate: (a) => `Reviso: ${a.q1 || "o que foi publicado e o engajamento"}. Frequência: ${a.q2 || "semanal"}. Permite: ${a.q3 || "ajustar o que não gera conversa ou confiança"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["presenca", "organico", "pago", "revisao"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["presenca", "organico", "pago", "revisao"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "DIVULGAÇÃO / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Divulgação e Presença</h1><p class="sub">Presença, orgânico, pago e revisão.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="presenca">Começar</button></div>`; } else if (view === "presenca") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Presença</h1><div class="field"><label>Onde o projeto aparece</label><textarea id="f-presenca">${esc(data.presenca)}</textarea></div>${discoverBtn("presenca")}<button class="btn" data-continue="presenca">Salvar e Continuar</button>`; } else if (view === "organico") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Orgânico</h1><div class="field"><label>Divulgação orgânica</label><textarea id="f-organico">${esc(data.organico)}</textarea></div>${discoverBtn("organico")}<button class="btn" data-continue="organico">Salvar e Continuar</button>`; } else if (view === "pago") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Pago</h1><div class="field"><label>Tráfego pago</label><textarea id="f-pago">${esc(data.pago)}</textarea></div>${discoverBtn("pago")}<button class="btn" data-continue="pago">Salvar e Continuar</button>`; } else if (view === "revisao") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Revisão</h1><div class="field"><label>Como revisar o que foi publicado</label><textarea id="f-revisao">${esc(data.revisao)}</textarea></div>${discoverBtn("revisao")}<button class="btn" data-continue="revisao">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "D")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
