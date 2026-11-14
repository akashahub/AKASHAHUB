const COL = "afProdutosDigitais";
let currentUser = null;
let data = { catalogo: "", ofertas: "", entrega: "", monetizacao: "" };
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
  const STEPS = ["catalogo", "ofertas", "entrega", "monetizacao"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PRODUTOS DIGITAIS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Produtos Digitais</h1>
      <p class="sub">Cursos, e-books, comunidades e assinaturas alinhados à sua essência.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="catalogo">Começar</button></div>`;
  } else if (view === "catalogo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Catálogo</h1>
      <div class="field"><label>Quais produtos digitais você oferece ou pretende oferecer?</label><textarea id="f-catalogo">${esc(data.catalogo)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>AF Plataforma, Dossiê de Essência, comunidades seletivas e conteúdos de autoridade.</p></div>
      <button class="btn" data-continue="catalogo">Salvar e Continuar</button>`;
  } else if (view === "ofertas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Ofertas</h1>
      <div class="field"><label>Como estruturar as ofertas?</label><textarea id="f-ofertas">${esc(data.ofertas)}</textarea></div>
      <button class="btn" data-continue="ofertas">Salvar e Continuar</button>`;
  } else if (view === "entrega") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Entrega e experiência</h1>
      <div class="field"><label>Como é a experiência de entrega?</label><textarea id="f-entrega">${esc(data.entrega)}</textarea></div>
      <button class="btn" data-continue="entrega">Salvar e Continuar</button>`;
  } else if (view === "monetizacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Monetização</h1>
      <div class="field"><label>Modelo de monetização</label><textarea id="f-monetizacao">${esc(data.monetizacao)}</textarea></div>
      <button class="btn" data-continue="monetizacao">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "P")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
