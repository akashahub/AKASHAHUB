const COL = "afDependenciasFundador";
let currentUser = null;
let data = { mapeamento: "", prioridades: "", transferencia: "", plano: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  mapeamento: {
    title: "Descobrir mapeamento",
    subtitle: "Identifique o que depende diretamente de você.",
    questions: [
      { id: "q1", label: "Quais áreas dependem mais de você?", options: ["Vendas", "Entrega", "Conteúdo", "Decisões estratégicas", "Relacionamento", "Outro"] },
      { id: "q2", label: "O que acontece se você se afastar por uma semana?", options: ["Tudo para", "Atraso grande", "Funciona parcialmente", "Funciona bem", "Outro"] },
      { id: "q3", label: "Qual dependência mais limita o crescimento?", type: "text" }
    ],
    generate: (a) => `Áreas: ${a.q1 || "vendas e entrega"}. Se afastar: ${a.q2 || "atraso grande"}. Limita: ${a.q3 || "tudo passar por mim antes de avançar"}.`
  },
  prioridades: {
    title: "Descobrir prioridades",
    subtitle: "Defina o que transferir primeiro.",
    questions: [
      { id: "q1", label: "O que você quer transferir primeiro?", options: ["Tarefas operacionais", "Atendimento", "Criação de conteúdo", "Follow-up", "Outro"] },
      { id: "q2", label: "O que você não quer transferir ainda?", options: ["Decisões estratégicas", "Relacionamento chave", "Fechamento", "Visão", "Outro"] },
      { id: "q3", label: "Qual transferência liberaria mais tempo?", type: "text" }
    ],
    generate: (a) => `Transferir primeiro: ${a.q1 || "tarefas operacionais"}. Não transferir: ${a.q2 || "decisões estratégicas"}. Liberaria tempo: ${a.q3 || "follow-up e criação de rascunhos"}.`
  },
  transferencia: {
    title: "Descobrir transferência",
    subtitle: "Defina como transferir responsabilidades.",
    questions: [
      { id: "q1", label: "Como você prefere transferir?", options: ["Documentar e treinar", "Automatizar", "Delegar com check", "Contratar", "Outro"] },
      { id: "q2", label: "O que precisa estar claro para transferir?", options: ["Processo", "Critérios", "Resultado esperado", "Limites", "Outro"] },
      { id: "q3", label: "O que te impede de transferir hoje?", type: "text" }
    ],
    generate: (a) => `Prefiro ${a.q1 || "documentar e treinar"}. Precisa estar claro: ${a.q2 || "processo e critérios"}. Impede: ${a.q3 || "falta de processo escrito"}.`
  },
  plano: {
    title: "Descobrir plano",
    subtitle: "Defina o plano de redução de dependência.",
    questions: [
      { id: "q1", label: "Qual horizonte faz sentido?", options: ["30 dias", "90 dias", "6 meses", "12 meses", "Outro"] },
      { id: "q2", label: "Qual é o primeiro passo concreto?", options: ["Mapear tarefas", "Escrever um processo", "Treinar alguém", "Automatizar", "Outro"] },
      { id: "q3", label: "Como você vai saber que a dependência diminuiu?", type: "text" }
    ],
    generate: (a) => `Horizonte: ${a.q1 || "90 dias"}. Primeiro passo: ${a.q2 || "mapear e escrever um processo"}. Saberei quando ${a.q3 || "a operação avançar sem eu estar em todas as etapas"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["mapeamento", "prioridades", "transferencia", "plano"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["mapeamento", "prioridades", "transferencia", "plano"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;
function openDiscovery(field) { const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field; document.getElementById("modalTitle").textContent = cfg.title; document.getElementById("modalSubtitle").textContent = cfg.subtitle; const qEl = document.getElementById("modalQuestions"); qEl.innerHTML = cfg.questions.map(q => { if (q.options) { const multi = q.multi ? ' data-multi="1"' : ''; return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`; } return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`; }).join(""); qEl.querySelectorAll(".options").forEach(box => { const multi = box.dataset.multi; box.querySelectorAll(".opt").forEach(btn => { btn.onclick = () => { if (multi) btn.classList.toggle("selected"); else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); } }; }); }); document.getElementById("modalResult").classList.add("hidden"); document.getElementById("discoveryForm").classList.remove("hidden"); document.getElementById("discoveryModal").classList.remove("hidden"); }
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) { const answers = {}; cfg.questions.forEach(q => { if (q.options) { const box = document.querySelector(`.options[data-qid="${q.id}"]`); if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value); else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; } } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; } }); return answers; }
function bind() { const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); }); const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); }); document.addEventListener("click", e => { const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; } const cont = e.target.closest("[data-continue]"); if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; } const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover); }); document.getElementById("modalClose").onclick = closeModal; document.getElementById("modalCancel").onclick = closeModal; document.querySelector(".modal-backdrop").onclick = closeModal; document.getElementById("discoveryForm").onsubmit = (e) => { e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return; const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers); document.getElementById("suggestionText").textContent = suggestion; document.getElementById("discoveryForm").classList.add("hidden"); document.getElementById("modalResult").classList.remove("hidden"); }; document.getElementById("useSuggestion").onclick = () => { const text = document.getElementById("suggestionText").textContent; if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); } closeModal(); render(); }; }
async function saveData() { if (!currentUser || !db) { toast("Faça login para salvar."); return; } try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); } render(); }
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() { const p = progress(); const content = document.getElementById("content"); if (!content) return; const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "DEPENDÊNCIAS / " + view.toUpperCase(); const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : ""; if (view === "dashboard") { content.innerHTML = notice + `<div class="eyebrow">Expansão · Fase 04</div><h1 class="title">Dependências do Fundador</h1><p class="sub">Mapeie o que depende de você e planeje a transferência.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="mapeamento">Começar</button></div>`; } else if (view === "mapeamento") { content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Mapeamento</h1><div class="field"><label>O que depende diretamente de você</label><textarea id="f-mapeamento">${esc(data.mapeamento)}</textarea></div>${discoverBtn("mapeamento")}<button class="btn" data-continue="mapeamento">Salvar e Continuar</button>`; } else if (view === "prioridades") { content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Prioridades</h1><div class="field"><label>O que transferir primeiro</label><textarea id="f-prioridades">${esc(data.prioridades)}</textarea></div>${discoverBtn("prioridades")}<button class="btn" data-continue="prioridades">Salvar e Continuar</button>`; } else if (view === "transferencia") { content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Transferência</h1><div class="field"><label>Como transferir responsabilidades</label><textarea id="f-transferencia">${esc(data.transferencia)}</textarea></div>${discoverBtn("transferencia")}<button class="btn" data-continue="transferencia">Salvar e Continuar</button>`; } else if (view === "plano") { content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Plano</h1><div class="field"><label>Plano de redução de dependência</label><textarea id="f-plano">${esc(data.plano)}</textarea></div>${discoverBtn("plano")}<button class="btn" data-continue="plano">Salvar e Finalizar</button>`; } }
bind(); render();
(async () => { try { const configMod = await import("../firebase/firebase-config.js"); auth = configMod.auth; db = configMod.db; const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "D")[0].toUpperCase(); } render(); }); } catch (e) { console.warn("Firebase opcional falhou:", e); } })();
