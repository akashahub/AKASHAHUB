const COL = "afFluxoDeCaixa";
let currentUser = null;
let data = { entradas: "", saidas: "", fluxo: "", projecao: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  entradas: {
    title: "Descobrir entradas",
    subtitle: "Defina como você organiza suas entradas.",
    questions: [
      { id: "q1", label: "Quais são suas principais fontes de entrada?", options: ["Mentoria", "Produtos digitais", "Serviços", "Assinatura", "Outro"] },
      { id: "q2", label: "Como você registra as entradas?", options: ["Planilha", "App", "Manual", "Não registro", "Outro"] },
      { id: "q3", label: "O que mais impacta suas entradas hoje?", type: "text" }
    ],
    generate: (a) => `Fontes: ${a.q1 || "mentoria e produtos"}. Registro: ${a.q2 || "planilha"}. Impacto: ${a.q3 || "consistência das ofertas"}.`
  },
  saidas: {
    title: "Descobrir saídas",
    subtitle: "Defina como você organiza suas saídas.",
    questions: [
      { id: "q1", label: "Quais categorias de saída são principais?", options: ["Operacional", "Marketing", "Ferramentas", "Pessoal", "Impostos", "Outro"] },
      { id: "q2", label: "Como você acompanha as saídas?", options: ["Planilha mensal", "App", "Extrato bancário", "Não acompanho", "Outro"] },
      { id: "q3", label: "Qual saída você quer reduzir ou otimizar?", type: "text" }
    ],
    generate: (a) => `Categorias: ${a.q1 || "operacional e ferramentas"}. Acompanhamento: ${a.q2 || "planilha"}. Otimizar: ${a.q3 || "ferramentas que não geram retorno"}.`
  },
  fluxo: {
    title: "Descobrir fluxo e saldo",
    subtitle: "Defina como você vê o fluxo de caixa.",
    questions: [
      { id: "q1", label: "Com que frequência você olha o saldo?", options: ["Diário", "Semanal", "Mensal", "Quando precisa", "Outro"] },
      { id: "q2", label: "O que é mais importante no fluxo?", options: ["Saldo positivo", "Previsibilidade", "Reserva", "Margem", "Outro"] },
      { id: "q3", label: "Como você sabe se o caixa está saudável?", type: "text" }
    ],
    generate: (a) => `Olho o saldo ${a.q1 || "semanalmente"}. Prioridade: ${a.q2 || "previsibilidade e reserva"}. Saudável quando ${a.q3 || "consigo cobrir os próximos 30-60 dias sem pressão"}.`
  },
  projecao: {
    title: "Descobrir projeção",
    subtitle: "Defina como você projeta o caixa.",
    questions: [
      { id: "q1", label: "Qual horizonte de projeção faz sentido?", options: ["30 dias", "60 dias", "90 dias", "Trimestral", "Outro"] },
      { id: "q2", label: "O que você inclui na projeção?", options: ["Entradas recorrentes", "Entradas pontuais", "Saídas fixas", "Saídas variáveis", "Outro"] },
      { id: "q3", label: "O que a projeção te ajuda a decidir?", type: "text" }
    ],
    generate: (a) => `Horizonte: ${a.q1 || "60-90 dias"}. Incluo ${a.q2 || "entradas recorrentes e saídas fixas"}. Ajuda a ${a.q3 || "decidir o que investir e o que postergar"}.`
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
  const fields = ["entradas", "saidas", "fluxo", "projecao"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["entradas", "saidas", "fluxo", "projecao"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "FLUXO DE CAIXA / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Alinhamento Financeiro · Fase 03</div>
      <h1 class="title">Fluxo de Caixa OS</h1>
      <p class="sub">Organize entradas, saídas, saldo e projeção com clareza.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="entradas">Começar</button></div>`;
  } else if (view === "entradas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div>
      <h1 class="title">Entradas</h1>
      <div class="field"><label>Como organizar suas entradas</label><textarea id="f-entradas">${esc(data.entradas)}</textarea></div>
      ${discoverBtn("entradas")}
      <button class="btn" data-continue="entradas">Salvar e Continuar</button>`;
  } else if (view === "saidas") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div>
      <h1 class="title">Saídas</h1>
      <div class="field"><label>Como organizar suas saídas</label><textarea id="f-saidas">${esc(data.saidas)}</textarea></div>
      ${discoverBtn("saidas")}
      <button class="btn" data-continue="saidas">Salvar e Continuar</button>`;
  } else if (view === "fluxo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div>
      <h1 class="title">Fluxo e saldo</h1>
      <div class="field"><label>Como acompanhar fluxo e saldo</label><textarea id="f-fluxo">${esc(data.fluxo)}</textarea></div>
      ${discoverBtn("fluxo")}
      <button class="btn" data-continue="fluxo">Salvar e Continuar</button>`;
  } else if (view === "projecao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div>
      <h1 class="title">Projeção</h1>
      <div class="field"><label>Como projetar o caixa</label><textarea id="f-projecao">${esc(data.projecao)}</textarea></div>
      ${discoverBtn("projecao")}
      <button class="btn" data-continue="projecao">Salvar e Finalizar</button>`;
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
