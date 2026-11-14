// v14 - modal com opções clicáveis
const COL = "afEssencia";
let currentUser = null;
let data = { historia: "", valores: "", crencas: "", posicionamento: "", proposito: "", observacoes: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  historia: {
    title: "Descobrir minha história",
    subtitle: "Selecione ou escreva para gerar sua narrativa.",
    questions: [
      {
        id: "q1",
        label: "Qual tipo de experiência mais marcou sua trajetória?",
        options: ["Família e origem", "Crise ou falência", "Mentor ou referência", "Mudança de carreira", "Conquista importante", "Outro"]
      },
      {
        id: "q2",
        label: "O que você aprendeu com isso?",
        options: ["Clareza de identidade", "Importância de sistemas", "Limites pessoais", "Valor do tempo", "Confiança em si", "Outro"]
      },
      {
        id: "q3",
        label: "Por que você faz o que faz hoje?",
        type: "text"
      }
    ],
    generate: (a) => `Minha trajetória foi marcada principalmente por ${a.q1 || "experiências formativas"}. Com isso aprendi ${a.q2 || "lições importantes"}. Hoje faço o que faço porque ${a.q3 || "quero gerar impacto real"}.`
  },
  valores: {
    title: "Descobrir meus valores",
    subtitle: "Escolha o que é inegociável para você.",
    questions: [
      {
        id: "q1",
        label: "Quais valores você não abre mão? (selecione até 3)",
        options: ["Clareza", "Integridade", "Liberdade", "Excelência", "Autenticidade", "Impacto", "Simplicidade", "Lealdade"],
        multi: true
      },
      {
        id: "q2",
        label: "O que você não faz, mesmo que seja lucrativo?",
        options: ["Hype e exagero", "Promessas vazias", "Trabalho sem propósito", "Escalar sem estrutura", "Outro"]
      },
      {
        id: "q3",
        label: "Qual padrão ou crença ainda te influencia?",
        type: "text"
      }
    ],
    generate: (a) => `Valores centrais: ${(a.q1 || []).join(", ") || "clareza e integridade"}. Não faço ${a.q2 || "o que contradiz minha essência"}. Padrão que ainda carrego: ${a.q3 || "algumas lealdades antigas"}.`
  },
  posicionamento: {
    title: "Descobrir meu posicionamento",
    subtitle: "Defina quem você ajuda e como se diferencia.",
    questions: [
      {
        id: "q1",
        label: "Quem você ajuda principalmente?",
        options: ["Empresários", "Profissionais liberais", "Empreendedores digitais", "Líderes de equipe", "Investidores", "Outro"]
      },
      {
        id: "q2",
        label: "Qual problema principal você resolve?",
        options: ["Falta de clareza de identidade", "Consumo excessivo de conteúdo", "Dificuldade de posicionamento", "Falta de sistema operacional", "Outro"]
      },
      {
        id: "q3",
        label: "Como você se diferencia?",
        type: "text"
      }
    ],
    generate: (a) => `Ajudo principalmente ${a.q1 || "pessoas de alto potencial"} a resolver ${a.q2 || "falta de direção"}. Me diferencio porque ${a.q3 || "uno essência com estrutura real"}.`
  },
  proposito: {
    title: "Descobrir meu propósito",
    subtitle: "Conecte o porquê maior com os próximos passos.",
    questions: [
      {
        id: "q1",
        label: "Qual resultado você quer ver em 12 meses?",
        options: ["Plataforma consolidada", "Grupo seleto de clientes", "Ativos digitais funcionando", "Autoridade reconhecida", "Outro"]
      },
      {
        id: "q2",
        label: "Por que isso importa no longo prazo?",
        type: "text"
      },
      {
        id: "q3",
        label: "Qual é o próximo passo concreto?",
        type: "text"
      }
    ],
    generate: (a) => `Em 12 meses quero ${a.q1 || "ter consolidado minha base"}. Isso importa porque ${a.q2 || "quero construir legado real"}. Próximo passo: ${a.q3 || "avançar com clareza"}.`
  }
};

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/</g, "<").replace(/>/g, ">");
}

function progress() {
  const fields = ["historia", "valores", "crencas", "posicionamento", "proposito"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["historia", "valores", "posicionamento", "proposito"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dossie" : STEPS[i + 1];
}

function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar");
  if (side) side.classList.remove("open");
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
        if (multi) {
          btn.classList.toggle("selected");
        } else {
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
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", e => {
    const b = e.target.closest("button[data-view]");
    if (b) setView(b.dataset.view);
  });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => {
    const s = document.getElementById("sidebar");
    if (s) s.classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]");
    if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => {
        let key = el.id.slice(2);
        const map = { pos: "posicionamento", prop: "proposito" };
        if (key in map) key = map[key];
        if (key in data) data[key] = el.value;
      });
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
      const map = { posicionamento: "pos", proposito: "prop" };
      const id = "f-" + (map[currentTargetField] || currentTargetField);
      const ta = document.getElementById(id);
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
  } catch {
    toast("Erro ao salvar.");
  }
  render();
}

function discoverBtn(field) {
  return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir minha essência</button>`;
}

function render() {
  const p = progress();
  const content = document.getElementById("content");
  if (!content) return;
  const crumb = document.getElementById("breadcrumb");
  if (crumb) crumb.textContent = "ESSÊNCIA / " + view.toUpperCase().replace("-", " ");
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Arquitetura de Essência</div>
      <h1 class="title">Sua essência</h1>
      <p class="sub">Mapeie identidade, história, valores e direção. O resultado é um Dossiê de Essência claro e utilizável.</p>
      <div class="card">
        <div>Progresso do dossiê</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo os módulos para gerar seu dossiê completo." : "Dossiê pronto."}</p>
        <button class="btn" data-goto="historia">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Cada etapa tem um botão “Descobrir” com opções clicáveis e perguntas guiadas.</p>
      </div>`;
  } else if (view === "historia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">História pessoal</h1>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-historia">${esc(data.historia)}</textarea></div>
      ${discoverBtn("historia")}
      <div class="example"><div class="eyebrow">Exemplo</div><p>Minha trajetória foi marcada por crise e reconstrução. Aprendi a importância de sistemas. Hoje ajudo empresários a construir com clareza.</p></div>
      <button class="btn" data-continue="historia">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores e crenças</h1>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="field"><label>Crenças e padrões</label><textarea id="f-crencas">${esc(data.crencas)}</textarea></div>
      ${discoverBtn("valores")}
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "posicionamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Posicionamento</h1>
      <div class="field"><label>Posicionamento e narrativa</label><textarea id="f-pos">${esc(data.posicionamento)}</textarea></div>
      ${discoverBtn("posicionamento")}
      <button class="btn" data-continue="posicionamento">Salvar e Continuar</button>`;
  } else if (view === "proposito") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Propósito e direção</h1>
      <div class="field"><label>Propósito e próximos passos</label><textarea id="f-prop">${esc(data.proposito)}</textarea></div>
      ${discoverBtn("proposito")}
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "dossie") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Dossiê de Essência</h1>
      <div class="card"><h3>História</h3><p>${esc(data.historia) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Posicionamento</h3><p>${esc(data.posicionamento) || "—"}</p></div>
      <div class="card"><h3>Propósito</h3><p>${esc(data.proposito) || "—"}</p></div>`;
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
        if (av) av.textContent = (user.email || "E")[0].toUpperCase();
      }
      render();
    });
  } catch (e) {
    console.warn("Firebase opcional falhou:", e);
  }
})();
