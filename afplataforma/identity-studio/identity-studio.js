const COL = "afIdentityStudio";
let currentUser = null;
let data = { identidade: "", valores: "", narrativa: "", diferenciais: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  identidade: {
    title: "Descobrir minha identidade",
    subtitle: "Selecione ou escreva para definir quem você é no núcleo.",
    questions: [
      { id: "q1", label: "Como você se reconhece quando remove cargo e status?", options: ["Construtor de sistemas", "Observador de padrões", "Facilitador de clareza", "Criador de pontes", "Outro"] },
      { id: "q2", label: "Qual papel você mais se identifica?", options: ["Mentor", "Estrategista", "Arquiteto", "Educador", "Outro"] },
      { id: "q3", label: "O que permanece quando você tira o título?", type: "text" }
    ],
    generate: (a) => `No núcleo, me reconheço como ${a.q1 || "alguém que cria clareza"}. Meu papel natural é ${a.q2 || "facilitar"}. O que permanece é ${a.q3 || "a capacidade de organizar complexidade"}.`
  },
  valores: {
    title: "Descobrir meus valores",
    subtitle: "Escolha o que é inegociável.",
    questions: [
      { id: "q1", label: "Quais valores você não abre mão? (até 3)", options: ["Clareza", "Integridade", "Liberdade", "Excelência", "Autenticidade", "Impacto", "Simplicidade"], multi: true },
      { id: "q2", label: "O que você já recusou por princípio?", options: ["Hype e exagero", "Projeto sem propósito", "Escala sem estrutura", "Promessas vazias", "Outro"] },
      { id: "q3", label: "Qual valor mais te define?", type: "text" }
    ],
    generate: (a) => `Valores centrais: ${(a.q1 || []).join(", ") || "clareza e integridade"}. Já recusei ${a.q2 || "o que não combina com minha essência"}. O que mais me define é ${a.q3 || "a busca por coerência"}.`
  },
  narrativa: {
    title: "Descobrir minha narrativa",
    subtitle: "Construa a história que explica por que você faz o que faz.",
    questions: [
      { id: "q1", label: "Qual foi a virada de chave?", options: ["Uma crise", "Um mentor", "Um fracasso", "Uma descoberta", "Outro"] },
      { id: "q2", label: "O que você parou de fazer?", options: ["Consumir mais conteúdo", "Fazer tudo sozinho", "Escalar sem clareza", "Seguir modismos", "Outro"] },
      { id: "q3", label: "Qual é a mensagem central da sua história?", type: "text" }
    ],
    generate: (a) => `A virada aconteceu com ${a.q1 || "uma experiência marcante"}. Parei de ${a.q2 || "consumir sem construir"}. Minha mensagem é: ${a.q3 || "clareza gera resultados reais"}.`
  },
  diferenciais: {
    title: "Descobrir meus diferenciais",
    subtitle: "Identifique o que é único na sua combinação.",
    questions: [
      { id: "q1", label: "Qual combinação você tem que poucos têm?", options: ["Essência + sistemas", "Pessoas + tecnologia", "Estratégia + profundidade", "Branding + operação", "Outro"] },
      { id: "q2", label: "O que as pessoas já notam em você?", options: ["Clareza", "Coerência", "Profundidade", "Praticidade", "Outro"] },
      { id: "q3", label: "O que te diferencia de quem faz algo parecido?", type: "text" }
    ],
    generate: (a) => `Minha combinação única é ${a.q1 || "essência com estrutura"}. As pessoas já notam ${a.q2 || "minha clareza"}. Me diferencio porque ${a.q3 || "uno profundidade com sistema"}.`
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "IDENTITY / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Identity Studio</div>
      <h1 class="title">Sua identidade</h1>
      <p class="sub">Defina identidade, valores, narrativa e diferenciais com clareza.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>
      <div class="guidance"><div class="eyebrow">Como usar</div><p>Cada etapa tem um botão “Descobrir” com opções clicáveis.</p></div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade</h1>
      <div class="field"><label>Identidade central</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      ${discoverBtn("identidade")}
      <div class="example"><div class="eyebrow">Exemplo</div><p>No núcleo, me reconheço como construtor de sistemas. Meu papel natural é arquiteto. O que permanece é a capacidade de organizar complexidade em clareza.</p></div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      ${discoverBtn("valores")}
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Narrativa</h1>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      ${discoverBtn("narrativa")}
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Diferenciais</h1>
      <div class="field"><label>Diferenciais e unicidade</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      ${discoverBtn("diferenciais")}
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
