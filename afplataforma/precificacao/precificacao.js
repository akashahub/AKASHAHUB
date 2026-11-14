const COL = "afPrecificacao";
let currentUser = null;
let data = { custos: "", margem: "", preco: "", posicionamento: "" };
let view = "dashboard";
let db = null;
let auth = null;
let currentTargetField = null;

const DISCOVERY = {
  custos: {
    title: "Descobrir custos",
    subtitle: "Defina os custos reais da oferta.",
    questions: [
      { id: "q1", label: "Quais custos você considera?", options: ["Tempo", "Ferramentas", "Impostos", "Comissões", "Infraestrutura", "Outro"] },
      { id: "q2", label: "Como você calcula o custo por entrega?", options: ["Horas trabalhadas", "Custo fixo diluído", "Custo variável", "Não calculo", "Outro"] },
      { id: "q3", label: "Qual custo você mais subestima?", type: "text" }
    ],
    generate: (a) => `Custos: ${a.q1 || "tempo e ferramentas"}. Cálculo: ${a.q2 || "horas + fixo diluído"}. Subestimo: ${a.q3 || "tempo de preparação e follow-up"}.`
  },
  margem: {
    title: "Descobrir margem e valor",
    subtitle: "Defina a margem desejada e o valor entregue.",
    questions: [
      { id: "q1", label: "Qual margem faz sentido para você?", options: ["50%+", "30-50%", "20-30%", "Cobrir custos", "Outro"] },
      { id: "q2", label: "O que justifica o valor cobrado?", options: ["Resultado concreto", "Clareza e sistema", "Acompanhamento", "Transformação", "Outro"] },
      { id: "q3", label: "Como você mede se a margem é saudável?", type: "text" }
    ],
    generate: (a) => `Margem desejada: ${a.q1 || "acima de 50%"}. Justifica: ${a.q2 || "clareza e resultado"}. Saudável quando ${a.q3 || "sobra caixa e não sinto pressão para vender mais"}.`
  },
  preco: {
    title: "Descobrir preço mínimo",
    subtitle: "Defina o preço mínimo viável.",
    questions: [
      { id: "q1", label: "Como você chega no preço mínimo?", options: ["Custo + margem", "Valor percebido", "Mercado", "Intuição", "Outro"] },
      { id: "q2", label: "O que acontece se o preço ficar abaixo?", options: ["Perco margem", "Não cubro custos", "Desvalorizo a oferta", "Fico dependente de volume", "Outro"] },
      { id: "q3", label: "Qual é o seu preço mínimo atual?", type: "text" }
    ],
    generate: (a) => `Chego no mínimo por ${a.q1 || "custo + margem"}. Abaixo disso: ${a.q2 || "perco margem e desvalorizo"}. Mínimo atual: ${a.q3 || "a definir com base nos custos reais"}.`
  },
  posicionamento: {
    title: "Descobrir posicionamento de preço",
    subtitle: "Defina como o preço se posiciona.",
    questions: [
      { id: "q1", label: "Como você posiciona o preço?", options: ["Premium", "Acessível premium", "Competitivo", "Acessível", "Outro"] },
      { id: "q2", label: "O que o preço comunica?", options: ["Qualidade e profundidade", "Acessibilidade", "Resultado rápido", "Continuidade", "Outro"] },
      { id: "q3", label: "Como você explica o preço para quem pergunta?", type: "text" }
    ],
    generate: (a) => `Posiciono como ${a.q1 || "premium com clareza"}. Comunica: ${a.q2 || "qualidade e profundidade"}. Explico: ${a.q3 || "pelo valor da estrutura e do acompanhamento, não pelo tempo"}.`
  }
};

function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800); }
function esc(s) { if (!s) return ""; return String(s).replace(/</g, "<").replace(/>/g, ">"); }
function progress() { const fields = ["custos", "margem", "preco", "posicionamento"]; return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100); }
function nextStep(current) { const STEPS = ["custos", "margem", "preco", "posicionamento"]; const i = STEPS.indexOf(current); return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1]; }
function setView(v) { view = v; document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v)); const side = document.getElementById("sidebar"); if (side) side.classList.remove("open"); render(); }
window.setView = setView;

function openDiscovery(field) {
  const cfg = DISCOVERY[field]; if (!cfg) return; currentTargetField = field;
  document.getElementById("modalTitle").textContent = cfg.title;
  document.getElementById("modalSubtitle").textContent = cfg.subtitle;
  const qEl = document.getElementById("modalQuestions");
  qEl.innerHTML = cfg.questions.map(q => {
    if (q.options) {
      const multi = q.multi ? ' data-multi="1"' : '';
      return `<div class="field"><label>${q.label}</label><div class="options" data-qid="${q.id}"${multi}>${q.options.map(opt => `<button type="button" class="opt" data-value="${opt}">${opt}</button>`).join("")}</div>${q.options.includes("Outro") ? `<input type="text" class="other-input hidden" data-for="${q.id}" placeholder="Especifique...">` : ""}</div>`;
    }
    return `<div class="field"><label>${q.label}</label><textarea id="disc-${q.id}" placeholder="Sua resposta..."></textarea></div>`;
  }).join("");
  qEl.querySelectorAll(".options").forEach(box => {
    const multi = box.dataset.multi;
    box.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (multi) btn.classList.toggle("selected");
        else { box.querySelectorAll(".opt").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); const other = box.parentElement.querySelector(".other-input"); if (other) other.classList.toggle("hidden", btn.dataset.value !== "Outro"); }
      };
    });
  });
  document.getElementById("modalResult").classList.add("hidden");
  document.getElementById("discoveryForm").classList.remove("hidden");
  document.getElementById("discoveryModal").classList.remove("hidden");
}
function closeModal() { document.getElementById("discoveryModal").classList.add("hidden"); currentTargetField = null; }
function collectAnswers(cfg) {
  const answers = {};
  cfg.questions.forEach(q => {
    if (q.options) {
      const box = document.querySelector(`.options[data-qid="${q.id}"]`);
      if (q.multi) answers[q.id] = Array.from(box.querySelectorAll(".opt.selected")).map(b => b.dataset.value);
      else { const sel = box.querySelector(".opt.selected"); let val = sel ? sel.dataset.value : ""; if (val === "Outro") { const other = document.querySelector(`.other-input[data-for="${q.id}"]`); val = other ? other.value.trim() : ""; } answers[q.id] = val; }
    } else { const el = document.getElementById("disc-" + q.id); answers[q.id] = el ? el.value.trim() : ""; }
  });
  return answers;
}
function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) { document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; }); saveData().then(() => setView(nextStep(cont.dataset.continue))); return; }
    const disc = e.target.closest("[data-discover]"); if (disc) openDiscovery(disc.dataset.discover);
  });
  document.getElementById("modalClose").onclick = closeModal;
  document.getElementById("modalCancel").onclick = closeModal;
  document.querySelector(".modal-backdrop").onclick = closeModal;
  document.getElementById("discoveryForm").onsubmit = (e) => {
    e.preventDefault(); const cfg = DISCOVERY[currentTargetField]; if (!cfg) return;
    const answers = collectAnswers(cfg); const suggestion = cfg.generate(answers);
    document.getElementById("suggestionText").textContent = suggestion;
    document.getElementById("discoveryForm").classList.add("hidden");
    document.getElementById("modalResult").classList.remove("hidden");
  };
  document.getElementById("useSuggestion").onclick = () => {
    const text = document.getElementById("suggestionText").textContent;
    if (currentTargetField && text) { data[currentTargetField] = text; const ta = document.getElementById("f-" + currentTargetField); if (ta) ta.value = text; toast("Sugestão aplicada. Você pode editar antes de salvar."); }
    closeModal(); render();
  };
}
async function saveData() {
  if (!currentUser || !db) { toast("Faça login para salvar."); return; }
  try { const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"); await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); } catch { toast("Erro ao salvar."); }
  render();
}
function discoverBtn(field) { return `<button class="btn secondary" data-discover="${field}" style="margin-top:8px">Descobrir</button>`; }
function render() {
  const p = progress(); const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "PRECIFICAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? '<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>' : "";
  if (view === "dashboard") {
    content.innerHTML = notice + `<div class="eyebrow">Alinhamento Financeiro · Fase 03</div><h1 class="title">Precificação</h1><p class="sub">Custos, margem, preço mínimo e posicionamento.</p><div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div><div class="card"><button class="btn" data-goto="custos">Começar</button></div>`;
  } else if (view === "custos") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 1</div><h1 class="title">Custos</h1><div class="field"><label>Custos reais da oferta</label><textarea id="f-custos">${esc(data.custos)}</textarea></div>${discoverBtn("custos")}<button class="btn" data-continue="custos">Salvar e Continuar</button>`;
  } else if (view === "margem") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 2</div><h1 class="title">Margem e valor</h1><div class="field"><label>Margem desejada e valor entregue</label><textarea id="f-margem">${esc(data.margem)}</textarea></div>${discoverBtn("margem")}<button class="btn" data-continue="margem">Salvar e Continuar</button>`;
  } else if (view === "preco") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 3</div><h1 class="title">Preço mínimo</h1><div class="field"><label>Preço mínimo viável</label><textarea id="f-preco">${esc(data.preco)}</textarea></div>${discoverBtn("preco")}<button class="btn" data-continue="preco">Salvar e Continuar</button>`;
  } else if (view === "posicionamento") {
    content.innerHTML = notice + `<div class="eyebrow">Missão 4</div><h1 class="title">Posicionamento</h1><div class="field"><label>Como o preço se posiciona</label><textarea id="f-posicionamento">${esc(data.posicionamento)}</textarea></div>${discoverBtn("posicionamento")}<button class="btn" data-continue="posicionamento">Salvar e Finalizar</button>`;
  }
}
bind(); render();
(async () => {
  try {
    const configMod = await import("../firebase/firebase-config.js");
    auth = configMod.auth; db = configMod.db;
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    onAuthStateChanged(auth, user => { currentUser = user || null; if (user) { const pill = document.getElementById("userPill"); const av = document.getElementById("avatar"); if (pill) pill.textContent = user.email || "Mentorando"; if (av) av.textContent = (user.email || "P")[0].toUpperCase(); } render(); });
  } catch (e) { console.warn("Firebase opcional falhou:", e); }
})();
