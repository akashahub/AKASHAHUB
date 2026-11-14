const COL = "afBrandingPessoal";
let currentUser = null;
let data = { identidade: "", arquetipos: "", voz: "", diferenciais: "", elementos: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  identidade: {
    title: "Descobrir minha identidade de marca",
    subtitle: "Defina como você quer ser reconhecido.",
    questions: [
      { id: "q1", label: "Qual arquétipo principal combina com você?", options: ["O Sábio", "O Criador", "O Guia", "O Herói", "O Explorador", "Outro"] },
      { id: "q2", label: "Como você quer ser reconhecido?", options: ["Por clareza", "Por profundidade", "Por estrutura", "Por autenticidade", "Outro"] },
      { id: "q3", label: "Qual é a essência da sua marca em uma frase?", type: "text" }
    ],
    generate: (a) => `Minha identidade de marca é ${a.q1 || "O Sábio + O Criador"}. Quero ser reconhecido ${a.q2 || "por clareza e profundidade"}. Essência: ${a.q3 || "clareza que gera legado"}.`
  },
  voz: {
    title: "Descobrir meu tom de voz",
    subtitle: "Defina como você se comunica.",
    questions: [
      { id: "q1", label: "Qual tom combina com você?", options: ["Claro e direto", "Profundo e reflexivo", "Elegante e preciso", "Caloroso e humano", "Outro"] },
      { id: "q2", label: "O que você evita na comunicação?", options: ["Hype e exagero", "Frases prontas", "Volume sem substância", "Linguagem técnica demais", "Outro"] },
      { id: "q3", label: "Como você fala quando está no seu melhor?", type: "text" }
    ],
    generate: (a) => `Meu tom é ${a.q1 || "claro e direto"}. Evito ${a.q2 || "hype e exagero"}. Quando estou no meu melhor, ${a.q3 || "falo com precisão e respeito"}.`
  },
  diferenciais: {
    title: "Descobrir meus diferenciais",
    subtitle: "Identifique o que é único na sua marca.",
    questions: [
      { id: "q1", label: "Qual combinação é só sua?", options: ["Essência + sistemas", "Pessoas + tecnologia", "Profundidade + praticidade", "Branding + operação", "Outro"] },
      { id: "q2", label: "O que as pessoas já reconhecem em você?", options: ["Clareza", "Coerência", "Profundidade", "Capacidade de estruturar", "Outro"] },
      { id: "q3", label: "O que te diferencia de quem faz algo parecido?", type: "text" }
    ],
    generate: (a) => `Minha combinação única é ${a.q1 || "essência com estrutura"}. As pessoas já reconhecem ${a.q2 || "minha clareza"}. Me diferencio porque ${a.q3 || "uno profundidade com sistema real"}.`
  },
  elementos: {
    title: "Descobrir meus elementos de marca",
    subtitle: "Defina referências visuais e sensoriais.",
    questions: [
      { id: "q1", label: "Qual estética combina com você?", options: ["Luxo silencioso", "Minimalista", "Elegante e estruturado", "Caloroso e humano", "Outro"] },
      { id: "q2", label: "Quais cores ou referências visuais te representam?", options: ["Dourado e violeta", "Tons terrosos", "Preto e branco", "Azul e dourado", "Outro"] },
      { id: "q3", label: "O que sua marca deve transmitir visualmente?", type: "text" }
    ],
    generate: (a) => `Estética: ${a.q1 || "luxo silencioso"}. Referências: ${a.q2 || "dourado e profundidade"}. Transmitir: ${a.q3 || "clareza, estrutura e profundidade"}.`
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
  const fields = ["identidade", "arquetipos", "voz", "diferenciais", "elementos"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["identidade", "voz", "diferenciais", "elementos"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "guia" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "BRANDING / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Branding Pessoal</div>
      <h1 class="title">Sua marca</h1>
      <p class="sub">Defina identidade, voz, diferenciais e elementos visuais.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="identidade">Começar</button></div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade e arquétipos</h1>
      <div class="field"><label>Identidade de marca</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="field"><label>Arquétipos</label><textarea id="f-arquetipos">${esc(data.arquetipos)}</textarea></div>
      ${discoverBtn("identidade")}
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "voz") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Tom de voz</h1>
      <div class="field"><label>Tom de voz e linguagem</label><textarea id="f-voz">${esc(data.voz)}</textarea></div>
      ${discoverBtn("voz")}
      <button class="btn" data-continue="voz">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Diferenciais</h1>
      <div class="field"><label>Diferenciais e posicionamento</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      ${discoverBtn("diferenciais")}
      <button class="btn" data-continue="diferenciais">Salvar e Continuar</button>`;
  } else if (view === "elementos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Elementos de marca</h1>
      <div class="field"><label>Elementos visuais e referências</label><textarea id="f-elementos">${esc(data.elementos)}</textarea></div>
      ${discoverBtn("elementos")}
      <button class="btn" data-continue="elementos">Salvar e Continuar</button>`;
  } else if (view === "guia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Guia de Branding Pessoal</h1>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Arquétipos</h3><p>${esc(data.arquetipos) || "—"}</p></div>
      <div class="card"><h3>Tom de voz</h3><p>${esc(data.voz) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>
      <div class="card"><h3>Elementos</h3><p>${esc(data.elementos) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "B")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
