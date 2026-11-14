const COL = "afAcompanhamentoResultados";
let currentUser = null;
let data = { indicadores: "", revisao: "", ajustes: "", estrategia: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  indicadores: {
    title: "Descobrir indicadores de resultados",
    subtitle: "Defina o que você acompanha.",
    questions: [
      { id: "q1", label: "Quais resultados você acompanha?", options: ["Receita", "Margem", "Caixa", "Conversão", "Retenção", "Outro"] },
      { id: "q2", label: "Com que frequência?", options: ["Semanal", "Mensal", "Trimestral", "Quando faz sentido", "Outro"] },
      { id: "q3", label: "O que esses resultados te dizem?", type: "text" }
    ],
    generate: (a) => `Acompanho: ${a.q1 || "receita, margem e caixa"}. Frequência: ${a.q2 || "mensal"}. Dizem: ${a.q3 || "se a estratégia está gerando o caixa esperado"}.`
  },
  revisao: {
    title: "Descobrir revisão",
    subtitle: "Defina como revisar os resultados.",
    questions: [
      { id: "q1", label: "Quando você revisa?", options: ["Todo mês", "Todo trimestre", "Quando o resultado muda", "No início do ciclo", "Outro"] },
      { id: "q2", label: "O que você compara?", options: ["Meta vs realizado", "Mês anterior", "Projeção", "Oferta por oferta", "Outro"] },
      { id: "q3", label: "O que a revisão te permite enxergar?", type: "text" }
    ],
    generate: (a) => `Reviso ${a.q1 || "mensalmente"}. Comparo ${a.q2 || "meta vs realizado"}. Enxergo: ${a.q3 || "o que está funcionando e o que precisa de ajuste"}.`
  },
  ajustes: {
    title: "Descobrir ajustes",
    subtitle: "Defina como ajustar com base nos resultados.",
    questions: [
      { id: "q1", label: "O que você ajusta quando o resultado não vem?", options: ["Oferta", "Preço", "Processo comercial", "Custos", "Outro"] },
      { id: "q2", label: "O que você não muda de imediato?", options: ["Essência", "Posicionamento central", "Preço mínimo", "Critérios", "Outro"] },
      { id: "q3", label: "Qual ajuste recente teve efeito?", type: "text" }
    ],
    generate: (a) => `Ajusto: ${a.q1 || "oferta ou processo"}. Não mudo: ${a.q2 || "essência e preço mínimo"}. Efeito: ${a.q3 || "ajuste de preço melhorou a margem sem perder conversão"}.`
  },
  estrategia: {
    title: "Descobrir estratégia",
    subtitle: "Defina como os resultados revisam a estratégia.",
    questions: [
      { id: "q1", label: "Como os resultados influenciam a estratégia?", options: ["Priorizam ofertas", "Definem investimentos", "Ajustam metas", "Pausam o que não funciona", "Outro"] },
      { id: "q2", label: "O que a estratégia precisa considerar?", options: ["Caixa", "Margem", "Capacidade", "Alinhamento", "Outro"] },
      { id: "q3", label: "O que a revisão estratégica permite?", type: "text" }
    ],
    generate: (a) => `Influenciam: ${a.q1 || "priorizam ofertas e investimentos"}. Considera: ${a.q2 || "caixa e margem"}. Permite: ${a.q3 || "concentrar energia no que gera resultado sustentável"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["indicadores", "revisao", "ajustes", "estrategia"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["indicadores", "revisao", "ajustes", "estrategia"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "RESULTADOS / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Acompanhamento de Resultados</h1><p class="sub">Indicadores, revisão, ajustes e estratégia.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="indicadores">Começar</button></div>`; } else if (view === "indicadores") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Indicadores</h1><div class="field"><label>O que você acompanha</label><textarea id="f-indicadores">${esc(data.indicadores)}</textarea></div>${discoverBtn("indicadores")}<button class="btn" data-continue="indicadores">Salvar e Continuar</button>`; } else if (view === "revisao") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Revisão</h1><div class="field"><label>Como revisar os resultados</label><textarea id="f-revisao">${esc(data.revisao)}</textarea></div>${discoverBtn("revisao")}<button class="btn" data-continue="revisao">Salvar e Continuar</button>`; } else if (view === "ajustes") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Ajustes</h1><div class="field"><label>Como ajustar com base nos resultados</label><textarea id="f-ajustes">${esc(data.ajustes)}</textarea></div>${discoverBtn("ajustes")}<button class="btn" data-continue="ajustes">Salvar e Continuar</button>`; } else if (view === "estrategia") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Estratégia</h1><div class="field"><label>Como os resultados revisam a estratégia</label><textarea id="f-estrategia">${esc(data.estrategia)}</textarea></div>${discoverBtn("estrategia")}<button class="btn" data-continue="estrategia">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "R")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
