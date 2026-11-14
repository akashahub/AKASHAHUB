const COL = "afRegistrosAkashicos";
let currentUser = null;
let data = { intencao: "", reflexoes: "", insights: "", integracao: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  intencao: {
    title: "Descobrir minha intenção",
    subtitle: "Defina o que você deseja observar.",
    questions: [
      { id: "q1", label: "Qual tema você deseja explorar?", options: ["Por que ainda consumo mais do que construo", "Medo de me expor", "Dificuldade de agir com a clareza que já tenho", "Padrão de adiar", "Outro"] },
      { id: "q2", label: "O que você deseja ver com mais clareza?", options: ["O que me impede de construir", "Qual é o próximo passo real", "Onde ainda existe lealdade antiga", "O que já está pronto em mim", "Outro"] },
      { id: "q3", label: "Qual pergunta importante ainda não tem resposta?", type: "text" }
    ],
    generate: (a) => `Quero explorar ${a.q1 || "por que ainda adio a construção"}. Desejo ver com mais clareza ${a.q2 || "o que já está pronto em mim"}. A pergunta é: ${a.q3 || "o que preciso integrar para agir"}.`
  },
  reflexoes: {
    title: "Descobrir reflexões",
    subtitle: "Anote o que emerge sem forçar.",
    questions: [
      { id: "q1", label: "O que surge quando você fica em silêncio com a intenção?", options: ["Medo de me expor", "Sensão de não estar pronto", "Uso do consumo como proteção", "Desejo de construir", "Outro"] },
      { id: "q2", label: "Qual imagem ou sensação se repete?", options: ["Estar sempre se preparando", "Carregar sozinho", "Esperar o momento perfeito", "Evitar vulnerabilidade", "Outro"] },
      { id: "q3", label: "O que essa reflexão revela sobre você?", type: "text" }
    ],
    generate: (a) => `Quando fico em silêncio, surge ${a.q1 || "o medo de me expor"}. A sensação que se repete é ${a.q2 || "estar sempre se preparando"}. Isso revela ${a.q3 || "que uso a preparação como proteção"}.`
  },
  insights: {
    title: "Descobrir insights",
    subtitle: "Identifique a percepção mais importante.",
    questions: [
      { id: "q1", label: "Qual é o insight principal?", options: ["Já tenho clareza suficiente", "O consumo é uma forma de evitar", "Não preciso estar 100% pronto", "A vulnerabilidade faz parte", "Outro"] },
      { id: "q2", label: "O que você entendeu sobre si que antes não estava claro?", options: ["Que adio por medo", "Que já sei o suficiente", "Que preciso me expor", "Que a preparação tem limite", "Outro"] },
      { id: "q3", label: "Como esse insight muda sua visão?", type: "text" }
    ],
    generate: (a) => `O insight principal é ${a.q1 || "que já tenho clareza suficiente"}. Entendi que ${a.q2 || "o consumo é uma forma de evitar a construção"}. Isso muda minha visão porque ${a.q3 || "posso agir com o que já tenho"}.`
  },
  integracao: {
    title: "Descobrir integração",
    subtitle: "Defina o próximo passo concreto.",
    questions: [
      { id: "q1", label: "Qual mudança prática você pode fazer?", options: ["Publicar algo real", "Reduzir o consumo", "Começar um ativo", "Pedir feedback", "Outro"] },
      { id: "q2", label: "Qual é o próximo passo pequeno?", options: ["Escrever um conteúdo", "Definir uma ação semanal", "Conversar com alguém", "Registrar um compromisso", "Outro"] },
      { id: "q3", label: "Como você vai observar o resultado?", type: "text" }
    ],
    generate: (a) => `Próximo passo: ${a.q1 || "publicar algo real"}. Ação pequena: ${a.q2 || "escrever um conteúdo esta semana"}. Vou observar ${a.q3 || "o que acontece quando ajo com a clareza que já tenho"}.`
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "REGISTROS / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Registros Akáshicos</div>
      <h1 class="title">Sua jornada</h1>
      <p class="sub">Jornada guiada de autoconhecimento.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="intencao">Começar</button></div>`;
  } else if (view === "intencao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Intenção</h1>
      <div class="field"><label>Intenção da jornada</label><textarea id="f-intencao">${esc(data.intencao)}</textarea></div>
      ${discoverBtn("intencao")}
      <button class="btn" data-continue="intencao">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Reflexões guiadas</h1>
      <div class="field"><label>Reflexões</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      ${discoverBtn("reflexoes")}
      <button class="btn" data-continue="reflexoes">Salvar e Continuar</button>`;
  } else if (view === "insights") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Insights</h1>
      <div class="field"><label>Insights principais</label><textarea id="f-insights">${esc(data.insights)}</textarea></div>
      ${discoverBtn("insights")}
      <button class="btn" data-continue="insights">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Integração</h1>
      <div class="field"><label>Integração e próximos passos</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      ${discoverBtn("integracao")}
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
