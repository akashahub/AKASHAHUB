const COL = "afLideranca";
let currentUser = null;
let data = { estilo: "", valores: "", comunicacao: "", autoridade: "", plano: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  estilo: {
    title: "Descobrir meu estilo de liderança",
    subtitle: "Defina como você lidera hoje e como quer liderar.",
    questions: [
      { id: "q1", label: "Como você lidera hoje?", options: ["Mais diretivo", "Mais colaborativo", "Por clareza e alinhamento", "Por exemplo", "Outro"] },
      { id: "q2", label: "Como você gostaria de liderar?", options: ["Criando clareza e autonomia", "Alinhando essência e direção", "Menos controle, mais confiança", "Por sistemas e processos", "Outro"] },
      { id: "q3", label: "O que precisa mudar na sua forma de liderar?", type: "text" }
    ],
    generate: (a) => `Hoje lidero de forma ${a.q1 || "mais diretiva"}. Quero evoluir para ${a.q2 || "criar clareza e espaço para autonomia"}. O que precisa mudar é ${a.q3 || "confiar mais no processo e nas pessoas"}.`
  },
  valores: {
    title: "Descobrir meus valores de liderança",
    subtitle: "Identifique o que é inegociável.",
    questions: [
      { id: "q1", label: "Quais valores você não abre mão? (até 3)", options: ["Clareza", "Integridade", "Responsabilidade compartilhada", "Respeito ao ritmo", "Excelência", "Autenticidade"], multi: true },
      { id: "q2", label: "O que você não faz como líder?", options: ["Avançar sem alinhamento", "Carregar tudo sozinho", "Omitir informação importante", "Pressionar sem clareza", "Outro"] },
      { id: "q3", label: "Qual princípio mais te define como líder?", type: "text" }
    ],
    generate: (a) => `Valores: ${(a.q1 || []).join(", ") || "clareza e integridade"}. Não faço ${a.q2 || "avançar sem alinhamento"}. O princípio que mais me define é ${a.q3 || "criar condições para as pessoas crescerem"}.`
  },
  comunicacao: {
    title: "Descobrir minha comunicação de liderança",
    subtitle: "Defina como você transmite direção e gera confiança.",
    questions: [
      { id: "q1", label: "Como você transmite direção?", options: ["De forma clara e direta", "Em conversas individuais", "Com feedback específico", "Pelo exemplo", "Outro"] },
      { id: "q2", label: "Como você dá feedback?", options: ["Baseado em fatos", "Em particular", "Pedindo também feedback", "Focado em evolução", "Outro"] },
      { id: "q3", label: "O que as pessoas sentem ao falar com você?", type: "text" }
    ],
    generate: (a) => `Transmito direção ${a.q1 || "de forma clara e direta"}. Dou feedback ${a.q2 || "baseado em fatos e em particular"}. As pessoas sentem ${a.q3 || "confiança e clareza"}.`
  },
  autoridade: {
    title: "Descobrir minha autoridade",
    subtitle: "Defina como você constrói e protege sua autoridade.",
    questions: [
      { id: "q1", label: "Como você constrói autoridade?", options: ["Pela coerência", "Pelo exemplo", "Pela clareza", "Pela confiança", "Outro"] },
      { id: "q2", label: "Pelo que você quer ser reconhecido?", options: ["Como alguém confiável", "Como quem cria condições", "Como líder claro", "Como quem não precisa estar no centro", "Outro"] },
      { id: "q3", label: "O que você não faz para proteger sua autoridade?", type: "text" }
    ],
    generate: (a) => `Construo autoridade ${a.q1 || "pela coerência e pelo exemplo"}. Quero ser reconhecido ${a.q2 || "como alguém que cria condições para as pessoas crescerem"}. Não faço ${a.q3 || "promessas que não posso cumprir"}.`
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
  const fields = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "LIDERANÇA / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Liderança</div>
      <h1 class="title">Sua liderança</h1>
      <p class="sub">Defina estilo, valores, comunicação e autoridade.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="estilo">Começar</button></div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      ${discoverBtn("estilo")}
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores de liderança</h1>
      <div class="field"><label>Valores e princípios</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      ${discoverBtn("valores")}
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Comunicação</h1>
      <div class="field"><label>Comunicação de liderança</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      ${discoverBtn("comunicacao")}
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade e influência</h1>
      <div class="field"><label>Autoridade e influência</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      ${discoverBtn("autoridade")}
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Liderança</h1>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
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
        if (av) av.textContent = (user.email || "L")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
