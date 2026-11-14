const COL = "afAuthorityLeadership";
let currentUser = null;
let data = { estilo: "", comunicacao: "", reputacao: "", competencias: "", observacoes: "" };
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
  const fields = ["estilo", "comunicacao", "reputacao", "competencias"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "comunicacao", "reputacao", "competencias"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "AUTHORITY / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Authority & Leadership OS</div>
      <h1 class="title">Sua autoridade</h1>
      <p class="sub">Unifica liderança, comunicação de autoridade, reputação e competências.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Defina estilo e comunicação." : "Plano pronto."}</p>
        <button class="btn" data-goto="estilo">Começar pelo estilo</button>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <div class="field"><label>Estilo de liderança</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Meu estilo de liderança é baseado em clareza e essência. Eu defino a direção com precisão, alinho as pessoas com o propósito e crio sistemas que permitem que elas construam com autonomia. Não lidero pelo volume nem pela pressão. Lidero criando as condições para que o crescimento aconteça de forma consciente.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você lidera quando está no seu melhor? Qual estilo quer consolidar?</p></div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Comunicação de autoridade</h1>
      <div class="field"><label>Comunicação de autoridade</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Comunico autoridade com precisão e profundidade. Falo menos, mas com mais clareza. Não preciso gritar nem postar todos os dias. Minha comunicação é reconhecida pela coerência entre o que digo e o que construo. Prefiro conversas de qualidade a volume de conteúdo.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você comunica direção e confiança sem forçar?</p></div>
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "reputacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Reputação e influência</h1>
      <div class="field"><label>Reputação e influência</label><textarea id="f-reputacao">${esc(data.reputacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Quero ser reconhecido como alguém que ajuda pessoas a construírem legado com clareza e estrutura, não como mais um que vende transformação. Protejo minha reputação evitando hype, promessas exageradas e associações que não combinam com minha essência. Minha influência vem da coerência e dos resultados reais das pessoas que acompanho.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Pelo que você quer ser conhecido? O que você não faz para proteger sua reputação?</p></div>
      <button class="btn" data-continue="reputacao">Salvar e Continuar</button>`;
  } else if (view === "competencias") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Competências</h1>
      <div class="field"><label>Competências prioritárias</label><textarea id="f-competencias">${esc(data.competencias)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Competências que já tenho: clareza na comunicação e capacidade de ler sistemas. Competências que quero fortalecer: criação de processos que funcionem sem minha presença constante, e habilidade de dar feedback que gera evolução sem gerar resistência. Também quero melhorar a forma de medir o progresso real das pessoas que lidero.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais competências já são fortes em você? Quais 1-2 você quer desenvolver agora?</p></div>
      <button class="btn" data-continue="competencias">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Authority & Leadership</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
      <div class="card"><h3>Reputação</h3><p>${esc(data.reputacao) || "—"}</p></div>
      <div class="card"><h3>Competências</h3><p>${esc(data.competencias) || "—"}</p></div>`;
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
