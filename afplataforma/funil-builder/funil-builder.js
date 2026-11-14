const COL = "afFunilBuilder";
let currentUser = null;
let data = { publico: "", oferta: "", etapas: "", paginas: "", metricas: "" };
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
  const STEPS = ["publico", "oferta", "etapas", "paginas", "metricas"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "FUNIL BUILDER / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Funil Builder</h1>
      <p class="sub">Estruture funis de captação e conversão alinhados à sua essência.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="publico">Começar</button></div>`;
  } else if (view === "publico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Público e dor</h1>
      <div class="field"><label>Quem é o público e qual a dor principal?</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Empresários e profissionais de alto potencial que consomem muito conteúdo de transformação mas não constroem legado real.</p></div>
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "oferta") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Oferta e promessa</h1>
      <div class="field"><label>Qual a oferta e a promessa clara?</label><textarea id="f-oferta">${esc(data.oferta)}</textarea></div>
      <button class="btn" data-continue="oferta">Salvar e Continuar</button>`;
  } else if (view === "etapas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Etapas do funil</h1>
      <div class="field"><label>Etapas (awareness → consideração → conversão)</label><textarea id="f-etapas">${esc(data.etapas)}</textarea></div>
      <button class="btn" data-continue="etapas">Salvar e Continuar</button>`;
  } else if (view === "paginas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Páginas e criativos</h1>
      <div class="field"><label>Páginas necessárias e tipo de criativos</label><textarea id="f-paginas">${esc(data.paginas)}</textarea></div>
      <button class="btn" data-continue="paginas">Salvar e Continuar</button>`;
  } else if (view === "metricas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 5</div><h1 class="title">Métricas</h1>
      <div class="field"><label>Quais métricas importam?</label><textarea id="f-metricas">${esc(data.metricas)}</textarea></div>
      <button class="btn" data-continue="metricas">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "F")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
