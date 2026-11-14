const COL = "afConstelacaoFamiliar";
let currentUser = null;
let data = { sistema: "", padroes: "", relacoes: "", reflexoes: "", observacoes: "" };
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
  const fields = ["sistema", "padroes", "relacoes", "reflexoes"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["sistema", "padroes", "relacoes", "reflexoes"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CONSTELAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Constelação Familiar</div>
      <h1 class="title">Seu sistema</h1>
      <p class="sub">Mapeamento reflexivo de padrões, relações e dinâmica familiar.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Observe o sistema e padrões para consolidar o mapa." : "Mapa pronto."}</p>
        <button class="btn" data-goto="sistema">Começar</button>
      </div>`;
  } else if (view === "sistema") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Sistema familiar</h1>
      <div class="field"><label>Descrição do sistema</label><textarea id="f-sistema">${esc(data.sistema)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Na minha família, o pai era o único provedor e carregava tudo sozinho. Minha mãe cuidava da casa e dos filhos, mas raramente era ouvida nas decisões importantes. Eu cresci vendo que “ser forte” significava não pedir ajuda. Hoje percebo que ainda ocupo o lugar de quem resolve tudo, mesmo quando não é minha responsabilidade.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Descreva o sistema sem julgar. Quem ocupa qual lugar? O que se repete?</p></div>
      <button class="btn" data-continue="sistema">Salvar e Continuar</button>`;
  } else if (view === "padroes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Padrões observados</h1>
      <div class="field"><label>Padrões e dinâmicas</label><textarea id="f-padroes">${esc(data.padroes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Padrão que se repete: carregar sozinho. Lealdade invisível a não ter mais que os outros ou a não “brilhar” demais. Já tentei mudar isso várias vezes, mas quando as coisas ficam difíceis eu volto a fazer tudo sozinho. Também percebo que evito pedir ajuda mesmo quando seria mais inteligente.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste o que se repete sem tentar corrigir agora. Quais situações voltam no mesmo formato?</p></div>
      <button class="btn" data-continue="padroes">Salvar e Continuar</button>`;
  } else if (view === "relacoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Relações chave</h1>
      <div class="field"><label>Relações relevantes</label><textarea id="f-relacoes">${esc(data.relacoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>A relação com meu pai ainda influencia muito: herdei a ideia de que pedir ajuda é fraqueza. Com minha mãe, herdei a sensibilidade de cuidar dos outros, mas também a dificuldade de me colocar em primeiro lugar. Com meu sócio atual, percebo que ainda tento carregar mais do que deveria.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais 2-3 relações mais impactam suas escolhas hoje? O que você herdou de cada uma?</p></div>
      <button class="btn" data-continue="relacoes">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Reflexões</h1>
      <div class="field"><label>Reflexões e insights</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Percebo que carregar sozinho me dá sensação de controle, mas também me esgota e limita o crescimento do que eu construo. Uma escolha consciente que posso fazer é começar a delegar pequenas coisas e observar o que acontece. Isso se conecta com meu desejo de construir legado sem precisar estar em tudo.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>O que esse mapa revela sobre as escolhas que você faz hoje? Qual passo consciente você pode dar?</p></div>
      <button class="btn" data-continue="reflexoes">Salvar e Continuar</button>`;
  } else if (view === "mapa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Mapa de Constelação</h1>
      <div class="card"><h3>Sistema</h3><p>${esc(data.sistema) || "—"}</p></div>
      <div class="card"><h3>Padrões</h3><p>${esc(data.padroes) || "—"}</p></div>
      <div class="card"><h3>Relações</h3><p>${esc(data.relacoes) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "C")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
