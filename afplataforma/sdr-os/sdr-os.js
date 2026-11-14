const COL = "afSdrOs";
let currentUser = null;
let data = { prospeccao: "", qualificacao: "", acompanhamento: "", scripts: "" };
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
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 10).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["prospeccao", "qualificacao", "acompanhamento", "scripts"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "SDR OS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">SDR OS</h1>
      <p class="sub">Sistema operacional de prospecção, qualificação e acompanhamento.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="prospeccao">Começar</button></div>`;
  } else if (view === "prospeccao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Prospecção</h1>
      <div class="field"><label>Como e onde prospectar?</label><textarea id="f-prospeccao">${esc(data.prospeccao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Conteúdo de autoridade no LinkedIn e site, indicações de mentorandos atuais, e participação em eventos seletivos. Foco em empresários e profissionais que já sentem a necessidade de sistema, não de mais informação. Evito prospecção fria em massa.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como e onde você prospecta pessoas alinhadas com sua essência?</p></div>
      <button class="btn" data-continue="prospeccao">Salvar e Continuar</button>`;
  } else if (view === "qualificacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Qualificação</h1>
      <div class="field"><label>Critérios de qualificação</label><textarea id="f-qualificacao">${esc(data.qualificacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Alinhamento com a essência da marca, capacidade de investir tempo e recursos, e desejo real de construir legado (não apenas consumir). Critérios: já tem clareza mínima, está disposto a agir, e valoriza profundidade.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais critérios você usa para qualificar uma pessoa?</p></div>
      <button class="btn" data-continue="qualificacao">Salvar e Continuar</button>`;
  } else if (view === "acompanhamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Acompanhamento</h1>
      <div class="field"><label>Como acompanhar o progresso?</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Mentor view na plataforma + pontos de contato estratégicos. Foco em progressão real nas fases, não em volume de mensagens. Acompanhamento baseado em dados da plataforma e conversas de qualidade.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você acompanha o progresso das pessoas que estão no funil?</p></div>
      <button class="btn" data-continue="acompanhamento">Salvar e Continuar</button>`;
  } else if (view === "scripts") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Scripts e playbook</h1>
      <div class="field"><label>Scripts e processos</label><textarea id="f-scripts">${esc(data.scripts)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Abordagem baseada em frequência e clareza, não em pressão. Playbook alinhado à identidade da marca. Scripts que ajudam a entender a realidade da pessoa antes de apresentar qualquer solução. Foco em escuta e alinhamento.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais scripts ou processos você usa ou pretende usar?</p></div>
      <button class="btn" data-continue="scripts">Salvar e Finalizar</button>`;
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
        const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
        if (pill) pill.textContent = user.email || "Mentorando";
        if (av) av.textContent = (user.email || "S")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
