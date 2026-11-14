// v13 - modal de descoberta
const COL = "afEssencia";
let currentUser = null;
let data = { historia: "", valores: "", crencas: "", posicionamento: "", proposito: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  historia: {
    title: "Descobrir minha história",
    subtitle: "Responda para gerar uma narrativa pessoal.",
    questions: [
      { id: "q1", label: "Qual experiência mais marcou sua trajetória profissional ou pessoal?" },
      { id: "q2", label: "O que você aprendeu com uma dificuldade importante?" },
      { id: "q3", label: "Por que você faz o que faz hoje?" }
    ],
    generate: (a) => `Nasci e cresci em um contexto que me ensinou ${a.q1 || "lições importantes"}. Uma experiência marcante foi ${a.q2 || "um desafio que me transformou"}. Isso me levou a ${a.q3 || "fazer o que faço hoje"}.`
  },
  valores: {
    title: "Descobrir meus valores",
    subtitle: "Identifique o que é inegociável para você.",
    questions: [
      { id: "q1", label: "Qual valor você já pagou preço para manter?" },
      { id: "q2", label: "O que você não faz, mesmo que seja lucrativo ou popular?" },
      { id: "q3", label: "Qual crença ou padrão ainda influencia suas decisões?" }
    ],
    generate: (a) => `Valores: ${a.q1 || "Clareza e integridade"}. Não faço ${a.q2 || "o que contradiz minha essência"}. Crença/Padrão: ${a.q3 || "ainda carrego algumas lealdades antigas"}.`
  },
  posicionamento: {
    title: "Descobrir meu posicionamento",
    subtitle: "Defina quem você ajuda e como se diferencia.",
    questions: [
      { id: "q1", label: "Quem você ajuda de verdade?" },
      { id: "q2", label: "Qual problema principal você resolve?" },
      { id: "q3", label: "O que te diferencia de quem faz algo parecido?" }
    ],
    generate: (a) => `Ajudo ${a.q1 || "pessoas que buscam clareza"} a resolver ${a.q2 || "a falta de direção"}. Me diferencio porque ${a.q3 || "uno essência e estrutura"}.`
  },
  proposito: {
    title: "Descobrir meu propósito",
    subtitle: "Conecte o porquê maior com os próximos passos.",
    questions: [
      { id: "q1", label: "Por que isso importa para você no longo prazo?" },
      { id: "q2", label: "Qual resultado você quer ver em 12 meses?" },
      { id: "q3", label: "Qual é o próximo passo concreto?" }
    ],
    generate: (a) => `Meu propósito é ${a.q1 || "criar impacto real"}. Em 12 meses quero ${a.q2 || "ter consolidado minha base"}. Próximo passo: ${a.q3 || "avançar com clareza"}.`
  }
};

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/</g, "<").replace(/>/g, ">");
}

function progress() {
  const fields = ["historia", "valores", "crencas", "posicionamento", "proposito"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["historia", "valores", "posicionamento", "proposito"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dossie" : STEPS[i + 1];
}

function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar");
  if (side) side.classList.remove("open");
  render();
}
window.setView = setView;

function openDiscovery(field) {
  const cfg = DISCOVERY[field];
  if (!cfg) return;
  currentTargetField = field;
  document.getElementById("modalTitle").textContent = cfg.title;
  document.getElementById("modalSubtitle").textContent = cfg.subtitle;
  const qEl = document.getElementById("modalQuestions");
  qEl.innerHTML = cfg.questions.map(q => `
    <div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>
  `).join("");
  document.getElementById("modalResult").classList.add("hidden");
  document.getElementById("discoveryForm").classList.remove("hidden");
  document.getElementById("discoveryModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("discoveryModal").classList.add("hidden");
  currentTargetField = null;
}

function bind() {
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", e => {
    const b = e.target.closest("button[data-view]");
    if (b) setView(b.dataset.view);
  });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => {
    const s = document.getElementById("sidebar");
    if (s) s.classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]");
    if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => {
        let key = el.id.slice(2);
        const map = { pos: "posicionamento", prop: "proposito" };
        if (key in map) key = map[key];
        if (key in data) data[key] = el.value;
      });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
      return;
    }
    const disc = e.target.closest("[data-discover]");
    if (disc) openDiscovery(disc.dataset.discover);
  });

  document.getElementById("modalClose").onclick = closeModal;
  document.getElementById("modalCancel").onclick = closeModal;
  document.querySelector(".modal-backdrop").onclick = closeModal;

  document.getElementById("discoveryForm").onsubmit = (e) => {
    e.preventDefault();
    const cfg = DISCOVERY[currentTargetField];
    if (!cfg) return;
    const answers = {};
    cfg.questions.forEach(q => {
      const el = document.getElementById("disc-" + q.id);
      answers[q.id] = el ? el.value.trim() : "";
    });
    const suggestion = cfg.generate(answers);
    document.getElementById("suggestionText").textContent = suggestion;
    document.getElementById("discoveryForm").classList.add("hidden");
    document.getElementById("modalResult").classList.remove("hidden");
  };

  document.getElementById("useSuggestion").onclick = () => {
    const text = document.getElementById("suggestionText").textContent;
    if (currentTargetField && text) {
      data[currentTargetField] = text;
      const map = { posicionamento: "pos", proposito: "prop" };
      const id = "f-" + (map[currentTargetField] || currentTargetField);
      const ta = document.getElementById(id);
      if (ta) ta.value = text;
      toast("Sugestão aplicada. Você pode editar antes de salvar.");
    }
    closeModal();
    render();
  };
}

async function saveData() {
  if (!currentUser || !db) { toast("Faça login para salvar."); return; }
  try {
    const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
    toast("Salvo com sucesso.");
  } catch {
    toast("Erro ao salvar.");
  }
  render();
}

function discoverBtn(field) {
  return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir minha essência</button>`;
}

function render() {
  const p = progress();
  const content = document.getElementById("content");
  if (!content) return;
  const crumb = document.getElementById("breadcrumb");
  if (crumb) crumb.textContent = "ESSÊNCIA / " + view.toUpperCase().replace("-", " ");
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

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
        <p>Cada etapa tem um botão “Descobrir” que abre perguntas guiadas para te ajudar a preencher.</p>
      </div>`;
  } else if (view === "historia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">História pessoal</h1>
      <p class="sub">Contexto, experiências formativas e o que moldou quem você é.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-historia">${esc(data.historia)}</textarea></div>
      ${discoverBtn("historia")}
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Nasci em uma família de empreendedores e desde cedo vi meu pai trabalhar muitas horas sem estrutura clara. Isso me fez querer criar sistemas que permitam às pessoas construir com mais clareza e menos desgaste.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Conte o arco que explica por que você faz o que faz hoje.</p></div>
      <button class="btn" data-continue="historia">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores e crenças</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="field"><label>Crenças e padrões</label><textarea id="f-crencas">${esc(data.crencas)}</textarea></div>
      ${discoverBtn("valores")}
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Valores: Clareza antes de velocidade. Integridade mesmo quando ninguém está olhando.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste 3-5 valores que você realmente não abre mão.</p></div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "posicionamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Posicionamento</h1>
      <div class="field"><label>Posicionamento e narrativa</label><textarea id="f-pos">${esc(data.posicionamento)}</textarea></div>
      ${discoverBtn("posicionamento")}
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Ajudo empresários a sair do consumo de transformação e entrar na construção de legado.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Descreva em 2-4 frases quem você ajuda e como se diferencia.</p></div>
      <button class="btn" data-continue="posicionamento">Salvar e Continuar</button>`;
  } else if (view === "proposito") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Propósito e direção</h1>
      <div class="field"><label>Propósito e próximos passos</label><textarea id="f-prop">${esc(data.proposito)}</textarea></div>
      ${discoverBtn("proposito")}
      <div class="example"><div class="eyebrow">Exemplo de como preencher</div><p>Meu propósito é criar um ecossistema onde empresários mapeiam sua essência e constroem legado com estrutura.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Defina o propósito maior e 1-2 direções concretas.</p></div>
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
        if (av) av.textContent = (user.email || "E")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
