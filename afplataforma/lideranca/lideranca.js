const COL = "afLideranca";
let currentUser = null;
let data = { estilo: "", valores: "", comunicacao: "", autoridade: "", plano: "", observacoes: "" };
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
  const fields = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "LIDERANÇA / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Liderança</div>
      <h1 class="title">Sua liderança</h1>
      <p class="sub">Defina estilo, valores, comunicação e autoridade.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie seu estilo e valores." : "Plano pronto."}</p>
        <button class="btn" data-goto="estilo">Começar</button>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Meu estilo atual é mais diretivo: eu defino o caminho e espero que as pessoas sigam. Quero evoluir para um estilo que cria clareza e espaço para as pessoas construírem com autonomia. Liderar, para mim, deve ser menos sobre controlar e mais sobre alinhar essência e direção, e depois confiar no processo.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você lidera hoje e como gostaria de liderar daqui para frente?</p></div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores de liderança</h1>
      <div class="field"><label>Valores e princípios</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Clareza acima de velocidade. Prefiro alinhar bem do que avançar rápido e ter que corrigir depois. Responsabilidade compartilhada: não quero ser o único que carrega. Integridade mesmo quando é mais fácil omitir. Respeito ao ritmo das pessoas, sem abandonar a direção.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais valores você não abre mão na forma de liderar, mesmo que custe resultado no curto prazo?</p></div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Comunicação</h1>
      <div class="field"><label>Comunicação de liderança</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Comunico a visão de forma clara e direta, sem rodeios. Prefiro conversas individuais quando o assunto é sensível. Dou feedback específico e baseado em fatos, não em impressões. Também peço feedback sobre minha própria comunicação para não perder a conexão com o time.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você transmite direção, dá feedback e gera confiança?</p></div>
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade e influência</h1>
      <div class="field"><label>Autoridade e influência</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Construo autoridade pela coerência entre o que digo e o que faço. Não busco ser o mais carismático, mas o mais confiável. Influencio mais por exemplo e clareza do que por pressão. Quero ser reconhecido como alguém que cria condições para as pessoas crescerem, não como quem precisa estar no centro de tudo.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você constrói e protege sua autoridade? Pelo que quer ser reconhecido como líder?</p></div>
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Liderança</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
      <div class="card"><h3>Autoridade</h3><p>${esc(data.autoridade) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "L")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
