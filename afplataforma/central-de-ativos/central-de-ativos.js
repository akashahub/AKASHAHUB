const COL = "afCentralAtivos";
let currentUser = null;
let data = { inventario: "", organizacao: "", integracao: "", evolucao: "" };
let view = "dashboard";
let db = null;
let auth = null;

function toast(msg) {
  const el = document.getElementById("toast"); if (!el) return;
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) {
  if (!s) return "";
  return String(s).replace(/</g, "<").replace(/>/g, ">");
}
function progress() {
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 10).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["inventario", "organizacao", "integracao", "evolucao"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar"); if (side) side.classList.remove("open");
  render();
}
window.setView = setView;
function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
    }
  });
}
async function saveData() {
  if (!currentUser || !db) { toast("Faça login para salvar."); return; }
  try {
    const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
    toast("Salvo com sucesso.");
  } catch { toast("Erro ao salvar."); }
  render();
}
function render() {
  const p = progress();
  const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CENTRAL DE ATIVOS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Central de Ativos</h1>
      <p class="sub">Organize e integre todos os seus ativos digitais em um sistema coerente.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="inventario">Começar</button></div>`;
  } else if (view === "inventario") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Inventário</h1>
      <div class="field"><label>Quais ativos digitais você já tem?</label><textarea id="f-inventario">${esc(data.inventario)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Site institucional, AF Plataforma (todos os apps das fases), conteúdos de autoridade, funis de captação, CRM, agentes de IA, e produtos digitais. Cada ativo serve a uma função específica no ecossistema.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste os ativos digitais que você já possui ou está construindo.</p></div>
      <button class="btn" data-continue="inventario">Salvar e Continuar</button>`;
  } else if (view === "organizacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Organização</h1>
      <div class="field"><label>Como organizar esses ativos?</label><textarea id="f-organizacao">${esc(data.organizacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Organização por fase da Arquitetura de Legado. Cada ativo serve a uma etapa específica e se conecta ao ecossistema. Evito ativos isolados que não se conversam.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você organiza e categoriza seus ativos digitais?</p></div>
      <button class="btn" data-continue="organizacao">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Integração</h1>
      <div class="field"><label>Como integrar os ativos?</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Firebase como backbone, links entre apps, mentor view unificada, e dados que fluem entre as fases. Integração que permite que o mentorando e o mentor tenham visão clara do progresso.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como seus ativos se integram e conversam entre si?</p></div>
      <button class="btn" data-continue="integracao">Salvar e Continuar</button>`;
  } else if (view === "evolucao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Evolução</h1>
      <div class="field"><label>Como os ativos vão evoluir?</label><textarea id="f-evolucao">${esc(data.evolucao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Novas fases (Financeiro, Expansão, Legado), novos apps, e aprofundamento contínuo da plataforma com base no uso real dos mentorandos. Evolução guiada por feedback e necessidade real, não por hype.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você pretende evoluir seus ativos digitais nos próximos meses ou anos?</p></div>
      <button class="btn" data-continue="evolucao">Salvar e Finalizar</button>`;
  }
}

bind();
render();

(async () => {
  try {
    const configMod = await import("../firebase/firebase-config.js");
    auth = configMod.auth;
    db = configMod.db;
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    onAuthStateChanged(auth, user => {
      currentUser = user || null;
      if (user) {
        const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
        if (pill) pill.textContent = user.email || "Mentorando";
        if (av) av.textContent = (user.email || "A")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
