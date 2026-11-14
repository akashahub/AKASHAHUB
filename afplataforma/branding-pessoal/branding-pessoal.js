const COL = "afBrandingPessoal";
let currentUser = null;
let data = { identidade: "", arquetipos: "", voz: "", diferenciais: "", elementos: "", observacoes: "" };
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
  const fields = ["identidade", "arquetipos", "voz", "diferenciais", "elementos"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["identidade", "voz", "diferenciais", "elementos"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "guia" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "BRANDING / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Branding Pessoal</div>
      <h1 class="title">Sua marca</h1>
      <p class="sub">Defina identidade, voz, diferenciais e elementos visuais da sua marca pessoal.</p>
      <div class="card">
        <div>Progresso do guia</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie identidade e voz para consolidar o guia." : "Guia pronto."}</p>
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade e arquétipos</h1>
      <div class="field"><label>Identidade de marca</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="field"><label>Arquétipos</label><textarea id="f-arquetipos">${esc(data.arquetipos)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Identidade: Tecnologia da Alma · Arquitetura de Essência e Legado. Arquétipos: o Sábio + o Criador + o Guia.</p></div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "voz") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Tom de voz</h1>
      <div class="field"><label>Tom de voz e linguagem</label><textarea id="f-voz">${esc(data.voz)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Tom: claro, profundo, direto e elegante. Sem hype. Luxo silencioso.</p></div>
      <button class="btn" data-continue="voz">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Diferenciais</h1>
      <div class="field"><label>Diferenciais e posicionamento</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <button class="btn" data-continue="diferenciais">Salvar e Continuar</button>`;
  } else if (view === "elementos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Elementos de marca</h1>
      <div class="field"><label>Elementos visuais e referências</label><textarea id="f-elementos">${esc(data.elementos)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Paleta: dourado + violeta. Tipografia: Cormorant Garamond + Inter. Estética de luxo silencioso.</p></div>
      <button class="btn" data-continue="elementos">Salvar e Continuar</button>`;
  } else if (view === "guia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Guia de Branding Pessoal</h1>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Arquétipos</h3><p>${esc(data.arquetipos) || "—"}</p></div>
      <div class="card"><h3>Tom de voz</h3><p>${esc(data.voz) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>
      <div class="card"><h3>Elementos</h3><p>${esc(data.elementos) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "B")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
