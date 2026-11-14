const COL = "afWebsiteStudio";
let currentUser = null;
let data = { proposito: "", estrutura: "", conteudo: "", visual: "", tecnico: "", plano: "" };
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
  const fields = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 15).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
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
  if (nav) nav.addEventListener("click", e => {
    const b = e.target.closest("button[data-view]");
    if (b) setView(b.dataset.view);
  });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => {
    const side = document.getElementById("sidebar");
    if (side) side.classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]");
    if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => {
        const key = el.id.slice(2);
        if (key in data) data[key] = el.value;
      });
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
  if (crumb) crumb.textContent = "WEBSITE STUDIO / " + view.toUpperCase().replace("-", " ");
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Website Studio</h1>
      <p class="sub">Planeje e estruture um site que posiciona sua essência e converte com clareza.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% estruturado</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Comece pelo propósito do site." : "Plano completo."}</p>
        <button class="btn" data-goto="proposito">Começar pelo Propósito</button>
      </div>`;
  } else if (view === "proposito") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Propósito do site</h1>
      <div class="field"><label>Propósito e objetivo principal</label><textarea id="f-proposito">${esc(data.proposito)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>O site da Akasha Hub não vende cursos. Ele posiciona a Arquitetura de Legado como sistema operacional de essência e autoridade.</p></div>
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "estrutura") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Estrutura e páginas</h1>
      <div class="field"><label>Estrutura proposta</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>
      <button class="btn" data-continue="estrutura">Salvar e Continuar</button>`;
  } else if (view === "conteudo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Conteúdo e narrativa</h1>
      <div class="field"><label>Narrativa e mensagens-chave</label><textarea id="f-conteudo">${esc(data.conteudo)}</textarea></div>
      <button class="btn" data-continue="conteudo">Salvar e Continuar</button>`;
  } else if (view === "visual") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Identidade visual</h1>
      <div class="field"><label>Diretrizes visuais</label><textarea id="f-visual">${esc(data.visual)}</textarea></div>
      <button class="btn" data-continue="visual">Salvar e Continuar</button>`;
  } else if (view === "tecnico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 5</div>
      <h1 class="title">Aspectos técnicos</h1>
      <div class="field"><label>Decisões técnicas</label><textarea id="f-tecnico">${esc(data.tecnico)}</textarea></div>
      <button class="btn" data-continue="tecnico">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 6</div>
      <h1 class="title">Plano de construção</h1>
      <div class="field"><label>Cronograma e ações</label><textarea id="f-plano">${esc(data.plano)}</textarea></div>
      <button class="btn" data-continue="plano">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "W")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
