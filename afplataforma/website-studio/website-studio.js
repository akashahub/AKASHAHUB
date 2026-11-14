const COL = "afWebsiteStudio";
let currentUser = null;
let data = { proposito: "", estrutura: "", conteudo: "", visual: "", tecnico: "", plano: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  proposito: {
    title: "Descobrir o propósito do site",
    subtitle: "Defina a função principal.",
    questions: [
      { id: "q1", label: "Qual é a função principal?", options: ["Posicionar a marca", "Captar pessoas qualificadas", "Educar e gerar autoridade", "Direcionar para conversa", "Outro"] },
      { id: "q2", label: "Qual objetivo principal?", options: ["Atrair empresários", "Gerar conversas", "Posicionar autoridade", "Captar leads", "Outro"] },
      { id: "q3", label: "O que o visitante deve sentir ou entender?", type: "text" }
    ],
    generate: (a) => `O site deve ${a.q1 || "posicionar minha marca"}. Objetivo: ${a.q2 || "atrair pessoas qualificadas"}. O visitante deve ${a.q3 || "entender rapidamente quem eu ajudo e o valor que entrego"}.`
  },
  estrutura: {
    title: "Descobrir a estrutura",
    subtitle: "Defina as páginas essenciais.",
    questions: [
      { id: "q1", label: "Quais páginas são essenciais? (até 4)", options: ["Home", "Sobre", "Plataforma / Serviços", "Conteúdos", "Contato", "Depoimentos"], multi: true },
      { id: "q2", label: "Qual página é mais importante?", options: ["Home", "Sobre", "Serviços", "Contato", "Outro"] },
      { id: "q3", label: "Qual é o objetivo da página principal?", type: "text" }
    ],
    generate: (a) => `Páginas essenciais: ${(a.q1 || []).join(", ") || "Home, Sobre e Contato"}. A mais importante é ${a.q2 || "Home"}. Objetivo: ${a.q3 || "posicionar e direcionar para o próximo passo"}.`
  },
  conteudo: {
    title: "Descobrir a narrativa",
    subtitle: "Defina a mensagem central.",
    questions: [
      { id: "q1", label: "Qual é a mensagem principal?", options: ["Pare de consumir, construa legado", "Clareza gera autoridade", "Identidade antes de estratégia", "Sistema acima de esforço", "Outro"] },
      { id: "q2", label: "Qual tom o site deve ter?", options: ["Direto e sofisticado", "Profundo e claro", "Elegante e contido", "Humano e preciso", "Outro"] },
      { id: "q3", label: "O que o visitante deve entender em poucos segundos?", type: "text" }
    ],
    generate: (a) => `Mensagem: ${a.q1 || "clareza gera autoridade real"}. Tom: ${a.q2 || "direto e sofisticado"}. Em poucos segundos o visitante deve ${a.q3 || "entender quem eu ajudo e o que ofereço de diferente"}.`
  },
  visual: {
    title: "Descobrir a identidade visual",
    subtitle: "Defina como o site deve parecer.",
    questions: [
      { id: "q1", label: "Qual estética combina?", options: ["Luxo silencioso", "Minimalista e elegante", "Escuro com dourado", "Espaço em branco", "Outro"] },
      { id: "q2", label: "O que deve ser evitado?", options: ["Excesso visual", "Hype e brilho", "Muitas cores", "Poluição de elementos", "Outro"] },
      { id: "q3", label: "O que o design deve transmitir?", type: "text" }
    ],
    generate: (a) => `Estética: ${a.q1 || "luxo silencioso"}. Evitar: ${a.q2 || "excesso visual"}. Transmitir: ${a.q3 || "profundidade, clareza e estrutura"}.`
  },
  tecnico: {
    title: "Descobrir aspectos técnicos",
    subtitle: "Defina a abordagem técnica.",
    questions: [
      { id: "q1", label: "Qual abordagem faz mais sentido?", options: ["Site estático de alta performance", "Plataforma com login", "Site simples e rápido", "Integração com CRM", "Outro"] },
      { id: "q2", label: "Qual prioridade técnica?", options: ["Velocidade", "Simplicidade de manutenção", "Integração com formulários", "Segurança", "Outro"] },
      { id: "q3", label: "O que precisa funcionar bem?", type: "text" }
    ],
    generate: (a) => `Abordagem: ${a.q1 || "site estático de alta performance"}. Prioridade: ${a.q2 || "velocidade e simplicidade"}. Precisa funcionar bem: ${a.q3 || "formulários e integração com a plataforma"}.`
  },
  plano: {
    title: "Descobrir o plano de construção",
    subtitle: "Defina as próximas ações.",
    questions: [
      { id: "q1", label: "Qual é o próximo passo?", options: ["Consolidar este brief", "Fazer wireframes", "Definir design", "Desenvolver", "Outro"] },
      { id: "q2", label: "Quantas etapas você quer ter?", options: ["3 etapas", "4-5 etapas", "Passo a passo simples", "Outro"] },
      { id: "q3", label: "Qual é a primeira ação concreta?", type: "text" }
    ],
    generate: (a) => `Próximo passo: ${a.q1 || "consolidar o brief e fazer wireframes"}. Plano em ${a.q2 || "4-5 etapas"}. Primeira ação: ${a.q3 || "finalizar este planejamento e avançar para design"}.`
  }
};

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
  const fields = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
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

function openDiscovery(field) {
  const cfg = DISCOVERY[field];
  if (!cfg) return;
  currentTargetField = field;
  document.getElementById("modalTitle").textContent = cfg.title;
  document.getElementById("modalSubtitle").textContent = cfg.subtitle;
  const qEl = document.getElementById("modalQuestions");
  qEl.innerHTML = cfg.questions.map(q => {
    if (q.options) {
      const multi = q.multi ? ' data-multi="1"' : '';
      return `<div class="field"><label>${q.label}</label>
        <div class="options" data-qid="${q.id}"${multi}>
          ${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}
        </div>
        ${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}
      </div>`;
    }
    return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`;
  }).join("");

  qEl.querySelectorAll(".options").forEach(box => {
    const multi = box.dataset.multi;
    box.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (multi) btn.classList.toggle("selected");
        else {
          box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          const other = box.parentElement.querySelector(".other-input");
          if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro");
        }
      };
    });
  });

  document.getElementById("modalResult").classList.add("hidden");
  document.getElementById("discoveryForm").classList.remove("hidden");
  document.getElementById("discoveryModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("discoveryModal").classList.add("hidden");
  currentTargetField = null;
}

function collectAnswers(cfg) {
  const answers = {};
  cfg.questions.forEach(q => {
    if (q.options) {
      const box = document.querySelector(`.options[data-qid="${q.id}"]`);
      if (q.multi) {
        answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value);
      } else {
        const sel = box.querySelector(".opt.selected");
        let val = sel ? sel.dataset.value : "";
        if (val === "Outro") {
          const other = document.querySelector(`.other-input[data-for="${q.id}"]`);
          val = other ? other.value.trim() : "";
        }
        answers[q.id] = val;
      }
    } else {
      const el = document.getElementById("disc-" + q.id);
      answers[q.id] = el ? el.value.trim() : "";
    }
  });
  return answers;
}

function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
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
    const answers = collectAnswers(cfg);
    const suggestion = cfg.generate(answers);
    document.getElementById("suggestionText").textContent = suggestion;
    document.getElementById("discoveryForm").classList.add("hidden");
    document.getElementById("modalResult").classList.remove("hidden");
  };

  document.getElementById("useSuggestion").onclick = () => {
    const text = document.getElementById("suggestionText").textContent;
    if (currentTargetField && text) {
      data[currentTargetField] = text;
      const ta = document.getElementById("f-" + currentTargetField);
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
  } catch { toast("Erro ao salvar."); }
  render();
}

function discoverBtn(field) {
  return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`;
}

function render() {
  const p = progress();
  const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "WEBSITE STUDIO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Website Studio</h1>
      <p class="sub">Planeje um site que posiciona e converte.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="proposito">Começar</button></div>`;
  } else if (view === "proposito") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Propósito do site</h1>
      <div class="field"><label>Propósito e objetivo</label><textarea id="f-proposito">${esc(data.proposito)}</textarea></div>
      ${discoverBtn("proposito")}
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "estrutura") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Estrutura e páginas</h1>
      <div class="field"><label>Estrutura proposta</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>
      ${discoverBtn("estrutura")}
      <button class="btn" data-continue="estrutura">Salvar e Continuar</button>`;
  } else if (view === "conteudo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Conteúdo e narrativa</h1>
      <div class="field"><label>Narrativa e mensagens</label><textarea id="f-conteudo">${esc(data.conteudo)}</textarea></div>
      ${discoverBtn("conteudo")}
      <button class="btn" data-continue="conteudo">Salvar e Continuar</button>`;
  } else if (view === "visual") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Identidade visual</h1>
      <div class="field"><label>Diretrizes visuais</label><textarea id="f-visual">${esc(data.visual)}</textarea></div>
      ${discoverBtn("visual")}
      <button class="btn" data-continue="visual">Salvar e Continuar</button>`;
  } else if (view === "tecnico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 5</div>
      <h1 class="title">Aspectos técnicos</h1>
      <div class="field"><label>Decisões técnicas</label><textarea id="f-tecnico">${esc(data.tecnico)}</textarea></div>
      ${discoverBtn("tecnico")}
      <button class="btn" data-continue="tecnico">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 6</div>
      <h1 class="title">Plano de construção</h1>
      <div class="field"><label>Cronograma e ações</label><textarea id="f-plano">${esc(data.plano)}</textarea></div>
      ${discoverBtn("plano")}
      <button class="btn" data-continue="plano">Salvar e Finalizar</button>`;
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
        if (av) av.textContent = (user.email || "W")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
