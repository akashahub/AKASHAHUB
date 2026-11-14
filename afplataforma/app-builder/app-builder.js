const COL = "afAppBuilder";
let currentUser = null;
let data = { problema: "", solucao: "", funcionalidades: "", arquitetura: "", roadmap: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  problema: {
    title: "Descobrir o problema e usuário",
    subtitle: "Defina quem tem o problema e o que precisa ser resolvido.",
    questions: [
      { id: "q1", label: "Quem é o usuário principal?", options: ["Empresários", "Profissionais", "Empreendedores", "Líderes", "Outro"] },
      { id: "q2", label: "Qual é o problema central?", options: ["Falta de clareza", "Dificuldade de organizar", "Falta de sistema", "Muito esforço manual", "Outro"] },
      { id: "q3", label: "O que o usuário já tentou e não funcionou?", type: "text" }
    ],
    generate: (a) => `O usuário principal é ${a.q1 || "empresários e profissionais"}. O problema central é ${a.q2 || "falta de sistema e clareza"}. Já tentaram ${a.q3 || "ferramentas genéricas sem resultado"}.`
  },
  solucao: {
    title: "Descobrir a solução e valor",
    subtitle: "Defina o valor que o app entrega.",
    questions: [
      { id: "q1", label: "Qual valor principal o app entrega?", options: ["Clareza e estrutura", "Automação de processos", "Organização de informações", "Decisão mais rápida", "Outro"] },
      { id: "q2", label: "Como o usuário resolve isso hoje?", options: ["Planilhas", "Anotações soltas", "Ferramentas genéricas", "Nada estruturado", "Outro"] },
      { id: "q3", label: "O que muda quando o problema é resolvido?", type: "text" }
    ],
    generate: (a) => `O app entrega ${a.q1 || "clareza e estrutura"}. Hoje o usuário resolve com ${a.q2 || "planilhas e anotações soltas"}. Quando resolvido, ${a.q3 || "ganha tempo e consistência"}.`
  },
  funcionalidades: {
    title: "Descobrir funcionalidades",
    subtitle: "Defina o que o app precisa ter.",
    questions: [
      { id: "q1", label: "Quais funcionalidades são essenciais? (até 3)", options: ["Cadastro e organização", "Acompanhamento", "Relatórios", "Automação", "Integração"], multi: true },
      { id: "q2", label: "Qual é a funcionalidade mais importante?", options: ["Organização", "Acompanhamento", "Decisão", "Automação", "Outro"] },
      { id: "q3", label: "O que o usuário precisa conseguir fazer?", type: "text" }
    ],
    generate: (a) => `Funcionalidades essenciais: ${(a.q1 || []).join(", ") || "organização e acompanhamento"}. A mais importante é ${a.q2 || "organização"}. O usuário precisa ${a.q3 || "registrar e acompanhar com clareza"}.`
  },
  arquitetura: {
    title: "Descobrir a arquitetura",
    subtitle: "Defina a estrutura técnica básica.",
    questions: [
      { id: "q1", label: "Qual tipo de app faz mais sentido?", options: ["Web app", "App mobile", "Plataforma interna", "Ferramenta simples", "Outro"] },
      { id: "q2", label: "Qual complexidade inicial?", options: ["Simples e direto", "Médio com evolução", "Completo desde o início", "MVP mínimo", "Outro"] },
      { id: "q3", label: "O que precisa estar pronto na primeira versão?", type: "text" }
    ],
    generate: (a) => `Tipo: ${a.q1 || "web app"}. Complexidade inicial: ${a.q2 || "simples e direto"}. Na primeira versão precisa: ${a.q3 || "cadastro, organização e acompanhamento básico"}.`
  },
  roadmap: {
    title: "Descobrir o roadmap",
    subtitle: "Defina as etapas de construção.",
    questions: [
      { id: "q1", label: "Qual é a primeira etapa?", options: ["Definir escopo", "Criar protótipo", "Desenvolver MVP", "Testar com usuários", "Outro"] },
      { id: "q2", label: "Quantas fases você imagina?", options: ["2 fases", "3 fases", "4 ou mais", "Passo a passo contínuo"] },
      { id: "q3", label: "Qual é o resultado esperado da primeira versão?", type: "text" }
    ],
    generate: (a) => `Primeira etapa: ${a.q1 || "definir escopo e criar protótipo"}. Imagino ${a.q2 || "3 fases"}. Resultado da primeira versão: ${a.q3 || "usuários conseguirem organizar e acompanhar com clareza"}.`
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
  const fields = ["problema", "solucao", "funcionalidades", "arquitetura", "roadmap"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["problema", "solucao", "funcionalidades", "arquitetura", "roadmap"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "APP BUILDER / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">App Builder</h1>
      <p class="sub">Planeje apps e plataformas que amplificam sua essência.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="problema">Começar</button></div>`;
  } else if (view === "problema") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Problema e usuário</h1>
      <div class="field"><label>Problema e usuário</label><textarea id="f-problema">${esc(data.problema)}</textarea></div>
      ${discoverBtn("problema")}
      <button class="btn" data-continue="problema">Salvar e Continuar</button>`;
  } else if (view === "solucao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Solução e valor</h1>
      <div class="field"><label>Solução e valor</label><textarea id="f-solucao">${esc(data.solucao)}</textarea></div>
      ${discoverBtn("solucao")}
      <button class="btn" data-continue="solucao">Salvar e Continuar</button>`;
  } else if (view === "funcionalidades") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Funcionalidades</h1>
      <div class="field"><label>Funcionalidades principais</label><textarea id="f-funcionalidades">${esc(data.funcionalidades)}</textarea></div>
      ${discoverBtn("funcionalidades")}
      <button class="btn" data-continue="funcionalidades">Salvar e Continuar</button>`;
  } else if (view === "arquitetura") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Arquitetura</h1>
      <div class="field"><label>Arquitetura e abordagem</label><textarea id="f-arquitetura">${esc(data.arquitetura)}</textarea></div>
      ${discoverBtn("arquitetura")}
      <button class="btn" data-continue="arquitetura">Salvar e Continuar</button>`;
  } else if (view === "roadmap") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 5</div>
      <h1 class="title">Roadmap</h1>
      <div class="field"><label>Roadmap de construção</label><textarea id="f-roadmap">${esc(data.roadmap)}</textarea></div>
      ${discoverBtn("roadmap")}
      <button class="btn" data-continue="roadmap">Salvar e Finalizar</button>`;
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
