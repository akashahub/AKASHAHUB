const COL = "afRegistrosAkashicos";
let currentUser = null;
let data = { intencao: "", reflexoes: "", insights: "", integracao: "", observacoes: "" };
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
  const fields = ["intencao", "reflexoes", "insights", "integracao"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["intencao", "reflexoes", "insights", "integracao"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "registro" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "REGISTROS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Registros Akáshicos</div>
      <h1 class="title">Sua jornada</h1>
      <p class="sub">Jornada guiada de autoconhecimento e reflexão.</p>
      <div class="card">
        <div>Progresso do registro</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Defina a intenção e avance nas reflexões." : "Registro completo."}</p>
        <button class="btn" data-goto="intencao">Começar</button>
      </div>`;
  } else if (view === "intencao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Intenção</h1>
      <div class="field"><label>Intenção da jornada</label><textarea id="f-intencao">${esc(data.intencao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Quero entender por que continuo consumindo informação e cursos mesmo sabendo que já tenho clareza suficiente para agir. Desejo observar onde ainda existe medo de construir de verdade e o que precisa ser integrado para que eu pare de adiar a criação dos meus ativos digitais.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Qual pergunta importante ainda não tem resposta? O que você deseja ver com mais clareza?</p></div>
      <button class="btn" data-continue="intencao">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Reflexões guiadas</h1>
      <div class="field"><label>Reflexões</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Quando fico em silêncio com essa intenção, surge a percepção de que eu uso o consumo de conteúdo como uma forma de me sentir produtivo sem me expor. Também aparece o medo de que, se eu começar a construir de verdade, as pessoas vão ver que ainda não sei tudo. Há uma parte de mim que prefere permanecer na preparação.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Anote o que emerge sem forçar conclusões. Quais imagens, sensações ou pensamentos se repetem?</p></div>
      <button class="btn" data-continue="reflexoes">Salvar e Continuar</button>`;
  } else if (view === "insights") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Insights</h1>
      <div class="field"><label>Insights principais</label><textarea id="f-insights">${esc(data.insights)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>O insight principal é que eu não preciso estar 100% pronto para começar. A clareza suficiente já existe. O que falta é a disposição de me expor construindo. Outra percepção: a maior parte do meu consumo de transformação é uma forma de evitar a vulnerabilidade de criar algo real.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Qual percepção mais importante apareceu? O que você entendeu sobre si que antes não estava claro?</p></div>
      <button class="btn" data-continue="insights">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Integração</h1>
      <div class="field"><label>Integração e próximos passos</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Próximo passo concreto: esta semana vou publicar um conteúdo real sobre o que estou construindo, mesmo que não esteja perfeito. Também vou reduzir o tempo gasto consumindo cursos e usar esse tempo para avançar em um ativo digital. Vou observar o que acontece quando eu ajo com a clareza que já tenho.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Qual mudança prática você pode fazer a partir deste insight? Qual é o próximo passo pequeno e real?</p></div>
      <button class="btn" data-continue="integracao">Salvar e Continuar</button>`;
  } else if (view === "registro") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Registro final</h1>
      <div class="card"><h3>Intenção</h3><p>${esc(data.intencao) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>
      <div class="card"><h3>Insights</h3><p>${esc(data.insights) || "—"}</p></div>
      <div class="card"><h3>Integração</h3><p>${esc(data.integracao) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "R")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
