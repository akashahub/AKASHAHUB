// v4 - render imediato
const COL = "afEssencia";
let currentUser = null;
let data = { historia: "", valores: "", crencas: "", posicionamento: "", proposito: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;

function toast(msg) {
  const el = document.getElementById("toast"); if (!el) return;
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }

function progress() {
  const fields = ["historia", "valores", "crencas", "posicionamento", "proposito"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["historia", "valores", "posicionamento", "proposito"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dossie" : STEPS[i + 1];
}
window.setView = setView;
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar"); if (side) side.classList.remove("open");
  render();
}
function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => {
        let key = el.id.slice(2);
        const map = {pos: 'posicionamento', prop: 'proposito'};
        if (key in map) key = map[key];
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
  const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "ESSÊNCIA / " + view.toUpperCase().replace("-", " ");
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Arquitetura de Essência</div>
      <h1 class="title">Sua essência</h1>
      <p class="sub">Mapeie identidade, história, valores e direção. O resultado é um Dossiê de Essência claro e utilizável.</p>
      <div class="card">
        <div>Progresso do dossiê</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo os módulos para gerar seu dossiê completo." : "Dossiê pronto. Revise e use como base para posicionamento e liderança."}</p>
        <button class="btn" data-goto="historia">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar este app</div>
        <p>Cada etapa tem um exemplo real da Akasha Hub + uma orientação para você idealizar o seu. Não copie — use como espelho para encontrar a sua versão.</p>
      </div>`;
  } else if (view === "historia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">História pessoal</h1>
      <p class="sub">Contexto, experiências formativas e o que moldou quem você é.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-historia">${esc(data.historia)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>A Akasha Hub nasceu da percepção de que a maioria das pessoas consome transformação, mas poucos constroem legado. Unimos tecnologia, identidade e frequência para criar uma incubadora de essência.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Conte o arco que explica por que você faz o que faz hoje.</p></div>
      <button class="btn" data-continue="historia">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores e crenças</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="field"><label>Crenças e padrões</label><textarea id="f-crencas">${esc(data.crencas)}</textarea></div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "posicionamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Posicionamento</h1>
      <div class="field"><label>Posicionamento e narrativa</label><textarea id="f-pos">${esc(data.posicionamento)}</textarea></div>
      <button class="btn" data-continue="posicionamento">Salvar e Continuar</button>`;
  } else if (view === "proposito") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Propósito e direção</h1>
      <div class="field"><label>Propósito e próximos passos</label><textarea id="f-prop">${esc(data.proposito)}</textarea></div>
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "dossie") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Dossiê de Essência</h1>
      <div class="card"><h3>História</h3><p>${esc(data.historia) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Posicionamento</h3><p>${esc(data.posicionamento) || "—"}</p></div>
      <div class="card"><h3>Propósito</h3><p>${esc(data.proposito) || "—"}</p></div>`;
  }
}

// Render imediato, sem depender do Firebase
bind();
render();

// Tenta conectar ao Firebase em segundo plano (opcional)
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
        if (av) av.textContent = (user.email || "E")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
