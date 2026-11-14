const COL = "afSustentabilidadeOfertas";
let currentUser = null;
let data = { avaliacao: "", margem: "", ajustes: "", criterios: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  avaliacao: {
    title: "Descobrir avaliação",
    subtitle: "Defina como avaliar a sustentabilidade de uma oferta.",
    questions: [
      { id: "q1", label: "O que você avalia primeiro?", options: ["Margem", "Demanda", "Custo de entrega", "Alinhamento", "Outro"] },
      { id: "q2", label: "Quando uma oferta é sustentável?", options: ["Gera caixa", "Tem margem", "Não desgasta", "Tem recorrência", "Outro"] },
      { id: "q3", label: "O que te faz questionar uma oferta?", type: "text" }
    ],
    generate: (a) => `Avalio primeiro: ${a.q1 || "margem e demanda"}. Sustentável quando ${a.q2 || "gera caixa com margem e sem desgastar"}. Questiono quando ${a.q3 || "o esforço não se paga ou a margem some"}.`
  },
  margem: {
    title: "Descobrir margem real",
    subtitle: "Defina como enxergar a margem real.",
    questions: [
      { id: "q1", label: "Como você calcula a margem real?", options: ["Receita - custos diretos", "Receita - todos os custos", "Por entrega", "Não calculo", "Outro"] },
      { id: "q2", label: "O que mais reduz a margem?", options: ["Tempo não previsto", "Ferramentas", "Impostos", "Comissões", "Outro"] },
      { id: "q3", label: "Qual margem mínima você aceita?", type: "text" }
    ],
    generate: (a) => `Calculo: ${a.q1 || "receita menos custos diretos e tempo"}. Reduz margem: ${a.q2 || "tempo não previsto"}. Mínima aceita: ${a.q3 || "acima de 40% depois de todos os custos"}.`
  },
  ajustes: {
    title: "Descobrir ajustes",
    subtitle: "Defina como ajustar ofertas que não são sustentáveis.",
    questions: [
      { id: "q1", label: "O que você ajusta primeiro?", options: ["Preço", "Entrega", "Público", "Escopo", "Outro"] },
      { id: "q2", label: "Quando você descontinua uma oferta?", options: ["Margem baixa", "Demanda baixa", "Desgasta", "Não alinha", "Outro"] },
      { id: "q3", label: "Qual ajuste teve mais impacto?", type: "text" }
    ],
    generate: (a) => `Ajusto primeiro: ${a.q1 || "preço ou escopo"}. Descontinuo quando ${a.q2 || "margem baixa e desgasta"}. Impacto maior: ${a.q3 || "aumentar preço e reduzir escopo não essencial"}.`
  },
  criterios: {
    title: "Descobrir critérios",
    subtitle: "Defina critérios para manter ou criar ofertas.",
    questions: [
      { id: "q1", label: "Quais critérios são inegociáveis?", options: ["Margem mínima", "Alinhamento", "Sustentabilidade do tempo", "Demanda real", "Outro"] },
      { id: "q2", label: "O que você não aceita mais?", options: ["Oferta sem margem", "Entrega que desgasta", "Preço baixo demais", "Público desalinhado", "Outro"] },
      { id: "q3", label: "Como esses critérios protegem o ecossistema?", type: "text" }
    ],
    generate: (a) => `Inegociáveis: ${a.q1 || "margem e alinhamento"}. Não aceito: ${a.q2 || "oferta sem margem ou que desgasta"}. Protegem porque ${a.q3 || "evitam que o caixa e a energia sejam drenados"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["avaliacao", "margem", "ajustes", "criterios"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["avaliacao", "margem", "ajustes", "criterios"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "SUSTENTABILIDADE / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Sustentabilidade das Ofertas</h1><p class="sub">Avaliação, margem real, ajustes e critérios.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="avaliacao">Começar</button></div>`; } else if (view === "avaliacao") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Avaliação</h1><div class="field"><label>Como avaliar sustentabilidade</label><textarea id="f-avaliacao">${esc(data.avaliacao)}</textarea></div>${discoverBtn("avaliacao")}<button class="btn" data-continue="avaliacao">Salvar e Continuar</button>`; } else if (view === "margem") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Margem real</h1><div class="field"><label>Como enxergar a margem real</label><textarea id="f-margem">${esc(data.margem)}</textarea></div>${discoverBtn("margem")}<button class="btn" data-continue="margem">Salvar e Continuar</button>`; } else if (view === "ajustes") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Ajustes</h1><div class="field"><label>Como ajustar ofertas</label><textarea id="f-ajustes">${esc(data.ajustes)}</textarea></div>${discoverBtn("ajustes")}<button class="btn" data-continue="ajustes">Salvar e Continuar</button>`; } else if (view === "criterios") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Critérios</h1><div class="field"><label>Critérios para manter ou criar ofertas</label><textarea id="f-criterios">${esc(data.criterios)}</textarea></div>${discoverBtn("criterios")}<button class="btn" data-continue="criterios">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "S")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
