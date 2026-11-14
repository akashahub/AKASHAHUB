const COL = "afComunicacao";
let currentUser = null;
let data = { estilo: "", mensagens: "", presenca: "", autoridade: "", plano: "", observacoes: "" };
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
  const fields = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "COMUNICAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Comunicação</div>
      <h1 class="title">Sua comunicação</h1>
      <p class="sub">Defina estilo, mensagens, presença e autoridade.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie estilo e mensagens." : "Plano pronto."}</p>
        <button class="btn" data-goto="estilo">Começar</button>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de comunicação</h1>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Meu estilo é claro e direto, com profundidade. Evito exageros e frases prontas. Prefiro dizer menos e com precisão. Quando escrevo ou falo, busco que a pessoa se sinta respeitada e compreendida, não pressionada. Quero que minha comunicação transmita confiança sem precisar ser alta ou frequente.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você se comunica quando está no seu melhor? Qual tom combina com sua essência?</p></div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "mensagens") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Mensagens-chave</h1>
      <div class="field"><label>Mensagens principais</label><textarea id="f-mensagens">${esc(data.mensagens)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Mensagem principal: “Clareza de identidade gera autoridade real.” Outra: “Pare de consumir mais informação e comece a construir com estrutura.” Quero que as pessoas lembrem que eu ajudo a sair do ciclo de consumo e entrar em construção consciente de legado.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Quais 2-3 mensagens você quer que as pessoas lembrem sobre você?</p></div>
      <button class="btn" data-continue="mensagens">Salvar e Continuar</button>`;
  } else if (view === "presenca") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Presença e impacto</h1>
      <div class="field"><label>Presença e impacto</label><textarea id="f-presenca">${esc(data.presenca)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Minha presença é mais de profundidade do que de volume. Prefiro aparecer menos e com mais substância. Quando interajo, quero que as pessoas saiam com mais clareza sobre si mesmas ou sobre o próximo passo. O impacto que busco é de confiança e direção, não de entretenimento.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você quer ocupar espaço? O que as pessoas devem sentir ao interagir com você?</p></div>
      <button class="btn" data-continue="presenca">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade</h1>
      <div class="field"><label>Autoridade na comunicação</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Transmito autoridade pela coerência e pela precisão, não pelo volume de conteúdo. Não preciso falar de tudo. Quando falo, as pessoas sentem que há experiência e clareza por trás. Protejo minha autoridade evitando promessas exageradas e mantendo o que digo alinhado com o que faço.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Como você comunica autoridade sem forçar? O que você não faz para proteger isso?</p></div>
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Comunicação</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Mensagens</h3><p>${esc(data.mensagens) || "—"}</p></div>
      <div class="card"><h3>Presença</h3><p>${esc(data.presenca) || "—"}</p></div>
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
        if (av) av.textContent = (user.email || "C")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
