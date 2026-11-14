const COL = "afMarketingPessoal";
let currentUser = null;
let data = { narrativa: "", publico: "", canais: "", acoes: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  narrativa: {
    title: "Descobrir minha narrativa",
    subtitle: "Defina a história que você conta sobre o problema e a transformação.",
    questions: [
      { id: "q1", label: "Qual é o problema central que você resolve?", options: ["Falta de clareza de identidade", "Consumo excessivo de conteúdo", "Dificuldade de posicionamento", "Falta de sistema", "Outro"] },
      { id: "q2", label: "Qual transformação você gera?", options: ["Da confusão para clareza", "Do consumo para construção", "Da insegurança para autoridade", "Do esforço para sistema", "Outro"] },
      { id: "q3", label: "Qual é a mensagem principal da sua narrativa?", type: "text" }
    ],
    generate: (a) => `Ajudo pessoas a resolver ${a.q1 || "falta de direção"}. A transformação que gero é ${a.q2 || "passar do consumo para a construção"}. Minha mensagem é: ${a.q3 || "clareza gera autoridade real"}.`
  },
  publico: {
    title: "Descobrir meu público",
    subtitle: "Defina quem é a pessoa ideal.",
    questions: [
      { id: "q1", label: "Quem é seu público principal?", options: ["Empresários", "Profissionais liberais", "Empreendedores digitais", "Líderes", "Outro"] },
      { id: "q2", label: "Qual a dor ou desejo central?", options: ["Querem construir legado", "Estão cansados de hype", "Buscam clareza de identidade", "Querem sistema operacional", "Outro"] },
      { id: "q3", label: "O que essa pessoa já tentou e não funcionou?", type: "text" }
    ],
    generate: (a) => `Meu público é ${a.q1 || "empresários e profissionais"} que ${a.q2 || "buscam clareza"}. Já tentaram ${a.q3 || "vários cursos e mentorias"} sem resultado consistente.`
  },
  canais: {
    title: "Descobrir meus canais",
    subtitle: "Escolha onde você vai construir presença.",
    questions: [
      { id: "q1", label: "Quais canais fazem sentido? (até 3)", options: ["LinkedIn", "Site próprio", "Instagram", "YouTube", "Newsletter", "Indicações", "Eventos"], multi: true },
      { id: "q2", label: "Qual canal você consegue sustentar com qualidade?", options: ["LinkedIn", "Site", "Conteúdo longo", "Conversas 1 a 1", "Outro"] },
      { id: "q3", label: "O que você não vai priorizar agora?", type: "text" }
    ],
    generate: (a) => `Canais prioritários: ${(a.q1 || []).join(", ") || "LinkedIn e site"}. Consigo sustentar com qualidade ${a.q2 || "conteúdo de profundidade"}. Não vou priorizar ${a.q3 || "volume alto sem substância"}.`
  },
  acoes: {
    title: "Descobrir minhas ações",
    subtitle: "Defina ações pequenas e consistentes.",
    questions: [
      { id: "q1", label: "Qual frequência você consegue manter?", options: ["1 post por semana", "2 posts por semana", "1 artigo por mês", "Conversas semanais", "Outro"] },
      { id: "q2", label: "Qual tipo de ação gera mais resultado para você?", options: ["Conteúdo de autoridade", "Conversas 1 a 1", "Indicações", "Presença em eventos", "Outro"] },
      { id: "q3", label: "Qual é a próxima ação concreta?", type: "text" }
    ],
    generate: (a) => `Vou manter ${a.q1 || "1 post de autoridade por semana"}. O que mais gera resultado é ${a.q2 || "conversas estratégicas"}. Próxima ação: ${a.q3 || "publicar um conteúdo de profundidade"}.`
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
  const fields = ["narrativa", "publico", "canais", "acoes"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["narrativa", "publico", "canais", "acoes"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "MARKETING / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Marketing Pessoal OS</div>
      <h1 class="title">Seu marketing</h1>
      <p class="sub">Narrativa, público, canais e ações.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="narrativa">Começar</button></div>
      <div class="guidance"><p>Cada etapa tem um botão “Descobrir” com opções clicáveis.</p></div>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Narrativa</h1>
      <div class="field"><label>Narrativa principal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      ${discoverBtn("narrativa")}
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "publico") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Público</h1>
      <div class="field"><label>Público-alvo</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      ${discoverBtn("publico")}
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "canais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Canais</h1>
      <div class="field"><label>Canais prioritários</label><textarea id="f-canais">${esc(data.canais)}</textarea></div>
      ${discoverBtn("canais")}
      <button class="btn" data-continue="canais">Salvar e Continuar</button>`;
  } else if (view === "acoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Ações</h1>
      <div class="field"><label>Ações e rotina</label><textarea id="f-acoes">${esc(data.acoes)}</textarea></div>
      ${discoverBtn("acoes")}
      <button class="btn" data-continue="acoes">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Marketing Pessoal</h1>
      <div class="card"><h3>Narrativa</h3><p>${esc(data.narrativa) || "—"}</p></div>
      <div class="card"><h3>Público</h3><p>${esc(data.publico) || "—"}</p></div>
      <div class="card"><h3>Canais</h3><p>${esc(data.canais) || "—"}</p></div>
      <div class="card"><h3>Ações</h3><p>${esc(data.acoes) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "M")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
