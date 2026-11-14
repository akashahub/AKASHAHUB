const COL = "afIaStudio";
let currentUser = null;
let data = { agentes: "", prompts: "", automacoes: "", casos: "" };
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
  const STEPS = ["agentes", "prompts", "automacoes", "casos"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "IA STUDIO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">IA Studio</h1>
      <p class="sub">Agentes, prompts e automações a serviço da sua essência e do legado.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="agentes">Começar</button></div>`;
  } else if (view === "agentes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Agentes</h1>
      <div class="field"><label>Quais agentes fazem sentido para você?</label><textarea id="f-agentes">${esc(data.agentes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Agente de reflexão de essência, agente de geração de conteúdo alinhado à identidade.</p></div>
      <button class="btn" data-continue="agentes">Salvar e Continuar</button>`;
  } else if (view === "prompts") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Prompts</h1>
      <div class="field"><label>Prompts e sistemas de prompt</label><textarea id="f-prompts">${esc(data.prompts)}</textarea></div>
      <button class="btn" data-continue="prompts">Salvar e Continuar</button>`;
  } else if (view === "automacoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Automações</h1>
      <div class="field"><label>Automações com IA</label><textarea id="f-automacoes">${esc(data.automacoes)}</textarea></div>
      <button class="btn" data-continue="automacoes">Salvar e Continuar</button>`;
  } else if (view === "casos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Casos de uso</h1>
      <div class="field"><label>Casos de uso prioritários</label><textarea id="f-casos">${esc(data.casos)}</textarea></div>
      <button class="btn" data-continue="casos">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "I")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
