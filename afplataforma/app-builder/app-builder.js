const COL = "afAppBuilder";
let currentUser = null;
let data = { problema: "", solucao: "", funcionalidades: "", arquitetura: "", roadmap: "" };
let view = "dashboard";
let db = null;
let auth = null;

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) {
  if (!s) return "";
  return String(s).replace(/</g, "<").replace(/>/g, ">");
}
function progress() {
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["problema", "solucao", "funcionalidades", "arquitetura", "roadmap"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar");
  if (side) side.classList.remove("open");
  render();
}
window.setView = setView;
function bind() {
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
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
  const content = document.getElementById("content");
  if (!content) return;
  const crumb = document.getElementById("breadcrumb");
  if (crumb) crumb.textContent = "APP BUILDER / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">App Builder</h1>
      <p class="sub">Planeje aplicativos e plataformas que amplificam sua essência.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><h3>Próximo passo</h3><button class="btn" data-goto="problema">Começar</button></div>`;
  } else if (view === "problema") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Problema e usuário</h1>
      <div class="field"><label>Qual problema resolve e para quem?</label><textarea id="f-problema">${esc(data.problema)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>A AF Plataforma resolve a fragmentação de ferramentas de autoconhecimento e posicionamento.</p></div>
      <button class="btn" data-continue="problema">Salvar e Continuar</button>`;
  } else if (view === "solucao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Solução e valor</h1>
      <div class="field"><label>Como o app resolve e qual valor entrega?</label><textarea id="f-solucao">${esc(data.solucao)}</textarea></div>
      <button class="btn" data-continue="solucao">Salvar e Continuar</button>`;
  } else if (view === "funcionalidades") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Funcionalidades</h1>
      <div class="field"><label>Principais funcionalidades (MVP)</label><textarea id="f-funcionalidades">${esc(data.funcionalidades)}</textarea></div>
      <button class="btn" data-continue="funcionalidades">Salvar e Continuar</button>`;
  } else if (view === "arquitetura") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Arquitetura</h1>
      <div class="field"><label>Decisões de arquitetura</label><textarea id="f-arquitetura">${esc(data.arquitetura)}</textarea></div>
      <button class="btn" data-continue="arquitetura">Salvar e Continuar</button>`;
  } else if (view === "roadmap") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 5</div><h1 class="title">Roadmap</h1>
      <div class="field"><label>Próximos passos e fases</label><textarea id="f-roadmap">${esc(data.roadmap)}</textarea></div>
      <button class="btn" data-continue="roadmap">Salvar e Finalizar</button>`;
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
        const pill = document.getElementById("userPill");
        const av = document.getElementById("avatar");
        if (pill) pill.textContent = user.email || "Mentorando";
        if (av) av.textContent = (user.email || "A")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
