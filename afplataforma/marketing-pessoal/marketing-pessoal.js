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
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Ajudo empresários que já tentaram de tudo a parar de consumir mais conteúdo e começar a construir um sistema real de identidade e autoridade. Minha narrativa é: a maioria das pessoas não precisa de mais informação — precisa de clareza sobre quem é e de estrutura para agir a partir disso. Eu construo essa estrutura junto com elas.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Qual é a história que você conta sobre o problema que resolve e a transformação que gera? Seja específico.</p></div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "publico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Público</h1>
      <div class="field"><label>Público-alvo</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Empresários e profissionais entre 30 e 50 anos que já faturam bem, mas sentem que estão correndo sem direção clara. Já fizeram vários cursos e mentorias, mas ainda não conseguiram transformar conhecimento em legado ou ativos digitais consistentes. Valorizam profundidade e não querem mais hype. Têm capacidade de investir tempo e dinheiro em algo que realmente faça sentido.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Descreva quem é a pessoa ideal (não “todo mundo”). Qual a dor ou desejo central dela?</p></div>
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "canais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Canais</h1>
      <div class="field"><label>Canais prioritários</label><textarea id="f-canais">${esc(data.canais)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Site próprio como base de autoridade. LinkedIn para alcançar empresários e decisores. Conteúdo de profundidade (artigos e vídeos curtos) em vez de posts diários. Indicações e conversas 1 a 1 com pessoas já qualificadas. Não priorizo Instagram de alto volume neste momento.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Onde seu público já está? Quais canais você consegue sustentar com qualidade e consistência?</p></div>
      <button class="btn" data-continue="canais">Salvar e Continuar</button>`;
  } else if (view === "acoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Ações</h1>
      <div class="field"><label>Ações e rotina</label><textarea id="f-acoes">${esc(data.acoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>1 post de autoridade por semana no LinkedIn (baseado em reflexões reais, não em tendência). 1 artigo ou vídeo mais profundo por mês. 2-3 conversas estratégicas por semana com pessoas do público ideal. Revisão mensal do que está gerando resultado e do que não está. Foco em profundidade, não em volume.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Defina ações pequenas e consistentes. O que você consegue sustentar toda semana sem se esgotar?</p></div>
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
