const COL = "afIdentityStudio";
let currentUser = null;
let data = { identidade: "", valores: "", narrativa: "", diferenciais: "", observacoes: "" };
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
  const fields = ["identidade", "valores", "narrativa", "diferenciais"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["identidade", "valores", "narrativa", "diferenciais"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "mapa" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "IDENTITY / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Identity Studio</div>
      <h1 class="title">Sua identidade</h1>
      <p class="sub">Defina identidade, valores, narrativa e diferenciais com clareza e profundidade.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie identidade e valores para consolidar o mapa." : "Mapa pronto. Use como base para posicionamento e branding."}</p>
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Use os exemplos da Akasha Hub como espelho. Idealize a sua versão a partir do que já é verdadeiro em você.</p>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade</h1>
      <p class="sub">Quem você é no núcleo e como se reconhece.</p>
      <div class="field"><label>Identidade central</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>A Akasha Hub é a incubadora de essência e legado. Não vendemos transformação — criamos o sistema operacional para quem já decidiu construir.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Defina quem você é quando tira o cargo, o produto e o status.</p></div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Essência antes de estratégia. Frequência alinhada. Tecnologia a serviço da alma. Legado sobre hype.</p></div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Narrativa</h1>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>De consumidores de transformação a construtores de legado.</p></div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Diferenciais</h1>
      <div class="field"><label>Diferenciais e unicidade</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>União de constelação familiar, branding de essência e tecnologia de plataforma.</p></div>
      <button class="btn" data-continue="diferenciais">Salvar e Continuar</button>`;
  } else if (view === "mapa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Mapa de Identidade</h1>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Narrativa</h3><p>${esc(data.narrativa) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "I")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
