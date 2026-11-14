const COL = "afAuthorityLeadership";
let currentUser = null;
let data = { estilo: "", comunicacao: "", reputacao: "", competencias: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  estilo: {
    title: "Descobrir meu estilo de liderança",
    subtitle: "Defina como você lidera no seu melhor.",
    questions: [
      { id: "q1", label: "Como você lidera quando está no seu melhor?", options: ["Por clareza e essência", "Criando sistemas", "Alinhando direção", "Gerando autonomia", "Outro"] },
      { id: "q2", label: "Qual estilo você quer consolidar?", options: ["Liderança por clareza", "Liderança por sistemas", "Liderança por exemplo", "Liderança por confiança", "Outro"] },
      { id: "q3", label: "O que sua liderança cria nas pessoas?", type: "text" }
    ],
    generate: (a) => `No meu melhor, lidero ${a.q1 || "por clareza e essência"}. Quero consolidar ${a.q2 || "uma liderança que cria sistemas e autonomia"}. Minha liderança cria ${a.q3 || "condições para as pessoas crescerem"}.`
  },
  comunicacao: {
    title: "Descobrir minha comunicação de autoridade",
    subtitle: "Defina como você comunica direção.",
    questions: [
      { id: "q1", label: "Como você comunica autoridade?", options: ["Com precisão e profundidade", "Falando menos, com mais clareza", "Pela coerência", "Em conversas de qualidade", "Outro"] },
      { id: "q2", label: "O que você não precisa fazer?", options: ["Postar todos os dias", "Falar de tudo", "Gritar para ser ouvido", "Seguir tendências", "Outro"] },
      { id: "q3", label: "Como as pessoas reconhecem sua autoridade?", type: "text" }
    ],
    generate: (a) => `Comunico autoridade ${a.q1 || "com precisão e profundidade"}. Não preciso ${a.q2 || "postar todos os dias"}. As pessoas reconhecem ${a.q3 || "a coerência entre o que digo e o que construo"}.`
  },
  reputacao: {
    title: "Descobrir minha reputação",
    subtitle: "Defina pelo que você quer ser conhecido.",
    questions: [
      { id: "q1", label: "Pelo que você quer ser reconhecido?", options: ["Por clareza e estrutura", "Por ajudar a construir legado", "Por coerência", "Por profundidade", "Outro"] },
      { id: "q2", label: "O que você não faz para proteger sua reputação?", options: ["Hype e exagero", "Promessas vazias", "Associações que não combinam", "Volume sem substância", "Outro"] },
      { id: "q3", label: "Como sua influência se constrói?", type: "text" }
    ],
    generate: (a) => `Quero ser reconhecido ${a.q1 || "por clareza e por ajudar a construir legado"}. Não faço ${a.q2 || "hype ou promessas exageradas"}. Minha influência se constrói ${a.q3 || "pela coerência e pelos resultados reais"}.`
  },
  competencias: {
    title: "Descobrir minhas competências",
    subtitle: "Identifique o que já é forte e o que quer desenvolver.",
    questions: [
      { id: "q1", label: "Quais competências já são fortes? (até 3)", options: ["Clareza na comunicação", "Leitura de sistemas", "Criação de processos", "Feedback construtivo", "Visão estratégica"], multi: true },
      { id: "q2", label: "Qual competência você quer fortalecer?", options: ["Delegar com confiança", "Medir progresso real", "Criar sistemas sem minha presença", "Dar feedback que gera evolução", "Outro"] },
      { id: "q3", label: "Como essa competência impacta seu legado?", type: "text" }
    ],
    generate: (a) => `Competências fortes: ${(a.q1 || []).join(", ") || "clareza e leitura de sistemas"}. Quero fortalecer ${a.q2 || "a capacidade de criar sistemas que funcionem sem mim"}. Isso impacta o legado porque ${a.q3 || "permite que a construção continue"}.`
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
  const fields = ["estilo", "comunicacao", "reputacao", "competencias"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "comunicacao", "reputacao", "competencias"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "AUTHORITY / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Authority & Leadership OS</div>
      <h1 class="title">Sua autoridade</h1>
      <p class="sub">Unifica liderança, comunicação, reputação e competências.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="estilo">Começar</button></div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <div class="field"><label>Estilo de liderança</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      ${discoverBtn("estilo")}
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Comunicação de autoridade</h1>
      <div class="field"><label>Comunicação de autoridade</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      ${discoverBtn("comunicacao")}
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "reputacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Reputação e influência</h1>
      <div class="field"><label>Reputação e influência</label><textarea id="f-reputacao">${esc(data.reputacao)}</textarea></div>
      ${discoverBtn("reputacao")}
      <button class="btn" data-continue="reputacao">Salvar e Continuar</button>`;
  } else if (view === "competencias") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Competências</h1>
      <div class="field"><label>Competências prioritárias</label><textarea id="f-competencias">${esc(data.competencias)}</textarea></div>
      ${discoverBtn("competencias")}
      <button class="btn" data-continue="competencias">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Authority & Leadership</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
      <div class="card"><h3>Reputação</h3><p>${esc(data.reputacao) || "—"}</p></div>
      <div class="card"><h3>Competências</h3><p>${esc(data.competencias) || "—"}</p></div>`;
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
