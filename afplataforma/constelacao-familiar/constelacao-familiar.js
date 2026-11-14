const COL = "afConstelacaoFamiliar";
let currentUser = null;
let data = { sistema: "", padroes: "", relacoes: "", reflexoes: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  sistema: {
    title: "Descobrir meu sistema familiar",
    subtitle: "Observe o sistema sem julgar.",
    questions: [
      { id: "q1", label: "Quem ocupava o lugar de provedor ou de força?", options: ["Pai", "Mãe", "Ambos", "Outro familiar", "Ninguém claramente", "Outro"] },
      { id: "q2", label: "Qual papel você mais ocupa hoje?", options: ["O que carrega tudo", "O que resolve", "O que cuida", "O que se afasta", "Outro"] },
      { id: "q3", label: "O que se repete no sistema?", type: "text" }
    ],
    generate: (a) => `No sistema, ${a.q1 || "alguém"} ocupava o lugar de força. Hoje eu mais ocupo o papel de ${a.q2 || "quem carrega"}. O que se repete é ${a.q3 || "a dificuldade de pedir ajuda"}.`
  },
  padroes: {
    title: "Descobrir meus padrões",
    subtitle: "Identifique o que se repete.",
    questions: [
      { id: "q1", label: "Qual padrão você mais reconhece?", options: ["Carregar sozinho", "Não pedir ajuda", "Cuidar dos outros primeiro", "Evitar conflito", "Outro"] },
      { id: "q2", label: "O que acontece quando as coisas ficam difíceis?", options: ["Volto a fazer tudo sozinho", "Me fecho", "Assumo mais responsabilidade", "Me afasto", "Outro"] },
      { id: "q3", label: "Qual lealdade invisível você percebe?", type: "text" }
    ],
    generate: (a) => `O padrão que mais se repete é ${a.q1 || "carregar sozinho"}. Quando fica difícil, ${a.q2 || "eu volto a fazer tudo"}. Uma lealdade que percebo é ${a.q3 || "não ter mais que os outros"}.`
  },
  relacoes: {
    title: "Descobrir relações chave",
    subtitle: "Identifique as relações que mais influenciam.",
    questions: [
      { id: "q1", label: "Qual relação mais influencia suas escolhas hoje?", options: ["Pai", "Mãe", "Parceiro(a)", "Sócio ou colega", "Outro"] },
      { id: "q2", label: "O que você herdou dessa relação?", options: ["A ideia de ser forte sozinho", "A sensibilidade de cuidar", "A dificuldade de me colocar em primeiro", "A pressão por resultado", "Outro"] },
      { id: "q3", label: "Como essa relação aparece no seu trabalho ou negócio?", type: "text" }
    ],
    generate: (a) => `A relação com ${a.q1 || "meu pai"} ainda influencia muito. Herdei ${a.q2 || "a ideia de carregar sozinho"}. Isso aparece hoje como ${a.q3 || "dificuldade de delegar"}.`
  },
  reflexoes: {
    title: "Descobrir reflexões",
    subtitle: "Conecte o mapa com suas escolhas atuais.",
    questions: [
      { id: "q1", label: "O que esse mapa revela sobre suas escolhas hoje?", options: ["Que carrego mais do que deveria", "Que evito pedir ajuda", "Que ainda ocupo lugares antigos", "Que posso escolher diferente", "Outro"] },
      { id: "q2", label: "Qual passo consciente você pode dar?", options: ["Delegar uma coisa pequena", "Pedir ajuda uma vez", "Observar sem reagir", "Conversar sobre o padrão", "Outro"] },
      { id: "q3", label: "Como isso se conecta com o legado que você quer construir?", type: "text" }
    ],
    generate: (a) => `Esse mapa revela ${a.q1 || "que ainda carrego padrões antigos"}. Um passo consciente é ${a.q2 || "começar a delegar"}. Isso se conecta com o legado porque ${a.q3 || "quero construir sem precisar estar em tudo"}.`
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CONSTELAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Constelação Familiar</div>
      <h1 class="title">Seu sistema</h1>
      <p class="sub">Mapeamento reflexivo de padrões e relações.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="sistema">Começar</button></div>`;
  } else if (view === "sistema") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Sistema familiar</h1>
      <div class="field"><label>Descrição do sistema</label><textarea id="f-sistema">${esc(data.sistema)}</textarea></div>
      ${discoverBtn("sistema")}
      <button class="btn" data-continue="sistema">Salvar e Continuar</button>`;
  } else if (view === "padroes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Padrões observados</h1>
      <div class="field"><label>Padrões e dinâmicas</label><textarea id="f-padroes">${esc(data.padroes)}</textarea></div>
      ${discoverBtn("padroes")}
      <button class="btn" data-continue="padroes">Salvar e Continuar</button>`;
  } else if (view === "relacoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Relações chave</h1>
      <div class="field"><label>Relações relevantes</label><textarea id="f-relacoes">${esc(data.relacoes)}</textarea></div>
      ${discoverBtn("relacoes")}
      <button class="btn" data-continue="relacoes">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Reflexões</h1>
      <div class="field"><label>Reflexões e insights</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      ${discoverBtn("reflexoes")}
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
