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
        <p>Cada etapa tem um exemplo prático do tipo de resposta esperada. Use como referência para encontrar a sua versão.</p>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade</h1>
      <p class="sub">Quem você é no núcleo e como se reconhece.</p>
      <div class="field"><label>Identidade central</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Sou a pessoa que cria estrutura onde antes só existia esforço. No núcleo, sou alguém que transforma complexidade em clareza. Quando tiro o título de “consultor” ou “empresário”, o que resta é alguém que observa sistemas (pessoas, negócios, famílias) e ajuda a reorganizar o que está desalinhado. Me reconheço mais como construtor de pontes do que como especialista em um nicho.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Descreva quem você é quando remove o cargo, o produto e o status. O que permanece?</p></div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Clareza acima de velocidade. Prefiro ir mais devagar e construir certo do que escalar rápido e ter que desfazer depois. Integridade mesmo quando ninguém está olhando — já recusei projetos lucrativos que não combinavam com o que acredito. Responsabilidade compartilhada: não quero ser o único que carrega o sistema. Legado acima de hype.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste 3-5 valores que você realmente não abre mão, mesmo que isso custe dinheiro ou popularidade.</p></div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Narrativa</h1>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Durante anos eu consumia cursos, mentorias e frameworks achando que o próximo método ia resolver. Só quando parei e mapeei quem eu realmente era que as decisões ficaram mais fáceis e os resultados mais consistentes. Hoje minha narrativa é: parei de consumir transformação e comecei a construir legado com estrutura. Ajudo outras pessoas a fazerem o mesmo.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Conte a história que explica por que você faz o que faz. Qual foi a virada de chave?</p></div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Diferenciais</h1>
      <div class="field"><label>Diferenciais e unicidade</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Uno três coisas que raramente andam juntas: leitura sistêmica de pessoas e famílias, clareza de identidade e branding, e capacidade de transformar isso em sistemas e plataformas digitais. Não sou só mentor nem só técnico. Crio o espaço onde a pessoa se encontra e já sai com estrutura para construir.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Qual combinação de experiência + visão + forma de fazer é só sua? O que as pessoas já notam em você sem você precisar explicar?</p></div>
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
