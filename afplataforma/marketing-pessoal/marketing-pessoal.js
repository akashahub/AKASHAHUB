const COL = "afMarketingPessoal";
let currentUser = null;
let data = { narrativa: "", publico: "", canais: "", acoes: "", observacoes: "" };
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
  const fields = ["narrativa", "publico", "canais", "acoes"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["narrativa", "publico", "canais", "acoes"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "plano" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "MARKETING / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Marketing Pessoal OS</div>
      <h1 class="title">Seu marketing</h1>
      <p class="sub">Narrativa, público, canais e ações. O resultado é um Plano de Marketing Pessoal utilizável.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo para gerar seu plano completo." : "Plano pronto. Use como guia de ação."}</p>
        <button class="btn" data-goto="narrativa">Começar</button>
      </div>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Narrativa</h1>
      <div class="field"><label>Narrativa principal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>De consumidores de transformação a construtores de legado.</p></div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "publico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Público</h1>
      <div class="field"><label>Público-alvo</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Empresários, investidores e profissionais de alto potencial que querem construir legado real.</p></div>
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "canais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Canais</h1>
      <div class="field"><label>Canais prioritários</label><textarea id="f-canais">${esc(data.canais)}</textarea></div>
      <button class="btn" data-continue="canais">Salvar e Continuar</button>`;
  } else if (view === "acoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Ações</h1>
      <div class="field"><label>Ações e rotina</label><textarea id="f-acoes">${esc(data.acoes)}</textarea></div>
      <button class="btn" data-continue="acoes">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Marketing Pessoal</h1>
      <div class="card"><h3>Narrativa</h3><p>${esc(data.narrativa) || "—"}</p></div>
      <div class="card"><h3>Público</h3><p>${esc(data.publico) || "—"}</p></div>
      <div class="card"><h3>Canais</h3><p>${esc(data.canais) || "—"}</p></div>
      <div class="card"><h3>Ações</h3><p>${esc(data.acoes) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "M")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
